"""
Factify – RAG-Enhanced Fake News Detection API
================================================
Architecture:
  POST /predict          → Layer 1 only  (pattern classifier, fast)
  POST /predict/rag      → Layer 1 + 2   (classifier + live evidence retrieval)
  POST /index/refresh    → Re-fetch RSS feeds and rebuild FAISS index
  GET  /health           → Status + index stats
"""

import os
import logging
from typing import Dict, List, Optional

import numpy as np
import torch
import feedparser
import faiss
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sentence_transformers import SentenceTransformer

# ─────────────────────────────────────────────
# Config (override via environment variables)
# ─────────────────────────────────────────────
MODEL_DIR      = os.getenv("MODEL_DIR",      "factify_xlmr_model")
EMBED_MODEL    = os.getenv("EMBED_MODEL",    "paraphrase-multilingual-MiniLM-L12-v2")
MAX_LEN        = int(os.getenv("MAX_LEN",    "128"))
SIM_THRESHOLD  = float(os.getenv("SIM_THRESHOLD", "0.50"))   # min cosine sim to count as evidence
ALPHA          = float(os.getenv("ALPHA",    "0.60"))         # weight for classifier vs evidence
MAX_PER_SOURCE = int(os.getenv("MAX_PER_SOURCE", "40"))

ID2LABEL: Dict[int, str] = {
    0: os.getenv("LABEL_0", "REAL"),
    1: os.getenv("LABEL_1", "FAKE"),
}

TRUSTED_RSS_FEEDS: List[tuple] = [
    ("Setopati",     "https://www.setopati.com/rss"),
    ("Onlinekhabar", "https://www.onlinekhabar.com/feed"),
    ("Ratopati",     "https://ratopati.com/rss"),
]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("factify")

# ─────────────────────────────────────────────
# App
# ─────────────────────────────────────────────
app = FastAPI(title="Factify RAG API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # restrict to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Global state (loaded once at startup)
# ─────────────────────────────────────────────
device     = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tokenizer  = None
clf_model  = None
embedder   = None
faiss_index      = None
article_store: List[dict] = []


# ─────────────────────────────────────────────
# Startup
# ─────────────────────────────────────────────
@app.on_event("startup")
def startup():
    load_classifier()
    load_embedder()
    refresh_news_index()   # build index on boot with latest articles


def load_classifier():
    global tokenizer, clf_model
    logger.info(f"Loading classifier from: {MODEL_DIR}")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    clf_model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    clf_model.to(device).eval()
    logger.info(f"✅ Classifier ready on {device}")


def load_embedder():
    global embedder
    logger.info(f"Loading sentence embedder: {EMBED_MODEL}")
    embedder = SentenceTransformer(EMBED_MODEL)
    logger.info("✅ Embedder ready")


def embed(texts: List[str]) -> np.ndarray:
    vecs = embedder.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
    return vecs.astype("float32")


def fetch_articles() -> List[dict]:
    articles = []
    for source_name, url in TRUSTED_RSS_FEEDS:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:MAX_PER_SOURCE]:
                title   = getattr(entry, "title",   "").strip()
                summary = getattr(entry, "summary", "").strip()
                link    = getattr(entry, "link",    "").strip()
                text    = f"{title}. {summary}".strip()
                if text:
                    articles.append({
                        "source": source_name,
                        "title":  title,
                        "link":   link,
                        "text":   text,
                    })
        except Exception as e:
            logger.warning(f"Could not fetch {source_name}: {e}")
    logger.info(f"Fetched {len(articles)} articles from {len(TRUSTED_RSS_FEEDS)} sources")
    return articles


def refresh_news_index():
    global faiss_index, article_store
    articles = fetch_articles()
    if not articles:
        logger.warning("No articles fetched – RAG index is empty")
        return
    vecs = embed([a["text"] for a in articles])
    dim  = vecs.shape[1]
    idx  = faiss.IndexFlatIP(dim)
    idx.add(vecs)
    faiss_index   = idx
    article_store = articles
    logger.info(f"✅ FAISS index built: {idx.ntotal} vectors, dim={dim}")


