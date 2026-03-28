import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_DIR = "factify_xlmr_model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()

id2label = {0: "REAL", 1: "FAKE"}  # change names if your labels mean something else

text = "बझाङका उम्मेदवारहरूले अघिल्ला चुनावमा जस्तै सडक, राजमार्ग, खेलमैदान र सञ्चार सुधारजस्ता पुरानै चुनावी बाचा दोहोर्‍याएका छन् । विगतका प्रतिबद्धता पूरा नहुँदा निराश देखिएका मतदाताले यसपटक परिणाम खोजिरहेका छन् ।"

inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=256)

with torch.no_grad():
    outputs = model(**inputs)
    probs = torch.softmax(outputs.logits, dim=1).squeeze().tolist()

pred_id = int(torch.argmax(outputs.logits, dim=1).item())
print("Prediction:", id2label[pred_id])
print("Confidence:", round(max(probs), 4))
print("Probabilities:", {id2label[i]: round(p, 4) for i, p in enumerate(probs)})