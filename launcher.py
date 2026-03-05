#!/usr/bin/env python3
import argparse
import http.server
import json
import os
import platform
import socket
import socketserver
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path

HOST = "127.0.0.1"
DEFAULT_PORT = 5173
MAX_POST_BODY = 16 * 1024  # 16 KB limit on POST bodies
ALLOWED_CONFIG_KEYS = frozenset({"browser"})
PROJECT_ROOT = Path(__file__).resolve().parent
DIST_DIR = PROJECT_ROOT / "dist"
INDEX_FILE = DIST_DIR / "index.html"
CONFIG_FILE = PROJECT_ROOT / ".hashcii_config.json"


def is_port_available(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.3)
        return sock.connect_ex((host, port)) != 0


def find_available_port(host: str, preferred: int, max_tries: int = 30) -> int:
    for port in range(preferred, preferred + max_tries):
        if is_port_available(host, port):
            return port
    raise RuntimeError(f"No available port found in range {preferred}-{preferred + max_tries - 1}")


class LocalOnlyTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def browser_candidates() -> list[tuple[str, str]]:
    os_name = platform.system().lower()
    if "windows" in os_name:
        return [
            ("Microsoft Edge", "msedge"),
            ("Google Chrome", "chrome"),
            ("Mozilla Firefox", "firefox"),
            ("Brave", "brave"),
            ("Opera", "opera"),
            ("Internet Explorer", "windows-default"),
        ]
    if "darwin" in os_name:
        return [
            ("Safari", "safari"),
            ("Google Chrome", "google chrome"),
            ("Mozilla Firefox", "firefox"),
            ("Brave Browser", "brave browser"),
            ("Opera", "opera"),
            ("System Default", "mac-default"),
        ]
    return [
        ("Google Chrome", "google-chrome"),
        ("Mozilla Firefox", "firefox"),
        ("Brave", "brave-browser"),
        ("Chromium", "chromium-browser"),
        ("Opera", "opera"),
        ("System Default", "linux-default"),
    ]


def command_exists(command: str) -> bool:
    from shutil import which

    return which(command) is not None


def detect_installed_browsers() -> list[tuple[str, str]]:
    detected: list[tuple[str, str]] = []
    os_name = platform.system().lower()

    for label, browser_id in browser_candidates():
        if browser_id in {"windows-default", "mac-default", "linux-default"}:
            detected.append((label, browser_id))
            continue

        if "darwin" in os_name:
            app_path = f"/Applications/{label}.app"
            if os.path.exists(app_path):
                detected.append((label, browser_id))
        elif "windows" in os_name:
            if browser_id in {"msedge", "chrome", "firefox", "brave", "opera"}:
                detected.append((label, browser_id))
        else:
            if command_exists(browser_id):
                detected.append((label, browser_id))

    unique = []
    seen = set()
    for item in detected:
        if item[1] not in seen:
            unique.append(item)
            seen.add(item[1])
    return unique


def load_config() -> dict:
    """Load saved configuration from disk."""
    if CONFIG_FILE.exists():
        try:
            return json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return {}
    return {}


def save_config(updates: dict) -> None:
    """Merge *updates* into the config file and persist (whitelisted keys only)."""
    cfg = load_config()
    for key, val in updates.items():
        if key in ALLOWED_CONFIG_KEYS:
            if not isinstance(val, str) or len(val) > 256:
                continue
            cfg[key] = val
    CONFIG_FILE.write_text(json.dumps(cfg, indent=2), encoding="utf-8")


def open_with_choice(url: str, browser_choice: str | None = None) -> None:
    os_name = platform.system().lower()
    browsers = detect_installed_browsers()

    if browser_choice:
        selected = None
        for label, browser_id in browsers:
            if browser_choice.lower() in {label.lower(), browser_id.lower()}:
                selected = (label, browser_id)
                break
        if not selected:
            raise ValueError(f"Requested browser '{browser_choice}' is not available")
    else:
        print("\nChoose browser:")
        for i, (label, _) in enumerate(browsers, start=1):
            print(f"  {i}. {label}")
        print("  0. System default")

        raw = input("Enter choice [0]: ").strip() or "0"
        try:
            idx = int(raw)
        except ValueError:
            idx = 0

        if idx <= 0 or idx > len(browsers):
            webbrowser.open(url)
            return
        selected = browsers[idx - 1]

    _, browser_id = selected

    if browser_id in {"windows-default", "mac-default", "linux-default"}:
        webbrowser.open(url)
        return

    if "windows" in os_name:
        subprocess.Popen(["cmd", "/c", "start", "", browser_id, url], shell=False)
        return
    if "darwin" in os_name:
        subprocess.Popen(["open", "-a", browser_id, url], shell=False)
        return

    subprocess.Popen([browser_id, url], shell=False)


