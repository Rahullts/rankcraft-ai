"""
Unit Tests for Prompt Templates and Validation in RankCraft AI.
Verifies structure of Basic Prompt vs Advanced Improved Prompt,
ensuring role constraints, keyword directives, and JSON schema presence.
"""

import unittest
from backend.services.prompt_builder import (
    build_basic_prompt,
    build_improved_prompt,
    PROMPT_TECHNIQUES_INFO
)

class TestPromptBuilder(unittest.TestCase):

    def setUp(self):
        self.sample_inputs = {
            "topic": "Microservices Observability Strategies",
            "target_audience": "Site Reliability Engineers",
            "industry": "Cloud Computing",
            "target_country": "United States",
            "primary_keyword": "microservices observability",
            "secondary_keywords": ["distributed tracing", "opentelemetry", "metrics"],
            "search_intent": "Informational",
            "content_type": "Comprehensive Guide",
            "tone": "Authoritative & Actionable",
            "language": "English (US)",
            "target_word_count": 1500,
            "reference_material": "Focus specifically on OpenTelemetry collectors and latency tracing."
        }

    def test_basic_prompt_structure(self):
        prompt = build_basic_prompt(self.sample_inputs)
        self.assertIn("Microservices Observability Strategies", prompt)
        self.assertIn("microservices observability", prompt)
        self.assertLess(len(prompt), 300) # Baseline prompt is intentionally naive and concise

    def test_improved_prompt_techniques(self):
        prompt = build_improved_prompt(self.sample_inputs)
        
        # Check Role & Persona
        self.assertIn("# SYSTEM ROLE & PERSONA", prompt)
        self.assertIn("Search Quality Architect", prompt)
        
        # Check Audience & Context
        self.assertIn("Site Reliability Engineers", prompt)
        self.assertIn("Cloud Computing", prompt)
        
        # Check Boundary Constraints
        self.assertIn("155 to 160 characters", prompt)
        self.assertIn("1500 words", prompt)
        
        # Check Reference Material Integration
        self.assertIn("OpenTelemetry collectors", prompt)
        
        # Check Anti-Stuffing & Natural Density
        self.assertIn("1.2% - 1.8%", prompt)
        
        # Check JSON schema enforcement
        self.assertIn('"title_suggestions":', prompt)
        self.assertIn('"recommended_title":', prompt)
        self.assertIn('"meta_description":', prompt)
        self.assertIn('"article_outline":', prompt)
        self.assertIn('"article_draft":', prompt)
        self.assertIn('"faqs":', prompt)

    def test_techniques_metadata(self):
        self.assertIn("role_prompting", PROMPT_TECHNIQUES_INFO)
        self.assertIn("length_boundary_specifications", PROMPT_TECHNIQUES_INFO)
        self.assertIn("factuality_hallucination_guardrails", PROMPT_TECHNIQUES_INFO)

if __name__ == "__main__":
    unittest.main()
