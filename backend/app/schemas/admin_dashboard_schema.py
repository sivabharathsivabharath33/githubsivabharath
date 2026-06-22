from pydantic import BaseModel


class AdminDashboardStats(BaseModel):
    total_users: int
    total_agents: int
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    closed_tickets: int
    total_faqs: int
    total_kb_documents: int
    high_priority_tickets: int