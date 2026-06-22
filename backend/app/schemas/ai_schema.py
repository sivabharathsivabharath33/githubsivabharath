from pydantic import BaseModel
from typing import Optional


class TicketAIClassificationResponse(BaseModel):
    request_type: str
    priority: str
    sentiment: str
    summary: str


class AISuggestionResponse(BaseModel):
    ticket_id: int
    suggested_reply: str


class AIReplySuggestionRequest(BaseModel):
    tone: Optional[str] = "professional"