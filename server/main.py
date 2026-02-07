from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = FastAPI()

# Load model from HuggingFace Hub
MODEL_ID = "goeldeepak747/safespeak-model"
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_ID)

class InputText(BaseModel):
    text: str

@app.post("/predict")
def predict(data: InputText):
    inputs = tokenizer(
        data.text,
        return_tensors="pt",
        truncation=True,
        padding="max_length",
        max_length=128
    )

    with torch.no_grad():
        outputs = model(**inputs)
    
    logits = outputs.logits[0]
    probs = torch.sigmoid(logits).tolist()

    labels = [
        "hate_speech",
        "offensive",
        "harassment",
        "threats",
        "slurs",
        "toxicity"
    ]

    result = dict(zip(labels, probs))
    return {"predictions": result}
