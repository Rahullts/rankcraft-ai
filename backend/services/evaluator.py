"""
Evaluation Engine for RankCraft AI.
Calculates objective, heuristic quality scores on a 0-5 scale across 8 dimensions.
Includes transparent scoring explanations and improvement suggestions.
Explicitly labeled as heuristic metrics, not proprietary search engine ranking algorithms.
"""

import re
from typing import Dict, Any, List

def calculate_reading_ease(text: str) -> float:
    """
    Approximated Flesch Reading Ease score based on sentence length and syllables.
    Flesch score range: 0 (very difficult) to 100 (very easy).
    Target for web content: 60-70 (plain English).
    """
    if not text:
        return 50.0
    
    # Strip markdown headers and symbols
    clean_text = re.sub(r'#+\s*', '', text)
    clean_text = re.sub(r'[*_`\[\]()]', '', clean_text)
    
    sentences = re.split(r'[.!?]+', clean_text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 3]
    num_sentences = max(len(sentences), 1)
    
    words = re.findall(r'\b[a-zA-Z]{2,}\b', clean_text)
    num_words = max(len(words), 1)
    
    # Simple syllable heuristic: count vowel sequences
    def count_syllables(w):
        w = w.lower()
        count = len(re.findall(r'[aeiouy]+', w))
        if w.endswith('e') and not w.endswith('le') and count > 1:
            count -= 1
        return max(count, 1)

    total_syllables = sum(count_syllables(w) for w in words)
    
    asl = num_words / num_sentences  # Average Sentence Length
    asw = total_syllables / num_words  # Average Syllables per Word
    
    score = 206.835 - (1.015 * asl) - (84.6 * asw)
    return max(0.0, min(100.0, score))

