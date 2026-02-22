from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from app.core.database import Base

class Escrow(Base):
    __tablename__ = "escrow"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, index=True)
    transaction_id = Column(String, unique=True, index=True) # Added for tracking
    amount = Column(Float)
    commission = Column(Float)
    seller_payout = Column(Float)
    status = Column(String, default="held")  # held → released
    created_at = Column(DateTime, default=datetime.utcnow)
