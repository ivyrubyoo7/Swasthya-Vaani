from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

from services.audio_service import process_audio
from models.llm import analyze_medical_text
from services.fhir_service import create_fhir_bundle

from db import consultations_collection

app = FastAPI()

# 🌐 allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🧱 HELPER: CLEAN STRUCTURE
# =========================
def format_prediction(analysis):
    return {
        "symptoms": analysis.get("symptoms", []),
        "diseases": analysis.get("diseases", []),
        "medications": analysis.get("medicines", []),  # rename here
        "dosage": analysis.get("dosage", []),
        "advice": analysis.get("advice", []),
        "numerical_data": analysis.get("numerical_data", []),
        "summary": analysis.get("summary", "")
    }


# =========================
# 🎤 AUDIO ENDPOINT
# =========================
@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        result = process_audio(file)

        text = result.get("text", "")
        analysis = result.get("analysis", {})
        fhir_data = result.get("fhir", {})

        # 🧱 FORMAT CLEAN DATA
        prediction = format_prediction(analysis)

        # 🧱 SAVE TO DB
        document = {
            "patient_id": "unknown",
            "timestamp": datetime.utcnow(),

            "input": {
                "type": "audio",
                "raw_text": text,
                "file_name": file.filename
            },

            "prediction": prediction,
            "fhir": fhir_data,   # ✅ separate

            "ground_truth": {}   # empty for now
        }

        consultations_collection.insert_one(document)

        return {
            "status": "success",
            "text": text,
            "analysis": prediction,
            "fhir": fhir_data
        }

    except Exception as e:
        print("❌ Upload Error:", e)

        return {
            "status": "error",
            "message": str(e)
        }


# =========================
# 📝 TEXT ENDPOINT
# =========================
class TextRequest(BaseModel):
    text: str


@app.post("/analyze-text")
async def analyze_text(req: TextRequest):
    try:
        print("📝 Received text:", req.text)

        # 🧠 LLM
        analysis = analyze_medical_text(req.text)

        # 🏥 FHIR
        fhir_data = create_fhir_bundle(analysis)

        # 🧱 FORMAT CLEAN DATA
        prediction = format_prediction(analysis)

        # 🧱 SAVE TO DB
        document = {
            "patient_id": "unknown",
            "timestamp": datetime.utcnow(),

            "input": {
                "type": "text",
                "raw_text": req.text
            },

            "prediction": prediction,
            "fhir": fhir_data,

            "ground_truth": {}
        }

        consultations_collection.insert_one(document)

        return {
            "status": "success",
            "text": req.text,
            "analysis": prediction,
            "fhir": fhir_data
        }

    except Exception as e:
        print("❌ Text Analysis Error:", e)

        return {
            "status": "error",
            "message": str(e)
        }