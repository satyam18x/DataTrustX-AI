from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base

class DatasetOffer(Base):
    __tablename__ = "dataset_offers"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, index=True)
    seller_username = Column(String, index=True)
    price = Column(Float)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
