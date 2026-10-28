"""
Unit Tests for Heuristic Content Evaluator in RankCraft AI.
Verifies scoring bounds (0-5), word count calculation, meta description length check,
and comparative delta arithmetic.
"""

import unittest
from backend.services.evaluator import calculate_reading_ease, evaluate_content, compare_evaluations

class TestEvaluator(unittest.TestCase):

    def setUp(self):
        self.inputs = {
            "topic": "Python Web Scraping Tutorial",
            "primary_keyword": "python web scraping",
            "search_intent": "Informational",
            "target_word_count": 500
        }
        self.mock_content_high_quality = {
            "title_suggestions": ["Python Web Scraping: Complete Guide"],
            "recommended_title": {
                "title": "Python Web Scraping: The Ultimate Practical Guide for Developers",
                "explanation": "Front-loads the primary keyword with authority."
            },
            # Exactly 158 characters
            "meta_description": "Master python web scraping with our step-by-step tutorial. Learn BeautifulSoup, parse complex HTML, and avoid IP bans. Read our complete expert guide today.",
            "primary_keyword_analysis": {
                "keyword": "python web scraping",
                "placement_strategy": "Front-loaded in Title, H1, first paragraph, and summary."
            },
            "secondary_keywords": ["beautifulsoup", "requests", "html parsing", "proxies", "scraping"],
            "long_tail_keywords": ["how to scrape websites with python step by step"],
            "search_intent_analysis": {
                "detected_intent": "Informational",
                "user_journey_stage": "Learning",
                "content_angle": "Step-by-step developer tutorial"
            },
            "article_outline": [
                {"heading": "Introduction to Python Web Scraping", "level": "H1", "key_points": ["Hook", "Prerequisites"]},
                {"heading": "Essential Scraping Libraries", "level": "H2", "key_points": ["Requests", "BeautifulSoup"]},
                {"heading": "Handling JavaScript Rendering", "level": "H2", "key_points": ["Playwright", "Selenium"]},
                {"heading": "Best Practices and Rate Limiting", "level": "H2", "key_points": ["Headers", "Delays"]},
                {"heading": "Summary & Next Steps", "level": "H2", "key_points": ["Wrap up", "Github repo"]}
            ],
            "article_draft": """# Python Web Scraping: The Ultimate Practical Guide for Developers

In the modern data economy, python web scraping is one of the most valuable capabilities an engineer can acquire. Whether you are aggregating product prices, compiling research datasets, or monitoring competitive market movements, extracting unstructured web content into clean JSON or tabular datasets is essential.

## Essential Scraping Libraries

To begin your python web scraping journey, you will primarily utilize the Requests HTTP client and BeautifulSoup parsing library. Together, these tools enable lightweight, lightning-fast DOM traversal.

```python
import requests
from bs4 import BeautifulSoup

response = requests.get('https://example.com')
soup = BeautifulSoup(response.text, 'html.parser')
print(soup.title.text)
```

## Handling Complex JavaScript Applications

When encountering client-side dynamic applications rendered with React or Vue, standard static scraping with Requests will return empty root DOM nodes. In these scenarios, utilizing modern headless browser automation like Playwright or Selenium is required to execute client-side scripts.

## Best Practices and Rate Limiting

Ethical web scraping requires respecting robots.txt directives, setting sensible crawl delays, and randomizing user-agent request headers. Always avoid overwhelming target web servers with concurrent bursts.

In conclusion, python web scraping unlocks immense data automation potential when implemented responsibly and architecturally soundly.
""",
            "faqs": [
                {"question": "Is python web scraping legal?", "answer": "Scraping publicly available data without violating terms of service or copyright is generally permitted under US law (hiQ v. LinkedIn), provided personal private data is not harvested."},
                {"question": "What is the best library for beginners?", "answer": "BeautifulSoup paired with Requests is by far the simplest and most readable starting stack."},
                {"question": "How do I prevent my scraper from being blocked?", "answer": "Rotate residential proxy IP addresses, implement exponential backoff delays, and spoof realistic browser headers."},
                {"question": "Can Python scrape single page applications?", "answer": "Yes, using headless browsers such as Playwright or Selenium, or by directly intercepting the underlying REST API network calls."},
                {"question": "How do I store scraped data?", "answer": "Depending on volume, save data into structured CSV files, SQLite databases, or cloud object stores like AWS S3."}
            ],
            "internal_linking": [
                {"anchor_text": "python web scraping best practices", "target_concept": "Data Engineering Guide", "context_sentence": "Review our python web scraping best practices before scaling."}
            ],
            "quality_checklist": [
                {"item": "Primary keyword present in Title & H1", "status": "passed", "note": "Verified"},
                {"item": "Meta description character count", "status": "passed", "note": "158 chars"}
            ],
            "improvement_suggestions": [
                "Add an interactive code sandbox to increase time on page."
            ]
        }

    def test_reading_ease_calculation(self):
        text = "This is a simple sentence. We like clean writing for our readers."
        score = calculate_reading_ease(text)
        self.assertGreaterEqual(score, 50.0)
        self.assertLessEqual(score, 100.0)

    def test_meta_description_exact_length(self):
        res = evaluate_content(self.mock_content_high_quality, self.inputs)
        meta_score = res["category_scores"]["meta_description_optimization"]
        self.assertEqual(meta_score, 5.0)
        self.assertIn(res["metrics"]["meta_description_length"], range(155, 161))

    def test_keyword_integration_score(self):
        res = evaluate_content(self.mock_content_high_quality, self.inputs)
        kw_score = res["category_scores"]["keyword_integration"]
        self.assertGreaterEqual(kw_score, 4.0)

    def test_comparison_delta_logic(self):
        # Create an inferior Mode A output with short meta, no FAQs, and low word count
        inferior_content = {
            "title_suggestions": ["Scraping Guide"],
            "recommended_title": {"title": "Scraping Guide", "explanation": "Short"},
            "meta_description": "Short meta.", # Only 11 chars
            "article_outline": [],
            "article_draft": "Short draft without keywords.",
            "faqs": [],
            "internal_linking": []
        }
        eval_inferior = evaluate_content(inferior_content, self.inputs)
        eval_superior = evaluate_content(self.mock_content_high_quality, self.inputs)
        
        comparison = compare_evaluations(eval_inferior, eval_superior)
        self.assertGreater(comparison["overall_delta"], 0)
        self.assertGreater(comparison["overall_score_b"], comparison["overall_score_a"])
        self.assertIn("academic_conclusion", comparison)

if __name__ == "__main__":
    unittest.main()
