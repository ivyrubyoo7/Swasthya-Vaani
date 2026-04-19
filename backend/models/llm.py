from dotenv import load_dotenv
from groq import Groq
import os
import json
import re

# =========================
# 🔐 LOAD ENV
# =========================
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("❌ GROQ_API_KEY not found. Check your .env file.")

client = Groq(api_key=api_key)


# =========================
# 🧹 CLEAN OUTPUT
# =========================
def clean_json_output(content: str):
    """
    Removes markdown wrappers and extra text
    """
    # remove ```json ```
    cleaned = re.sub(r"```json|```", "", content)

    # extract only JSON block if extra text exists
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        cleaned = match.group(0)

    return cleaned.strip()


# =========================
# 🧱 EMPTY TEMPLATE
# =========================
def empty_structure(summary=""):
    return {
        "symptoms": [],
        "medicines": [],
        "diseases": [],
        "dosage": [],
        "frequency": [],
        "duration": [],
        "advice": [],
        "observations": [],
        "summary": summary
    }


# =========================
# 🧠 MAIN FUNCTION
# =========================
def analyze_medical_text(text: str):
    """
    Handles:
    - Hinglish → English
    - Medical NER
    - Structured extraction
    """

    prompt = f"""
You are a clinical AI assistant analyzing a doctor-patient conversation.

TASK:
1. Convert Hinglish/Hindi into clean medical English
2. Extract ALL clinical information

IMPORTANT:
- Separate medicine, dosage, frequency, and duration clearly
- Do NOT merge them together

EXTRACT:

- symptoms (fever, headache, etc.)
- diseases (viral infection, etc.)
- medicines (paracetamol, etc.)
- dosage (500 mg, 1.5 mg)
- frequency (twice daily, once daily)
- duration (5 days, 3–4 days)
- advice (bed rest, hydration)
- observations (numbers, measurable info)

STRICT RULES:
- Output ONLY valid JSON
- No explanation
- No markdown
- Always include summary

FORMAT:
{{
  "symptoms": [],
  "medicines": [],
  "diseases": [],
  "dosage": [],
  "frequency": [],
  "duration": [],
  "advice": [],
  "observations": [],
  "summary": ""
}}

CONVERSATION:
{text}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "Return ONLY valid JSON. No markdown. No explanation."
                },
                {
                    "role": "user",
                    "content": prompt
                },
            ],
            temperature=0.2,
        )

        content = response.choices[0].message.content.strip()

        print("🧠 Raw LLM Output:", content)

        cleaned = clean_json_output(content)

        # =========================
        # ✅ SAFE JSON PARSE
        # =========================
        try:
            parsed = json.loads(cleaned)

            # ensure all keys exist
            base = empty_structure()
            base.update(parsed)

            return base

        except json.JSONDecodeError as e:
            print("⚠️ JSON parse failed:", e)
            return empty_structure(summary=cleaned)

    except Exception as e:
        print("❌ Groq Error:", e)
        return empty_structure()