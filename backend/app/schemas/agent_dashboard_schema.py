from pydantic import BaseModel


class AgentDashboardStats(BaseModel):
    agent_name: str
    request_type: str

    total_assigned_tickets: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    closed_tickets: int
    high_priority_tickets: int
    today_queue_size: int