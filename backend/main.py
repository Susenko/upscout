import json
import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from openai import AsyncOpenAI
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="UpScout API")


def _get_openai_client() -> AsyncOpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured")
    return AsyncOpenAI(api_key=api_key)


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------


class ActivityData(BaseModel):
    Proposals: Optional[str] = None
    Interviewing: Optional[str] = None
    Invites_sent: Optional[str] = None
    Unanswered_invites: Optional[str] = None
    Last_viewed_by_client: Optional[str] = None

    model_config = {"populate_by_name": True, "extra": "allow"}


class JobData(BaseModel):
    title: str
    postedAt: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    hoursPerWeek: Optional[str] = None
    contractType: Optional[str] = None
    duration: Optional[str] = None
    experienceLevel: Optional[str] = None
    budgetMin: Optional[str] = None
    budgetMax: Optional[str] = None
    budgetType: Optional[str] = None
    projectType: Optional[str] = None
    skills: Optional[list[str]] = None
    activity: Optional[ActivityData] = None
    bidRange: Optional[str] = None
    url: Optional[str] = None


class ClientData(BaseModel):
    paymentVerified: Optional[bool] = None
    ratingText: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    localTime: Optional[str] = None
    jobsPosted: Optional[str] = None
    hireRate: Optional[str] = None
    openJobs: Optional[str] = None
    totalSpent: Optional[str] = None
    hires: Optional[str] = None
    activeHires: Optional[str] = None
    avgHourlyRatePaid: Optional[str] = None
    hoursBilled: Optional[str] = None
    companySize: Optional[str] = None
    memberSince: Optional[str] = None


class ProposalData(BaseModel):
    canApplyNow: Optional[bool] = None
    connectsRequired: Optional[str] = None
    availableConnects: Optional[str] = None
    jobLink: Optional[str] = None


class AnalyzeJobRequest(BaseModel):
    job: JobData
    client: Optional[ClientData] = None
    proposal: Optional[ProposalData] = None


# ---------------------------------------------------------------------------
# Response model
# ---------------------------------------------------------------------------


class AnalyzeJobResponse(BaseModel):
    shouldApply: bool
    score: int
    difficulty: str
    estimatedRealBudget: str
    redFlags: list[str]
    advice: str


# ---------------------------------------------------------------------------
# Route
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = (
    "You are an expert Upwork freelancer advisor. "
    "Analyze the provided Upwork job data and return a JSON object with exactly "
    "these fields:\n"
    "- shouldApply (boolean): whether the freelancer should apply\n"
    "- score (integer 0-100): overall job quality score\n"
    "- difficulty (string): one of 'Low', 'Medium', 'High'\n"
    "- estimatedRealBudget (string): realistic budget range, e.g. '$200-$400'\n"
    "- redFlags (array of strings): list of concerns; empty array if none\n"
    "- advice (string): short actionable advice (1-2 sentences)\n\n"
    "Return ONLY valid JSON, no markdown, no extra text."
)


@app.post("/analyze-job", response_model=AnalyzeJobResponse)
async def analyze_job(request: AnalyzeJobRequest) -> AnalyzeJobResponse:
    job_payload = request.model_dump(exclude_none=True)

    try:
        completion = await _get_openai_client().chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": json.dumps(job_payload, ensure_ascii=False),
                },
            ],
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"OpenAI API error: {exc}"
        ) from exc

    raw = completion.choices[0].message.content
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502, detail=f"Invalid JSON from OpenAI: {raw}"
        ) from exc

    try:
        return AnalyzeJobResponse(**data)
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Unexpected response shape from OpenAI: {data}"
        ) from exc
