from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from pathlib import Path

# Resolve the database path relative to this file:
# app/core/database.py  →  go up 2 levels  →  backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # backend/
DB_DIR = BASE_DIR  # db lives directly in backend/
DB_DIR.mkdir(parents=True, exist_ok=True)  # create dir if missing

DATABASE_URL = f"sqlite:///{DB_DIR / 'datatrustx.db'}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
