from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.request import DatasetRequest

router = APIRouter()


@router.get("/requests")
def list_requests(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "seller":
        raise HTTPException(
            status_code=403,
            detail="Only sellers can view buyer requests"
        )

    requests = (
        db.query(DatasetRequest)
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
