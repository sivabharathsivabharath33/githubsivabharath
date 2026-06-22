from pydantic import BaseModel
from typing import List


class RAGQuestionRequest(BaseModel):
    question: str


class RAGSource(BaseModel):
    document_id: int | None = None
    title: str | None = None
    category: str | None = None
    chunk_index: int | None = None


class RAGAnswerResponse(BaseModel):
    question: str
    answer: str
    sources: List[RAGSource] = []