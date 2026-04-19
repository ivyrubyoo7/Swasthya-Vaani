import shutil
import os
import random
from datetime import datetime
import json

from services.fhir_service import create_fhir_bundle

# ✅ updated imports
from models.stt import transcribe_audio
from models.llm import analyze_medical_text

# =========================
# 📁 PATH SETUP
# =========================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

RECORDINGS_DIR = os.path.join(BASE_DIR, "recordings")
TRANSCRIPTIONS_DIR = os.path.join(BASE_DIR, "transcriptions")
ANALYSIS_DIR = os.path.join(BASE_DIR, "analysis")

os.makedirs(RECORDINGS_DIR, exist_ok=True)
os.makedirs(TRANSCRIPTIONS_DIR, exist_ok=True)
os.makedirs(ANALYSIS_DIR, exist_ok=True)


# =========================
# 🏷️ FILENAME GENERATOR
# =========================
def generate_filename(extension: str) -> str:
    random_id = str(random.randint(10000, 99999))
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{random_id}_{timestamp}.{extension}"


# =========================
# 🎧 MAIN PROCESS FUNCTION
# =========================
def process_audio(file) -> dict:
    try:
        # ✅ safe extension extraction
        ext = file.filename.split(".")[-1].lower() if "." in file.filename else "webm"

        # ✅ generate filename
        filename = generate_filename(ext)
        audio_path = os.path.join(RECORDINGS_DIR, filename)

        # ✅ save file
        with open(audio_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"🎧 Saved audio: {audio_path}")

        # =========================
        # 🎤 STT
        # =========================
        text = transcribe_audio(audio_path)

        if not text.strip():
            print("⚠️ Empty transcription detected")

            return {
                "audio_file": filename,
                "text": "",
                "analysis": {},
                "fhir": {}
            }

        # =========================
        # 📝 SAVE TRANSCRIPTION
        # =========================
        text_filename = filename.rsplit(".", 1)[0] + ".txt"
        text_path = os.path.join(TRANSCRIPTIONS_DIR, text_filename)

        with open(text_path, "w", encoding="utf-8") as f:
            f.write(text)

        print(f"📝 Saved transcription: {text_path}")

        # =========================
        # 🧠 LLM ANALYSIS
        # =========================
        analysis = analyze_medical_text(text)

        # =========================
        # 💾 SAVE ANALYSIS
        # =========================
        analysis_filename = filename.rsplit(".", 1)[0] + ".json"
        analysis_path = os.path.join(ANALYSIS_DIR, analysis_filename)

        with open(analysis_path, "w", encoding="utf-8") as f:
            json.dump(analysis, f, indent=2)

        print(f"🧠 Saved analysis: {analysis_path}")

        # =========================
        # 🏥 FHIR (NOT STORED)
        # =========================
        fhir_data = create_fhir_bundle(analysis)

        print("🏥 FHIR Preview:")
        print(json.dumps(fhir_data, indent=2))

        # =========================
        # 📤 RESPONSE
        # =========================
        return {
            "audio_file": filename,
            "text_file": text_filename,
            "analysis_file": analysis_filename,
            "text": text,
            "analysis": analysis,
            "fhir": fhir_data
        }

    except Exception as e:
        print("❌ Processing Error:", str(e))
        raise