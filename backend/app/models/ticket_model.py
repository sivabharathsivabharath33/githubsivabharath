from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True)

    subject = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)

    request_type = Column(String(50), nullable=True)
    # IT / HR / Facilities

    priority = Column(String(20), nullable=True)
    # High / Medium / Low

    sentiment = Column(String(30), nullable=True)
    # Positive / Neutral / Negative / Urgent

    summary = Column(Text, nullable=True)

    status = Column(String(30), default="Open")
    # Open / In Progress / Resolved / Closed

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)

    customer = relationship("User", back_populates="tickets")
    assigned_agent = relationship("Agent", back_populates="assigned_tickets")
    messages = relationship(
        "TicketMessage",
        back_populates="ticket",
        cascade="all, delete-orphan"
    )