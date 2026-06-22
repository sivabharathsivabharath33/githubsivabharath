from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user_model import User
from app.models.agent_model import Agent
from app.models.admin_model import Admin

from app.schemas.user_schema import UserCreate
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import create_access_token


def register_customer(user_data: UserCreate, db: Session):
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    if user_data.employee_id:
        existing_employee = (
            db.query(User)
            .filter(User.employee_id == user_data.employee_id)
            .first()
        )

        if existing_employee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee ID already registered"
            )

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        employee_id=user_data.employee_id,
        department=user_data.department,
        phone=user_data.phone,
        role="customer",
        status="active"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_customer(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "name": user.name,
        "email": user.email
    }


def authenticate_agent(email: str, password: str, db: Session):
    agent = db.query(Agent).filter(Agent.email == email).first()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(password, agent.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if agent.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent account is inactive"
        )

    token = create_access_token(
        data={
            "sub": str(agent.id),
            "email": agent.email,
            "role": agent.role,
            "request_type": agent.request_type
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": agent.role,
        "name": agent.name,
        "email": agent.email
    }


def authenticate_admin(email: str, password: str, db: Session):
    admin = db.query(Admin).filter(Admin.email == email).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if admin.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive"
        )

    token = create_access_token(
        data={
            "sub": str(admin.id),
            "email": admin.email,
            "role": admin.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": admin.role,
        "name": admin.name,
        "email": admin.email
    }