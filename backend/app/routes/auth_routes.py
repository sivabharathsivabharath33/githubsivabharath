from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.user_schema import UserCreate, UserResponse
from app.schemas.auth_schema import LoginRequest, TokenResponse, CurrentUserResponse
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from app.services.auth_service import (
    register_customer,
    authenticate_customer,
    authenticate_agent,
    authenticate_admin
)

from app.dependencies import (
    get_current_customer,
    get_current_agent,
    get_current_admin
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/customer/register", response_model=UserResponse)
def customer_register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    return register_customer(user_data, db)


@router.post("/customer/login", response_model=TokenResponse)
def customer_login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    return authenticate_customer(
        login_data.email,
        login_data.password,
        db
    )


@router.post("/agent/login", response_model=TokenResponse)
def agent_login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    return authenticate_agent(
        login_data.email,
        login_data.password,
        db
    )


@router.post("/admin/login", response_model=TokenResponse)
def admin_login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    return authenticate_admin(
        login_data.email,
        login_data.password,
        db
    )


@router.get("/customer/me", response_model=CurrentUserResponse)
def customer_me(current_customer=Depends(get_current_customer)):
    return current_customer


@router.get("/agent/me", response_model=CurrentUserResponse)
def agent_me(current_agent=Depends(get_current_agent)):
    return current_agent


@router.get("/admin/me", response_model=CurrentUserResponse)
def admin_me(current_admin=Depends(get_current_admin)):
    return current_admin


@router.post("/swagger-login")
def swagger_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    email = form_data.username
    password = form_data.password

    try:
        return authenticate_customer(email, password, db)
    except HTTPException:
        pass

    try:
        return authenticate_agent(email, password, db)
    except HTTPException:
        pass

    try:
        return authenticate_admin(email, password, db)
    except HTTPException:
        pass

    raise HTTPException(
        status_code=401,
        detail="Invalid email or password"
    )