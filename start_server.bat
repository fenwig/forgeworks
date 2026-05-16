@echo off
REM Start Forgeworks Local Server

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Python not found
    echo ========================================
    echo.
    echo Python is required but not installed or not in PATH.
    echo Please install Python first, then run this file again.
    echo.
    echo Install from: https://www.python.org
    echo.
    pause
    exit /b 1
)

REM Get the directory where this script is located
cd /d "%~dp0"

REM Start the server
echo.
echo ========================================
echo Starting Forgeworks Server
echo ========================================
echo.
echo Server is running at: http://localhost:8000
echo.
echo Opening your browser in 2 seconds...
echo.
echo To stop the server, close this window.
echo.
timeout /t 2 /nobreak

REM Open the browser (in background)
start http://localhost:8000/forgeworks_dashboard.html

REM Start the server (blocking - keeps window open)
python -m http.server 8000
