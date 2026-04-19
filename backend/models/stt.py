import whisper
from sarvamai import SarvamAI
import os
import json
from dotenv import load_dotenv

# =========================
# 🔐 Load ENV
# =========================
load_dotenv()

# =========================
# 🤖 Load Whisper (once)
# =========================
print("🔄 Loading Whisper model...")
whisper_model = whisper.load_model("base")
print("✅ Whisper model loaded!")

# =========================
# 🌐 Sarvam Client
# =========================
sarvam_client = SarvamAI(
    api_subscription_key=os.getenv("SARVAM_API_KEY")
)


# =========================
# 🎤 Main Function (Hybrid)
# =========================
def transcribe_audio(file_path: str) -> str:
    """
    Hybrid STT:
    1. Try Sarvam (better Hinglish)
    2. Fallback to Whisper (free/local)
    """

    # -------------------------
    # 🚀 Try Sarvam First
    # -------------------------
    try:
        print("🚀 Using Sarvam STT...")

        job = sarvam_client.speech_to_text_job.create_job(
            model="saaras:v3",
            mode="transcribe",
            language_code="unknown",
            with_diarization=False
        )

        job.upload_files(file_paths=[file_path])
        job.start()
        job.wait_until_complete()

        results = job.get_file_results()

        if not results["successful"]:
            raise Exception(results["failed"])

        output_dir = "temp_outputs"
        os.makedirs(output_dir, exist_ok=True)

        job.download_outputs(output_dir=output_dir)

        files = os.listdir(output_dir)
        json_files = [f for f in files if f.endswith(".json")]

        if not json_files:
            raise Exception("No transcription file found")

        latest_file = max(
            [os.path.join(output_dir, f) for f in json_files],
            key=os.path.getctime
        )

        with open(latest_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        text = data.get("text") or data.get("transcript", "")

        if not text.strip():
            raise Exception("Empty transcription")

        print("📝 Sarvam Transcription:", text)
        return text.strip()

    except Exception as e:
        print("⚠️ Sarvam failed, switching to Whisper:", str(e))

    # -------------------------
    # 🔁 Whisper Fallback
    # -------------------------
    try:
        print("🎧 Using Whisper fallback...")

        result = whisper_model.transcribe(file_path)
        text = result.get("text", "").strip()

        print("📝 Whisper Transcription:", text)

        return text

    except Exception as e:
        print("❌ Whisper also failed:", e)
        return ""