@echo off
setlocal
echo [HashCii] Starting local launcher...
where py >nul 2>nul
if %errorlevel%==0 (
  py launcher.py
  exit /b %errorlevel%
)
where python >nul 2>nul
if %errorlevel%==0 (
  python launcher.py
  exit /b %errorlevel%
)
echo [ERROR] Python 3 is required. Install from https://www.python.org/downloads/
exit /b 1
