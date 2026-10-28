"""
RankCraft AI - Flask Backend Server.
Provides RESTful APIs for SEO Content Generation, Prompt Engineering Lab comparison,
Heuristic Content Evaluation, and Static Asset Serving for React + TypeScript frontend.
"""

import os
import sys
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory, send_file

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.config import get_api_key, set_api_key, PORT, HOST, DEFAULT_MODEL
from backend.services.gemini_service import generate_seo_content
from backend.services.evaluator import evaluate_content, compare_evaluations
from backend.services.prompt_builder import (
    PROMPT_TECHNIQUES_INFO,
    build_basic_prompt,
    build_improved_prompt
)

app = Flask(
    __name__,
    static_folder=str(PROJECT_ROOT / "frontend"),
    static_url_path=""
)

# Custom CORS header injector for modern browsers
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# -------------------------------------------------------------
# API ROUTES
# -------------------------------------------------------------

@app.route("/api/status", methods=["GET"])
def api_status():
    """Health check and API key readiness probe."""
    api_key = get_api_key()
    has_key = bool(api_key and len(api_key) > 5)
    masked_key = f"{api_key[:4]}...{api_key[-4:]}" if has_key else "NOT_CONFIGURED"
    
    return jsonify({
        "status": "healthy",
        "service": "RankCraft AI Backend",
        "version": "1.0.0",
        "has_api_key": has_key,
        "masked_key": masked_key,
        "active_model": DEFAULT_MODEL,
        "mode": "Live AI Ready" if has_key else "Academic Demonstration Mode (Key Pending)",
        "instructions": "Get a free Gemini API key from https://aistudio.google.com/app/apikey and add to .env"
    })

@app.route("/api/config/key", methods=["POST"])
def update_api_key():
    """Securely updates the Gemini API key in memory and .env."""
    data = request.get_json() or {}
    key = data.get("api_key", "").strip()
    if not key:
        return jsonify({"success": False, "error": "API key cannot be empty."}), 400
    
    set_api_key(key)
    return jsonify({
        "success": True,
        "message": "GEMINI_API_KEY saved successfully.",
        "has_api_key": True,
        "masked_key": f"{key[:4]}...{key[-4:]}"
    })

@app.route("/api/prompt-templates", methods=["GET"])
def get_prompt_templates():
    """Returns documentation and explanation of prompt techniques used."""
    return jsonify({
        "techniques": PROMPT_TECHNIQUES_INFO,
        "sample_basic_template": build_basic_prompt({"topic": "[Topic]", "primary_keyword": "[Keyword]", "target_word_count": 1000}),
        "sample_improved_template": build_improved_prompt({
            "topic": "[Topic]",
            "primary_keyword": "[Keyword]",
            "target_audience": "[Target Audience]",
            "industry": "[Industry]",
            "search_intent": "Informational",
            "target_word_count": 1200
        })
    })

@app.route("/api/generate", methods=["POST"])
def generate():
    """
    Generates SEO content for given inputs and prompt mode.
    Validates required inputs, runs generation, evaluates output, and returns structured result.
    """
    data = request.get_json() or {}
    
    # Input validation
    topic = data.get("topic", "").strip()
    primary_kw = data.get("primary_keyword", "").strip()
    if not topic:
        return jsonify({"success": False, "error": "Validation Error: 'topic' is required."}), 400
    if not primary_kw:
        return jsonify({"success": False, "error": "Validation Error: 'primary_keyword' is required."}), 400

    prompt_mode = data.get("prompt_mode", "improved").lower()
    if prompt_mode not in ["basic", "improved"]:
        prompt_mode = "improved"

    success, content, prompt_used, err_msg = generate_seo_content(data, prompt_mode)
    
    if not success:
        return jsonify({
            "success": False,
            "error": err_msg,
            "prompt_used": prompt_used
        }), 502

    # Run transparent heuristic evaluation
    evaluation = evaluate_content(content, data)

    is_demo = (err_msg == "DEMO_MODE_ACTIVE")
    return jsonify({
        "success": True,
        "prompt_mode": prompt_mode,
        "prompt_used": prompt_used,
        "is_demo_mode": is_demo,
        "content": content,
        "evaluation": evaluation
    })

@app.route("/api/prompt-lab/compare", methods=["POST"])
def compare_prompts():
    """
    Executes BOTH Mode A (Basic) and Mode B (Improved) for the exact same inputs.
    Calculates heuristic evaluation for both and produces a side-by-side comparative analysis.
    """
    data = request.get_json() or {}
    topic = data.get("topic", "").strip()
    primary_kw = data.get("primary_keyword", "").strip()
    
    if not topic or not primary_kw:
        return jsonify({
            "success": False,
            "error": "Both 'topic' and 'primary_keyword' are required for Prompt Lab comparison."
        }), 400

    # 1. Generate Mode A (Basic)
    success_a, content_a, prompt_a, err_a = generate_seo_content(data, "basic")
    if not success_a:
        return jsonify({"success": False, "error": f"Mode A failed: {err_a}"}), 502
    eval_a = evaluate_content(content_a, data)

    # 2. Generate Mode B (Improved)
    success_b, content_b, prompt_b, err_b = generate_seo_content(data, "improved")
    if not success_b:
        return jsonify({"success": False, "error": f"Mode B failed: {err_b}"}), 502
    eval_b = evaluate_content(content_b, data)

    # 3. Compare with transparent rubric delta
    comparison = compare_evaluations(eval_a, eval_b)

    return jsonify({
        "success": True,
        "is_demo_mode": (err_a == "DEMO_MODE_ACTIVE" or err_b == "DEMO_MODE_ACTIVE"),
        "mode_a": {
            "prompt": prompt_a,
            "content": content_a,
            "evaluation": eval_a
        },
        "mode_b": {
            "prompt": prompt_b,
            "content": content_b,
            "evaluation": eval_b
        },
        "comparison": comparison
    })

@app.route("/api/evaluate", methods=["POST"])
def evaluate_custom():
    """Stand-alone heuristic evaluation endpoint."""
    data = request.get_json() or {}
    content = data.get("content", {})
    inputs = data.get("inputs", {})
    if not content:
        return jsonify({"success": False, "error": "Content object is required."}), 400
    
    evaluation = evaluate_content(content, inputs)
    return jsonify({
        "success": True,
        "evaluation": evaluation
    })

# -------------------------------------------------------------
# STATIC FILE SERVING FOR REACT + TYPESCRIPT FRONTEND
# -------------------------------------------------------------

@app.route("/")
def serve_index():
    """Serves the main application page."""
    return send_from_directory(str(PROJECT_ROOT / "frontend"), "index.html")

@app.route("/<path:path>")
def serve_static(path):
    """Serves static files (vendor scripts, css, tsx/ts files)."""
    frontend_dir = PROJECT_ROOT / "frontend"
    target_file = frontend_dir / path
    if target_file.exists():
        # Ensure correct MIME type for TSX/TS files
        if path.endswith(".tsx") or path.endswith(".ts"):
            return send_file(str(target_file), mimetype="text/javascript")
        return send_from_directory(str(frontend_dir), path)
    return send_from_directory(str(frontend_dir), "index.html")

if __name__ == "__main__":
    print("=" * 65)
    print("   🚀 RankCraft AI - AI SEO Content Assistant")
    print(f"   Listening on http://{HOST}:{PORT}")
    print(f"   API Key Status: {'Configured' if get_api_key() else 'Pending (Running Demo Mode)'}")
    print("=" * 65)
    app.run(host=HOST, port=PORT, debug=True)
