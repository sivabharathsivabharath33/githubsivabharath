from pydantic import BaseModel, EmailStr
from datetime import datetime


class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class AdminResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True