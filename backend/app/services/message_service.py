from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.ticket_model import Ticket
from app.models.message_model import TicketMessage
from app.schemas.message_schema import MessageCreate


def get_ticket_messages(ticket_id: int, current_user, db: Session):
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

    return (
        db.query(TicketMessage)
        .filter(TicketMessage.ticket_id == ticket_id)
        .order_by(TicketMessage.created_at.asc())
        .all()
    )


def add_customer_message(ticket_id: int, message_data: MessageCreate, current_user, db: Session):
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

    if ticket.status == "Closed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add message to a closed ticket"
        )

    new_message = TicketMessage(
        ticket_id=ticket_id,
        sender_id=current_user.id,
        sender_role="customer",
        sender_name=current_user.name,
        message=message_data.message
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return new_message