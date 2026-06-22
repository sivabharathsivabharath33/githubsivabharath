from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TicketCreate(BaseModel):
    subject: str
    description: str


class TicketResponse(BaseModel):
    id: int
    user_id: int
    assigned_agent_id: Optional[int] = None

    subject: str
    description: str

    request_type: Optional[str] = None
    priority: Optional[str] = None
    sentiment: Optional[str] = None
    summary: Optional[str] = None

    status: str

    created_at: datetime
    updated_at: datetime
    closed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TicketStatusUpdate(BaseModel):
    status: str