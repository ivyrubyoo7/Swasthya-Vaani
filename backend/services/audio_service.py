import shutil
import os
import random
from datetime import datetime
import json

from models.stt import transcribe_audio
from models.llm import analyze_medical_text

# ✅ ensure folders exist
os.makedirs("recordings", exist_ok=True)
os.makedirs("transcriptions", exist_ok=True)
os.makedirs("analysis", exist_ok=True)


def generate_filename(extension: str) -> str:
    """
    Generate unique filename:
    5-digit random + datetime
    Example: 58291_20260418_154210.wav
    """
    random_id = str(random.randint(10000, 99999))
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{random_id}_{timestamp}.{extension}"


def process_audio(file) -> dict:
    # ✅ extract extension safely
    ext = file.filename.split(".")[-1] if "." in file.filename else "webm"

    # ✅ generate unique filename
    filename = generate_filename(ext)

    audio_path = f"recordings/{filename}"

    # ✅ save audio file
    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"🎧 Saved audio: {audio_path}")

    # ✅ run STT
    text = transcribe_audio(audio_path)

    # ⚠️ handle empty transcription safely
    if not text.strip():
        print("⚠️ Empty transcription detected")
        return {
            "audio_file": filename,
            "text": "",
            "analysis": {}
        }

    # ✅ save transcription text
    text_filename = filename.replace(f".{ext}", ".txt")
    text_path = f"transcriptions/{text_filename}"

    with open(text_path, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"📝 Saved transcription: {text_path}")

    # ✅ run Groq (NER + summary)
    analysis = analyze_medical_text(text)

    # ✅ save analysis JSON
    analysis_filename = filename.replace(f".{ext}", ".json")
    analysis_path = f"analysis/{analysis_filename}"

    with open(analysis_path, "w", encoding="utf-8") as f:
        json.dump(analysis, f, indent=2)

    print(f"🧠 Saved analysis: {analysis_path}")

    return {
        "audio_file": filename,
        "text_file": text_filename,
        "analysis_file": analysis_filename,
        "text": text,
        "analysis": analysis
    }