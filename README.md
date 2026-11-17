# HelioGrid-AI

Intelligent Solar Farm Health & Anomaly Detection System (Deployment_2).

----

## Quick Start (One-Command Startup)

You can launch both the **Backend ML Engine (FastAPI)** and the **Frontend (Next.js)** with any of the following single commands from the project root:

### Option 1: Command Prompt / Double-Click
```cmd
start.bat
```
*(or run `start-all.bat`)*

### Option 2: PowerShell
```powershell
.\start.ps1
```

### Option 3: npm
```bash
npm start
```
*(or `npm run dev`)*

---

## Services & Ports

Once started, the following services will be available:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **API Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check Endpoint**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## Individual Service Commands

- **Backend only**:
  ```cmd
  start-backend.bat
  ```
- **Frontend only**:
  ```bash
  cd frontend
  npm run dev
  ```
