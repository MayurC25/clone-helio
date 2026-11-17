from __future__ import annotations

from PIL import Image

try:
    from model.demo_inference import demo_predict
    from model.inference import SolNetInference
except ImportError:
    from backend.model.demo_inference import demo_predict
    from backend.model.inference import SolNetInference

_engine: SolNetInference | None = None


def get_scanner_engine() -> SolNetInference:
    global _engine
    if _engine is None:
        _engine = SolNetInference()
    return _engine


def scanner_status() -> dict:
    engine = get_scanner_engine()
    return {
        "backend_online": True,
        "model_loaded": engine.is_ready,
        "inference_mode": "solnet" if engine.is_ready else "demo",
        "device": str(engine.device),
        "weights_path": str(engine.weights_path),
        "classes": ["healthy", "hotspot", "micro_crack", "shading", "soiling"],
        "model_accuracy": 99.0 if engine.is_ready else None,
    }


def run_scan(image: Image.Image, return_heatmap: bool = True) -> dict:
    engine = get_scanner_engine()
    if engine.is_ready:
        result = engine.predict(image, return_heatmap=return_heatmap)
        result["inference_mode"] = "solnet"
        return result
    return demo_predict(image, return_heatmap=return_heatmap)
