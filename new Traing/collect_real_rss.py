import time
import re
import requests
import feedparser
import pandas as pd
from bs4 import BeautifulSoup
from urllib.parse import urlparse

# -----------------------------
# CONFIG: add your trusted RSS feeds here
# -----------------------------
TRUSTED_RSS_FEEDS = [
    "https://kathmandupost.com/rss",
    "https://www.onlinekhabar.com/feed",
    "https://www.bbc.com/nepali/index.xml",
]

MAX_ITEMS_PER_FEED = 150
MAX_TOTAL_ARTICLES = 600
REQUEST_TIMEOUT = 15
SLEEP_BETWEEN_REQUESTS = 0.4

OUT_CSV = "real_rss.csv"


def get_domain(url: str) -> str:
    try:
        return urlparse(url).netloc.lower()
    except Exception:
        return "unknown"


def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    return re.sub(r"\s+", " ", text).strip()


def fetch_article_text(url: str) -> str:
    """
    Simple scraper: pulls text from <p> tags.
    Works reasonably, but some sites may block or need custom parsing.
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0 (FactifyBot/1.0)"}
        r = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
        if r.status_code != 200 or not r.text:
            return ""

        soup = BeautifulSoup(r.text, "html.parser")
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()

        paragraphs = [p.get_text(" ", strip=True) for p in soup.find_all("p")]
        text = clean_text(" ".join(paragraphs))

        # Filter too-short pages
        if len(text) < 200:
            return ""
        return text

    except Exception:
        return ""


def main():
    rows = []
    seen = set()

    for feed_url in TRUSTED_RSS_FEEDS:
        parsed = feedparser.parse(feed_url)
        entries = parsed.entries[:MAX_ITEMS_PER_FEED]

        for e in entries:
            link = getattr(e, "link", None)
            title = clean_text(getattr(e, "title", ""))
            summary_html = getattr(e, "summary", "")
            summary = clean_text(BeautifulSoup(summary_html, "html.parser").get_text(" ", strip=True))

            if not link or link in seen:
                continue
            seen.add(link)

            source = get_domain(link)

            body = fetch_article_text(link)
            time.sleep(SLEEP_BETWEEN_REQUESTS)

            rows.append({
                "url": link,
                "source": source,
                "heading": title,
                "subheading": summary,
                "body": body,
                "label": "REAL",     # auto-label here
                "origin": "rss"
            })

            if len(rows) >= MAX_TOTAL_ARTICLES:
                break

        if len(rows) >= MAX_TOTAL_ARTICLES:
            break

    df = pd.DataFrame(rows)
    df.to_csv(OUT_CSV, index=False, encoding="utf-8")
    print(f"✅ Saved REAL RSS dataset: {OUT_CSV}")
    print("Rows:", len(df))
    print(df["source"].value_counts().head(10))


if __name__ == "__main__":
    main()
