from app.config import settings


def generate_with_gemini(prompt: str) -> str:
    if not settings.GEMINI_API_KEY:
        return (
            "The AI service is not configured because GEMINI_API_KEY is missing. "
            "Please contact a support agent for help."
        )

    try:
        from google import genai

        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )

        if not response.text:
            return (
                "I could not generate an answer right now. "
                "Please contact a support agent for further help."
            )

        return response.text

    except Exception as e:
        error_message = str(e)

        if "429" in error_message or "quota" in error_message.lower():
            return (
                "The AI service is temporarily unavailable because the free Gemini quota limit has been reached. "
                "Please try again later or contact a support agent for urgent help."
            )

        return (
            f"The AI service is temporarily unavailable. Error: {error_message}. "
            "Please try again later or contact a support agent."
        )


def generate_with_groq(prompt: str) -> str:
    if not settings.GROQ_API_KEY:
        return (
            "The AI service is not configured because GROQ_API_KEY is missing. "
            "Please contact a support agent for help."
        )

    try:
        from groq import Groq

        client = Groq(api_key=settings.GROQ_API_KEY)

        completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful smart service desk assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        return completion.choices[0].message.content

    except Exception as e:
        error_message = str(e)

        if "429" in error_message or "rate limit" in error_message.lower():
            return (
                "The AI service is temporarily busy due to free API rate limits. "
                "Please try again after some time or contact a support agent."
            )

        return (
            f"The AI service is temporarily unavailable. Error: {error_message}. "
            "Please try again later or contact a support agent."
        )


def generate_answer(prompt: str) -> str:
    provider = settings.LLM_PROVIDER.lower()

    if provider == "gemini":
        return generate_with_gemini(prompt)

    if provider == "groq":
        return generate_with_groq(prompt)

    return (
        "Invalid AI provider configuration. "
        "Please set LLM_PROVIDER as gemini or groq."
    )