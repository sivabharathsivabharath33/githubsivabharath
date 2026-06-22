from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database import Base


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    role = Column(String(20), default="admin")
    status = Column(String(20), default="active")

    created_at = Column(DateTime, default=datetime.utcnow)