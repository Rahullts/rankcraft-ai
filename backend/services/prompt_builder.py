"""
Prompt Engineering Templates and Generator for RankCraft AI.
Demonstrates Mode A (Basic Prompt) vs Mode B (Improved Prompt) with rigorous academic techniques.
"""

from typing import Dict, Any

PROMPT_TECHNIQUES_INFO = {
    "role_prompting": {
        "name": "Role & Persona Prompting",
        "description": "Establishes domain authority, tone, and cognitive focus by assigning the persona of a veteran SEO Content Architect.",
        "academic_reference": "Reynolds & McDonell (2021); White et al. (2023) - Prompt Pattern Catalog"
    },
    "context_audience_calibration": {
        "name": "Context & Audience Calibration",
        "description": "Grounds the LLM with target audience knowledge level, regional search idioms, and industry semantics.",
        "academic_reference": "Brown et al. (2020) - Language Models are Few-Shot Learners"
    },
    "search_intent_grounding": {
        "name": "Search Intent Alignment",
        "description": "Differentiates informational, commercial, and transactional query journeys to match user intent directly.",
        "academic_reference": "Google Search Quality Rater Guidelines (E-E-A-T Framework)"
    },
    "explicit_task_decomposition": {
        "name": "Task Decomposition & Structured Output",
        "description": "Breaks the generation down into 12 structured modular sections instead of an undifferentiated essay.",
        "academic_reference": "Kojima et al. (2022); Wei et al. (2022) - Chain-of-Thought & Multi-Step Reasoning"
    },
    "keyword_density_constraints": {
        "name": "Negative & Positive Keyword Constraints",
        "description": "Enforces natural keyword integration in Title, H1, first 100 words, and limits density to 1.2-1.8% to avoid keyword stuffing.",
        "academic_reference": "Constraint-Directed Prompting (Lu et al., 2022)"
    },
    "length_boundary_specifications": {
        "name": "Exact Character & Word Boundary Specifications",
        "description": "Specifies strict limits (e.g. Meta description 155-160 characters; article target word count +/- 10%).",
        "academic_reference": "Madaan et al. (2023) - Self-Refine / Boundary Adherence"
    },
    "few_shot_exemplars": {
        "name": "Few-Shot In-Context Demonstrations",
        "description": "Provides high-CTR title patterns and meta description formulas to prime pattern completion.",
        "academic_reference": "Min et al. (2022) - Rethinking the Role of Demonstrations"
    },
    "factuality_hallucination_guardrails": {
        "name": "Factuality & Anti-Hallucination Guardrails",
        "description": "Explicitly forbids fabricating search volume, fake statistics, or unverifiable claims.",
        "academic_reference": "Ji et al. (2023) - Survey of Hallucination in Natural Language Generation"
    },
    "json_schema_enforcement": {
        "name": "Deterministic JSON Schema Enforcement",
        "description": "Requires output strictly conforming to machine-validated JSON schema for reliable parsing.",
        "academic_reference": "Structured Generation & Formal Grammar Decoding"
    }
}

def build_basic_prompt(inputs: Dict[str, Any]) -> str:
    """
    Mode A: Unengineered Baseline Prompt.
    A simple, unstructured prompt typical of novice users.
    """
    topic = inputs.get("topic", "Digital Marketing")
    primary_kw = inputs.get("primary_keyword", "")
    tone = inputs.get("tone", "Professional")
    word_count = inputs.get("target_word_count", 1000)
    language = inputs.get("language", "English").strip()

    prompt = f"""Write an SEO blog post about {topic}.
Primary keyword: {primary_kw}
Tone: {tone}
Length: around {word_count} words.

CRITICAL LANGUAGE INSTRUCTION: Write the entire output strictly and completely in {language} (Default: English). All titles, meta description, outline, article, and FAQs must be in {language}. Do not mix languages or translate partially.

Give me titles, meta description, outline, article, keywords, and FAQs in JSON format."""
    return prompt

