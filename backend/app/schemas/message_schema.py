from pydantic import BaseModel
from datetime import datetime


class MessageCreate(BaseModel):
    message: str


class MessageResponse(BaseModel):
    id: int
    ticket_id: int
    sender_id: int
    sender_role: str
    sender_name: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True