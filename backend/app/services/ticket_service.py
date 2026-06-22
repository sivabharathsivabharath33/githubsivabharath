from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.ticket_model import Ticket
from app.models.message_model import TicketMessage
from app.schemas.ticket_schema import TicketCreate
from app.services.ai_service import classify_ticket


def create_customer_ticket(ticket_data: TicketCreate, current_user, db: Session):
    ai_result = classify_ticket(ticket_data.subject, ticket_data.description)

    new_ticket = Ticket(
        user_id=current_user.id,
        subject=ticket_data.subject,
        description=ticket_data.description,
        request_type=ai_result["request_type"],
        priority=ai_result["priority"],
        sentiment=ai_result["sentiment"],
        summary=ai_result["summary"],
        status="Open"
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    first_message = TicketMessage(
        ticket_id=new_ticket.id,
        sender_id=current_user.id,
        sender_role="customer",
        sender_name=current_user.name,
        message=ticket_data.description
    )

    db.add(first_message)
    db.commit()

    return new_ticket


def get_customer_tickets(current_user, db: Session):
    return (
        db.query(Ticket)
        .filter(Ticket.user_id == current_user.id)
        .order_by(Ticket.created_at.desc())
        .all()
    )


def get_customer_ticket_by_id(ticket_id: int, current_user, db: Session):
    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id,
            Ticket.user_id == current_user.id
        )
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    return ticket