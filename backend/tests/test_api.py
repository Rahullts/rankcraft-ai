"""
Integration Tests for RankCraft AI Flask API Routes.
Verifies status probe, input validation error codes, prompt comparison, and evaluation.
"""

import unittest
import json
from backend.app import app

class TestApiEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()

    def test_status_endpoint(self):
        resp = self.client.get("/api/status")
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["service"], "RankCraft AI Backend")
        self.assertIn("has_api_key", data)

    def test_prompt_templates_endpoint(self):
        resp = self.client.get("/api/prompt-templates")
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertIn("techniques", data)
        self.assertIn("sample_improved_template", data)

    def test_generate_missing_required_fields(self):
        # Missing primary_keyword
        payload = {"topic": "Next.js App Router Guide"}
        resp = self.client.post("/api/generate", json=payload)
        self.assertEqual(resp.status_code, 400)
        data = resp.get_json()
        self.assertIn("Validation Error", data["error"])

    def test_generate_endpoint_success(self):
        payload = {
            "topic": "Edge Computing Architectures",
            "primary_keyword": "edge computing",
            "target_audience": "Infrastructure Engineers",
            "target_word_count": 800,
            "prompt_mode": "improved"
        }
        resp = self.client.post("/api/generate", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertTrue(data["success"])
        self.assertIn("content", data)
        self.assertIn("evaluation", data)
        self.assertEqual(len(data["content"]["title_suggestions"]), 5)
        self.assertEqual(len(data["content"]["faqs"]), 5)

    def test_prompt_lab_compare_endpoint(self):
        payload = {
            "topic": "PostgreSQL Query Tuning",
            "primary_keyword": "postgresql query tuning",
            "target_audience": "Database Administrators",
            "target_word_count": 1000
        }
        resp = self.client.post("/api/prompt-lab/compare", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertTrue(data["success"])
        self.assertIn("mode_a", data)
        self.assertIn("mode_b", data)
        self.assertIn("comparison", data)
        self.assertGreater(data["comparison"]["overall_score_b"], data["comparison"]["overall_score_a"])

if __name__ == "__main__":
    unittest.main()
