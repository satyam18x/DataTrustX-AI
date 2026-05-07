from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.deal import Deal
from app.models.escrow import Escrow
from app.models.dispute import Dispute
from app.models.validation import ValidationResult

router = APIRouter()


@router.get("/disputes")
def get_all_disputes(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    disputes = db.query(Dispute).all()
    
    result = []
    for dispute in disputes:
        deal = db.query(Deal).filter(Deal.id == dispute.deal_id).first()
        result.append({
            "dispute_id": dispute.id,
            "deal_id": dispute.deal_id,
            "opened_by": dispute.opened_by,
            "reason": dispute.reason,
            "resolution": dispute.resolution,
            "resolved_by": dispute.resolved_by,
            "created_at": dispute.created_at,
            "deal_status": deal.dispute_status if deal else None,
            "buyer": deal.buyer_username if deal else None,
            "seller": deal.seller_username if deal else None,
            "price": deal.price if deal else None
        })
    
    return result


@router.post("/resolve/{dispute_id}/{action}")
def resolve_dispute(
    dispute_id: int,
    action: str,  # release | refund
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    dispute = db.query(Dispute).filter(Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")

    deal = db.query(Deal).filter(Deal.id == dispute.deal_id).first()
    escrow = db.query(Escrow).filter(Escrow.deal_id == deal.id).first()

    if action == "release":
        escrow.status = "released"
        deal.payment_status = "released"
        dispute.resolution = "Released to seller"

    elif action == "refund":
        escrow.status = "refunded"
        deal.payment_status = "refunded"
        dispute.resolution = "Refunded to buyer"

    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    deal.dispute_status = "resolved"
    dispute.resolved_by = user.username

    db.commit()

    return {"message": "Dispute resolved", "action": dispute.resolution}


@router.get("/validations")
def get_all_validations(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    validations = db.query(ValidationResult).order_by(ValidationResult.created_at.desc()).all()
    
    return [
        {
            "id": v.id,
            "username": v.username,
            "final_score": v.final_score,
            "status": v.status,
            "created_at": v.created_at
        }
        for v in validations
    ]
