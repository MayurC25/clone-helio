# HelioGrid-AI Unified Startup Script for PowerShell
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "              HelioGrid-AI Startup                      " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting Backend (FastAPI) and Frontend (Next.js)..." -ForegroundColor White

$RootPath = $PSScriptRoot
$VenvActivate = Join-Path $RootPath ".venv\Scripts\activate.bat"
$BackendPath = Join-Path $RootPath "backend"
$FrontendPath = Join-Path $RootPath "frontend"

if (-not (Test-Path $VenvActivate)) {
    Write-Error "Virtual environment not found at $RootPath\.venv. Please set up .venv first."
    exit 1
}

# Launch Backend in new window
Write-Host "[1/2] Launching Backend ML Engine on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process cmd.exe -ArgumentList "/k", "cd /d `"$BackendPath`" && call `"$VenvActivate`" && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

# Launch Frontend in new window
Write-Host "[2/2] Launching Frontend Next.js app on http://localhost:3000 ..." -ForegroundColor Green
Start-Process cmd.exe -ArgumentList "/k", "cd /d `"$FrontendPath`" && npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "HelioGrid-AI services are running!" -ForegroundColor Green
Write-Host " - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host " - Backend:  http://127.0.0.1:8000" -ForegroundColor White
Write-Host " - Docs:     http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan

Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

