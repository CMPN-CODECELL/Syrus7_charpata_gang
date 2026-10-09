
from pathlib import Path

import pandas as pd
from sqlalchemy import Column, Float, Integer, MetaData, String, Table, inspect, func, select

from backend.database import engine

DATA_DIR = Path(__file__).resolve().parent / "data" / "raw"

DATASETS = {
    "hospital_admissions_clean.csv": "hospital_admissions",
    "patient_stays_clean.csv": "patient_stays",
}

metadata = MetaData()

hospital_admissions = Table(
    "hospital_admissions",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("age", Integer),
    Column("gender", String(30)),
    Column("blood_type", String(10)),
    Column("medical_condition", String(100)),
    Column("date_of_admission", String(30)),
    Column("hospital", String(200)),
    Column("billing_amount", Float),
    Column("admission_type", String(50)),
    Column("discharge_date", String(30)),
    Column("length_of_stay", Integer),
)

patient_stays = Table(
    "patient_stays",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("patient_id", String(50)),
    Column("age", Integer),
    Column("arrival_date", String(30)),
    Column("departure_date", String(30)),
    Column("service", String(100)),
    Column("satisfaction", Integer),
    Column("length_of_stay", Integer),
)

TABLES = {
    "hospital_admissions": hospital_admissions,
    "patient_stays": patient_stays,
}


def import_dataset(filename, table_name):
    path = DATA_DIR / filename

    if not path.exists():
        raise FileNotFoundError(f"CSV file not found: {path}")

    df = pd.read_csv(path)

    expected_columns = [column.name for column in TABLES[table_name].columns
                        if column.name != "id"]

    if set(df.columns) != set(expected_columns):
        raise ValueError(
            f"Unexpected columns in {filename}.\n"
            f"Expected: {expected_columns}\n"
            f"Found: {list(df.columns)}"
        )

    if df.isnull().any().any():
        raise ValueError(f"{filename} contains missing values.")

    if df.empty:
        raise ValueError(f"{filename} contains no data.")

    # Convert NumPy scalar values to regular Python values for SQLite.
    records = df[expected_columns].to_dict(orient="records")
    clean_records = [
        {
            key: (None if pd.isna(value) else value.item()
                  if hasattr(value, "item") else value)
            for key, value in record.items()
        }
        for record in records
    ]

    # Avoid accidental duplicate imports.
    with engine.begin() as connection:
        existing_count = connection.execute(
            select(func.count()).select_from(TABLES[table_name])
        ).scalar_one()

        if existing_count > 0:
            print(
                f"Skipped {filename}: {table_name} already contains "
                f"{existing_count} rows."
            )
            return

        connection.execute(TABLES[table_name].insert(), clean_records)

    print(f"Imported {len(clean_records)} rows into {table_name}.")



def main():
    metadata.create_all(engine)

    for filename, table_name in DATASETS.items():
        import_dataset(filename, table_name)

    inspector = inspect(engine)
    print("\nImport verification:")

    with engine.connect() as connection:
        for table_name in DATASETS.values():
            count = connection.execute(
                select(func.count()).select_from(TABLES[table_name])
            ).scalar_one()
            print(f"{table_name}: {count} rows")

    print("CSV import process complete.")


if __name__ == "__main__":
    main()