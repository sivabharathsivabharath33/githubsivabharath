from app.vectorstore.chroma_client import get_kb_collection
from app.services.embedding_service import create_embeddings, create_embedding


def add_chunks_to_vectorstore(
    document_id: int,
    title: str,
    category: str,
    chunks: list[str]
) -> list[str]:
    collection = get_kb_collection()

    embeddings = create_embeddings(chunks)

    ids = []
    metadatas = []

    for index, chunk in enumerate(chunks):
        vector_id = f"doc_{document_id}_chunk_{index}"

        ids.append(vector_id)

        metadatas.append(
            {
                "document_id": document_id,
                "title": title,
                "category": category,
                "chunk_index": index
            }
        )

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )

    return ids


def search_similar_chunks(question: str, top_k: int = 4):
    collection = get_kb_collection()

    query_embedding = create_embedding(question)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    retrieved_chunks = []

    for index, document_text in enumerate(documents):
        metadata = metadatas[index] if index < len(metadatas) else {}
        distance = distances[index] if index < len(distances) else None

        retrieved_chunks.append(
            {
                "text": document_text,
                "metadata": metadata,
                "distance": distance
            }
        )

    return retrieved_chunks


def delete_document_from_vectorstore(document_id: int):
    collection = get_kb_collection()

    results = collection.get(
        where={"document_id": document_id}
    )

    ids = results.get("ids", [])

    if ids:
        collection.delete(ids=ids)

    return ids