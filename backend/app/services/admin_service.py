from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.user_model import User
from app.models.agent_model import Agent
from app.models.ticket_model import Ticket
from app.models.faq_model import FAQ
from app.models.kb_model import KnowledgeBaseDocument

from app.schemas.agent_schema import AgentCreate, AgentUpdate
from app.schemas.faq_schema import FAQCreate, FAQUpdate
from app.utils.security import hash_password


VALID_REQUEST_TYPES = ["IT", "HR", "Facilities"]


# ---------------- USER MANAGEMENT ----------------

def get_all_users(db: Session):
    return db.query(User).order_by(User.created_at.desc()).all()


def update_user_status(user_id: int, status_value: str, db: Session):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if status_value not in ["active", "inactive"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be active or inactive"
        )

    user.status = status_value
    db.commit()
    db.refresh(user)

    return user


# ---------------- AGENT MANAGEMENT ----------------

def get_all_agents(db: Session):
    return db.query(Agent).order_by(Agent.created_at.desc()).all()


def create_agent(agent_data: AgentCreate, db: Session):
    if agent_data.request_type not in VALID_REQUEST_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="request_type must be IT, HR, or Facilities"
        )

    existing_agent = db.query(Agent).filter(
        Agent.email == agent_data.email
    ).first()

    if existing_agent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent email already exists"
        )

    new_agent = Agent(
        name=agent_data.name,
        email=agent_data.email,
        password_hash=hash_password(agent_data.password),
        request_type=agent_data.request_type,
        role="agent",
        status="active"
    )

    db.add(new_agent)
    db.commit()
    db.refresh(new_agent)

    return new_agent


def update_agent(agent_id: int, agent_data: AgentUpdate, db: Session):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )

    if agent_data.request_type is not None:
        if agent_data.request_type not in VALID_REQUEST_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="request_type must be IT, HR, or Facilities"
            )
        agent.request_type = agent_data.request_type

    if agent_data.name is not None:
        agent.name = agent_data.name

    if agent_data.email is not None:
        email_exists = db.query(Agent).filter(
            Agent.email == agent_data.email,
            Agent.id != agent_id
        ).first()

        if email_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already used by another agent"
            )

        agent.email = agent_data.email

    if agent_data.password is not None:
        agent.password_hash = hash_password(agent_data.password)

    if agent_data.status is not None:
        if agent_data.status not in ["active", "inactive"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be active or inactive"
            )
        agent.status = agent_data.status

    db.commit()
    db.refresh(agent)

    return agent


def delete_agent(agent_id: int, db: Session):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()

    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )

    db.delete(agent)
    db.commit()

    return {"message": "Agent deleted successfully"}


# ---------------- FAQ MANAGEMENT ----------------

def get_all_faqs_admin(db: Session):
    return db.query(FAQ).order_by(FAQ.created_at.desc()).all()


def create_faq(faq_data: FAQCreate, db: Session):
    new_faq = FAQ(
        question=faq_data.question,
        answer=faq_data.answer,
        category=faq_data.category,
        status="active"
    )

    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)

    return new_faq


def update_faq(faq_id: int, faq_data: FAQUpdate, db: Session):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()

    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found"
        )

    if faq_data.question is not None:
        faq.question = faq_data.question

    if faq_data.answer is not None:
        faq.answer = faq_data.answer

    if faq_data.category is not None:
        faq.category = faq_data.category

    if faq_data.status is not None:
        if faq_data.status not in ["active", "inactive", "draft"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be active, inactive, or draft"
            )
        faq.status = faq_data.status

    db.commit()
    db.refresh(faq)

    return faq


def delete_faq(faq_id: int, db: Session):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()

    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FAQ not found"
        )

    db.delete(faq)
    db.commit()

    return {"message": "FAQ deleted successfully"}


# ---------------- DASHBOARD STATS ----------------

def get_admin_dashboard_stats(db: Session):
    total_users = db.query(User).count()
    total_agents = db.query(Agent).count()
    total_tickets = db.query(Ticket).count()
    total_faqs = db.query(FAQ).count()
    total_kb_documents = db.query(KnowledgeBaseDocument).count()

    open_tickets = db.query(Ticket).filter(Ticket.status == "Open").count()
    in_progress_tickets = db.query(Ticket).filter(Ticket.status == "In Progress").count()
    resolved_tickets = db.query(Ticket).filter(Ticket.status == "Resolved").count()
    closed_tickets = db.query(Ticket).filter(Ticket.status == "Closed").count()
    high_priority_tickets = db.query(Ticket).filter(Ticket.priority == "High").count()

    return {
        "total_users": total_users,
        "total_agents": total_agents,
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "in_progress_tickets": in_progress_tickets,
        "resolved_tickets": resolved_tickets,
        "closed_tickets": closed_tickets,
        "total_faqs": total_faqs,
        "total_kb_documents": total_kb_documents,
        "high_priority_tickets": high_priority_tickets
    }