def run_server(host: str, port: int, directory: Path) -> None:
    class SecureHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(directory), **kwargs)

        # ── API routing ──────────────────────────────────────

        def _is_local_origin(self) -> bool:
            """Reject DNS-rebinding: only allow requests from localhost origins."""
            origin = self.headers.get("Origin", "")
            host = self.headers.get("Host", "")
            allowed = {"127.0.0.1", "localhost", f"127.0.0.1:{self.server.server_address[1]}",
                       f"localhost:{self.server.server_address[1]}"}
            if origin:
                from urllib.parse import urlparse
                parsed = urlparse(origin)
                return parsed.hostname in {"127.0.0.1", "localhost"}
            return any(host.startswith(a) for a in allowed) or not host

        def do_GET(self):
            if self.path == "/api/browsers":
                if not self._is_local_origin():
                    self.send_error(403, "Forbidden")
                    return
                browsers = detect_installed_browsers()
                self._send_json([{"label": l, "id": b} for l, b in browsers])
            elif self.path == "/api/browser-preference":
                if not self._is_local_origin():
                    self.send_error(403, "Forbidden")
                    return
                self._send_json({"browser": load_config().get("browser")})
            else:
                super().do_GET()

        def do_POST(self):
            if not self._is_local_origin():
                self.send_error(403, "Forbidden")
                return
            if self.path == "/api/browser-preference":
                length = int(self.headers.get("Content-Length", 0))
                if length > MAX_POST_BODY:
                    self.send_error(413, "Payload too large")
                    return
                body = self.rfile.read(length)
                try:
                    data = json.loads(body)
                    browser_val = data.get("browser", "")
                    # Validate browser id against known list
                    known_ids = {b for _, b in browser_candidates()}
                    if browser_val and browser_val not in known_ids:
                        self._send_json({"status": "error", "message": "Unknown browser id"}, 400)
                        return
                    save_config({"browser": browser_val})
                    self._send_json({"status": "ok", "browser": browser_val})
                except (json.JSONDecodeError, Exception) as exc:
                    self._send_json({"status": "error", "message": str(exc)}, 400)
            else:
                self.send_error(404)

        def do_OPTIONS(self):
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()

        def _send_json(self, data, code=200):
            payload = json.dumps(data).encode()
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(payload)

        # ── Security headers & logging ───────────────────────

        def end_headers(self):
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('X-Frame-Options', 'DENY')
            self.send_header('Referrer-Policy', 'no-referrer')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
            self.send_header('X-Permitted-Cross-Domain-Policies', 'none')
            super().end_headers()

        def log_message(self, format, *args):
            """Suppress default noisy logging."""
            pass

    with LocalOnlyTCPServer((host, port), SecureHandler) as httpd:
        print(f"\n[HashCii] Local server running at http://{host}:{port}")
        print("[HashCii] Bound to localhost only (not externally accessible).")
        print("[HashCii] Press Ctrl+C to stop.\n")
        httpd.serve_forever()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="HashCii local launcher")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Preferred localhost port")
    parser.add_argument("--browser", type=str, default=None, help="Browser name or id (optional)")
    parser.add_argument("--no-open", action="store_true", help="Do not auto-open browser")
    return parser.parse_args()


def main() -> int:
    if not INDEX_FILE.exists():
        print(f"[ERROR] Missing built files. Run 'npm run build' first.")
        print(f"[ERROR] Expected: {INDEX_FILE}")
        return 1

    args = parse_args()

    try:
        port = find_available_port(HOST, args.port)
    except RuntimeError as exc:
        print(f"[ERROR] {exc}")
        return 1

    server_thread = threading.Thread(target=run_server, args=(HOST, port, DIST_DIR), daemon=True)
    server_thread.start()

    url = f"http://{HOST}:{port}/index.html"

    if not args.no_open:
        time.sleep(0.4)
        config = load_config()
        browser_choice = args.browser or config.get("browser")
        try:
            if browser_choice:
                open_with_choice(url, browser_choice)
            else:
                webbrowser.open(url)
        except Exception as exc:
            print(f"[WARN] Could not open requested browser: {exc}")
            print("[INFO] Falling back to system default browser.")
            webbrowser.open(url)

    try:
        while server_thread.is_alive():
            time.sleep(0.5)
    except KeyboardInterrupt:
        print("\n[HashCii] Shutting down.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
