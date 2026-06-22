from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    employee_id = Column(String(50), unique=True, index=True, nullable=True)
    department = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)

    role = Column(String(20), default="customer")
    status = Column(String(20), default="active")

    created_at = Column(DateTime, default=datetime.utcnow)

    tickets = relationship("Ticket", back_populates="customer")