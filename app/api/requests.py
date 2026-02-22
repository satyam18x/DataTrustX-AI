from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.dependencies import get_current_user, get_db
from app.models.request import DatasetRequest

router = APIRouter()


class RequestCreate(BaseModel):
    title: str
    description: str
    domain: str


@router.post("/request")
def create_request(
    data: RequestCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can create dataset requests"
        )

    req = DatasetRequest(
        buyer_username=user.username,
        title=data.title,
        description=data.description,
        domain=data.domain
    )

    db.add(req)
    db.commit()

    return {
    "message": "Dataset request posted successfully",
    "request_id": req.id
}


@router.get("/my_requests")
def get_my_requests(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can view their requests"
        )

    requests = (
        db.query(DatasetRequest)
        .filter(DatasetRequest.buyer_username == user.username)
        .order_by(DatasetRequest.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "domain": r.domain,
            "created_at": r.created_at
        }
        for r in requests
    ]

