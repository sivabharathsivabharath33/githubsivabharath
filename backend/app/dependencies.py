from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.utils.jwt_handler import verify_access_token

from app.models.user_model import User
from app.models.agent_model import Agent
from app.models.admin_model import Admin


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/swagger-login")


def get_current_user_payload(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    return payload


def get_current_customer(
    payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db)
):
    if payload.get("role") != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access only"
        )

    user = db.query(User).filter(User.id == int(payload.get("sub"))).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    return user


def get_current_agent(
    payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db)
):
    if payload.get("role") != "agent":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent access only"
        )

    agent = db.query(Agent).filter(Agent.id == int(payload.get("sub"))).first()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )

    return agent


def get_current_admin(
    payload: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db)
):
    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access only"
        )

    admin = db.query(Admin).filter(Admin.id == int(payload.get("sub"))).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )

    return admin