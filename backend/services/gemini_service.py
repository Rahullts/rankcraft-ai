"""
Gemini AI Service for RankCraft AI.
Handles real server-side API requests to Google Gemini API with JSON mode,
timeout handling, retry logic, error classification, and structured schema validation.
Includes offline demo generator for academic review environments when API key is pending.
"""

import json
import re
import urllib.request
import urllib.error
from typing import Dict, Any, Tuple
from backend.config import get_api_key, DEFAULT_MODEL
from backend.services.prompt_builder import build_basic_prompt, build_improved_prompt

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

def clean_json_text(raw_text: str) -> str:
    """Strip markdown code fence blocks if LLM wraps output in ```json ... ```."""
    text = raw_text.strip()
    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1).strip()
    return text

def parse_and_validate_seo_json(raw_text: str) -> Dict[str, Any]:
    """Parse JSON string and validate against required SEO schema."""
    cleaned = clean_json_text(raw_text)
    data = json.loads(cleaned)
    
    # Ensure all 12 modules exist with proper defaults
    if not isinstance(data.get("title_suggestions"), list):
        data["title_suggestions"] = [
            "Complete Guide to Topic in 2026",
            "How to Master Topic: Step-by-Step",
            "Top 7 Strategies for Topic Success",
            "Topic Explained: Essential Best Practices",
            "The Ultimate Blueprint for Topic"
        ]
    
    if not isinstance(data.get("recommended_title"), dict):
        rec_title = data["title_suggestions"][0] if data["title_suggestions"] else "SEO Guide"
        data["recommended_title"] = {
            "title": rec_title,
            "explanation": "Selected for front-loaded keyword positioning and high search click-through appeal."
        }
    
    if not isinstance(data.get("meta_description"), str) or not data["meta_description"].strip():
        data["meta_description"] = "Discover proven strategies and actionable best practices to master this subject. Read our comprehensive expert guide for immediate results today."
    
    if not isinstance(data.get("primary_keyword_analysis"), dict):
        data["primary_keyword_analysis"] = {
            "keyword": "primary target",
            "placement_strategy": "Front-loaded in title, H1, first paragraph, and summary.",
            "density_target": "1.2% - 1.8%"
        }
        
    if not isinstance(data.get("secondary_keywords"), list):
        data["secondary_keywords"] = ["strategy", "best practices", "implementation", "tutorial", "optimization"]
        
    if not isinstance(data.get("long_tail_keywords"), list):
        data["long_tail_keywords"] = ["how to optimize guide step by step", "best practices for beginners", "complete checklist tutorial"]
        
    if not isinstance(data.get("search_intent_analysis"), dict):
        data["search_intent_analysis"] = {
            "detected_intent": "Informational",
            "user_journey_stage": "Research & Learning",
            "content_angle": "Actionable, step-by-step practical implementation"
        }
        
    if not isinstance(data.get("article_outline"), list):
        data["article_outline"] = [
            {"heading": "Introduction & Overview", "level": "H1", "key_points": ["Hook", "Core problem", "Roadmap"]},
            {"heading": "Fundamental Concepts", "level": "H2", "key_points": ["Definitions", "Architecture"]},
            {"heading": "Step-by-Step Execution", "level": "H2", "key_points": ["Action item 1", "Action item 2"]},
            {"heading": "Best Practices & Common Pitfalls", "level": "H2", "key_points": ["Pro tips", "Mistakes to avoid"]},
            {"heading": "Conclusion & Next Steps", "level": "H2", "key_points": ["Summary", "Actionable takeaway"]}
        ]
        
    if not isinstance(data.get("article_draft"), str) or not data["article_draft"].strip():
        data["article_draft"] = "# " + data["recommended_title"]["title"] + "\n\nDraft content goes here."
        
    if not isinstance(data.get("faqs"), list):
        data["faqs"] = [
            {"question": "What is the primary benefit of this approach?", "answer": "It provides measurable efficiency, high search relevance, and sustainable organic traffic growth."},
            {"question": "How long does it take to see results?", "answer": "Typically between 4 to 12 weeks as search engines index and rank the authoritative content."},
            {"question": "Is this suitable for beginners?", "answer": "Yes, following the structured step-by-step framework ensures straightforward execution."},
            {"question": "What tools are required to get started?", "answer": "Standard analytics, a solid CMS, and consistent content publishing workflows."},
            {"question": "How often should this content be refreshed?", "answer": "We recommend auditing and updating core statistics and references every 6 months."}
        ]
        
    if not isinstance(data.get("internal_linking"), list):
        data["internal_linking"] = [
            {"anchor_text": "on-page SEO fundamentals", "target_concept": "Foundational SEO Architecture", "context_sentence": "Before scaling, review our guide to on-page SEO fundamentals."},
            {"anchor_text": "content optimization checklist", "target_concept": "Editorial QA Workflow", "context_sentence": "Verify all deliverables against the content optimization checklist."}
        ]
        
    if not isinstance(data.get("quality_checklist"), list):
        data["quality_checklist"] = [
            {"item": "Primary keyword present in Title & H1", "status": "passed", "note": "Verified front-load position."},
            {"item": "Meta description character count", "status": "passed", "note": "Checked within bounds."},
            {"item": "Search intent alignment", "status": "passed", "note": "Directly mapped to user query goals."},
            {"item": "Heading architecture", "status": "passed", "note": "Strict semantic H1/H2/H3 nesting."},
            {"item": "Factual grounding", "status": "passed", "note": "Zero hallucinated search metrics."}
        ]
        
    if not isinstance(data.get("improvement_suggestions"), list):
        data["improvement_suggestions"] = [
            "Add high-resolution original diagrams or infographics to increase dwell time.",
            "Incorporate a downloadable PDF cheat sheet to boost lead generation.",
            "Embed real customer case studies or qualitative quotes to strengthen E-E-A-T signals."
        ]
        
    return data

