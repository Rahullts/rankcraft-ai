# ⚡ AI SEO Content Assistant Using Prompt Engineering

> **Academic Capstone Project · AI SEO Content Assistant**  
> **Course:** Computer Science & Engineering (B.Tech / B.Sc / MCA)  
> **Specialization:** Generative AI & Prompt Engineering Systems  
> **Student Name:** Rahul  
> **Status:** Fully Implemented & Verified (49/49 Automated Tests Passing)

---

## 🌟 Executive Summary

**AI SEO Content Assistant Using Prompt Engineering** is a full-stack web application that generates search-optimized technical content from user topics while empirically demonstrating how **systematic prompt engineering techniques** improve model output quality, structural conformity, and constraint adherence.

The cornerstone academic feature is the **Prompt Engineering Lab (A/B Test)**, which benchmarks an unconstrained single-shot prompt (**Mode A: Basic**) against a 4-stage chained prompt pipeline (**Mode B: Improved**) under identical inputs and controlled sampling parameters (Temperature 0.5 on live provider / deterministic fixtures on mock provider, dynamic token allocation). Outputs are evaluated by an objective, deterministic **100-point rubric (R1-R10)** that is fully explainable in an academic viva.

---

## 🏗️ System Architecture & Technology Stack

```
   ┌──────────────────────────────────────────────────────────────┐
   │             RankCraft AI Frontend (Port 5173)                │
   │  React 18 + TypeScript + Vite + Custom CSS Design System     │
   │  - AppShell (Sidebar, Topbar, Provider Chip, Mock Banner)    │
   │  - 5 Pages: Dashboard, Generate, Lab, Evaluation, Prompts    │
   │  - Deterministic Rule Engine (evaluate.ts, text.ts)          │
   └──────────────────────────────┬───────────────────────────────┘
                                  │  Proxy /api -> http://localhost:8787
   ┌──────────────────────────────▼───────────────────────────────┐
   │             RankCraft AI Backend (Port 8787)                 │
   │  Express + TypeScript + Zod Validation + Safe Logger         │
   │  - Staged Routes: /api/strategy, /outline, /article, /faqs   │
   │  - Baseline Route: /api/simple                               │
   │  - Meta & Prompts: /api/health, /api/prompts                 │
   └──────────────────────────────┬───────────────────────────────┘
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼                                               ▼
   ┌───────────────────────────────┐               ┌───────────────────────────────┐
   │   Mock Provider (Default)     │               │   Live Provider (Optional)    │
   │  - Instant, zero cost         │               │  - Anthropic (Claude 3.5)     │
   │  - Offline viva ready         │               │  - OpenAI-compatible (GPT-4o) │
   │  - Deterministic fixtures     │               │  - Server-only environment    │
   └───────────────────────────────┘               └───────────────────────────────┘
```

---

## 🧪 The 6 Core Prompt Engineering Techniques Implemented

| # | Technique | Implementation in RankCraft AI | Failure Mode Prevented |
| :-: | :--- | :--- | :--- |
| **1** | **Role Prompting** | Persona assigned: *"Senior SEO content strategist and technical copywriter"*. | Eliminates superficial conversational filler. |
| **2** | **Context & Audience** | Explicit fields for target reader, niche industry, market, and search intent. | Prevents generic, mismatched content. |
| **3** | **Explicit Constraints** | Non-negotiable boundaries: exact 155-160 char meta description, 4+ H2 headings. | Prevents SERP truncation and outline collapse. |
| **4** | **Few-Shot Exemplars** | Exact demonstration pairs of 158-character meta descriptions with primary keywords. | Guides model generation probability without ambiguity. |
| **5** | **Structured JSON Output** | Strict Zod validation schemas for Strategy, Outline, and FAQs with automated regex retry. | Guarantees machine-parseable data for UI rendering. |
| **6** | **Staged Pipeline Chaining** | Deconstructs task into 4 stages: Strategy -> Outline -> Article -> FAQs. | Prevents context overload and lost headings. |

---

## 🎯 The 100-Point Evaluation Rubric (R1 - R10)

Scores are computed **deterministically** via local code (character counting, regex pattern matching, heading tree parsing) rather than subjective LLM evaluation:

- **R1: Title Quality (10 pts)** — 5 titles provided, 30-60 character length bounds, keyword inclusion.
- **R2: Meta Description (10 pts)** — 155-160 exact character SERP target measured by code, keyword present.
- **R3: Keyword Set (10 pts)** — Primary keyword match, 5-8 secondary keywords, 5-8 long-tail keywords (3+ words).
- **R4: Heading Structure (10 pts)** — Single H1, 4+ H2 sections, nested H3 subheadings, clean level hierarchy.
- **R5: Primary Keyword Placement (15 pts)** — Keyword in H1, first 100 words, H2, final section, density within 0.3%-2.5%.
- **R6: Word-Count Accuracy (10 pts)** — Output length within +/-10% of user target (e.g., 800 words).
- **R7: FAQs (10 pts)** — Exactly 5 questions, all ending with '?', answers 40-70 words in length.
- **R8: Readability Heuristic (5 pts)** — Average sentence length <= 20 words (English only).
- **R9: Unsupported Claim Scan (10 pts)** — Detects unverifiable assertions (percentages, "studies show", "#1 ranked").
- **R10: Human Evaluator Review (10 pts)** — Interactive 0-5 radio scales for Search Intent Match and Tone & Audience Fit.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v20+ and npm v10+

### Step 1: Install Dependencies
```bash
# In server directory:
cd server
npm install

# In client directory:
cd ../client
npm install
```

