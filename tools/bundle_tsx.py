"""
Bundler and Build Tool for RankCraft AI Frontend.
Combines modular TypeScript (.ts, .tsx) components into frontend/public/bundle.tsx
for instant browser transpilation via Babel Standalone.
"""

import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = BASE_DIR / "frontend" / "src"
OUT_FILE = BASE_DIR / "frontend" / "public" / "bundle.tsx"

FILE_ORDER = [
    SRC_DIR / "types.ts",
    SRC_DIR / "utils" / "exporter.ts",
    SRC_DIR / "prompts" / "basicPrompt.ts",
    SRC_DIR / "prompts" / "improvedPrompt.ts",
    SRC_DIR / "components" / "Sidebar.tsx",
    SRC_DIR / "components" / "Navbar.tsx",
    SRC_DIR / "components" / "DashboardHome.tsx",
    SRC_DIR / "components" / "ContentGenerator.tsx",
    SRC_DIR / "components" / "ResultsView.tsx",
    SRC_DIR / "components" / "PromptLab.tsx",
    SRC_DIR / "components" / "ContentEvaluation.tsx",
    SRC_DIR / "components" / "HistoryDrawer.tsx",
    SRC_DIR / "components" / "ApiKeyModal.tsx",
    SRC_DIR / "components" / "DocumentationModal.tsx",
    SRC_DIR / "App.tsx",
    SRC_DIR / "index.tsx",
]

def clean_file_content(content: str) -> str:
    lines = content.splitlines()
    clean_lines = []
    for line in lines:
        stripped = line.strip()
        # Remove relative internal imports (e.g., import { Foo } from './components/Foo')
        if re.match(r"^import\s+.*from\s+['\"]\.\.?\/.*['\"];?", stripped):
            continue
        # Remove React imports as React is globally provided via script tag
        if re.match(r"^import\s+React.*from\s+['\"]react['\"];?", stripped):
            continue
        if re.match(r"^import\s+ReactDOM.*from\s+['\"]react-dom.*['\"];?", stripped):
            continue
        # Remove export keyword before const/function/interface/type to avoid global export errors
        line = re.sub(r"^export\s+(const|let|var|function|interface|type|class)\s+", r"\1 ", line)
        clean_lines.append(line)
    return "\n".join(clean_lines)

def bundle():
    print(f"[Bundler] Reading {len(FILE_ORDER)} source files from {SRC_DIR}...")
    output_parts = [
        "// ==========================================================================",
        "// RankCraft AI - Compiled Client Bundle",
        "// React + TypeScript Frontend Application",
        "// Generated automatically for browser-based runtime execution",
        "// ==========================================================================\n",
        "const { useState, useEffect, useRef, useMemo, useCallback } = React;\n"
    ]

    for file_path in FILE_ORDER:
        if not file_path.exists():
            print(f"[Bundler] Error: Missing file {file_path}")
            continue
        print(f"  + Bundling {file_path.relative_to(SRC_DIR)}")
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            cleaned = clean_file_content(content)
            output_parts.append(f"\n// --- SOURCE: {file_path.name} ---\n" + cleaned)

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(output_parts))
    print(f"[Bundler] Successfully wrote bundle to {OUT_FILE} ({OUT_FILE.stat().st_size} bytes)")

if __name__ == "__main__":
    bundle()