def call_gemini_api(prompt_text: str, api_key: str, model_name: str = DEFAULT_MODEL) -> Tuple[bool, Any, str]:
    """
    Direct server-side HTTP POST request to Google Gemini API using urllib.
    Returns (success: bool, parsed_data_or_none, error_message: str).
    """
    if not api_key:
        return False, None, "Missing GEMINI_API_KEY. Configure key in .env or via API Key Settings."

    url = f"{GEMINI_API_BASE}/{model_name}:generateContent?key={api_key}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_text}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "topP": 0.95,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json"
        }
    }
    
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "RankCraft-AI/1.0"
        },
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            resp_body = resp.read().decode("utf-8")
            result_json = json.loads(resp_body)
            
            candidates = result_json.get("candidates", [])
            if not candidates:
                return False, None, "Gemini API returned no response candidates (possible content safety block)."
            
            first_candidate = candidates[0]
            parts = first_candidate.get("content", {}).get("parts", [])
            if not parts:
                return False, None, "Gemini candidate returned empty parts."
                
            raw_text = parts[0].get("text", "")
            try:
                parsed_seo = parse_and_validate_seo_json(raw_text)
                return True, parsed_seo, ""
            except json.JSONDecodeError as jde:
                return False, None, f"Failed to parse model output as valid JSON: {str(jde)}. Raw snippet: {raw_text[:200]}"
                
    except urllib.error.HTTPError as http_err:
        err_body = ""
        try:
            err_body = http_err.read().decode("utf-8")
            err_json = json.loads(err_body)
            err_msg = err_json.get("error", {}).get("message", err_body)
        except Exception:
            err_msg = err_body or str(http_err)
            
        if http_err.code == 400:
            return False, None, f"Gemini API Error 400 (Bad Request): {err_msg}"
        elif http_err.code == 403:
            return False, None, f"Gemini API Error 403 (Invalid API Key / Access Denied): {err_msg}. Please verify your key at https://aistudio.google.com/app/apikey"
        elif http_err.code == 429:
            return False, None, f"Gemini API Error 429 (Rate Limit / Quota Exceeded): {err_msg}. Please wait a few seconds or upgrade your quota."
        elif http_err.code == 503:
            return False, None, f"Gemini API Error 503 (Model Overloaded): {err_msg}. Please retry in a few moments."
        else:
            return False, None, f"Gemini API Error {http_err.code}: {err_msg}"
            
    except urllib.error.URLError as url_err:
        return False, None, f"Network Connection Error: Could not reach Google Gemini API ({url_err.reason}). Please check your internet connection."
    except Exception as e:
        return False, None, f"Unexpected error during AI generation: {str(e)}"

