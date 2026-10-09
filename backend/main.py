from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text

from backend.database import Base, SessionLocal, engine
from backend.forecasting import (
    calculate_backtest_validation,
    forecast_department_bottlenecks,
)
from backend.models import Alert, Department, User


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="FlowGuard AI API",
    description="Predictive Hospital Bottleneck Intelligence",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to FlowGuard AI",
        "status": "running",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "application": "FlowGuard AI",
    }


@app.get("/api/departments")
def get_departments():
    with SessionLocal() as db:
        departments = db.scalars(
            select(Department).order_by(Department.name)
        ).all()

        return [
            {
                "id": department.id,
                "name": department.name,
                "description": department.description,
                "is_active": department.is_active,
            }
            for department in departments
        ]


@app.get("/api/alerts")
def get_alerts():
    with SessionLocal() as db:
        alerts = db.scalars(
            select(Alert).order_by(Alert.id.desc())
        ).all()

        return [
            {
                "id": alert.id,
                "title": alert.title,
                "message": alert.message,
                "severity": alert.severity,
                "department_id": alert.department_id,
                "is_acknowledged": alert.is_acknowledged,
                "created_at": (
                    alert.created_at.isoformat()
                    if alert.created_at
                    else None
                ),
            }
            for alert in alerts
        ]


@app.get("/api/analytics/overview")
def analytics_overview():
    with engine.connect() as conn:
        total_admissions = conn.execute(
            text("SELECT COUNT(*) FROM hospital_admissions")
        ).scalar_one()

        total_stays = conn.execute(
            text("SELECT COUNT(*) FROM patient_stays")
        ).scalar_one()

        avg_admission_los = conn.execute(
            text("""
                SELECT AVG(CAST(length_of_stay AS FLOAT))
                FROM hospital_admissions
            """)
        ).scalar()

        avg_patient_stay = conn.execute(
            text("""
                SELECT AVG(CAST(length_of_stay AS FLOAT))
                FROM patient_stays
            """)
        ).scalar()

        admissions_by_type = conn.execute(
            text("""
                SELECT admission_type, COUNT(*) AS count
                FROM hospital_admissions
                GROUP BY admission_type
                ORDER BY count DESC
            """)
        ).mappings().all()

        admissions_by_condition = conn.execute(
            text("""
                SELECT medical_condition, COUNT(*) AS count
                FROM hospital_admissions
                GROUP BY medical_condition
                ORDER BY count DESC
                LIMIT 8
            """)
        ).mappings().all()

        stays_by_service = conn.execute(
            text("""
                SELECT service, COUNT(*) AS count
                FROM patient_stays
                GROUP BY service
                ORDER BY count DESC
            """)
        ).mappings().all()

        admissions_by_month = conn.execute(
            text("""
                SELECT substr(date_of_admission, 1, 7) AS month,
                       COUNT(*) AS count
                FROM hospital_admissions
                GROUP BY month
                ORDER BY month
            """)
        ).mappings().all()

        arrivals_by_month = conn.execute(
            text("""
                SELECT substr(arrival_date, 1, 7) AS month,
                       COUNT(*) AS count
                FROM patient_stays
                GROUP BY month
                ORDER BY month
            """)
        ).mappings().all()

    return {
        "data_source": "historical_csv_datasets",
        "total_admissions": total_admissions,
        "total_patient_stays": total_stays,
        "average_admission_length_of_stay": round(
            float(avg_admission_los or 0), 2
        ),
        "average_patient_stay_length": round(
            float(avg_patient_stay or 0), 2
        ),
        "admissions_by_type": [dict(row) for row in admissions_by_type],
        "admissions_by_condition": [
            dict(row) for row in admissions_by_condition
        ],
        "stays_by_service": [dict(row) for row in stays_by_service],
        "admissions_by_month": [
            dict(row) for row in admissions_by_month
        ],
        "arrivals_by_month": [dict(row) for row in arrivals_by_month],
        "note": (
            "Historical statistics only. These values do not represent "
            "live hospital occupancy, queues, or staff availability."
        ),
    }


@app.get("/api/forecasting/bottlenecks")
def get_forecasting_bottlenecks(
    arrivals: float = Query(0.0, description="Demand increase percentage (0-50)"),
    staff_shortage: int = Query(0, description="Additional staff unavailable (0-4)"),
    season: str = Query("Normal", description="Normal, Monsoon, Respiratory season, Outbreak"),
    scanner_available: bool = Query(True, description="Whether primary CT scanner is operational"),
):
    return forecast_department_bottlenecks(
        arrivals_modifier_pct=arrivals,
        staff_shortage=staff_shortage,
        season=season,
        scanner_available=scanner_available,
    )


@app.get("/api/forecasting/backtest")
def get_forecasting_backtest():
    return calculate_backtest_validation()