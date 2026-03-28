#!/usr/bin/env python3
"""
Nepali RSS crawler that exports CSV in this format:

news_content,label,category,source_type,news_id,generated_date,meta_intent,meta_style

Usage:
    python nepali_rss_crawler.py

Optional:
    python nepali_rss_crawler.py --limit 50 --output nepali_news_dataset.csv
"""

import argparse
import csv
import re
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

import feedparser
import requests
from bs4 import BeautifulSoup


# ---------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------
RSS_FEEDS = [
    {
        "name": "OnlineKhabar",
        "rss_url": "https://www.onlinekhabar.com/feed",
        "default_category": "general",
        "source_type": "online_portal",
    },
    {
        "name": "Kathmandu Post",
        "rss_url": "https://kathmandupost.com/rss",
        "default_category": "general",
        "source_type": "print",
    },
    {
        "name": "BBC Nepali",
        "rss_url": "https://feeds.bbci.co.uk/nepali/rss.xml",
        "default_category": "general",
        "source_type": "radio",
    },
]

# Exact dataset columns based on your format
OUTPUT_COLUMNS = [
    "news_content",
    "label",
    "category",
    "source_type",
    "news_id",
    "generated_date",
    "meta_intent",
    "meta_style",
]

DEFAULT_LABEL = 0
DEFAULT_META_INTENT = "informative"
DEFAULT_META_STYLE = "formal"


# ---------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------
def clean_text(text: str) -> str:
    """Clean HTML/text and normalize whitespace."""
    if not text:
        return ""

    # Remove HTML tags if any remain
    text = BeautifulSoup(text, "html.parser").get_text(" ", strip=True)

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text


def map_category(feed_name: str, entry) -> str:
    """
    Try to infer category from RSS tags/link/title.
    Falls back to feed default category.
    """
    text_parts = []

    if getattr(entry, "title", None):
        text_parts.append(entry.title.lower())

    if getattr(entry, "link", None):
        text_parts.append(entry.link.lower())

    if hasattr(entry, "tags"):
        for tag in entry.tags:
            term = getattr(tag, "term", "")
            if term:
                text_parts.append(str(term).lower())

    text = " ".join(text_parts)

    category_rules = {
        "politics": ["politic", "election", "government", "parliament", "minister", "राजनीति"],
        "economy": ["economy", "business", "market", "finance", "bank", "economic", "अर्थ"],
        "health": ["health", "medical", "hospital", "disease", "covid", "स्वास्थ्य"],
        "society": ["society", "community", "social", "education", "culture", "समाज"],
        "technology": ["tech", "technology", "digital", "ai", "internet", "प्रविधि"],
        "agriculture": ["agriculture", "farm", "farming", "crop", "livestock", "कृषि"],
        "tourism": ["tourism", "travel", "visit", "hotel", "trek", "पर्यटन"],
        "education": ["education", "school", "college", "university", "exam", "शिक्षा"],
        "crime": ["crime", "police", "arrest", "murder", "theft", "अपराध"],
        "disaster": ["disaster", "earthquake", "flood", "landslide", "fire", "विपद"],
        "sports": ["sport", "football", "cricket", "match", "tournament", "खेलकुद"],
    }

    for category, keywords in category_rules.items():
        if any(keyword in text for keyword in keywords):
            return category

    # feed-level fallback
    for feed in RSS_FEEDS:
        if feed["name"] == feed_name:
            return feed["default_category"]

    return "general"


