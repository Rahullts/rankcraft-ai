"""
RankCraft AI - One-Click Launcher Script.
Launches both the Express backend (port 8787) and Vite React frontend (port 5173)
concurrently, with graceful shutdown, port collision protection, health-check verification, and automatic browser opening.

CLI Options:
  --status      Check health and status of both services without launching
  --restart     Force terminate and restart both services
  --detach      Launch services into independent background processes and exit
  --no-browser  Do not automatically launch the browser
"""

import argparse
import os
import signal
import subprocess
import sys
import time
import urllib.request
import webbrowser
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
SERVER_DIR = BASE_DIR / "server"
CLIENT_DIR = BASE_DIR / "client"

# Add candidate node paths on Windows
user_profile = os.environ.get("USERPROFILE", "")
candidate_paths = [
    Path(user_profile) / "AppData" / "Roaming" / "fnm" / "node-versions" / "v20.20.2" / "installation",
    Path(user_profile) / "AppData" / "Local" / "Python" / "bin",
    Path(user_profile) / "AppData" / "Roaming" / "fnm" / "current" / "installation",
    Path("C:/Program Files/nodejs"),
    Path("C:/Program Files (x86)/nodejs")
]

for p in candidate_paths:
    if p.exists() and str(p) not in os.environ.get("PATH", ""):
        os.environ["PATH"] = str(p) + os.pathsep + os.environ.get("PATH", "")

