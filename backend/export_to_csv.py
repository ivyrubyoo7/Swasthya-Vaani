from pymongo import MongoClient
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["swasthya_vaani"]
collection = db["consultations"]

data = list(collection.find())

def list_to_str(x):
    return ", ".join(x) if isinstance(x, list) else ""

rows = []

for doc in data:
    pred = doc.get("prediction", {})
    truth = doc.get("ground_truth", {})

    row = {
        "text": doc.get("input", {}).get("raw_text"),

        # -------- PRED --------
        "symptoms_pred": list_to_str(pred.get("symptoms", [])),
        "diseases_pred": list_to_str(pred.get("diseases", [])),
        "medications_pred": list_to_str(pred.get("medications", [])),
        "dosage_pred": list_to_str(pred.get("dosage", [])),
        "advice_pred": list_to_str(pred.get("advice", [])),
        "numerical_data_pred": list_to_str(pred.get("numerical_data", [])),
        "summary_pred": pred.get("summary", ""),

        # -------- TRUE --------
        "symptoms_true": list_to_str(truth.get("symptoms", [])),
        "diseases_true": list_to_str(truth.get("diseases", [])),
        "medications_true": list_to_str(truth.get("medications", [])),
        "dosage_true": list_to_str(truth.get("dosage", [])),
        "advice_true": list_to_str(truth.get("advice", [])),
        "numerical_data_true": list_to_str(truth.get("numerical_data", [])),
        "summary_true": truth.get("summary", "")
    }

    rows.append(row)

df = pd.DataFrame(rows)
df.to_csv("medical_dataset.csv", index=False)

print("✅ CSV exported: medical_dataset.csv")