
from sqlalchemy import select

from backend.database import Base, SessionLocal, engine
from backend.models import Department

# Initial departments for the FlowGuard AI demonstration.
DEPARTMENTS = [
    {
        "name": "Emergency",
        "description": "Emergency admissions and urgent patient flow",
    },
    {
        "name": "ICU",
        "description": "Intensive care and critical patient monitoring",
    },
    {
        "name": "General Medicine",
        "description": "General medical admissions and inpatient care",
    },
    {
        "name": "Surgery",
        "description": "Surgical admissions and postoperative care",
    },
    {
        "name": "Radiology",
        "description": "Medical imaging and diagnostic workflow",
    },
    {
        "name": "Laboratory",
        "description": "Laboratory tests and diagnostic sample processing",
    },
    {
        "name": "Outpatient",
        "description": "Outpatient consultations and patient visits",
    },
    {
        "name": "Pharmacy",
        "description": "Medication dispensing and pharmacy workflow",
    },
    
    {
        "name": "X-Ray",
        "description": "X-ray imaging and diagnostic examinations",
    },
    {
        "name": "Cardiology",
        "description": "Heart care, cardiac diagnostics and monitoring",
    },
    {
        "name": "Orthopedics",
        "description": "Bone, joint and musculoskeletal care",
    },
    {
        "name": "Maternity",
        "description": "Maternity care and obstetric services",
    },
    {
        "name": "Pediatrics",
        "description": "Medical care for infants, children and adolescents",
    },
    {
        "name": "Dialysis",
        "description": "Dialysis treatment and renal care",
    },
    {
        "name": "Physiotherapy",
        "description": "Rehabilitation and physical therapy services",
    },
    {
        "name": "Blood Bank",
        "description": "Blood collection, storage and transfusion support",
    },
]


def seed_departments():
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        added = 0

        for item in DEPARTMENTS:
            existing = db.scalar(
                select(Department).where(
                    Department.name == item["name"]
                )
            )

            if existing is None:
                db.add(Department(**item))
                added += 1

        db.commit()

    print(f"Department setup complete. Added {added} new departments.")


if __name__ == "__main__":
    seed_departments()