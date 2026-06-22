from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from datetime import datetime, date

from app.models.ticket_model import Ticket
from app.models.message_model import TicketMessage
from app.models.user_model import User

from app.schemas.message_schema import MessageCreate
from app.schemas.ticket_schema import TicketStatusUpdate
from app.services.ai_service import generate_agent_reply_suggestion


VALID_TICKET_STATUS = ["Open", "In Progress", "Resolved", "Closed"]


# ---------------- AGENT DASHBOARD ----------------

def get_agent_dashboard_stats(current_agent, db: Session):
    request_type = current_agent.request_type

    total_assigned_tickets = (
        db.query(Ticket)
        .filter(Ticket.request_type == request_type)
        .count()
    )

    open_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.request_type == request_type,
            Ticket.status == "Open"
        )
        .count()
    )

    in_progress_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.request_type == request_type,
            Ticket.status == "In Progress"
        )
        .count()
    )

    resolved_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.request_type == request_type,
            Ticket.status == "Resolved"
        )
        .count()
    )

    closed_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.request_type == request_type,
            Ticket.status == "Closed"
        )
        .count()
    )

    high_priority_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.request_type == request_type,
            Ticket.priority == "High"
        )
        .count()
    )

    today_date = date.today()

    today_queue_size = (
        db.query(Ticket)
        .filter(
            Ticket.request_type == request_type,
            func.date(Ticket.created_at) == today_date
        )
        .count()
    )

    return {
        "agent_name": current_agent.name,
        "request_type": current_agent.request_type,
        "total_assigned_tickets": total_assigned_tickets,
        "open_tickets": open_tickets,
        "in_progress_tickets": in_progress_tickets,
        "resolved_tickets": resolved_tickets,
        "closed_tickets": closed_tickets,
        "high_priority_tickets": high_priority_tickets,
        "today_queue_size": today_queue_size
    }


# ---------------- AGENT QUEUE ----------------

def get_agent_queue(
    current_agent,
    db: Session,
    status_filter: str | None = None,
    priority_filter: str | None = None
):
    query = db.query(Ticket).filter(
        Ticket.request_type == current_agent.request_type
    )

    if status_filter:
        query = query.filter(Ticket.status == status_filter)

    if priority_filter:
        query = query.filter(Ticket.priority == priority_filter)

    return query.order_by(Ticket.created_at.desc()).all()


# ---------------- VIEW TICKET DETAILS ----------------

def get_agent_ticket_by_id(ticket_id: int, current_agent, db: Session):
    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id,
            Ticket.request_type == current_agent.request_type
        )
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found in your assigned queue"
        )

    return ticket


# ---------------- TICKET MESSAGES ----------------

def get_agent_ticket_messages(ticket_id: int, current_agent, db: Session):
    ticket = get_agent_ticket_by_id(ticket_id, current_agent, db)

    return (
        db.query(TicketMessage)
        .filter(TicketMessage.ticket_id == ticket.id)
        .order_by(TicketMessage.created_at.asc())
        .all()
    )


# ---------------- AGENT REPLY ----------------

def add_agent_reply(
    ticket_id: int,
    message_data: MessageCreate,
    current_agent,
    db: Session
):
    ticket = get_agent_ticket_by_id(ticket_id, current_agent, db)

    if ticket.status == "Closed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot reply to a closed ticket"
        )

    # Assign the ticket to the replying agent if not already assigned
    if ticket.assigned_agent_id is None:
        ticket.assigned_agent_id = current_agent.id

    if ticket.status == "Open":
        ticket.status = "In Progress"

    new_message = TicketMessage(
        ticket_id=ticket.id,
        sender_id=current_agent.id,
        sender_role="agent",
        sender_name=current_agent.name,
        message=message_data.message
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return new_message


# ---------------- UPDATE TICKET STATUS ----------------

def update_agent_ticket_status(
    ticket_id: int,
    status_data: TicketStatusUpdate,
    current_agent,
    db: Session
):
    ticket = get_agent_ticket_by_id(ticket_id, current_agent, db)

    if status_data.status not in VALID_TICKET_STATUS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be Open, In Progress, Resolved, or Closed"
        )

    ticket.status = status_data.status
    ticket.assigned_agent_id = current_agent.id

    if status_data.status == "Closed":
        ticket.closed_at = datetime.utcnow()

    db.commit()
    db.refresh(ticket)

    return ticket


# ---------------- AI REPLY SUGGESTION BASIC ----------------

def generate_basic_ai_reply_suggestion(ticket_id: int, current_agent, db: Session):
    ticket = get_agent_ticket_by_id(ticket_id, current_agent, db)

    customer = db.query(User).filter(User.id == ticket.user_id).first()
    customer_name = customer.name if customer else "there"

    messages = (
        db.query(TicketMessage)
        .filter(TicketMessage.ticket_id == ticket.id)
        .order_by(TicketMessage.created_at.asc())
        .all()
    )

    suggested_reply = generate_agent_reply_suggestion(
        ticket=ticket,
        messages=messages,
        customer_name=customer_name
    )

    return {
        "ticket_id": ticket.id,
        "suggested_reply": suggested_reply
    }