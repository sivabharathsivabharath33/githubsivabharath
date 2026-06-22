from sentence_transformers import SentenceTransformer

from app.config import settings


_embedding_model = None


def get_embedding_model():
    global _embedding_model

    if _embedding_model is None:
        _embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)

    return _embedding_model


def create_embedding(text: str) -> list[float]:
    model = get_embedding_model()
    embedding = model.encode(text).tolist()
    return embedding


def create_embeddings(texts: list[str]) -> list[list[float]]:
    model = get_embedding_model()
    embeddings = model.encode(texts).tolist()
    return embeddings