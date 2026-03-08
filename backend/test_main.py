"""Tests for the POST /analyze-job route."""

import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

SAMPLE_REQUEST = {
    "job": {
        "title": "Go Through New Developer Website and Give Them Optimization Advice",
        "postedAt": "yesterday",
        "location": "Worldwide",
        "summary": "Hey I need someone to go through a new website.",
        "hoursPerWeek": "Less than 30 hrs/week",
        "contractType": "Hourly",
        "duration": "1 to 3 months",
        "experienceLevel": "Intermediate",
        "budgetMin": "$10.00",
        "budgetMax": "$20.00",
        "budgetType": "Hourly",
        "projectType": "Ongoing project",
        "skills": ["Web Development", "JavaScript"],
        "activity": {
            "Proposals": "15 to 20",
            "Interviewing": "0",
            "Invites sent": "0",
            "Unanswered invites": "0",
        },
        "bidRange": "Bid range - High $55.00 | Avg $21.59 | Low $7.00",
        "url": "https://www.upwork.com/jobs/~022030734193543920090",
    },
    "client": {
        "paymentVerified": True,
        "ratingText": "4.97 of 27 reviews",
        "country": "United States",
        "city": "Charleston",
        "totalSpent": "$19K total spent",
        "hireRate": "72% hire rate",
    },
    "proposal": {
        "canApplyNow": True,
        "connectsRequired": "20 Connects",
        "availableConnects": "3",
        "jobLink": "https://www.upwork.com/jobs/~022030734193543920090",
    },
}

SAMPLE_AI_RESPONSE = {
    "shouldApply": True,
    "score": 74,
    "difficulty": "Low",
    "estimatedRealBudget": "$80-$150",
    "redFlags": ["Low budget compared to client avg paid rate"],
    "advice": "Good quick-fix style job, but connects cost is high.",
}


def _mock_completion(data: dict) -> MagicMock:
    """Build a fake openai completion object."""
    message = MagicMock()
    message.content = json.dumps(data)
    choice = MagicMock()
    choice.message = message
    completion = MagicMock()
    completion.choices = [choice]
    return completion


@patch("main.AsyncOpenAI")
@patch.dict("os.environ", {"OPENAI_API_KEY": "test-key"})
def test_analyze_job_success(mock_openai_cls):
    """Route returns the expected JSON when OpenAI responds correctly."""
    mock_instance = MagicMock()
    mock_instance.chat.completions.create = AsyncMock(
        return_value=_mock_completion(SAMPLE_AI_RESPONSE)
    )
    mock_openai_cls.return_value = mock_instance

    response = client.post("/analyze-job", json=SAMPLE_REQUEST)

    assert response.status_code == 200
    body = response.json()
    assert body["shouldApply"] is True
    assert body["score"] == 74
    assert body["difficulty"] == "Low"
    assert "estimatedRealBudget" in body
    assert isinstance(body["redFlags"], list)
    assert "advice" in body


@patch("main.AsyncOpenAI")
@patch.dict("os.environ", {"OPENAI_API_KEY": "test-key"})
def test_analyze_job_missing_title(mock_openai_cls):
    """Route returns 422 when required field 'title' is missing."""
    request_without_title = dict(SAMPLE_REQUEST)
    request_without_title["job"] = {}  # title is required

    response = client.post("/analyze-job", json=request_without_title)
    assert response.status_code == 422


@patch.dict("os.environ", {}, clear=True)
def test_analyze_job_no_api_key():
    """Route returns 500 when OPENAI_API_KEY is not set."""
    response = client.post("/analyze-job", json=SAMPLE_REQUEST)
    assert response.status_code == 500
    assert "OPENAI_API_KEY" in response.json()["detail"]