def check_command(cmd):
    try:
        subprocess.run([cmd, "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, check=True)
        return True
    except Exception:
        return False

def check_port_in_use(port):
    """Returns set of PIDs listening on the specified port on Windows."""
    pids = set()
    if sys.platform == "win32":
        try:
            out = subprocess.check_output(f'netstat -ano | findstr :{port}', shell=True, text=True, stderr=subprocess.DEVNULL)
            for line in out.strip().splitlines():
                parts = line.strip().split()
                if len(parts) >= 5 and "LISTENING" in parts:
                    pid = parts[-1]
                    if pid and pid != "0":
                        pids.add(pid)
        except Exception:
            pass
    return pids

def free_port_if_in_use(port):
    """Terminates any process holding the specified port on Windows."""
    if sys.platform == "win32":
        pids = check_port_in_use(port)
        for pid in pids:
            print(f"[Port Cleanup] Clearing process PID {pid} on port {port}...")
            subprocess.run(f"taskkill /F /PID {pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            time.sleep(0.5)

def poll_url(url, timeout_sec=15):
    """Polls a URL until it responds with HTTP 200 or timeout is reached."""
    start = time.time()
    while time.time() - start < timeout_sec:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'RankCraft-Launcher'})
            with urllib.request.urlopen(req, timeout=1) as resp:
                if resp.status == 200:
                    return True
        except Exception:
            pass
        time.sleep(0.5)
    return False

def ensure_client_wasm():
    """Runs patch-rollup.cjs if needed to guarantee Rollup WASM compatibility before starting client."""
    patch_script = CLIENT_DIR / "scripts" / "patch-rollup.cjs"
    if patch_script.exists():
        try:
            subprocess.run(["node", str(patch_script)], cwd=str(CLIENT_DIR), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except Exception:
            pass

def main():
    parser = argparse.ArgumentParser(description="RankCraft AI Service Launcher")
    parser.add_argument("--status", action="store_true", help="Check health and status of both services and exit")
    parser.add_argument("--restart", action="store_true", help="Force restart services even if running")
    parser.add_argument("--detach", action="store_true", help="Start services in independent background processes and exit")
    parser.add_argument("--no-browser", action="store_true", help="Do not automatically open browser")
    args = parser.parse_args()

    print("=" * 68)
    print("   🌟 RankCraft AI: AI SEO Content Assistant")
    print("   35-Mark Academic Capstone Edition - Local Dev Launcher")
    print("=" * 68)

    if not check_command("node"):
        print("[ERROR] Node.js is not found on PATH. Please install Node.js (v18+).")
        sys.exit(1)

    # Status check mode
    if args.status:
        b_ok = poll_url("http://localhost:8787/api/health", timeout_sec=2)
        f_ok = poll_url("http://localhost:5173", timeout_sec=2)
        print(f"Backend  (http://localhost:8787/api/health) : {'HEALTHY (200 OK)' if b_ok else 'DOWN / UNRESPONSIVE'}")
        print(f"Frontend (http://localhost:5173)            : {'READY   (200 OK)' if f_ok else 'DOWN / UNRESPONSIVE'}")
        sys.exit(0 if (b_ok and f_ok) else 1)

    # Force restart mode
    if args.restart:
        print("[Launcher] Force restart requested. Terminating active instances...")
        free_port_if_in_use(8787)
        free_port_if_in_use(5173)

    # Check if services are already running and healthy
    backend_already_ok = poll_url("http://localhost:8787/api/health", timeout_sec=2)
    frontend_already_ok = poll_url("http://localhost:5173", timeout_sec=2)

    if backend_already_ok and frontend_already_ok:
        print("\n[Launcher] Both services are already running and healthy!")
        print("      ✓ Express Backend: http://localhost:8787/api/health")
        print("      ✓ Vite Frontend  : http://localhost:5173")
        print("      • Pass --restart to force a fresh restart if needed.")
        if not args.no_browser:
            try:
                webbrowser.open("http://localhost:5173")
            except Exception:
                pass
        return

    # Handle partial or unresponsive ports
    if not backend_already_ok:
        free_port_if_in_use(8787)
    if not frontend_already_ok:
        free_port_if_in_use(5173)

    ensure_client_wasm()

    creation_flags = 0
    stdin_pipe = None
    stdout_pipe = None
    stderr_pipe = None
    if args.detach and sys.platform == "win32":
        creation_flags = 0x08000000  # CREATE_NO_WINDOW (avoids DLL init failure of DETACHED_PROCESS)
        stdin_pipe = subprocess.DEVNULL
        stdout_pipe = subprocess.DEVNULL
        stderr_pipe = subprocess.DEVNULL

    server_proc = None
    client_proc = None

    if not backend_already_ok:
        print("\n[1/3] Starting Express Backend on http://localhost:8787...")
        server_proc = subprocess.Popen(
            "npm run dev",
            cwd=str(SERVER_DIR),
            shell=True,
            creationflags=creation_flags,
            stdin=stdin_pipe,
            stdout=stdout_pipe,
            stderr=stderr_pipe
        )
    else:
        print("\n[1/3] Express Backend is already active on http://localhost:8787.")

    if not frontend_already_ok:
        print("[2/3] Starting Vite React Frontend on http://localhost:5173...")
        client_proc = subprocess.Popen(
            "npm run dev",
            cwd=str(CLIENT_DIR),
            shell=True,
            creationflags=creation_flags,
            stdin=stdin_pipe,
            stdout=stdout_pipe,
            stderr=stderr_pipe
        )
    else:
        print("[2/3] Vite React Frontend is already active on http://localhost:5173.")

    print("\n[3/3] Awaiting service health verification...")
    backend_ok = poll_url("http://localhost:8787/api/health", timeout_sec=15)
    frontend_ok = poll_url("http://localhost:5173", timeout_sec=15)

    if backend_ok and frontend_ok:
        print("      ✓ Express Backend is healthy (http://localhost:8787/api/health)")
        print("      ✓ Vite Frontend is ready (http://localhost:5173)")
        if not args.no_browser:
            try:
                webbrowser.open("http://localhost:5173")
            except Exception:
                pass
        if args.detach:
            print("[Launcher] Services successfully launched into background. Exiting.")
            return
        print("      • Press Ctrl+C at any time to shut down services.")
    else:
        if not backend_ok:
            print("      ⚠ Warning: Express Backend did not respond on http://localhost:8787 within 15s.")
        if not frontend_ok:
            print("      ⚠ Warning: Vite Frontend did not respond on http://localhost:5173 within 15s.")

    def cleanup(signum=None, frame=None):
        print("\n[Shutdown] Stopping RankCraft AI services...")
        try:
            if sys.platform == "win32":
                if server_proc:
                    subprocess.run(f"taskkill /F /T /PID {server_proc.pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                if client_proc:
                    subprocess.run(f"taskkill /F /T /PID {client_proc.pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                if server_proc:
                    server_proc.terminate()
                if client_proc:
                    client_proc.terminate()
        except Exception:
            pass
        free_port_if_in_use(8787)
        free_port_if_in_use(5173)
        print("[Shutdown] Completed.")
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    try:
        while True:
            time.sleep(1)
            if server_proc and server_proc.poll() is not None:
                print(f"[Warning] Express server exited with code {server_proc.poll()}")
                break
            if client_proc and client_proc.poll() is not None:
                print(f"[Warning] Vite client exited with code {client_proc.poll()}")
                break
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
