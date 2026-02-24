import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, classification_report

from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    DataCollatorWithPadding,
)

# -------------------
# 1) Config
# -------------------
CSV_PATH = "/nepali_news_part_0002.csv"   # <- your file path
TEXT_COL = "news_context"
LABEL_COL = "label"

MODEL_NAME = "xlm-roberta-base"  # strong multilingual model for Nepali
OUT_DIR = "factify_xlmr_model"

MAX_LENGTH = 256        # increase to 512 if you have GPU + long articles
TEST_SIZE = 0.2
SEED = 42

# -------------------
# 2) Load dataset (robust CSV read)
# -------------------
df = pd.read_csv(CSV_PATH, engine="python", on_bad_lines="skip")

# keep only needed columns + drop missing
df = df[[TEXT_COL, LABEL_COL]].dropna()

# make sure labels are int
df[LABEL_COL] = df[LABEL_COL].astype(int)

# stratified split
train_df, test_df = train_test_split(
    df,
    test_size=TEST_SIZE,
    random_state=SEED,
    stratify=df[LABEL_COL]
)

train_ds = Dataset.from_pandas(train_df.reset_index(drop=True))
test_ds  = Dataset.from_pandas(test_df.reset_index(drop=True))

# -------------------
# 3) Tokenizer
# -------------------
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

def tokenize_batch(batch):
    return tokenizer(
        batch[TEXT_COL],
        truncation=True,
        max_length=MAX_LENGTH
    )

train_ds = train_ds.map(tokenize_batch, batched=True)
test_ds  = test_ds.map(tokenize_batch, batched=True)

# Trainer expects label column name to be "labels"
train_ds = train_ds.rename_column(LABEL_COL, "labels")
test_ds  = test_ds.rename_column(LABEL_COL, "labels")

# set format for PyTorch
cols_to_return = ["input_ids", "attention_mask", "labels"]
train_ds.set_format(type="torch", columns=cols_to_return)
test_ds.set_format(type="torch", columns=cols_to_return)

data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# -------------------
# 4) Model
# -------------------
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=2
)

# -------------------
# 5) Metrics
# -------------------
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=1)
    return {
        "accuracy": accuracy_score(labels, preds),
        "f1_macro": f1_score(labels, preds, average="macro")
    }

# -------------------
# 6) Training args
# -------------------
training_args = TrainingArguments(
    output_dir=OUT_DIR,
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_steps=50,
    load_best_model_at_end=True,
    metric_for_best_model="f1_macro",
    fp16=False,  # set True if you have compatible GPU
    report_to="none"
)

# -------------------
# 7) Train
# -------------------
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_ds,
    eval_dataset=test_ds,
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

trainer.train()

# -------------------
# 8) Evaluate + save
# -------------------
preds = trainer.predict(test_ds)
y_true = preds.label_ids
y_pred = np.argmax(preds.predictions, axis=1)

print("\nClassification report:")
print(classification_report(y_true, y_pred, digits=4))

trainer.save_model(OUT_DIR)
tokenizer.save_pretrained(OUT_DIR)

print(f"\n✅ Saved model + tokenizer to: {OUT_DIR}")