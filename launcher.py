#!/usr/bin/env python3
import argparse
import http.server
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
PROJECT_ROOT = Path(__file__).resolve().parent
DIST_DIR = PROJECT_ROOT / "dist"
INDEX_FILE = DIST_DIR / "index.html"


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
        try:
            open_with_choice(url, args.browser)
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
