from app.services.vector_service import search_similar_chunks
from app.services.llm_service import generate_answer
from app.utils.prompt_templates import build_rag_prompt


def ask_knowledge_base(question: str):
    retrieved_chunks = search_similar_chunks(question, top_k=4)

    if not retrieved_chunks:
        return {
            "question": question,
            "answer": (
                "I could not find any relevant information in the knowledge base. "
                "Please contact a support agent."
            ),
            "sources": []
        }

    context_parts = []

    sources = []

    for item in retrieved_chunks:
        chunk_text = item["text"]
        metadata = item["metadata"]

        context_parts.append(chunk_text)

        sources.append(
            {
                "document_id": metadata.get("document_id"),
                "title": metadata.get("title"),
                "category": metadata.get("category"),
                "chunk_index": metadata.get("chunk_index")
            }
        )

    context = "\n\n---\n\n".join(context_parts)

    prompt = build_rag_prompt(
        question=question,
        context=context
    )

    answer = generate_answer(prompt)

    return {
        "question": question,
        "answer": answer,
        "sources": sources
    }