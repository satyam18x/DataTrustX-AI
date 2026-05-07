from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.user import User
from app.core.password import hash_password, verify_password
from app.core.security import create_access_token

router = APIRouter()


class SignupRequest(BaseModel):
    username: str
    password: str
    role: str  # buyer or seller



class LoginRequest(BaseModel):
    username: str
    password: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    print(f"DEBUG SIGNUP: Received {data}")
    existing_user = db.query(User).filter(User.username == data.username).first()
    if existing_user:
        print(f"DEBUG SIGNUP: User {data.username} already exists")
        raise HTTPException(status_code=400, detail="User already exists")

    if data.role not in ["buyer", "seller"]:
        print(f"DEBUG SIGNUP: Invalid role {data.role}")
        raise HTTPException(status_code=400, detail="Role must be buyer or seller")


    user = User(
    username=data.username,
    password=hash_password(data.password),
    role=data.role
)

    db.add(user)
    db.commit()
    print(f"DEBUG SIGNUP: User {data.username} created successfully")

    return {"message": "User registered successfully"}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    print(f"DEBUG LOGIN: Attempting login for {data.username}")
    user = db.query(User).filter(User.username == data.username).first()
    if not user:
        print(f"DEBUG LOGIN: User {data.username} not found")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(data.password, user.password):
        print(f"DEBUG LOGIN: Password mismatch for {data.username}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user.username)

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "role": user.role
    }
