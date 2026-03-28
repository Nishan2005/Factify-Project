import os
from typing import Dict, Optional

import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# ---------- Config ----------
MODEL_DIR = os.getenv("MODEL_DIR", "factify_xlmr_model")
MAX_LEN = int(os.getenv("MAX_LEN", "128"))

# If you trained 2 labels only, map them properly:
# Change these to your real labels.
ID2LABEL: Dict[int, str] = {
    0: os.getenv("LABEL_0", "REAL"),
    1: os.getenv("LABEL_1", "FAKE"),
}

# ---------- App ----------
app = FastAPI(title="Factify Inference API", version="1.0.0")

# Allow frontend (React/Vite etc.) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, set your domain(s) only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Request / Response ----------
class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, description="News text to classify")
    max_length: Optional[int] = Field(None, ge=16, le=512, description="Override max token length")

class PredictResponse(BaseModel):
    label: str
    confidence: float
    probs: Dict[str, float]

# ---------- Load model once ----------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tokenizer = None
model = None

@app.on_event("startup")
def load_model():
    global tokenizer, model
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    model.to(device)
    model.eval()
    print(f"✅ Model loaded from: {os.path.abspath(MODEL_DIR)}")
    print(f"✅ Running on device: {device}")

@app.get("/health")
def health():
    return {
        "status": "ok",
        "device": str(device),
        "model_dir": os.path.abspath(MODEL_DIR),
    }

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if tokenizer is None or model is None:
        # should not happen, but safe guard
        return PredictResponse(label="ERROR", confidence=0.0, probs={})

    max_len = req.max_length or MAX_LEN

    inputs = tokenizer(
        req.text,
        return_tensors="pt",
        truncation=True,
        max_length=max_len,
        padding=False,
    )

    # move tensors to device
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        out = model(**inputs)
        probs = torch.softmax(out.logits, dim=1).squeeze(0).detach().cpu()

    pred_id = int(torch.argmax(probs).item())
    confidence = float(probs[pred_id].item())

    probs_dict = {ID2LABEL[i]: float(probs[i].item()) for i in range(len(probs))}
    label = ID2LABEL.get(pred_id, str(pred_id))

    return PredictResponse(label=label, confidence=confidence, probs=probs_dict)