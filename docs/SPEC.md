# AI SEO Content Assistant Using Prompt Engineering
Implementation specification for Google Antigravity · Version 1.0 · 27 October 2026 · Planned by Rahul with Claude

## 0. Rules for the implementing agent (Antigravity)
1. Build only what this document specifies. Anything not listed is out of scope.
2. Use three statuses everywhere: Planned (specified, not built), Implemented (code exists, not yet checked), Verified (checked by running it, evidence recorded in docs/TEST_LOG.md).
3. Never fabricate model outputs, scores, screenshots, traffic, search volume, keyword difficulty or cost figures. If something was not run, write NOT RUN.
4. API keys live only in server environment variables. They must never appear in client code, the client bundle, logs, API responses or the repository.
5. Where this spec is ambiguous, choose the simplest option and record it in docs/DECISIONS.md.
6. Mock mode exists only for building the UI. Mock output must be visibly labelled and must never be used as evidence in the report.
7. Follow the milestone order in section F5. Do not start a milestone until the previous one runs.

## A. Full Project Specification
### A1. Purpose and learning objectives
A web app that turns a user's topic and context into a complete SEO content package (titles, meta description, keywords, outline, article, FAQs, checklist) using carefully engineered prompts. Its central teaching goal is to show the measurable difference between a basic prompt and a structured, constraint-based prompt.
Objectives:
1. Apply six prompt-engineering techniques: role, context, explicit constraints, few-shot examples, structured output, staged prompting.
2. Compare a simple prompt and an improved prompt under identical conditions (same input, model, temperature, token cap, evaluator).
3. Judge both with a transparent rubric that is mostly deterministic code, so scores can be explained line by line.
4. Build a small, secure, provider-agnostic architecture a student can explain in a viva.

### A2. Scope
In scope: the 12 features in A4, five pages, one backend with four generation stages plus one simple-prompt endpoint, a rule-based evaluator, copy and download.
Out of scope: user accounts, database, payments, SERP scraping, search volume / difficulty / traffic data of any kind, CMS publishing, image generation, plagiarism detection, streaming tokens, multi-user features.
Stretch (only after every milestone is Verified): technique on/off toggles, title picker before outline, one-shot meta-length repair call, dark mode.

### A3. Primary scenario
One user running locally. They fill the form, press Generate package, watch four stages complete, review result tabs, copy or download, then open Prompt Lab to run the same input through the simple and improved prompts and read the rubric explanation.

### A4. Feature list
- F01: Input form (User, Generate)
- F02: Five SEO title suggestions (LLM stage 1, Titles tab)
- F03: Meta description, 155-160 character target (LLM stage 1, Meta tab)
- F04: Primary, secondary, long-tail keyword suggestions (LLM stage 1, Keywords tab)
- F05: H1/H2/H3 outline (LLM stage 2, Outline tab)
- F06: Article (LLM stage 3, Article tab)
- F07: Five FAQs with answers (LLM stage 4, FAQs tab)
- F08: SEO content quality checklist (Rule engine, Checklist tab)
- F09: Simple vs improved prompt comparison (Prompt Lab)
- F10: Copy and download results (Client, Every card & Export menu)
- F11: Loading, validation, empty and error states (Client and server, All pages)
- F12: Transparent evaluation rubric with explanations (Code plus manual ratings, Evaluation page)
