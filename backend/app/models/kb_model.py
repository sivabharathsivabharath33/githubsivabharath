from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime

from app.database import Base


class KnowledgeBaseDocument(Base):
    __tablename__ = "knowledge_base_documents"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)

    category = Column(String(100), nullable=True)
    # IT / HR / Facilities / General

    uploaded_by = Column(Integer, ForeignKey("admins.id"), nullable=True)

    status = Column(String(20), default="active")

    created_at = Column(DateTime, default=datetime.utcnow)


class KnowledgeBaseChunk(Base):
    __tablename__ = "knowledge_base_chunks"

    id = Column(Integer, primary_key=True, index=True)

    document_id = Column(
        Integer,
        ForeignKey("knowledge_base_documents.id"),
        nullable=False
    )

    chunk_text = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)

    vector_id = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)