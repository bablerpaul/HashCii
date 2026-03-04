#!/usr/bin/env sh
set -eu

if command -v python3 >/dev/null 2>&1; then
  exec python3 launcher.py
elif command -v python >/dev/null 2>&1; then
  exec python launcher.py
else
  echo "[ERROR] Python 3 is required. Install Python and retry."
  exit 1
fi
