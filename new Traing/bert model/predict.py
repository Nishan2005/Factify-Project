import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_DIR = "factify_xlmr_model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()

id2label = {0: "REAL", 1: "FAKE"}  # change names if your labels mean something else

text = "नेपाल बैंकले आज ब्याज दर ४.५% मा राख्ने निर्णय गरेको छ..."

inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=256)

with torch.no_grad():
    outputs = model(**inputs)
    probs = torch.softmax(outputs.logits, dim=1).squeeze().tolist()

pred_id = int(torch.argmax(outputs.logits, dim=1).item())
print("Prediction:", id2label[pred_id])
print("Confidence:", round(max(probs), 4))
print("Probabilities:", {id2label[i]: round(p, 4) for i, p in enumerate(probs)})