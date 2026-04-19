import whisper

# 🔄 Load model once (on server start)
print("🔄 Loading Whisper model...")
model = whisper.load_model("base")  # "base" is good for CPU
print("✅ Whisper model loaded!")


def transcribe_audio(file_path: str) -> str:
    """
    Convert audio file → text using Whisper
    """

    try:
        print(f"🎧 Transcribing: {file_path}")

        result = model.transcribe(file_path)

        text = result.get("text", "").strip()

        print("📝 Transcription:", text)

        return text

    except Exception as e:
        print("❌ STT Error:", e)
        return ""