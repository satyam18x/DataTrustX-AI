from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.deal import Deal
from app.models.escrow import Escrow

router = APIRouter()


@router.post("/confirm/{deal_id}")
def confirm_delivery(
    deal_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    if deal.buyer_username != user.username:
        raise HTTPException(status_code=403, detail="Only buyer can confirm delivery")

    if deal.delivery_status != "delivered":
        raise HTTPException(status_code=400, detail="Dataset not marked delivered yet")

    escrow = db.query(Escrow).filter(Escrow.deal_id == deal.id).first()
    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow record not found")

    escrow.status = "released"
    deal.delivery_status = "confirmed"
    deal.payment_status = "released"

    db.commit()

    return {
        "message": "Delivery confirmed, escrow released",
        "seller_payout": escrow.seller_payout,
        "platform_commission": escrow.commission
    }
