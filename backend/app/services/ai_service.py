import json
import re
from fastapi import HTTPException, status

from app.services.llm_service import generate_answer


VALID_REQUEST_TYPES = ["IT", "HR", "Facilities"]
VALID_PRIORITIES = ["High", "Medium", "Low"]
VALID_SENTIMENTS = ["Positive", "Neutral", "Negative", "Urgent"]


def extract_json_from_text(text: str) -> dict:
    """
    Extract JSON safely from LLM response.
    Some LLMs return JSON with markdown like ```json ... ```.
    This function removes that and parses clean JSON.
    """

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    json_match = re.search(r"\{.*\}", text, re.DOTALL)

    if not json_match:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI response did not contain valid JSON"
        )

    json_text = json_match.group(0)

    try:
        return json.loads(json_text)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse AI JSON response"
        )


def normalize_classification(ai_data: dict, subject: str) -> dict:
    request_type = ai_data.get("request_type", "IT")
    priority = ai_data.get("priority", "Medium")
    sentiment = ai_data.get("sentiment", "Neutral")
    summary = ai_data.get("summary", f"Support request: {subject}")

    if request_type not in VALID_REQUEST_TYPES:
        request_type = "IT"

    if priority not in VALID_PRIORITIES:
        priority = "Medium"

    if sentiment not in VALID_SENTIMENTS:
        sentiment = "Neutral"

    if not summary or not isinstance(summary, str):
        summary = f"Support request: {subject}"

    return {
        "request_type": request_type,
        "priority": priority,
        "sentiment": sentiment,
        "summary": summary
    }


def classify_ticket(subject: str, description: str) -> dict:
    prompt = f"""
You are an AI ticket classification agent for an MNC Smart Service Desk.

Classify the employee support ticket.

Allowed request_type values:
- IT
- HR
- Facilities

Allowed priority values:
- High
- Medium
- Low

Allowed sentiment values:
- Positive
- Neutral
- Negative
- Urgent

Rules:
1. IT means laptop, password, login, VPN, software, system, network, email, access, application issues.
2. HR means salary, payroll, leave, attendance, benefits, employee policy, onboarding, resignation.
3. Facilities means AC, chair, desk, lighting, cleaning, maintenance, office space, cafeteria, parking.
4. High priority means urgent work blocked, critical system issue, salary not credited, safety issue, or client work affected.
5. Medium priority means normal issue that affects work but is not emergency.
6. Low priority means general query or non-urgent request.
7. Return ONLY valid JSON. Do not add explanation.

Ticket Subject:
{subject}

Ticket Description:
{description}

Return JSON in this exact format:
{{
  "request_type": "IT",
  "priority": "High",
  "sentiment": "Negative",
  "summary": "Short summary of the issue"
}}
"""

    try:
        response_text = generate_answer(prompt)
        ai_data = extract_json_from_text(response_text)
        return normalize_classification(ai_data, subject)

    except Exception:
        return {
            "request_type": "IT",
            "priority": "Medium",
            "sentiment": "Neutral",
            "summary": f"Support request: {subject}"
        }

def generate_agent_reply_suggestion(ticket, messages: list, customer_name: str) -> str:
    """
    Real LLM-based agent reply suggestion.
    """

    conversation_text = ""

    for message in messages:
        conversation_text += (
            f"{message.sender_role.upper()} - {message.sender_name}: "
            f"{message.message}\n"
        )

    prompt = f"""
You are an AI assistant helping a support agent reply to an employee ticket.

Write a professional, helpful, and clear response.

Ticket Details:
Customer Name: {customer_name}
Subject: {ticket.subject}
Description: {ticket.description}
Request Type: {ticket.request_type}
Priority: {ticket.priority}
Sentiment: {ticket.sentiment}
Status: {ticket.status}
AI Summary: {ticket.summary}

Conversation Thread:
{conversation_text}

Rules:
1. Start with a polite greeting using the customer's name.
2. Acknowledge the issue.
3. Give useful next steps.
4. If information is missing, ask for it clearly.
5. Keep the reply short and professional.
6. Do not promise anything unrealistic.
7. Do not mention that you are an AI.

Final Agent Reply:
"""

    return generate_answer(prompt)