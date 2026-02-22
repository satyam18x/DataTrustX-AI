from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.offer import DatasetOffer
from app.models.request import DatasetRequest
from app.models.deal import Deal
from app.core.commission import PLATFORM_COMMISSION_PERCENT

router = APIRouter()


@router.post("/accept/{offer_id}")
def accept_offer(
    offer_id: int,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can accept offers"
        )

    offer = db.query(DatasetOffer).filter(DatasetOffer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    request = db.query(DatasetRequest).filter(DatasetRequest.id == offer.request_id).first()
    if not request or request.buyer_username != user.username:
        raise HTTPException(status_code=403, detail="Not authorized for this request")

    # Prevent double acceptance
    existing = db.query(Deal).filter(Deal.request_id == request.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Deal already exists for this request")

    commission = (PLATFORM_COMMISSION_PERCENT / 100) * offer.price

    deal = Deal(
        request_id=request.id,
        offer_id=offer.id,
        buyer_username=user.username,
        seller_username=offer.seller_username,
        price=offer.price,
        commission=commission
    )

    db.add(deal)
    db.commit()

    return {
        "message": "Offer accepted successfully",
        "deal_id": deal.id,
        "price": offer.price,
        "commission": commission
    }


@router.get("/my_deals")
def get_my_deals(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch deals where user is buyer OR seller
    deals = db.query(Deal).filter(
        (Deal.buyer_username == user.username) | 
        (Deal.seller_username == user.username)
    ).all()

    return deals
