from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str
    email: EmailStr


class CurrentUserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    status: str