from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.audio_service import process_audio
from models.llm import analyze_medical_text

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

        return {
            "status": "success",
            "text": result.get("text", ""),
            "analysis": result.get("analysis", {})
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

        analysis = analyze_medical_text(req.text)

        return {
            "status": "success",
            "text": req.text,
            "analysis": analysis
        }

    except Exception as e:
        print("❌ Text Analysis Error:", e)

        return {
            "status": "error",
            "message": str(e)
        }