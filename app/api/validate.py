from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.services.validation_service import validate_csv_bytes
from app.core.dependencies import get_current_user
from app.core.database import SessionLocal
from app.models.validation import ValidationResult

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/validate")
async def validate_data(
    file: UploadFile = File(...),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "seller":
        raise HTTPException(
            status_code=403,
            detail="Only sellers can validate datasets"
        )

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    file_bytes = await file.read()
    result = validate_csv_bytes(file_bytes)

    if result["status"] != "PASS":
        raise HTTPException(
            status_code=400,
            detail="Dataset rejected due to insufficient trust score"
        )

    import json
    record = ValidationResult(
        username=user.username,
        final_score=result["final_trust_score"],
        status=result["status"],
        report_json=json.dumps(result)
    )
    db.add(record)
    db.commit()

    return result

