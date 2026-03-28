import re
import pandas as pd
from urllib.parse import urlparse

IN_CSV = "real_rss.csv"     # your file
OUT_CSV = "factcheck_labeled.csv"

FAKE_PAT = re.compile(r"(मिथ्या|भ्रामक|गलत|झुटो|झूठो|फेक|हल्ला)", re.IGNORECASE)
REAL_PAT = re.compile(r"(सत्य|सही|ठिक|ठीक|यथार्थ)", re.IGNORECASE)

def get_domain(url: str) -> str:
    try:
        return urlparse(url).netloc.lower()
    except Exception:
        return "unknown"

def clean_text(t: str) -> str:
    if not isinstance(t, str):
        return ""
    return re.sub(r"\s+", " ", t).strip()

def weak_label(heading: str, subheading: str):
    txt = f"{heading} {subheading}"
    has_fake = bool(FAKE_PAT.search(txt))
    has_real = bool(REAL_PAT.search(txt))

    # For your current pipeline: map misleading -> FAKE
    if has_fake:
        return "FAKE"
    if has_real and not has_fake:
        return "REAL"
    return None

def main():
    df = pd.read_csv(IN_CSV).rename(columns={
        "Article URL": "url",
        "Headings": "heading",
        "Subheadings": "subheading"
    })

    df = df.dropna(subset=["url", "heading", "subheading"]).copy()

    df["heading"] = df["heading"].map(clean_text)
    df["subheading"] = df["subheading"].map(clean_text)
    df["source"] = df["url"].map(get_domain)

    df["label"] = df.apply(lambda r: weak_label(r["heading"], r["subheading"]), axis=1)
    df = df.dropna(subset=["label"]).copy()

    df["origin"] = "factcheck"

    df.to_csv(OUT_CSV, index=False, encoding="utf-8")
    print(f"✅ Saved labeled fact-check dataset: {OUT_CSV}")
    print("Label counts:\n", df["label"].value_counts())

if __name__ == "__main__":
    main()
