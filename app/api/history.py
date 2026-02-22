from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.dependencies import get_current_user
from app.models.validation import ValidationResult

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_validation_history(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    records = (
        db.query(ValidationResult)
        .filter(ValidationResult.username == user.username)
        .order_by(ValidationResult.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "final_score": r.final_score,
            "status": r.status,
            "created_at": r.created_at
        }
        for r in records
    ]

@router.get("/report/id/{report_id}")
def get_report_by_id(
    report_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    import json
    record = db.query(ValidationResult).filter(ValidationResult.id == report_id).first()
    if not record:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Simple check for authorization (ideally add admin check too)
    if record.username != user.username and user.role != "admin":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Not authorized to view this report")

    return {
        "id": record.id,
        "username": record.username,
        "deal_id": record.deal_id,
        "final_score": record.final_score,
        "status": record.status,
        "report": json.loads(record.report_json) if record.report_json else {},
        "created_at": record.created_at
    }

@router.get("/report/deal/{deal_id}")
def get_report_by_deal(
    deal_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    import json
    record = db.query(ValidationResult).filter(ValidationResult.deal_id == deal_id).first()
    if not record:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Report not found for this deal")

    # Authorization check
    from app.models.deal import Deal
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Deal not found")

    if deal.buyer_username != user.username and deal.seller_username != user.username and user.role != "admin":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Not authorized to view this report")

    return {
        "id": record.id,
        "username": record.username,
        "deal_id": record.deal_id,
        "final_score": record.final_score,
        "status": record.status,
        "report": json.loads(record.report_json) if record.report_json else {},
        "created_at": record.created_at
    }
