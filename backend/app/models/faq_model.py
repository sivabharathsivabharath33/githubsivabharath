from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database import Base


class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)

    question = Column(String(300), nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    # IT / HR / Facilities / General

    status = Column(String(20), default="active")
    # active / inactive / draft

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)