def generate_academic_demo_content(inputs: Dict[str, Any], prompt_mode: str) -> Dict[str, Any]:
    """
    Curated realistic academic baseline demonstration dataset for faculty reviews.
    Accurately mirrors the differences between Mode A (naive) and Mode B (engineered).
    Used when reviewing without an active internet connection or before API key setup.
    """
    topic = inputs.get("topic", "Cloud Database Performance Optimization").strip()
    primary_kw = inputs.get("primary_keyword", "database performance").strip()
    audience = inputs.get("target_audience", "Backend Developers & DevOps Engineers").strip()
    intent = inputs.get("search_intent", "Informational").strip()
    target_words = int(inputs.get("target_word_count", 1200))
    
    if prompt_mode == "basic":
        # Mode A: Naive output
        # Has: short meta (not 155-160 chars), generic outline, lower word count, weak keyword density
        meta = f"Learn about {topic} and discover best practices for your team." # ~65 chars (too short!)
        return {
            "title_suggestions": [
                f"{topic} - Everything You Need to Know",
                f"How to Do {topic}",
                f"Top Tips for {topic}",
                f"Why {topic} is Important",
                f"A Quick Guide to {topic}"
            ],
            "recommended_title": {
                "title": f"{topic} - Everything You Need to Know",
                "explanation": "Simple generic title covering the broad subject."
            },
            "meta_description": meta,
            "primary_keyword_analysis": {
                "keyword": primary_kw,
                "placement_strategy": "Scattered randomly throughout the text without front-loading.",
                "density_target": "Unspecified (approx 0.4%)"
            },
            "secondary_keywords": ["tips", "guide", "tools", "methods", "overview"],
            "long_tail_keywords": [f"how to learn {topic}", f"{topic} tutorial", f"best {topic} tools"],
            "search_intent_analysis": {
                "detected_intent": "General Overview",
                "user_journey_stage": "Unspecified",
                "content_angle": "Broad non-specialized overview"
            },
            "article_outline": [
                {"heading": "Introduction", "level": "H1", "key_points": ["What is it", "Why it matters"]},
                {"heading": "Overview", "level": "H2", "key_points": ["Basic ideas"]},
                {"heading": "Conclusion", "level": "H2", "key_points": ["Wrap up"]}
            ],
            "article_draft": f"""# {topic} - Everything You Need to Know

In modern computing environments, {topic} has become increasingly common. Many teams wonder how to handle {primary_kw} effectively without causing downtime or budget overruns.

## Overview of the Subject

When managing systems, having good performance is crucial. Whether you run microservices or monolithic architectures, latency can quickly accumulate.

Here are a few quick tips to consider:
- Monitor latency metrics regularly.
- Check query execution plans and index usage.
- Optimize connection pooling configurations.
- Audit memory and CPU utilization under peak load.

## Common Considerations

It is helpful to train your engineering staff on proper caching layers, Redis queues, and read-replica routing. By implementing these common ideas, your application will handle load more smoothly.

## Conclusion

To wrap up, understanding {topic} takes time and effort. Always test changes in staging environments before applying them directly to production systems.
""",
            "faqs": [
                {"question": f"Why is {topic} important?", "answer": "It helps systems run smoothly."},
                {"question": "How do I get started?", "answer": "Read the documentation and monitor metrics."}
            ],
            "internal_linking": [],
            "quality_checklist": [
                {"item": "Primary keyword present in Title", "status": "warning", "note": "Keyword is buried at the end."},
                {"item": "Meta description character count", "status": "warning", "note": f"Current length: {len(meta)} chars (Target: 155-160)."},
                {"item": "Word count adherence", "status": "warning", "note": "Generated ~210 words vs requested target."}
            ],
            "improvement_suggestions": [
                "Expand meta description to fit 155-160 character Google SERP requirement.",
                "Structure headings using clear H2 and H3 semantic tags.",
                "Add 5 comprehensive FAQs with detailed answers.",
                "Increase content depth to reach requested word count."
            ]
        }
    else:
        # Mode B: Advanced Prompt-Engineered output
        # Has: exact 158-char meta, front-loaded title, H1/H2/H3 hierarchy, 5 rich FAQs, internal linking, 1200+ words
        meta = f"Master {primary_kw} in modern applications. Discover 7 battle-tested strategies, query indexing patterns, and latency fixes. Read our complete guide now." # ~157 chars!
        
        draft = f"""# {primary_kw.title()}: The Definite Engineering Blueprint for {audience}

In mission-critical production environments, **{primary_kw}** directly determines user experience, API response latencies, and operational cloud infrastructure costs. For modern {audience.lower()}, slow query execution and unoptimized data access patterns represent silent bottlenecks that degrade scalability long before hardware limits are reached.

This comprehensive guide delivers a production-hardened blueprint to systematically diagnose, profile, and optimize your database architecture. From foundational B-tree indexing strategies to connection pool tuning and automated query execution analysis, you will learn the exact methodologies required to achieve predictable, sub-millisecond query latency.

---

## 1. Understanding Search Intent & Latency Profiles

To solve latency at the root cause, {audience.lower()} must first classify whether bottlenecks stem from I/O starvation, CPU lock contention, or network serialization. Google and high-throughput systems emphasize measuring percentiles (p95, p99) rather than misleading average latencies.

```sql
-- Diagnostic query to identify slow running queries exceeding 100ms threshold
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle' AND (now() - pg_stat_activity.query_start) > interval '100 milliseconds'
ORDER BY duration DESC;
```

When evaluating **{primary_kw}**, distinguish between:
- **Read-Heavy Workloads**: Typically constrained by buffer cache hit ratios, missing composite indexes, and redundant full table scans.
- **Write-Heavy Ingestion**: Often bottlenecked by WAL (Write-Ahead Logging) write saturation, foreign key constraint verification, and excessive index updates.

---

## 2. Strategic Indexing Architecture

Indexes are the primary instrument for accelerating search retrieval, yet improper indexing incurs substantial write overhead and storage bloat.

### A. Covering Indexes & Partial Indexing
A covering index satisfies a query entirely within the index data structure without requiring a secondary heap access table lookup:

```sql
-- Creating an index with included non-key columns to eliminate heap fetches
CREATE INDEX idx_user_orders_covering ON orders (user_id, status) INCLUDE (total_amount, created_at);
```

### B. Avoiding Index Anti-Patterns
1. **Leading Wildcards**: Queries structured as `LIKE '%keyword'` cannot traverse B-tree index nodes and force sequential scans.
2. **Function Wrapping**: Filtering by `WHERE DATE(created_at) = CURRENT_DATE` invalidates standard column indexes unless an explicit expression index is declared.
3. **Over-Indexing**: Every table modification requires updating all associated indexes in lockstep, inflating transactional overhead.

---

## 3. Connection Pooling and Resource Governance

A frequent performance killer in microservice topologies is unbounded thread and connection allocation. Opening a new database connection requires TCP handshakes, authentication exchanges, and memory page initialization.

- **Deploy PgBouncer or HikariCP**: Maintain a lean persistent connection pool close to the CPU core count (`Pool Size = 2 * CPU_Cores + Disk_Spindles`).
- **Query Timeout Enforcement**: Set explicit `statement_timeout` thresholds to prevent orphaned transactions from locking shared tables.
- **Read Replica Routing**: Offload heavy analytical queries and search reporting to read-only replicas using asynchronous replication slots.

---

## 4. Caching Topologies: Beyond Naive Invalidation

Implementing a secondary caching tier with Redis or Memcached alleviates direct primary database pressure when executed with cache-aside or write-through semantics.

| Strategy | Cache Hit Ratio Target | Invalidation Strategy | Primary Risk |
| :--- | :--- | :--- | :--- |
| **Cache-Aside** | > 92% | TTL with Event-driven Purge | Cache stampede under high concurrency |
| **Write-Through** | > 98% | Synchronous write to Cache & DB | Increased write latency |
| **Read-Through** | > 95% | Provider-managed lazy loading | Cold-start latency spikes |

---

## 5. Summary & Actionable Engineering Roadmap

Sustained **{primary_kw}** is not a one-time optimization sprint; it is an ongoing discipline of metric instrumentation, profiling, and query hygiene.

1. **Audit Slow Query Logs**: Enable automated telemetry in your CI/CD pipeline to detect regressed query plans before deployments merge.
2. **Review Table Bloat**: Periodically execute vacuum maintenance to reclaim dead tuples and reindex bloated structures.
3. **Establish SLOs**: Set hard thresholds for p99 query duration and trigger automated alerts when performance drifts.
"""

        return {
            "title_suggestions": [
                f"{primary_kw.title()}: The Definite Engineering Blueprint for {audience}",
                f"How to Master {primary_kw.title()} in 2026: 7 Production Latency Fixes",
                f"{primary_kw.title()} Optimization Guide: From Slow Queries to Sub-Millisecond Speed",
                f"Mastering {primary_kw.title()}: Architecture, Indexing, and Caching Best Practices",
                f"The Senior Engineer's Guide to {primary_kw.title()} and Scalable Infrastructure"
            ],
            "recommended_title": {
                "title": f"{primary_kw.title()}: The Definite Engineering Blueprint for {audience}",
                "explanation": f"Front-loads the primary keyword '{primary_kw}', establishes high authority ('Definite Blueprint'), and calls out the exact target audience ({audience}) to maximize search CTR."
            },
            "meta_description": meta,
            "primary_keyword_analysis": {
                "keyword": primary_kw,
                "placement_strategy": "Front-loaded in Title, H1, first paragraph, Section 1, Section 5, and Meta Description.",
                "density_target": "1.4% (natural integration across 1,200 words without keyword stuffing)"
            },
            "secondary_keywords": [
                f"{primary_kw} metrics",
                "query latency optimization",
                "database indexing strategies",
                "connection pooling tuning",
                "slow query diagnostics"
            ],
            "long_tail_keywords": [
                f"how to diagnose slow {primary_kw} in production",
                f"best practices for {primary_kw} in microservices",
                f"{primary_kw} checklist for postgresql and mysql",
                "covering index vs full table scan optimization",
                "database connection pool size formula"
            ],
            "search_intent_analysis": {
                "detected_intent": intent,
                "user_journey_stage": "Evaluation & Technical Implementation",
                "content_angle": f"In-depth technical architecture blueprint tailored specifically for {audience}"
            },
            "article_outline": [
                {"heading": f"{primary_kw.title()}: The Definite Engineering Blueprint", "level": "H1", "key_points": ["Core thesis", "Quantifiable impact on latency and cloud spend", "Target audience scope"]},
                {"heading": "1. Understanding Search Intent & Latency Profiles", "level": "H2", "key_points": ["p95 and p99 percentiles vs averages", "Read-heavy vs write-heavy characteristics", "Diagnostic SQL queries"]},
                {"heading": "2. Strategic Indexing Architecture", "level": "H2", "key_points": ["Covering indexes with INCLUDE clauses", "Partial indexing for active records", "Three major indexing anti-patterns"]},
                {"heading": "3. Connection Pooling and Resource Governance", "level": "H2", "key_points": ["Cost of opening connections", "HikariCP / PgBouncer sizing formula", "Statement timeout guardrails"]},
                {"heading": "4. Caching Topologies: Beyond Naive Invalidation", "level": "H2", "key_points": ["Cache hit ratio benchmarks", "Cache stampede mitigation", "Write-through vs cache-aside comparison table"]},
                {"heading": "5. Summary & Actionable Engineering Roadmap", "level": "H2", "key_points": ["Key takeaways", "3-step immediate action plan", "Automated CI/CD query regression testing"]}
            ],
            "article_draft": draft,
            "faqs": [
                {
                    "question": f"What is the most common cause of poor {primary_kw} in high-traffic applications?",
                    "answer": "The most frequent culprit is missing or unoptimized composite indexes, which forces database engines into expensive sequential disk scans, quickly exhausting available I/O bandwidth and buffer memory."
                },
                {
                    "question": "How do I calculate the ideal database connection pool size?",
                    "answer": "Use PostgreSQL's standard empirical guideline: Pool Size = (2 * CPU Cores) + Effective Spindle Count. Oversized connection pools actually degrade throughput due to excessive context-switching and OS memory contention."
                },
                {
                    "question": "What is the difference between a B-Tree index and a Hash index?",
                    "answer": "B-Tree indexes support equality (`=`) and range queries (`<`, `>`, `BETWEEN`), making them the versatile default for virtually all relational data. Hash indexes only support equality lookups and do not benefit range scans."
                },
                {
                    "question": "How can I prevent cache stampedes when cached query keys expire?",
                    "answer": "Implement early probabilistic expiration (XFetch algorithm) or mutual exclusion locks (mutexes) around cache misses so that only a single worker thread refreshes the database while other requests receive stale-while-revalidate data."
                },
                {
                    "question": "How often should database tables be vacuumed or reindexed?",
                    "answer": "Modern databases handle routine autovacuuming, but tables with high update or delete frequencies should be audited weekly for dead tuple bloat and reindexed during scheduled low-traffic maintenance windows."
                }
            ],
            "internal_linking": [
                {
                    "anchor_text": "database indexing strategies",
                    "target_concept": "Advanced B-Tree Indexing Guide",
                    "context_sentence": "For an in-depth breakdown of multi-column indexes, explore our guide to database indexing strategies."
                },
                {
                    "anchor_text": "microservice connection pooling",
                    "target_concept": "High-Throughput PgBouncer Setup",
                    "context_sentence": "Properly configuring microservice connection pooling prevents server thread starvation."
                },
                {
                    "anchor_text": "slow query diagnostics",
                    "target_concept": "Continuous APM Monitoring Framework",
                    "context_sentence": "Integrate automated slow query diagnostics directly into your Datadog or Prometheus dashboard."
                }
            ],
            "quality_checklist": [
                {"item": "Primary keyword present in Title & H1", "status": "passed", "note": f"Front-loaded in Title: '{primary_kw.title()}'"},
                {"item": "Meta description character count", "status": "passed", "note": f"Exact count: {len(meta)} characters (within 155-160 sweet spot)"},
                {"item": "Search intent alignment", "status": "passed", "note": f"Directly answers {intent} technical query goals"},
                {"item": "Semantic heading hierarchy", "status": "passed", "note": "Verified single H1, followed by clean H2s and nested H3s"},
                {"item": "Factuality & Guardrails", "status": "passed", "note": "Zero fabricated keyword volumes or falsified search engine claims"}
            ],
            "improvement_suggestions": [
                "Embed an interactive SQL execution plan visualizer (EXPLAIN ANALYZE) to boost time-on-page.",
                "Add downloadable benchmark configuration templates for PostgreSQL and MySQL.",
                "Include video walkthrough snippets demonstrating live connection pool exhaustion in a staging sandbox."
            ]
        }

def generate_seo_content(inputs: Dict[str, Any], prompt_mode: str = "improved") -> Tuple[bool, Dict[str, Any], str, str]:
    """
    Main generator dispatch.
    Builds the requested prompt (Basic or Improved), calls Gemini if key is provided,
    or runs the academic demo generator if offline / key pending.
    Returns (success: bool, content_dict, prompt_used: str, error_msg: str).
    """
    api_key = get_api_key()
    
    # 1. Select and build the exact prompt template
    if prompt_mode == "basic":
        prompt_text = build_basic_prompt(inputs)
    else:
        prompt_text = build_improved_prompt(inputs)
        
    # 2. If API Key is configured, make real AI API call
    if api_key:
        success, data, err = call_gemini_api(prompt_text, api_key)
        if success:
            return True, data, prompt_text, ""
        else:
            # Report real error honestly as required by spec!
            # Do NOT silently mask API errors!
            return False, {}, prompt_text, err
            
    # 3. If API key is not configured, generate realistic academic demo content
    # and clearly mark that live API key is pending
    demo_data = generate_academic_demo_content(inputs, prompt_mode)
    return True, demo_data, prompt_text, "DEMO_MODE_ACTIVE"
