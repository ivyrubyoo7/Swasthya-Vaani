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
    cleaned = re.sub(r"```json|```", "", content)

    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        cleaned = match.group(0)

    return cleaned.strip()


# =========================
# 🧹 CLEAN LIST VALUES
# =========================
def clean_list(values):
    if not isinstance(values, list):
        return []

    cleaned = []
    for v in values:
        if isinstance(v, str):
            v = v.strip().lower()
            if v:
                cleaned.append(v)

    return list(set(cleaned))


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
        "numerical_data": [],
        "summary": summary
    }


# =========================
# 🧠 MAIN FUNCTION (UPDATED)
# =========================
def analyze_medical_text(text: str):

    prompt = f"""
You are a clinical AI system.

You MUST follow this pipeline strictly:

-----------------------------------
STEP 1: TRANSLATE
-----------------------------------
Convert the entire conversation into clean medical English.

- Hindi/Hinglish → English
- Use clinical terminology
- Examples:
  "बुखार" → "fever"
  "पेट खराब" → "stomach upset"
  "कमजोरी" → "weakness"

-----------------------------------
STEP 2: EXTRACT STRUCTURED DATA
-----------------------------------
From the translated English text extract:

- symptoms
- diseases (ONLY if explicitly mentioned)
- medicines
- dosage
- frequency
- duration
- advice
- observations

-----------------------------------
STEP 3: SUMMARY
-----------------------------------
Write a short clinical summary in English.

-----------------------------------
STRICT RULES:

- Output MUST be in English ONLY
- DO NOT include Hindi words
- DO NOT hallucinate diseases
- If missing → return empty list

-----------------------------------
OUTPUT FORMAT:

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

-----------------------------------
CONVERSATION:
{text}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "Return ONLY valid JSON in English."
                },
                {
                    "role": "user",
                    "content": prompt
                },
            ],
            temperature=0.1,  # 🔥 more deterministic
        )

        content = response.choices[0].message.content.strip()
        print("🧠 Raw LLM Output:", content)

        cleaned = clean_json_output(content)

        try:
            parsed = json.loads(cleaned)

            base = empty_structure()
            base.update(parsed)

            # =========================
            # 🧹 CLEAN ALL LIST FIELDS
            # =========================
            for key in [
                "symptoms",
                "medicines",
                "diseases",
                "dosage",
                "frequency",
                "duration",
                "advice",
                "observations"
            ]:
                base[key] = clean_list(base.get(key, []))

            # =========================
            # 🔢 NUMERICAL DATA
            # =========================
            base["numerical_data"] = clean_list(
                base.get("frequency", []) + base.get("duration", [])
            )

            return base

        except json.JSONDecodeError as e:
            print("⚠️ JSON parse failed:", e)
            return empty_structure(summary=cleaned)

    except Exception as e:
        print("❌ Groq Error:", e)
        return empty_structure()