# Create a markdown file summarizing the UpScout concept discussed in the conversation

content = """
# UpScout – AI Upwork Job Analyzer (Project Summary)

## 1. Idea Overview
UpScout is a Chrome extension that analyzes Upwork job posts and helps freelancers decide whether they should apply.

The extension reads the visible content of a job page and provides an AI-based analysis including:
- Should you apply or skip the job
- Estimated real value of the project
- Difficulty level
- Red flags about the client or job description
- Estimated probability of getting hired
- Quick advice for bidding

Goal:
Help freelancers save time and connects by avoiding low-quality jobs.

---

# 2. Core User Flow

1. User opens an Upwork job page
2. UpScout detects the page
3. Extension injects a button:

    🔍 Analyze with UpScout

4. User clicks the button
5. Job data is extracted from the page
6. Data is sent to backend AI
7. AI returns analysis
8. Extension displays a small panel with results

Example output:

UpScout AI Analysis

Job Score: 72 / 100
Estimated Real Budget: $300–$500
Difficulty: Medium
Competition: High

Recommendation:
Apply only if you can deliver a quick fix.

---

# 3. Data Extracted From Upwork Page

The extension extracts visible DOM data:

Job title
Job description
Budget
Hourly/fixed price
Number of proposals
Client rating
Client spending
Payment verification
Client location

Example JSON sent to backend:

{
  "title": "...",
  "description": "...",
  "budget": "...",
  "proposals": "...",
  "client_rating": "...",
  "client_spent": "...",
  "payment_verified": true
}

---

# 4. AI Analysis Prompt

Example prompt:

You are an Upwork freelancer advisor.

Analyze this job and provide:

1. Should apply (YES / NO)
2. Estimated real project value
3. Difficulty (1-5)
4. Red flags
5. Probability of getting hired
6. Short advice

---

# 5. Extension Architecture

Chrome Extension Components

Content Script
- Detects job page
- Extracts DOM content
- Injects “Analyze” button

Background Script
- Handles API requests

Popup / Panel UI
- Displays AI analysis

Backend (FastAPI or similar)
- Receives job data
- Calls AI model
- Returns structured analysis

---

# 6. Example UI Panel

┌─────────────────────────────┐
│ UpScout AI Analysis         │
│                             │
│ Job Score: 72               │
│ Real Budget: $300 – $500    │
│ Difficulty: Medium          │
│ Competition: High           │
│                             │
│ Recommendation:             │
│ Apply only if quick fix     │
└─────────────────────────────┘

---

# 7. MVP Scope

Minimum version:

- Detect Upwork job pages
- Inject "Analyze with UpScout" button
- Extract job text
- Send to AI backend
- Display simple analysis panel

Estimated build time:
1–2 days

---

# 8. Possible Future Features

Proposal generator

Button:
Generate Proposal

AI writes a tailored proposal based on the job description.

---

Job scoring

Example:

Client quality: 8/10
Budget realism: 4/10
Competition: High

---

Real project price estimator

Example:

Client budget: $100
Realistic project price: $800–1200

---

Freelancer assistant

AI could:

- analyze job
- generate proposal
- suggest price
- track application history

---

# 9. Monetization Model

Free tier
3 analyses per day

Pro tier
$9/month

Unlimited analyses

Premium tier
$19/month

Includes:
- proposal generation
- deeper analysis

---

# 10. Market Reality

Existing similar tools:

Upwex
PouncerAI
Vollna
Proposal generator extensions

Typical metrics:

Users: 5k–50k
Revenue: $1k–$20k/month

Typical conversion:
3–10% paid users

---

# 11. Compliance With Upwork Rules

Safe actions:

✔ Analyze job page
✔ Generate proposal text
✔ Show AI recommendations

Risky actions:

✖ Auto apply to jobs
✖ Automatic messaging
✖ Scraping large numbers of jobs
✖ Using private Upwork APIs

Extension should only read visible DOM content.

---

# 12. Naming

Selected name:

UpScout

Meaning:
“Scout for opportunities on Upwork”

Recommended product title:

UpScout – AI Upwork Job Analyzer

Possible domain names:

upscout.ai
upscout.app
upscout.dev

---

# 13. Long-Term Vision

UpScout could evolve into:

AI Freelance Assistant

Functions:

- Job analysis
- Proposal generation
- Pricing suggestions
- Client risk analysis
- Freelance CRM

Potential expansion:

Support for:
Upwork
Fiverr
Freelancer
other marketplaces

---

# 14. Key Insight

UpScout solves a real freelancer problem:

Freelancers waste time and connects applying to poor-quality jobs.

UpScout helps answer the key question:

Should I apply to this job?
"""

path = "/mnt/data/upscout_project_summary.md"
with open(path, "w") as f:
    f.write(content)

path