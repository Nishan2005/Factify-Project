import pandas as pd

REAL_CSV = "real_rss.csv"
FACTCHECK_CSV = "factcheck_labeled.csv"
OUT_CSV = "merged_balanced.csv"

def balance_binary(df: pd.DataFrame, seed=42):
    counts = df["label"].value_counts()
    if len(counts) < 2:
        raise ValueError(f"Need 2 classes. Found: {counts.to_dict()}")

    min_n = counts.min()
    balanced = (
        df.groupby("label", group_keys=False)
          .apply(lambda x: x.sample(min_n, random_state=seed))
          .reset_index(drop=True)
    )
    return balanced

def build_final_text(df):
    # Prefer body if exists, fallback to heading + subheading
    body = df.get("body", "")
    if body is None:
        body = ""

    def make_row(r):
        parts = [
            f"source: {r.get('source','')}",
            f"heading: {r.get('heading','')}",
            f"subheading: {r.get('subheading','')}",
        ]
        b = r.get("body", "")
        if isinstance(b, str) and len(b.strip()) > 0:
            parts.append(f"text: {b}")
        return "  ".join(parts)

    df["text"] = df.apply(make_row, axis=1)
    return df

def main():
    real_df = pd.read_csv(REAL_CSV)
    fact_df = pd.read_csv(FACTCHECK_CSV)

    # Keep only REAL/FAKE
    real_df = real_df[real_df["label"].isin(["REAL"])].copy()
    fact_df = fact_df[fact_df["label"].isin(["FAKE"])].copy()

    merged = pd.concat([real_df, fact_df], ignore_index=True)

    merged = build_final_text(merged)

    print("Before balancing:\n", merged["label"].value_counts())

    balanced = balance_binary(merged)
    print("After balancing:\n", balanced["label"].value_counts())

    balanced.to_csv(OUT_CSV, index=False, encoding="utf-8")
    print(f"✅ Saved balanced dataset: {OUT_CSV}")

if __name__ == "__main__":
    main()
