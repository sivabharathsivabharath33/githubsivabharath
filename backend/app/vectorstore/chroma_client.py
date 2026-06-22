import chromadb

from app.config import settings


_chroma_client = None
_collection = None


def get_chroma_client():
    global _chroma_client

    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(
            path=settings.CHROMA_DB_PATH
        )

    return _chroma_client


def get_kb_collection():
    global _collection

    if _collection is None:
        client = get_chroma_client()

        _collection = client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME
        )

    return _collection