### Step 2: Run Unit Tests
```bash
# Test backend routes, content quality, language consistency, and prompt rendering (37 tests across 4 suites):
cd server
npm test

# Test frontend text utilities and 100-point rubric evaluator (12 tests across 2 suites):
cd ../client
npm test
```

### Step 3: Start Application

**Option A (One-Click Launcher - Recommended):**
```bash
# In the project root directory:
python run_app.py
```
*This launches both the backend and frontend concurrently and opens your browser automatically.*

**Option B (Two Terminals):**
- **Terminal 1 (Backend Server on Port 8787):**
  ```bash
  cd server
  npm run dev
  ```
- **Terminal 2 (Frontend Client on Port 5173):**
  ```bash
  cd client
  npm run dev
  ```

Open your browser at:
- **Frontend Application:** **`http://localhost:5173`**
- **Backend Health Check:** **`http://localhost:8787/api/health`**

---

## 🔑 Optional Live LLM Configuration

The application works 100% offline out-of-the-box using the built-in **Mock Provider**.

To use live AI models, create or edit `server/.env`:

```env
# Choose: mock | anthropic | openai-compatible
LLM_PROVIDER=anthropic

# For Anthropic Claude:
ANTHROPIC_API_KEY=sk-ant-api03-...
LLM_MODEL=claude-3-5-sonnet-20241022

# Or for OpenAI / OpenAI-Compatible (Groq, Together, Ollama):
# LLM_PROVIDER=openai-compatible
# OPENAI_API_KEY=sk-...
# OPENAI_BASE_URL=https://api.openai.com/v1
# LLM_MODEL=gpt-4o
```

> **Security Guarantee:** API credentials exist exclusively in `server/.env` on the backend. They are never exposed to browser client code, network responses, or git.

---

## 📂 Project Repository Structure

```
rankcraft-ai/
├── client/                      # Frontend Single Page App
│   ├── src/
│   │   ├── api/client.ts        # Typed API client with AbortSignal
│   │   ├── components/AppShell  # Responsive layout, sidebar, banner
│   │   ├── lib/evaluate.ts      # 100-point deterministic rubric engine
│   │   ├── lib/text.ts          # Section E7 text parsing & regex rules
│   │   ├── lib/export.ts        # Markdown & JSON export generators
│   │   ├── routes/              # 5 core pages (Dashboard, Generate, Lab, Evaluation, Prompts)
│   │   ├── state/store.tsx      # React Context + useReducer store
│   │   └── styles/              # Design tokens, resets, component styles
│   └── test/                    # Vitest unit test suite (12 tests)
├── server/                      # Lightweight Node/Express Backend
│   ├── src/
│   │   ├── config.ts            # Environment variables & provider settings
│   │   ├── index.ts             # Express server setup with CORS & rate limiting
│   │   ├── lib/llmJson.ts       # Structured JSON parser & retry mechanism
│   │   ├── prompts/             # Modular system & user prompt templates
│   │   ├── providers/           # Provider adapters (Mock, Anthropic, OpenAI)
│   │   ├── routes/              # API endpoints (/strategy, /outline, /article, /faqs, /simple)
│   │   └── schemas/             # Zod input & stage validation schemas
│   └── test/                    # Server unit test suite (9 tests)
├── docs/                        # Academic Capstone Documentation
│   ├── SPEC.md                  # Complete Version 1.0 specification
│   ├── DECISIONS.md             # Architecture Decision Records (ADRs)
│   ├── TEST_LOG.md              # Quality Assurance & real verification log
│   ├── PROJECT_REPORT.md        # Comprehensive academic project report
│   ├── PROMPT_ENGINEERING_GUIDE # Viva reference guide on prompt techniques
│   ├── FACULTY_VIVA_QA.md       # 20 faculty viva questions with answers
│   └── TESTING_REPORT.md        # Detailed test execution report
└── README.md                    # Project overview & running guide
```

---

## 🎓 Faculty Evaluation & Viva Quick Reference

- **Why staged prompting instead of a single prompt?**  
  *Staging eliminates attention dilution across long outputs. Generating strategy -> outline -> article -> FAQs guarantees that headings and keywords planned in earlier stages are strictly enforced in later stages.*
- **How is meta description length enforced?**  
  *Through explicit character boundaries in the prompt (155-160 chars), few-shot exemplars with exact length counts, and an automated rule (R2) in the deterministic evaluator.*
- **Why are scores calculated by code rather than an LLM?**  
  *Using an LLM to evaluate an LLM creates circular logic and hallucinations. Deterministic string algorithms (word counting, regex matching, AST hierarchy checks) provide 100% reproducible and verifiable grades.*

---

## ⚖️ Academic Scope, Honesty & Limitations

1. **Heuristic Evaluation vs. Search Engine Ranking:** The rubric scores generated content against explicit editorial and on-page SEO best practices (character lengths, heading hierarchies, keyword distribution, readability, claim hygiene). It does **not** query proprietary search engine ranking algorithms or simulate Google Search Console indexation.
2. **Search Volume & Difficulty Metrics:** The platform does not display arbitrary or unverified search volume, CPC, or keyword difficulty numbers. Keyword suggestions are structured semantically around the user's primary topic.
3. **Default Offline Mock Mode:** The project is configured by default to use deterministic mock fixtures so it can be evaluated, demonstrated, and audited completely offline without external API dependencies or paid API keys.
4. **Live Provider Configuration:** Support for live LLM providers (Anthropic Claude 3.5 Sonnet, OpenAI GPT-4o, or OpenAI-compatible endpoints) is built in, requiring user-supplied API keys placed strictly in the server environment. No live model claims are made unless live credentials are authenticated.
