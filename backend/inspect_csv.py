
from pathlib import Path
import pandas as pd

DATA_DIR = Path(__file__).resolve().parent / "data" / "raw"

files = [
    "hospital_admissions_clean.csv",
    "patient_stays_clean.csv",
]

for filename in files:
    file_path = DATA_DIR / filename

    print("\n" + "=" * 50)
    print(f"FILE: {filename}")
    print("=" * 50)

    try:
        df = pd.read_csv(file_path)

        print("Rows:", len(df))
        print("Columns:", len(df.columns))
        print("\nColumn names:")
        for column in df.columns:
            print("-", column)

        print("\nFirst 3 rows:")
        print(df.head(3).to_string(index=False))

        print("\nMissing values per column:")
        print(df.isnull().sum().to_string())

    except Exception as error:
        print("Could not read file:", error)