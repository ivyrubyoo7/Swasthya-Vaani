from dotenv import load_dotenv
from groq import Groq
import os
import json
import re

# ✅ LOAD ENV FIRST
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
print("🔑 GROQ KEY LOADED:", "YES" if api_key else "NO")

if not api_key:
    raise ValueError("❌ GROQ_API_KEY not found. Check your .env file.")

client = Groq(api_key=api_key)


def clean_json_output(content: str):
    """
    Removes ```json ``` wrappers and cleans output
    """
    cleaned = re.sub(r"```json|```", "", content).strip()
    return cleaned


def analyze_medical_text(text: str):
    """
    Extracts symptoms, medicines, diseases, and summary
    """

    prompt = f"""
Extract structured medical data.

STRICT RULES:
- Return ONLY valid JSON
- No markdown, no explanation
- Always include a meaningful summary (even if non-medical)

FORMAT:
{{
  "symptoms": [],
  "medicines": [],
  "diseases": [],
  "summary": ""
}}

Text:
{text}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Return only JSON. No markdown."},
                {"role": "user", "content": prompt},
            ],
            temperature=0,
        )

        content = response.choices[0].message.content.strip()

        print("🧠 Raw LLM Output:", content)

        cleaned = clean_json_output(content)

        return json.loads(cleaned)

    except json.JSONDecodeError as e:
        print("⚠️ JSON parse failed:", e)

        return {
            "symptoms": [],
            "medicines": [],
            "diseases": [],
            "summary": cleaned if 'cleaned' in locals() else content
        }

    except Exception as e:
        print("❌ Groq Error:", e)

        return {
            "symptoms": [],
            "medicines": [],
            "diseases": [],
            "summary": ""
        }