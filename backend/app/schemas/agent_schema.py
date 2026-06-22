from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class AgentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    request_type: str


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    request_type: Optional[str] = None
    status: Optional[str] = None


class AgentResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    request_type: str
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True