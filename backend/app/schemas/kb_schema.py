from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class KnowledgeBaseDocumentResponse(BaseModel):
    id: int
    title: str
    file_name: str
    file_path: str
    category: Optional[str] = None
    uploaded_by: Optional[int] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True