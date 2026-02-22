from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.core.database import Base

class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, index=True)
    offer_id = Column(Integer, index=True)
    buyer_username = Column(String, index=True)
    seller_username = Column(String, index=True)
    price = Column(Float)
    commission = Column(Float)

    payment_status = Column(String, default="pending")  
    # pending → escrowed → released

    created_at = Column(DateTime, default=datetime.utcnow)

    delivery_status = Column(String, default="pending")
    # pending → delivered → confirmed

    dispute_status = Column(String, default="none")
    # none → opened → resolved

    quality_score = Column(Float, nullable=True)
    validation_status = Column(String, default="pending") 
    # pending → pass → fail


