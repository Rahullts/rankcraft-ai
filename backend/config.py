"""
Configuration module for RankCraft AI backend.
Handles environment variables, API key detection, and application constants.
"""

import os
from pathlib import Path

# Resolve base paths
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

def load_env_file():
    """Lightweight custom .env file parser (zero-dependency)."""
    if not ENV_FILE.exists():
        return
    try:
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                key = key.strip()
                val = val.strip().strip("'\"")
                if key and key not in os.environ:
                    os.environ[key] = val
    except Exception as e:
        print(f"[Config] Warning loading .env file: {e}")

# Load environment variables on import
load_env_file()

# Configuration constants
PORT = int(os.environ.get("PORT", 5000))
HOST = os.environ.get("HOST", "127.0.0.1")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
DEFAULT_MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")

def get_api_key():
    """Return currently active GEMINI_API_KEY from environment."""
    return os.environ.get("GEMINI_API_KEY", "").strip()

def set_api_key(api_key: str):
    """Update in-memory and write to .env securely."""
    clean_key = api_key.strip()
    os.environ["GEMINI_API_KEY"] = clean_key
    try:
        lines = []
        key_found = False
        if ENV_FILE.exists():
            with open(ENV_FILE, "r", encoding="utf-8") as f:
                lines = f.readlines()
        
        new_lines = []
        for line in lines:
            if line.strip().startswith("GEMINI_API_KEY="):
                new_lines.append(f'GEMINI_API_KEY="{clean_key}"\n')
                key_found = True
            else:
                new_lines.append(line)
        if not key_found:
            new_lines.append(f'GEMINI_API_KEY="{clean_key}"\n')
            
        with open(ENV_FILE, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
    except Exception as e:
        print(f"[Config] Error writing .env: {e}")
