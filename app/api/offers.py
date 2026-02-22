from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.dependencies import get_current_user, get_db
from app.models.offer import DatasetOffer
from app.models.request import DatasetRequest

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

