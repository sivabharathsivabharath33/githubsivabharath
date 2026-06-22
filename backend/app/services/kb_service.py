import os
import shutil

from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status

from app.models.kb_model import KnowledgeBaseDocument, KnowledgeBaseChunk

from app.utils.file_extractor import extract_text_from_file
from app.utils.text_splitter import split_text_into_chunks

from app.services.vector_service import (
    add_chunks_to_vectorstore,
    delete_document_from_vectorstore
)


UPLOAD_DIR = "app/uploads"

ALLOWED_EXTENSIONS = [".pdf", ".txt", ".docx"]


def save_kb_document(
    title: str,
    category: str,
    file: UploadFile,
    current_admin,
    db: Session
):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF, TXT, and DOCX files are allowed"
        )

    safe_file_name = file.filename.replace(" ", "_")
    file_path = os.path.join(UPLOAD_DIR, safe_file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_file(file_path)

    if not extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No readable text found in the uploaded document"
        )

    chunks = split_text_into_chunks(extracted_text)

    if not chunks:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create text chunks from the document"
        )

    new_document = KnowledgeBaseDocument(
        title=title,
        file_name=safe_file_name,
        file_path=file_path,
        category=category,
        uploaded_by=current_admin.id,
        status="active"
    )

    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    vector_ids = add_chunks_to_vectorstore(
        document_id=new_document.id,
        title=new_document.title,
        category=new_document.category or "General",
        chunks=chunks
    )

    for index, chunk_text in enumerate(chunks):
        chunk = KnowledgeBaseChunk(
            document_id=new_document.id,
            chunk_text=chunk_text,
            chunk_index=index,
            vector_id=vector_ids[index]
        )

        db.add(chunk)

    db.commit()

    return new_document


def get_kb_documents(db: Session):
    return (
        db.query(KnowledgeBaseDocument)
        .order_by(KnowledgeBaseDocument.created_at.desc())
        .all()
    )


def delete_kb_document(document_id: int, db: Session):
    document = (
        db.query(KnowledgeBaseDocument)
        .filter(KnowledgeBaseDocument.id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge base document not found"
        )

    delete_document_from_vectorstore(document_id)

    db.query(KnowledgeBaseChunk).filter(
        KnowledgeBaseChunk.document_id == document_id
    ).delete()

    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    db.delete(document)
    db.commit()

    return {"message": "Knowledge base document deleted successfully"}