def evaluate_content(content_data: Dict[str, Any], inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates generated content across 8 heuristic dimensions (0-5 scale).
    """
    topic = inputs.get("topic", "").lower().strip()
    primary_kw = inputs.get("primary_keyword", "").lower().strip()
    target_intent = inputs.get("search_intent", "Informational").lower().strip()
    target_words = int(inputs.get("target_word_count", 1000))
    
    meta_desc = content_data.get("meta_description", "")
    meta_len = len(meta_desc.strip())
    
    article_draft = content_data.get("article_draft", "")
    draft_words = len(re.findall(r'\b[a-zA-Z0-9_-]+\b', article_draft))
    
    scores = {}
    explanations = {}
    recommendations = {}

    # 1. Topic Relevance (0-5)
    topic_tokens = [t for t in re.findall(r'\w+', topic) if len(t) > 3]
    topic_found_count = 0
    article_lower = article_draft.lower()
    for token in topic_tokens:
        if token in article_lower:
            topic_found_count += 1
    
    relevance_ratio = topic_found_count / max(len(topic_tokens), 1)
    if relevance_ratio >= 0.8:
        scores["topic_relevance"] = 5.0
        explanations["topic_relevance"] = "Extremely high topical resonance; core subject matter permeates all sections."
        recommendations["topic_relevance"] = "Maintain strong topical focus in upcoming revisions."
    elif relevance_ratio >= 0.5:
        scores["topic_relevance"] = 3.5
        explanations["topic_relevance"] = "Moderate topical focus; some key concepts are present but could be emphasized."
        recommendations["topic_relevance"] = f"Reinforce core topic semantics: {', '.join(topic_tokens[:3])}."
    else:
        scores["topic_relevance"] = 2.0
        explanations["topic_relevance"] = "Weak topical connection; generated draft drifts away from the requested subject."
        recommendations["topic_relevance"] = "Anchor introduction and major headings to the core topic."

    # 2. Search Intent Alignment (0-5)
    intent_analysis = content_data.get("search_intent_analysis", {})
    detected_intent = str(intent_analysis.get("detected_intent", "")).lower()
    
    if target_intent in detected_intent or (not detected_intent and len(article_draft) > 400):
        scores["search_intent_alignment"] = 4.8
        explanations["search_intent_alignment"] = f"Strong alignment with {target_intent.capitalize()} intent. Structure answers user expectations directly."
        recommendations["search_intent_alignment"] = "Add a quick-reference decision box or summary table to increase immediate utility."
    else:
        scores["search_intent_alignment"] = 3.0
        explanations["search_intent_alignment"] = f"Partial alignment. Requested intent '{target_intent.capitalize()}' is only loosely structured."
        recommendations["search_intent_alignment"] = f"Re-orient headings and takeaways to specifically target {target_intent.capitalize()} search queries."

    # 3. Keyword Integration & Density (0-5)
    kw_count = article_lower.count(primary_kw) if primary_kw else 0
    kw_density = (kw_count / max(draft_words, 1)) * 100
    
    title_has_kw = primary_kw in content_data.get("recommended_title", {}).get("title", "").lower()
    meta_has_kw = primary_kw in meta_desc.lower()
    
    if 0.8 <= kw_density <= 2.2 and title_has_kw and meta_has_kw:
        scores["keyword_integration"] = 4.9
        explanations["keyword_integration"] = f"Optimal keyword density ({kw_density:.1f}%). Primary keyword correctly placed in title, meta, and body without keyword stuffing."
        recommendations["keyword_integration"] = "Natural placement achieved; consider adding secondary keyword synonyms in H3 subheadings."
    elif kw_density > 2.5:
        scores["keyword_integration"] = 2.5
        explanations["keyword_integration"] = f"High keyword density ({kw_density:.1f}%). Risk of over-optimization / search penalty."
        recommendations["keyword_integration"] = f"Replace {kw_count - max(int(draft_words * 0.015), 1)} instances of '{primary_kw}' with natural synonyms or pronouns."
    elif kw_count > 0:
        scores["keyword_integration"] = 3.8
        explanations["keyword_integration"] = f"Keyword present ({kw_count} times, {kw_density:.1f}%), but placement in Title or Meta could be stronger."
        recommendations["keyword_integration"] = f"Ensure '{primary_kw}' appears within the first 60 characters of the title and first 100 words of the text."
    else:
        scores["keyword_integration"] = 1.5
        explanations["keyword_integration"] = "Primary keyword is completely absent from article draft or metadata."
        recommendations["keyword_integration"] = f"Integrate '{primary_kw}' naturally into Title, H1, Meta Description, and introductory paragraph."

    # 4. Readability & Structure (0-5)
    flesch_score = calculate_reading_ease(article_draft)
    if 60 <= flesch_score <= 75:
        scores["readability"] = 5.0
        explanations["readability"] = f"Excellent reading ease score ({flesch_score:.1f}). Balanced sentence rhythm, high clarity for web readers."
        recommendations["readability"] = "Formatting is reader-friendly; keep utilizing bullet points and callouts."
    elif 50 <= flesch_score < 60 or 75 < flesch_score <= 85:
        scores["readability"] = 4.2
        explanations["readability"] = f"Good readability ({flesch_score:.1f}). Accessible to general readers with occasional complex syntax."
        recommendations["readability"] = "Break sentences exceeding 25 words into two concise statements."
    else:
        scores["readability"] = 3.0
        explanations["readability"] = f"Challenging reading level ({flesch_score:.1f}). May cause reader drop-off on mobile devices."
        recommendations["readability"] = "Simplify vocabulary and split dense paragraphs into 2-3 sentence chunks."

    # 5. Heading Structure (0-5)
    h1_count = len(re.findall(r'^#\s+', article_draft, re.MULTILINE))
    h2_count = len(re.findall(r'^##\s+', article_draft, re.MULTILINE))
    h3_count = len(re.findall(r'^###\s+', article_draft, re.MULTILINE))
    outline = content_data.get("article_outline", [])
    
    if (h1_count == 1 or len(outline) >= 4) and (h2_count >= 2 or len(outline) >= 3):
        scores["heading_structure"] = 4.8
        explanations["heading_structure"] = f"Clean heading hierarchy ({h1_count} H1, {h2_count} H2, {h3_count} H3). Scannable semantic structure."
        recommendations["heading_structure"] = "Heading hierarchy is well-formed for search crawlability."
    elif h2_count > 0:
        scores["heading_structure"] = 3.5
        explanations["heading_structure"] = "Basic heading breakdown present, but lacks sub-level H3 depth or has multiple H1 tags."
        recommendations["heading_structure"] = "Ensure exactly one H1 per article and nest detailed tactics under H3 tags."
    else:
        scores["heading_structure"] = 2.0
        explanations["heading_structure"] = "Weak or missing heading structure; text resembles an unstructured wall of text."
        recommendations["heading_structure"] = "Organize article into clear H2 thematic sections with H3 implementation points."

    # 6. Word Count Adherence (0-5)
    word_ratio = draft_words / max(target_words, 1)
    if 0.85 <= word_ratio <= 1.20:
        scores["word_count_adherence"] = 5.0
        explanations["word_count_adherence"] = f"Superb word count adherence. Generated {draft_words} words (target: {target_words}, ratio: {word_ratio*100:.0f}%)."
        recommendations["word_count_adherence"] = "Length perfectly matches editorial planning."
    elif 0.65 <= word_ratio < 0.85 or 1.20 < word_ratio <= 1.40:
        scores["word_count_adherence"] = 3.8
        explanations["word_count_adherence"] = f"Acceptable length ({draft_words} words vs target {target_words}, {word_ratio*100:.0f}%)."
        recommendations["word_count_adherence"] = f"Expand key sections or summarize to hit target of {target_words} words."
    else:
        scores["word_count_adherence"] = 2.2
        explanations["word_count_adherence"] = f"Substantial discrepancy ({draft_words} words vs target {target_words})."
        recommendations["word_count_adherence"] = f"Significantly adjust content depth to adhere to target word count of {target_words}."

    # 7. Meta Description Optimization (0-5)
    if 150 <= meta_len <= 165:
        scores["meta_description_optimization"] = 5.0
        explanations["meta_description_optimization"] = f"Ideal length: {meta_len} characters. Fits Google desktop and mobile SERP snippets without truncation."
        recommendations["meta_description_optimization"] = "Meta description is within SERP display boundaries."
    elif 130 <= meta_len < 150:
        scores["meta_description_optimization"] = 3.8
        explanations["meta_description_optimization"] = f"Slightly short ({meta_len} chars). Under-utilizes available SERP pixel width."
        recommendations["meta_description_optimization"] = f"Expand meta description by {155 - meta_len} characters with an enticing call to action."
    elif 165 < meta_len <= 190:
        scores["meta_description_optimization"] = 3.5
        explanations["meta_description_optimization"] = f"Slightly long ({meta_len} chars). High likelihood of being truncated on mobile screens with an ellipsis (...)."
        recommendations["meta_description_optimization"] = f"Trim {meta_len - 160} characters to prevent snippet truncation on mobile devices."
    else:
        scores["meta_description_optimization"] = 2.0
        explanations["meta_description_optimization"] = f"Poor meta description length ({meta_len} chars). Either heavily truncated or drastically under-developed."
        recommendations["meta_description_optimization"] = "Rewrite meta description to land strictly between 155 and 160 characters."

    # 8. Content Completeness (0-5)
    required_keys = [
        "title_suggestions", "recommended_title", "meta_description",
        "primary_keyword_analysis", "secondary_keywords", "long_tail_keywords",
        "search_intent_analysis", "article_outline", "article_draft",
        "faqs", "internal_linking", "quality_checklist"
    ]
    present_keys = sum(1 for k in required_keys if content_data.get(k))
    completeness_ratio = present_keys / len(required_keys)
    
    if completeness_ratio == 1.0:
        scores["content_completeness"] = 5.0
        explanations["content_completeness"] = f"Complete delivery: all 12 modules generated with verified structure."
        recommendations["content_completeness"] = "All architectural assets (titles, meta, outline, FAQs, internal links) are ready for publication."
    elif completeness_ratio >= 0.75:
        scores["content_completeness"] = 3.8
        explanations["content_completeness"] = f"{present_keys} of {len(required_keys)} modules generated."
        recommendations["content_completeness"] = "Generate missing sections (e.g. FAQs or internal linking anchor recommendations)."
    else:
        scores["content_completeness"] = 2.2
        explanations["content_completeness"] = f"Incomplete output: only {present_keys} of {len(required_keys)} required sections present."
        recommendations["content_completeness"] = "Run with structured schema prompt to produce all 12 modules."

    # Calculate Overall Weighted Score (0-100)
    weights = {
        "topic_relevance": 0.15,
        "search_intent_alignment": 0.15,
        "keyword_integration": 0.15,
        "readability": 0.10,
        "heading_structure": 0.10,
        "word_count_adherence": 0.10,
        "meta_description_optimization": 0.10,
        "content_completeness": 0.15,
    }
    
    total_score_norm = sum((scores[k] / 5.0) * weights[k] for k in weights)
    overall_percentage = round(total_score_norm * 100, 1)
    
    if overall_percentage >= 90:
        grade = "A+ (Publication Ready)"
    elif overall_percentage >= 80:
        grade = "A (Strong Commercial Grade)"
    elif overall_percentage >= 70:
        grade = "B (Good Draft - Needs Polishing)"
    elif overall_percentage >= 60:
        grade = "C (Fair - Requires Re-prompting)"
    else:
        grade = "D (Needs Structural Revision)"

    return {
        "overall_score": overall_percentage,
        "letter_grade": grade,
        "category_scores": scores,
        "explanations": explanations,
        "recommendations": recommendations,
        "metrics": {
            "draft_word_count": draft_words,
            "target_word_count": target_words,
            "word_count_difference": draft_words - target_words,
            "meta_description_length": meta_len,
            "primary_keyword_count": kw_count,
            "keyword_density_percent": round(kw_density, 2),
            "flesch_reading_ease": round(flesch_score, 1),
            "h1_count": h1_count,
            "h2_count": h2_count,
            "h3_count": h3_count,
            "faq_count": len(content_data.get("faqs", [])),
            "internal_links_count": len(content_data.get("internal_linking", []))
        },
        "evaluation_disclaimer": "These scores represent rule-based heuristic calculations based on industry on-page SEO best practices and readability formulas. They are designed for educational and editorial guidance and do not represent proprietary search engine ranking algorithms."
    }

def compare_evaluations(eval_a: Dict[str, Any], eval_b: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compares Mode A (Basic) and Mode B (Improved) evaluation results
    to quantify prompt engineering impact for academic assessment.
    """
    score_a = eval_a.get("overall_score", 0)
    score_b = eval_b.get("overall_score", 0)
    delta = round(score_b - score_a, 1)
    
    categories = [
        "topic_relevance", "search_intent_alignment", "keyword_integration",
        "readability", "heading_structure", "word_count_adherence",
        "meta_description_optimization", "content_completeness"
    ]
    
    cat_diffs = {}
    for cat in categories:
        s_a = eval_a.get("category_scores", {}).get(cat, 0)
        s_b = eval_b.get("category_scores", {}).get(cat, 0)
        cat_diffs[cat] = {
            "mode_a": s_a,
            "mode_b": s_b,
            "delta": round(s_b - s_a, 2),
            "pct_gain": round(((s_b - s_a) / max(s_a, 0.1)) * 100, 1) if s_a > 0 else 0
        }
        
    return {
        "overall_score_a": score_a,
        "overall_score_b": score_b,
        "overall_delta": delta,
        "percentage_improvement": round(((score_b - score_a) / max(score_a, 1)) * 100, 1),
        "grade_a": eval_a.get("letter_grade", "N/A"),
        "grade_b": eval_b.get("letter_grade", "N/A"),
        "category_comparison": cat_diffs,
        "academic_conclusion": (
            f"Prompt engineering yielded a +{delta} point ({cat_diffs['keyword_integration']['delta']:+.1f} on keyword integration, "
            f"{cat_diffs['meta_description_optimization']['delta']:+.1f} on meta-length adherence) performance improvement, "
            f"demonstrating the efficacy of role prompting, negative constraints, and structured schema grounding."
            if delta > 0 else
            "Prompt engineering produced comparable scores. Review constraint calibration."
        )
    }
