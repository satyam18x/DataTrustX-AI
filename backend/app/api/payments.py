from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from app.core.dependencies import get_current_user, get_db
from app.models.deal import Deal
from app.models.escrow import Escrow

router = APIRouter()


@router.post("/pay/{deal_id}")
def pay_to_escrow(
    deal_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch deal
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    # Only buyer can pay
    if deal.buyer_username != user.username:
        raise HTTPException(status_code=403, detail="Not authorized to pay for this deal")

    # Prevent double payment
    if deal.payment_status != "pending":
        raise HTTPException(
            status_code=400,
            detail=f"Payment already processed (status: {deal.payment_status})"
        )

    # ---- MOCK PAYMENT SUCCESS ----
    payment_id = str(uuid.uuid4())

    try:
        # Create escrow record
        escrow = Escrow(
            deal_id=deal.id,
            transaction_id=payment_id, # Store the UUID
            amount=deal.price,
            commission=deal.commission,
            seller_payout=deal.price - deal.commission,
            status="held"
        )

        deal.payment_status = "escrowed"

        db.add(escrow)
        db.commit()
    except Exception as e:
        print(f"PAYMENT ERROR: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Payment processing failed: {str(e)}")

    return {
        "message": "Mock payment successful. Funds held in escrow.",
        "payment_id": payment_id,
        "deal_id": deal.id,
        "amount": deal.price,
        "commission": deal.commission,
        "seller_payout": deal.price - deal.commission,
        "status": "escrowed"
    }
