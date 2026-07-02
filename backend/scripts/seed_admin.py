"""
Run this script ONCE from the backend/ directory to create the admin user:

    python scripts/seed_admin.py

You can re-run it safely — it skips creation if the user already exists.
"""

import sys
import os

# Make sure imports resolve from backend/
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.core.password import hash_password

# Ensure all tables exist
Base.metadata.create_all(bind=engine)

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"   # ← change this before production!

def seed():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == ADMIN_USERNAME).first()
        if existing:
            print(f"[seed_admin] User '{ADMIN_USERNAME}' already exists — skipping.")
            return

        admin = User(
            username=ADMIN_USERNAME,
            password=hash_password(ADMIN_PASSWORD),
            role="admin"
        )
        db.add(admin)
        db.commit()
        print(f"[seed_admin] Admin user created successfully.")
        print(f"             username : {ADMIN_USERNAME}")
        print(f"             password : {ADMIN_PASSWORD}")
        print(f"             role     : admin")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
