from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    request_type = Column(String(50), nullable=False)
    # Example: IT, HR, Facilities

    status = Column(String(20), default="active")
    role = Column(String(20), default="agent")

    created_at = Column(DateTime, default=datetime.utcnow)

    assigned_tickets = relationship("Ticket", back_populates="assigned_agent")