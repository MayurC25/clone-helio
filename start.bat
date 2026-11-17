@echo off
title HelioGrid-AI Launcher
echo ========================================================
echo               HelioGrid-AI Startup
echo ========================================================
echo Starting Backend (FastAPI) and Frontend (Next.js)...

:: Ensure virtual environment exists
if not exist "%~dp0.venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found at %~dp0.venv
    echo Run: python -m venv .venv ^&^& .\.venv\Scripts\pip install -r backend\requirements.txt
    pause
    exit /b 1
)

:: Launch Backend in a dedicated window
echo [1/2] Launching Backend ML Engine on http://127.0.0.1:8000 ...
start "HelioGrid-AI [Backend API]" cmd /k "cd /d "%~dp0backend" && call "..\.venv\Scripts\activate.bat" && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

:: Launch Frontend in a dedicated window
echo [2/2] Launching Frontend Next.js app on http://localhost:3000 ...
start "HelioGrid-AI [Frontend]" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo HelioGrid-AI is starting up!
echo - Frontend: http://localhost:3000
echo - Backend:  http://127.0.0.1:8000
echo - Docs:     http://127.0.0.1:8000/docs
echo ========================================================
echo.
timeout /t 3 /nobreak >nul
start http://localhost:3000

