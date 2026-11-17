from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io

from scanner_service import run_scan, scanner_status

app = FastAPI(title="HelioGrid AI - ML Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IoTData(BaseModel):
    irradiance: float
    voltage: float
    current: float
    temperature: float

@app.get("/")
def read_root():
    return {"status": "HelioGrid AI ML Engine is running"}


@app.get("/health")
def health_check():
    status = scanner_status()
    return {
        "status": "ok",
        "backend_online": True,
        "inference_mode": status["inference_mode"],
        "model_loaded": status["model_loaded"],
    }

@app.post("/predict_health")
def predict_health(data: IoTData):
    base_health = 100.0
    if data.temperature > 45:
        base_health -= 15
    if data.irradiance < 200:
        base_health -= 10
    
    anomalies = []
    if base_health < 80:
        anomalies.append("Potential soiling detected")
    
    return {"health_score": max(0, min(100, base_health)), "anomalies": anomalies}

@app.get("/gps_recommendations")
def get_gps_recommendations(lat: float = 0.0, lon: float = 0.0):
    recommendations = [
        {"action": "OPTIMIZE_TILT", "confidence": 0.95, "reason": "Incoming high-irradiance window for GPS coords"},
        {"action": "STOW_PANELS", "confidence": 0.88, "reason": "High wind speed alert at your location"},
        {"action": "CLEANING_CYCLE", "confidence": 0.72, "reason": "Post-storm dust accumulation predicted"},
    ]
    
    return {"recommendations": recommendations, "location": {"lat": lat, "lon": lon}}


@app.get("/scanner/status")
def get_scanner_status():
    return scanner_status()


def _is_image_upload(file: UploadFile) -> bool:
    if file.content_type and file.content_type.startswith("image/"):
        return True
    if file.filename:
        lowered = file.filename.lower()
        return lowered.endswith((".png", ".jpg", ".jpeg", ".webp", ".bmp"))
    return False


@app.post("/scanner/scan")
async def scan_panel(
    file: UploadFile = File(...),
    return_heatmap: bool = Query(default=True),
):
    if not _is_image_upload(file):
        raise HTTPException(status_code=400, detail="Upload must be an image file (PNG or JPG)")

    raw = await file.read()
    if len(raw) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be 10MB or smaller")

    try:
        image = Image.open(io.BytesIO(raw))
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid image file") from exc

    try:
        return run_scan(image, return_heatmap=return_heatmap)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference failed: {exc}") from exc
