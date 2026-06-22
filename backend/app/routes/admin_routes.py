from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.dependencies import get_current_admin

from app.schemas.user_schema import UserResponse
from app.schemas.agent_schema import AgentCreate, AgentUpdate, AgentResponse
from app.schemas.faq_schema import FAQCreate, FAQUpdate, FAQResponse
from app.schemas.kb_schema import KnowledgeBaseDocumentResponse
from app.schemas.ticket_schema import TicketResponse
from app.schemas.admin_dashboard_schema import AdminDashboardStats

from app.models.ticket_model import Ticket

from app.services.admin_service import (
    get_all_users,
    update_user_status,
    get_all_agents,
    create_agent,
    update_agent,
    delete_agent,
    get_all_faqs_admin,
    create_faq,
    update_faq,
    delete_faq,
    get_admin_dashboard_stats
)

from app.services.kb_service import (
    save_kb_document,
    get_kb_documents,
    delete_kb_document
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ---------------- DASHBOARD ----------------

@router.get("/dashboard", response_model=AdminDashboardStats)
def admin_dashboard(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return get_admin_dashboard_stats(db)


# ---------------- USER MANAGEMENT ----------------

@router.get("/users", response_model=List[UserResponse])
def admin_get_users(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return get_all_users(db)


@router.patch("/users/{user_id}/status", response_model=UserResponse)
def admin_update_user_status(
    user_id: int,
    status_value: str,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return update_user_status(user_id, status_value, db)


# ---------------- AGENT MANAGEMENT ----------------

@router.get("/agents", response_model=List[AgentResponse])
def admin_get_agents(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return get_all_agents(db)


@router.post("/agents", response_model=AgentResponse)
def admin_create_agent(
    agent_data: AgentCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return create_agent(agent_data, db)


@router.patch("/agents/{agent_id}", response_model=AgentResponse)
def admin_update_agent(
    agent_id: int,
    agent_data: AgentUpdate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return update_agent(agent_id, agent_data, db)


@router.delete("/agents/{agent_id}")
def admin_delete_agent(
    agent_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return delete_agent(agent_id, db)


# ---------------- FAQ MANAGEMENT ----------------

@router.get("/faqs", response_model=List[FAQResponse])
def admin_get_faqs(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return get_all_faqs_admin(db)


@router.post("/faqs", response_model=FAQResponse)
def admin_create_faq(
    faq_data: FAQCreate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return create_faq(faq_data, db)


@router.patch("/faqs/{faq_id}", response_model=FAQResponse)
def admin_update_faq(
    faq_id: int,
    faq_data: FAQUpdate,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return update_faq(faq_id, faq_data, db)


@router.delete("/faqs/{faq_id}")
def admin_delete_faq(
    faq_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return delete_faq(faq_id, db)


# ---------------- KNOWLEDGE BASE MANAGEMENT ----------------

@router.post("/kb/upload", response_model=KnowledgeBaseDocumentResponse)
def admin_upload_kb_document(
    title: str = Form(...),
    category: str = Form("General"),
    file: UploadFile = File(...),
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return save_kb_document(title, category, file, current_admin, db)


@router.get("/kb/documents", response_model=List[KnowledgeBaseDocumentResponse])
def admin_get_kb_documents(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return get_kb_documents(db)


@router.delete("/kb/documents/{document_id}")
def admin_delete_kb_document(
    document_id: int,
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return delete_kb_document(document_id, db)


# ---------------- TICKET MONITORING ----------------

@router.get("/tickets", response_model=List[TicketResponse])
def admin_get_all_tickets(
    current_admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Ticket).order_by(Ticket.created_at.desc()).all()