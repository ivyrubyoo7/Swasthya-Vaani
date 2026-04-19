from fastapi import APIRouter
from db import consultations_collection
from datetime import datetime

router = APIRouter()

@router.get("/test-db")
def test_db_insert():
    sample_data = {
        "patient_id": "P001",
        "timestamp": datetime.utcnow(),

        "input": {
            "raw_text": "Patient has fever and headache",
            "language": "en"
        },

        "prediction": {
            "clean_text": "Patient reports fever and headache",
            "summary": "Patient has symptoms of fever and headache.",
            "entities": {
                "symptoms": ["fever", "headache"],
                "diseases": [],
                "medicines": [],
                "dosage": [],
                "frequency": [],
                "duration": [],
                "advice": [],
                "observations": []
            }
        },

        "ground_truth": {
            "summary": "",
            "entities": {}
        }
    }

    result = consultations_collection.insert_one(sample_data)

    return {
        "message": "Inserted successfully",
        "id": str(result.inserted_id)
    }