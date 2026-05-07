from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.dependencies import get_current_user, get_db
from app.models.deal import Deal
from app.models.dispute import Dispute

router = APIRouter()


class DisputeCreate(BaseModel):
    reason: str


@router.post("/dispute/{deal_id}")
def open_dispute(
    deal_id: int,
    data: DisputeCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    if user.username not in [deal.buyer_username, deal.seller_username]:
        raise HTTPException(status_code=403, detail="Not authorized")

    deal.dispute_status = "opened"

    dispute = Dispute(
        deal_id=deal.id,
        opened_by=user.role,
        reason=data.reason
    )

    db.add(dispute)
    db.commit()

    return {
    "message": "Dispute opened successfully",
    "dispute_id": dispute.id,     # ✅ REQUIRED
    "deal_id": deal.id,
    "status": "opened"
}