def get_entry_date(entry) -> str:
    """
    Returns YYYY-MM-DD.
    Prefers published date from RSS, otherwise today's UTC date.
    """
    for field in ["published_parsed", "updated_parsed"]:
        value = getattr(entry, field, None)
        if value:
            try:
                return datetime(*value[:6]).strftime("%Y-%m-%d")
            except Exception:
                pass

    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def fetch_article_text(url: str, timeout: int = 15) -> str:
    """
    Fetch article page and try to extract main article text.
    Fallback to all paragraphs if article tag is not found.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        )
    }

    try:
        response = requests.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()
    except Exception:
        return ""

    soup = BeautifulSoup(response.text, "html.parser")

    # remove unwanted tags
    for tag in soup(["script", "style", "noscript", "iframe", "header", "footer", "form"]):
        tag.decompose()

    # try likely article containers first
    selectors = [
        "article",
        "[class*='article']",
        "[class*='content']",
        "[class*='post']",
        "[id*='article']",
        "[id*='content']",
    ]

    extracted_chunks = []

    for selector in selectors:
        nodes = soup.select(selector)
        for node in nodes:
            paragraphs = [p.get_text(" ", strip=True) for p in node.find_all("p")]
            paragraphs = [clean_text(p) for p in paragraphs if clean_text(p)]
            if len(" ".join(paragraphs)) > 200:
                extracted_chunks = paragraphs
                break
        if extracted_chunks:
            break

    # fallback to all paragraphs
    if not extracted_chunks:
        paragraphs = [p.get_text(" ", strip=True) for p in soup.find_all("p")]
        extracted_chunks = [clean_text(p) for p in paragraphs if clean_text(p)]

    article_text = " ".join(extracted_chunks)
    return clean_text(article_text)


def build_news_content(entry, article_text: str) -> str:
    """
    Build the final text for news_content.
    Priority:
      1) full article text
      2) title + summary
      3) title only
    """
    title = clean_text(getattr(entry, "title", ""))
    summary = clean_text(getattr(entry, "summary", ""))

    if article_text and len(article_text) > 150:
        return article_text

    if title and summary:
        return f"{title}. {summary}"

    return title or summary


def parse_feed(feed_conf: Dict, limit: Optional[int] = None) -> List[Dict]:
    parsed = feedparser.parse(feed_conf["rss_url"])
    rows = []

    entries = parsed.entries[:limit] if limit else parsed.entries

    for entry in entries:
        link = getattr(entry, "link", "").strip()
        article_text = fetch_article_text(link) if link else ""
        news_content = build_news_content(entry, article_text)

        if not news_content:
            continue

        row = {
            "news_content": news_content,
            "label": DEFAULT_LABEL,
            "category": map_category(feed_conf["name"], entry),
            "source_type": feed_conf["source_type"],
            "generated_date": get_entry_date(entry),
            "meta_intent": DEFAULT_META_INTENT,
            "meta_style": DEFAULT_META_STYLE,
        }
        rows.append(row)

    return rows


def assign_news_ids(rows: List[Dict], prefix: str = "NP_") -> List[Dict]:
    for i, row in enumerate(rows, start=1):
        row["news_id"] = f"{prefix}{i:06d}"
    return rows


def deduplicate_rows(rows: List[Dict]) -> List[Dict]:
    seen = set()
    deduped = []

    for row in rows:
        key = (
            row["news_content"][:250].lower(),
            row["category"],
            row["source_type"],
        )
        if key in seen:
            continue
        seen.add(key)
        deduped.append(row)

    return deduped


def export_csv(rows: List[Dict], output_path: str) -> None:
    with open(output_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()
        for row in rows:
            writer.writerow({col: row.get(col, "") for col in OUTPUT_COLUMNS})


def main():
    parser = argparse.ArgumentParser(description="Nepali RSS crawler to CSV")
    parser.add_argument("--limit", type=int, default=30, help="Max articles per feed")
    parser.add_argument(
        "--output",
        type=str,
        default="nepali_news_dataset.csv",
        help="Output CSV filename",
    )
    args = parser.parse_args()

    all_rows = []
    for feed_conf in RSS_FEEDS:
        try:
            feed_rows = parse_feed(feed_conf, limit=args.limit)
            all_rows.extend(feed_rows)
            print(f"[OK] {feed_conf['name']}: {len(feed_rows)} rows")
        except Exception as e:
            print(f"[ERROR] {feed_conf['name']}: {e}")

    all_rows = deduplicate_rows(all_rows)
    all_rows = assign_news_ids(all_rows)

    export_csv(all_rows, args.output)

    print(f"\nDone. Exported {len(all_rows)} rows to {args.output}")


if __name__ == "__main__":
    main()
