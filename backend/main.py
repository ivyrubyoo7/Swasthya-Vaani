from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

from services.audio_service import process_audio
from models.llm import analyze_medical_text
from services.fhir_service import create_fhir_bundle

from db import consultations_collection  # ✅ NEW

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
# 🎤 AUDIO ENDPOINT
# =========================
@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        result = process_audio(file)

        text = result.get("text", "")
        analysis = result.get("analysis", {})
        fhir_data = result.get("fhir", {})

        # 🧱 SAVE TO DB
        document = {
            "patient_id": "unknown",  # later replace with auth/user
            "timestamp": datetime.utcnow(),

            "input": {
                "type": "audio",
                "raw_text": text,
                "file_name": file.filename
            },

            "prediction": {
                "analysis": analysis,
                "fhir": fhir_data
            },

            "ground_truth": {
                "analysis": {},
                "summary": ""
            }
        }

        consultations_collection.insert_one(document)

        return {
            "status": "success",
            "text": text,
            "analysis": analysis,
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

        # 🧱 SAVE TO DB
        document = {
            "patient_id": "unknown",
            "timestamp": datetime.utcnow(),

            "input": {
                "type": "text",
                "raw_text": req.text
            },

            "prediction": {
                "analysis": analysis,
                "fhir": fhir_data
            },

            "ground_truth": {
                "analysis": {},
                "summary": ""
            }
        }

        consultations_collection.insert_one(document)

        return {
            "status": "success",
            "text": req.text,
            "analysis": analysis,
            "fhir": fhir_data
        }

    except Exception as e:
        print("❌ Text Analysis Error:", e)

        return {
            "status": "error",
            "message": str(e)
        }