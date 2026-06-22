from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.faq_schema import FAQResponse
from app.services.faq_service import search_faqs, get_all_active_faqs


router = APIRouter(
    prefix="/faqs",
    tags=["FAQs"]
)


@router.get("/", response_model=List[FAQResponse])
def get_faqs(db: Session = Depends(get_db)):
    return get_all_active_faqs(db)


@router.get("/search", response_model=List[FAQResponse])
def search_faq(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    return search_faqs(q, db)