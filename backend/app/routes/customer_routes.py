from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.dependencies import get_current_customer

from app.schemas.ticket_schema import TicketCreate, TicketResponse
from app.schemas.message_schema import MessageCreate, MessageResponse

from app.services.ticket_service import (
    create_customer_ticket,
    get_customer_tickets,
    get_customer_ticket_by_id
)

from app.services.message_service import (
    get_ticket_messages,
    add_customer_message
)


router = APIRouter(
    prefix="/customer",
    tags=["Customer"]
)


@router.post("/tickets", response_model=TicketResponse)
def create_ticket(
    ticket_data: TicketCreate,
    current_user=Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    return create_customer_ticket(ticket_data, current_user, db)


@router.get("/tickets", response_model=List[TicketResponse])
def my_tickets(
    current_user=Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    return get_customer_tickets(current_user, db)


@router.get("/tickets/{ticket_id}", response_model=TicketResponse)
def ticket_details(
    ticket_id: int,
    current_user=Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    return get_customer_ticket_by_id(ticket_id, current_user, db)


@router.get("/tickets/{ticket_id}/messages", response_model=List[MessageResponse])
def ticket_messages(
    ticket_id: int,
    current_user=Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    return get_ticket_messages(ticket_id, current_user, db)


@router.post("/tickets/{ticket_id}/messages", response_model=MessageResponse)
def send_customer_message(
    ticket_id: int,
    message_data: MessageCreate,
    current_user=Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    return add_customer_message(ticket_id, message_data, current_user, db)