from sqlalchemy.orm import Session
from app.models.faq_model import FAQ


def search_faqs(query: str, db: Session):
    return (
        db.query(FAQ)
        .filter(
            FAQ.status == "active",
            FAQ.question.ilike(f"%{query}%")
        )
        .all()
    )


def get_all_active_faqs(db: Session):
    return (
        db.query(FAQ)
        .filter(FAQ.status == "active")
        .order_by(FAQ.created_at.desc())
        .all()
    )