from fastapi import APIRouter

from app.schemas.rag_schema import RAGQuestionRequest, RAGAnswerResponse
from app.services.rag_service import ask_knowledge_base


router = APIRouter(
    prefix="/rag",
    tags=["RAG Knowledge Base"]
)


@router.post("/ask", response_model=RAGAnswerResponse)
def ask_rag_question(request: RAGQuestionRequest):
    return ask_knowledge_base(request.question)