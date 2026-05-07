from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from app.core.dependencies import get_current_user, get_db
from app.models.offer import DatasetOffer
from app.models.request import DatasetRequest
from app.models.deal import Deal

router = APIRouter()


class OfferCreate(BaseModel):
    request_id: int
    price: float
    message: str


@router.post("/offer")
def create_offer(
    data: OfferCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "seller":
        raise HTTPException(
            status_code=403,
            detail="Only sellers can submit offers"
        )

    req = db.query(DatasetRequest).filter(DatasetRequest.id == data.request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    offer = DatasetOffer(
        request_id=data.request_id,
        seller_username=user.username,
        price=data.price,
        message=data.message
    )

    db.add(offer)
    db.commit()

    return {"message": "Offer submitted successfully"}

@router.get("/offers/{request_id}")
def list_offers_for_request(
    request_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only buyers can view offers
    if user.role != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can view offers"
        )

    offers = (
        db.query(DatasetOffer)
        .filter(DatasetOffer.request_id == request_id)
        .all()
    )

    return [
    {
        "offer_id": o.id,              # ✅ REQUIRED
        "request_id": o.request_id,    # ✅ GOOD PRACTICE
        "seller": o.seller_username,
        "price": o.price,
        "message": o.message,
        "created_at": o.created_at
    }
    for o in offers
]


@router.get("/seller_stats")
def get_seller_stats(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "seller":
        raise HTTPException(status_code=403, detail="Only sellers can view their stats")

    # Aggregate revenue: sum of prices from deals where payment is released
    revenue_result = (
        db.query(func.sum(Deal.price))
        .filter(
            Deal.seller_username == user.username,
            Deal.payment_status == "released"
        )
        .scalar()
    )
    aggregate_revenue = revenue_result or 0

    # Active proposals: offers this seller has submitted
    total_offers = (
        db.query(func.count(DatasetOffer.id))
        .filter(DatasetOffer.seller_username == user.username)
        .scalar()
    ) or 0

    # Accepted proposals: offers that became deals
    accepted_offers = (
        db.query(func.count(Deal.id))
        .filter(Deal.seller_username == user.username)
        .scalar()
    ) or 0

    # Acceptance rate
    if total_offers > 0:
        acceptance_rate = round((accepted_offers / total_offers) * 100, 1)
    else:
        acceptance_rate = 0

    # Completed deliveries: deals where delivery is confirmed
    completed_deliveries = (
        db.query(func.count(Deal.id))
        .filter(
            Deal.seller_username == user.username,
            Deal.delivery_status == "confirmed"
        )
        .scalar()
    ) or 0

    return {
        "aggregate_revenue": aggregate_revenue,
        "active_proposals": total_offers,
        "acceptance_rate": acceptance_rate,
        "completed_deliveries": completed_deliveries
    }