def build_improved_prompt(inputs: Dict[str, Any]) -> str:
    """
    Mode B: Advanced Engineered Prompt.
    Incorporates role prompting, intent alignment, boundary constraints,
    few-shot examples, negative constraints, and rigid JSON schema enforcement.
    """
    topic = inputs.get("topic", "").strip()
    target_audience = inputs.get("target_audience", "Industry Professionals").strip()
    industry = inputs.get("industry", "Technology").strip()
    target_country = inputs.get("target_country", "Global").strip()
    primary_keyword = inputs.get("primary_keyword", "").strip()
    secondary_kws = inputs.get("secondary_keywords", [])
    if isinstance(secondary_kws, str):
        secondary_kws = [k.strip() for k in secondary_kws.split(",") if k.strip()]
    secondary_kw_str = ", ".join(secondary_kws) if secondary_kws else "None specified"
    
    search_intent = inputs.get("search_intent", "Informational").strip()
    content_type = inputs.get("content_type", "Comprehensive Guide").strip()
    tone = inputs.get("tone", "Educational & Actionable").strip()
    language = inputs.get("language", "English (US)").strip()
    target_word_count = inputs.get("target_word_count", 1200)
    reference_material = inputs.get("reference_material", "").strip()

    reference_section = ""
    if reference_material:
        reference_section = f"""
## REFERENCE MATERIAL & CONTEXT NOTES:
\"\"\"{reference_material}\"\"\"
Synthesize insights from the reference material without verbatim plagiarism.
"""

    prompt = f"""# SYSTEM ROLE & PERSONA
You are RankCraft AI's Lead SEO Content Strategist and Senior Search Quality Architect. You combine deep knowledge of Google's Search Quality Rater Guidelines (E-E-A-T: Experience, Expertise, Authoritativeness, and Trustworthiness) with high-converting digital copywriting and technical on-page SEO.

---

# CONTEXT & SPECIFICATIONS
- **Core Topic**: {topic}
- **Industry / Vertical**: {industry}
- **Target Audience Persona**: {target_audience}
- **Geographic Market / Search Dialect**: {target_country} ({language})
- **Primary Target Keyword**: "{primary_keyword}"
- **Secondary Keywords**: {secondary_kw_str}
- **Target Search Intent**: {search_intent}
- **Content Format**: {content_type}
- **Writing Tone & Voice**: {tone}
- **Target Article Word Count**: {target_word_count} words (+/- 8% adherence)
{reference_section}
---

# PROMPT ENGINEERING CONSTRAINTS & DIRECTIVES

### 0. Mandatory Output Language Directive (STRICT)
- The entire generated response across all 12 modules (title suggestions, recommended title, meta description, keyword analysis, outline, article draft, FAQs, internal links, and checklist) MUST be written strictly and consistently in {language} (Default: English).
- Do NOT switch languages, translate headings partially, or mix languages based on the target country/market {target_country}.

### 1. Title Strategy (Few-Shot Pattern Guidance)
Generate 5 distinct titles applying proven high-CTR SEO patterns:
- How-To / Process: "How to Master [Keyword] in [Year]: Complete Guide"
- Power / Direct: "[Keyword]: The Definite Blueprint for [Audience]"
- Comparison / Value: "[Keyword] Explained: What [Audience] Must Know"
Select the single best recommended title and provide a crisp 2-sentence rationale covering search psychology and front-loaded keyword placement.

### 2. Meta Description Length Constraint (STRICT)
- TARGET: Exactly 155 to 160 characters (including spaces and punctuation).
- Must include the primary keyword "{primary_keyword}" naturally in the first 110 characters.
- Must end with a compelling action-oriented call to action (e.g., "Read the full guide now.", "Learn the 5 key strategies.").

### 3. Search Intent Grounding
- Calibrate headings, depth, and vocabulary to **{search_intent}** intent.
- Address the user's primary problem in the opening 100 words.
- Structure for search journey progression (Discovery -> Evaluation -> Decision).

### 4. Keyword Integration Rules (Anti-Stuffing)
- Integrate "{primary_keyword}" in: (a) Title, (b) H1, (c) opening 100 words, (d) at least one H2, (e) concluding summary.
- Natural keyword density target: 1.2% - 1.8%.
- Do NOT fabricate exact Google search volumes, CPC, or ranking metrics; label keyword suggestions as contextual semantic recommendations.

### 5. Article Outline & Draft Depth
- The article draft must be thoroughly developed (aiming close to {target_word_count} words), formatted in Markdown with proper `# H1`, `## H2`, and `### H3` hierarchy.
- Include actionable bullet points, clear takeaways, and concrete real-world examples.
- Include 5 FAQs with thorough 2-4 sentence answers addressing common query variations.
- Provide 3-5 high-relevance internal linking anchor text suggestions with target conceptual topics.

### 6. Quality Checklist & Actionable Improvements
- Provide an objective 5-point quality checklist assessing E-E-A-T readiness.
- Provide 3 concrete recommendations for next-stage optimization.

---

# DETERMINISTIC OUTPUT FORMAT
You MUST respond with valid, parseable JSON only. Do not include markdown code block wrappers (like ```json), commentary, or introductory text.

Follow this exact JSON structure:
{{
  "title_suggestions": [
    "Title 1",
    "Title 2",
    "Title 3",
    "Title 4",
    "Title 5"
  ],
  "recommended_title": {{
    "title": "Selected Best Title",
    "explanation": "Why this title wins based on CTR, search intent, and keyword front-loading."
  }},
  "meta_description": "A precise 155-160 character description containing the primary keyword and strong CTA.",
  "primary_keyword_analysis": {{
    "keyword": "{primary_keyword}",
    "placement_strategy": "Front-loaded in H1, first paragraph, and concluding summary.",
    "density_target": "1.2% to 1.8%"
  }},
  "secondary_keywords": [
    "Secondary Keyword 1",
    "Secondary Keyword 2",
    "Secondary Keyword 3",
    "Secondary Keyword 4",
    "Secondary Keyword 5"
  ],
  "long_tail_keywords": [
    "Long tail variation 1",
    "Long tail variation 2",
    "Long tail variation 3",
    "Long tail variation 4",
    "Long tail variation 5"
  ],
  "search_intent_analysis": {{
    "detected_intent": "{search_intent}",
    "user_journey_stage": "Consideration / Information Seeking",
    "content_angle": "Comprehensive, actionable blueprint tailored for {target_audience}"
  }},
  "article_outline": [
    {{
      "heading": "H1 Main Topic",
      "level": "H1",
      "key_points": ["Hook", "Core problem statement", "Primary promise"]
    }},
    {{
      "heading": "H2 Major Section 1",
      "level": "H2",
      "key_points": ["Point A", "Point B"]
    }},
    {{
      "heading": "H3 Sub-topic",
      "level": "H3",
      "key_points": ["Granular tactic"]
    }}
  ],
  "article_draft": "# Complete Markdown Article Draft\\n\\n[Full comprehensive draft content with headings, paragraphs, and takeaways...]",
  "faqs": [
    {{
      "question": "Question 1?",
      "answer": "Clear, direct, actionable answer."
    }},
    {{
      "question": "Question 2?",
      "answer": "Clear, direct, actionable answer."
    }},
    {{
      "question": "Question 3?",
      "answer": "Clear, direct, actionable answer."
    }},
    {{
      "question": "Question 4?",
      "answer": "Clear, direct, actionable answer."
    }},
    {{
      "question": "Question 5?",
      "answer": "Clear, direct, actionable answer."
    }}
  ],
  "internal_linking": [
    {{
      "anchor_text": "strategic anchor text",
      "target_concept": "Related topic or core guide",
      "context_sentence": "Sentence illustrating where to place the link naturally."
    }}
  ],
  "quality_checklist": [
    {{
      "item": "Primary keyword present in Title & H1",
      "status": "passed",
      "note": "Optimized front-load positioning"
    }},
    {{
      "item": "Meta description character count",
      "status": "passed",
      "note": "Strictly between 155-160 characters"
    }},
    {{
      "item": "Search intent match",
      "status": "passed",
      "note": "Aligned directly with user expectations"
    }},
    {{
      "item": "Heading hierarchy (H1 -> H2 -> H3)",
      "status": "passed",
      "note": "Clean semantic document structure"
    }},
    {{
      "item": "E-E-A-T Demonstration",
      "status": "passed",
      "note": "Concrete examples and authoritative tone"
    }}
  ],
  "improvement_suggestions": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3"
  ]
}}"""
    return prompt
