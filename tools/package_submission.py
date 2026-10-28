import os
import zipfile
import shutil
from pathlib import Path

project_root = Path(r"C:\Users\rahul\.gemini\antigravity\scratch\rankcraft-ai")
brain_zip = Path(r"C:\Users\rahul\.gemini\antigravity\brain\d76cba7c-01cd-4f4d-9cf2-59f7a402edec\rankcraft-ai.zip")
scratch_zip = Path(r"C:\Users\rahul\.gemini\antigravity\scratch\rankcraft-ai.zip")

EXCLUDE_DIR_NAMES = {
    "node_modules", ".git", "dist", "build", ".cache", "__pycache__", 
    ".system_generated", "rendered_pages", "friend_pages", "extracted_media",
    "quick_inspect"
}

EXCLUDE_FILE_EXACT = {
    ".env", ".env.local", ".DS_Store", "Thumbs.db",
    "test_img_replace.docx", "test_img_replace.pdf", 
    "stage_with_images.docx", "test_wrap_output.docx", "test_wrap_output.pdf",
    "test_page2.png", "cert_crop.png", "friend_docx_full_dump.txt", "friend_reference.pdf"
}

def is_excluded_file(file_path: Path) -> bool:
    name = file_path.name
    # Exclude exact filenames
    if name in EXCLUDE_FILE_EXACT:
        return True
    # Exclude temporary extensions
    if name.endswith((".pyc", ".tmp", ".log", ".bak")):
        return True
    # Exclude sensitive .env files but KEEP .env.example
    if name.startswith(".env") and name != ".env.example":
        return True
    return False

def build_zip():
    print("======================================================================")
    print("   PACKAGING FINAL SUBMISSION ZIP FOR AI SEO CONTENT ASSISTANT")
    print("======================================================================")
    print(f"Project root: {project_root}")
    print(f"Target 1:     {brain_zip}")
    print(f"Target 2:     {scratch_zip}")
    print("----------------------------------------------------------------------")

    included_files = []
    
    with zipfile.ZipFile(brain_zip, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(project_root):
            # Prune excluded directories in-place
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIR_NAMES and not d.startswith(".")]
            
            for f in sorted(files):
                fp = Path(root) / f
                if is_excluded_file(fp):
                    continue
                
                rel_path = fp.relative_to(project_root).as_posix()
                arcname = f"rankcraft-ai/{rel_path}"
                zf.write(fp, arcname)
                included_files.append(arcname)

    # Copy to scratch directory for convenient user access
    shutil.copy2(brain_zip, scratch_zip)

    size_mb = brain_zip.stat().st_size / (1024 * 1024)
    print(f"\nPackaging complete!")
    print(f"Total files packaged: {len(included_files)}")
    print(f"Archive size:         {size_mb:.2f} MB")
    print(f"File 1: {brain_zip}")
    print(f"File 2: {scratch_zip}")
    
    # Verify key files are present
    key_files = [
        "rankcraft-ai/README.md",
        "rankcraft-ai/.env.example",
        "rankcraft-ai/package.json",
        "rankcraft-ai/run_app.py",
        "rankcraft-ai/client/src/components/AppShell.tsx",
        "rankcraft-ai/client/src/routes/Dashboard.tsx",
        "rankcraft-ai/client/src/routes/Generate.tsx",
        "rankcraft-ai/client/src/routes/Lab.tsx",
        "rankcraft-ai/client/src/routes/Evaluation.tsx",
        "rankcraft-ai/client/src/routes/Prompts.tsx",
        "rankcraft-ai/client/src/styles/components.css",
        "rankcraft-ai/client/src/styles/base.css",
        "rankcraft-ai/server/src/index.ts",
        "rankcraft-ai/docs/PROJECT_REPORT.md",
        "rankcraft-ai/docs/FACULTY_VIVA_QA.md",
        "rankcraft-ai/docs/e-record/AI_SEO_Content_Assistant_E_Record.pdf",
        "rankcraft-ai/docs/e-record/AI_SEO_Content_Assistant_E_Record.docx"
    ]
    
    print("\nVerifying key files in archive:")
    for k in key_files:
        present = k in included_files
        print(f"  [{'PASS' if present else 'FAIL'}] {k}")

    # Check that excluded files are NOT in archive
    bad_files = [f for f in included_files if any(p in f for p in ["node_modules", ".git/", ".env\b", "dist/"])]
    if bad_files:
        print(f"\nWARNING: Found {len(bad_files)} excluded files in archive!")
    else:
        print("\nCleanliness verified: Zero node_modules, .git, .env secrets, or dist caches in archive.")

if __name__ == "__main__":
    build_zip()