# ─────────────────────────────────────────────
# Core inference helpers
# ─────────────────────────────────────────────
def run_classifier(text: str, max_length: int = MAX_LEN) -> dict:
    inputs = tokenizer(
        text, return_tensors="pt",
        truncation=True, max_length=max_length, padding=False,
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        probs = torch.softmax(clf_model(**inputs).logits, dim=1).squeeze(0).cpu()
    pred_id    = int(torch.argmax(probs).item())
    confidence = float(probs[pred_id].item())
    return {
        "label":      ID2LABEL.get(pred_id, str(pred_id)),
        "confidence": confidence,
        "probs":      {ID2LABEL[i]: float(probs[i].item()) for i in range(len(probs))},
        "prob_real":  float(probs[0].item()),
    }


def retrieve_evidence(claim: str, k: int = 5) -> List[dict]:
    if faiss_index is None or faiss_index.ntotal == 0:
        return []
    query_vec = embed([claim])
    scores, indices = faiss_index.search(query_vec, k)
    results = []
    for rank, (idx, score) in enumerate(zip(indices[0], scores[0])):
        if idx == -1:
            continue
        art = article_store[idx].copy()
        art["similarity"] = round(float(score), 4)
        art["rank"]       = rank + 1
        results.append(art)
    return results


def fuse_scores(prob_real: float, evidence_score: float) -> dict:
    final_score = ALPHA * prob_real + (1 - ALPHA) * evidence_score
    if final_score >= 0.60:
        verdict = "REAL"
    elif final_score <= 0.40:
        verdict = "FAKE"
    else:
        verdict = "UNCERTAIN"
    return {
        "verdict":        verdict,
        "final_score":    round(final_score, 4),
        "pattern_score":  round(prob_real, 4),
        "evidence_score": round(evidence_score, 4),
    }


# ─────────────────────────────────────────────
# Request / Response schemas
# ─────────────────────────────────────────────
class PredictRequest(BaseModel):
    text:       str            = Field(..., min_length=1)
    max_length: Optional[int]  = Field(None, ge=16, le=512)
    top_k:      Optional[int]  = Field(5,    ge=1,  le=20)

class EvidenceItem(BaseModel):
    rank:       int
    source:     str
    title:      str
    link:       str
    similarity: float

class PredictResponse(BaseModel):
    label:      str
    confidence: float
    probs:      Dict[str, float]

class RAGPredictResponse(BaseModel):
    # Classifier output
    pattern_label:   str
    pattern_probs:   Dict[str, float]
    # RAG fusion output
    verdict:         str            # REAL | FAKE | UNCERTAIN
    final_score:     float          # 0=FAKE  1=REAL
    pattern_score:   float
    evidence_score:  float
    # Evidence
    evidence_found:  bool
    top_evidence:    List[EvidenceItem]

class RefreshResponse(BaseModel):
    status:        str
    articles_indexed: int


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status":           "ok",
        "device":           str(device),
        "model_dir":        os.path.abspath(MODEL_DIR),
        "articles_indexed": faiss_index.ntotal if faiss_index else 0,
        "sources":          [s for s, _ in TRUSTED_RSS_FEEDS],
    }


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    """Fast pattern-only classification (Layer 1)."""
    if tokenizer is None or clf_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    result = run_classifier(req.text, req.max_length or MAX_LEN)
    return PredictResponse(
        label=result["label"],
        confidence=result["confidence"],
        probs=result["probs"],
    )


@app.post("/predict/rag", response_model=RAGPredictResponse)
def predict_rag(req: PredictRequest):
    """
    Full RAG pipeline (Layer 1 + Layer 2).
    
    Flow:
      claim → classifier → pattern_score
           → FAISS search → evidence_score
           → fuse scores  → verdict
    """
    if tokenizer is None or clf_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    # Layer 1 – classifier
    clf = run_classifier(req.text, req.max_length or MAX_LEN)

    # Layer 2 – retrieve evidence
    retrieved = retrieve_evidence(req.text, k=req.top_k or 5)
    max_sim   = max((r["similarity"] for r in retrieved), default=0.0)

    # Filter to threshold
    top_evidence = [r for r in retrieved if r["similarity"] >= SIM_THRESHOLD]

    # Fuse
    fusion = fuse_scores(
        prob_real=clf["prob_real"],
        evidence_score=float(np.clip(max_sim, 0, 1)),
    )

    return RAGPredictResponse(
        pattern_label  = clf["label"],
        pattern_probs  = clf["probs"],
        verdict        = fusion["verdict"],
        final_score    = fusion["final_score"],
        pattern_score  = fusion["pattern_score"],
        evidence_score = fusion["evidence_score"],
        evidence_found = len(top_evidence) > 0,
        top_evidence   = [
            EvidenceItem(
                rank       = e["rank"],
                source     = e["source"],
                title      = e["title"],
                link       = e["link"],
                similarity = e["similarity"],
            )
            for e in top_evidence[:5]
        ],
    )


@app.post("/index/refresh", response_model=RefreshResponse)
def refresh_index(background_tasks: BackgroundTasks):
    """
    Trigger a background refresh of the news index.
    Returns immediately; index updates in the background.
    """
    background_tasks.add_task(refresh_news_index)
    return RefreshResponse(
        status="refresh started",
        articles_indexed=faiss_index.ntotal if faiss_index else 0,
    )
