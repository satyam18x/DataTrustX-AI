from sqlalchemy import Column, DateTime, Integer, String, Float
from app.core.database import Base
from datetime import datetime

class ValidationResult(Base):
    __tablename__ = "validations"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    deal_id = Column(Integer, nullable=True, index=True)
    final_score = Column(Float)
    status = Column(String)
    report_json = Column(String, nullable=True) # Full JSON report
    created_at = Column(DateTime, default=datetime.utcnow)
