import uuid


def create_fhir_bundle(data: dict):
    entries = []

    def make_entry(resource):
        return {
            "fullUrl": f"urn:uuid:{resource['id']}",
            "resource": resource
        }

    # -------------------------
    # 🟢 Symptoms → Condition
    # -------------------------
    for symptom in data.get("symptoms", []):
        resource = {
            "resourceType": "Condition",
            "id": str(uuid.uuid4()),
            "category": [{"text": "symptom"}],
            "code": {"text": symptom},
            "clinicalStatus": {"text": "active"}
        }
        entries.append(make_entry(resource))

    # -------------------------
    # 🦠 Diseases → Condition
    # -------------------------
    for disease in data.get("diseases", []):
        resource = {
            "resourceType": "Condition",
            "id": str(uuid.uuid4()),
            "category": [{"text": "diagnosis"}],
            "code": {"text": disease},
            "clinicalStatus": {"text": "active"}
        }
        entries.append(make_entry(resource))

    # -------------------------
    # 💊 Medicines → MedicationStatement
    # -------------------------
    dosages = data.get("dosage", [])
    frequencies = data.get("frequency", [])
    durations = data.get("duration", [])

    for i, med in enumerate(data.get("medicines", [])):
        dosage_text = ""

        if i < len(dosages):
            dosage_text += dosages[i]

        if i < len(frequencies):
            dosage_text += f" {frequencies[i]}"

        if i < len(durations):
            dosage_text += f" for {durations[i]}"

        resource = {
            "resourceType": "MedicationStatement",
            "id": str(uuid.uuid4()),
            "status": "active",
            "medicationCodeableConcept": {
                "text": med
            }
        }

        if dosage_text:
            resource["dosage"] = [{"text": dosage_text.strip()}]

        entries.append(make_entry(resource))

    # -------------------------
    # 🛌 Advice → CarePlan
    # -------------------------
    if data.get("advice"):
        resource = {
            "resourceType": "CarePlan",
            "id": str(uuid.uuid4()),
            "status": "active",
            "description": ", ".join(data["advice"])
        }
        entries.append(make_entry(resource))

    # -------------------------
    # 🔢 Observations → Observation
    # -------------------------
    for obs in data.get("observations", []):
        resource = {
            "resourceType": "Observation",
            "id": str(uuid.uuid4()),
            "status": "final",
            "valueString": obs
        }
        entries.append(make_entry(resource))

    # -------------------------
    # 🧠 Summary → ClinicalImpression
    # -------------------------
    if data.get("summary"):
        resource = {
            "resourceType": "ClinicalImpression",
            "id": str(uuid.uuid4()),
            "status": "completed",
            "description": data["summary"]
        }
        entries.append(make_entry(resource))

    # -------------------------
    # 📦 Bundle
    # -------------------------
    return {
        "resourceType": "Bundle",
        "type": "collection",
        "entry": entries
    }