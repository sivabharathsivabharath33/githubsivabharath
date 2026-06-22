from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    employee_id: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    employee_id: Optional[str]
    department: Optional[str]
    phone: Optional[str]
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True