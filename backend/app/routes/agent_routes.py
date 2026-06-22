from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.dependencies import get_current_agent

from app.schemas.agent_dashboard_schema import AgentDashboardStats
from app.schemas.ticket_schema import TicketResponse, TicketStatusUpdate
from app.schemas.message_schema import MessageCreate, MessageResponse
from app.schemas.ai_schema import AISuggestionResponse

from app.services.agent_service import (
    get_agent_dashboard_stats,
    get_agent_queue,
    get_agent_ticket_by_id,
    get_agent_ticket_messages,
    add_agent_reply,
    update_agent_ticket_status,
    generate_basic_ai_reply_suggestion
)


router = APIRouter(
    prefix="/agent",
    tags=["Agent"]
)


# ---------------- DASHBOARD ----------------

@router.get("/dashboard", response_model=AgentDashboardStats)
def agent_dashboard(
    current_agent=Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    return get_agent_dashboard_stats(current_agent, db)


# ---------------- QUEUE ----------------

@router.get("/queue", response_model=List[TicketResponse])
def agent_queue(
    status_filter: Optional[str] = Query(None),
    priority_filter: Optional[str] = Query(None),
    current_agent=Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    return get_agent_queue(
        current_agent=current_agent,
        db=db,
        status_filter=status_filter,
        priority_filter=priority_filter
    )


# ---------------- TICKET DETAILS ----------------

@router.get("/tickets/{ticket_id}", response_model=TicketResponse)
def agent_ticket_details(
    ticket_id: int,
    current_agent=Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    return get_agent_ticket_by_id(ticket_id, current_agent, db)


# ---------------- TICKET MESSAGES ----------------

@router.get("/tickets/{ticket_id}/messages", response_model=List[MessageResponse])
def agent_ticket_messages(
    ticket_id: int,
    current_agent=Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    return get_agent_ticket_messages(ticket_id, current_agent, db)


# ---------------- AGENT REPLY ----------------

@router.post("/tickets/{ticket_id}/reply", response_model=MessageResponse)
def agent_reply(
    ticket_id: int,
    message_data: MessageCreate,
    current_agent=Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    return add_agent_reply(ticket_id, message_data, current_agent, db)


# ---------------- UPDATE STATUS ----------------

@router.patch("/tickets/{ticket_id}/status", response_model=TicketResponse)
def agent_update_ticket_status(
    ticket_id: int,
    status_data: TicketStatusUpdate,
    current_agent=Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    return update_agent_ticket_status(ticket_id, status_data, current_agent, db)


# ---------------- BASIC AI SUGGESTION ----------------

@router.post("/tickets/{ticket_id}/ai-suggestion", response_model=AISuggestionResponse)
def agent_ai_suggestion(
    ticket_id: int,
    current_agent=Depends(get_current_agent),
    db: Session = Depends(get_db)
):
    return generate_basic_ai_reply_suggestion(ticket_id, current_agent, db)