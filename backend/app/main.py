from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine

from app.models import (
    User,
    Agent,
    Admin,
    Ticket,
    TicketMessage,
    FAQ,
    KnowledgeBaseDocument,
    KnowledgeBaseChunk,
)

from app.routes.auth_routes import router as auth_router
from app.routes.faq_routes import router as faq_router
from app.routes.customer_routes import router as customer_router
from app.routes.rag_routes import router as rag_router
from app.routes.admin_routes import router as admin_router
from app.routes.agent_routes import router as agent_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(faq_router)
app.include_router(customer_router)
app.include_router(rag_router)
app.include_router(admin_router)
app.include_router(agent_router)


@app.get("/")
def root():
    return {
        "message": "Smart Service Desk Backend is running successfully",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Backend health check successful"
    }