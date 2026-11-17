from __future__ import annotations

import base64
import io

import numpy as np
from PIL import Image

from model.solnet import CLASS_NAMES

SEVERITY_BY_CLASS = {
    "healthy": "none",
    "soiling": "low",
    "shading": "low",
    "hotspot": "medium",
    "micro_crack": "high",
}


def _normalize_scores(scores: dict[str, float]) -> dict[str, float]:
    total = sum(scores.values()) or 1.0
    return {name: round((scores[name] / total) * 100, 2) for name in CLASS_NAMES}


def _preview_heatmap(image: Image.Image) -> str:
    rgb = np.array(image.convert("RGB").resize((224, 224)), dtype=np.float32) / 255.0
    gray = rgb.mean(axis=2)
    heat = np.clip((gray - gray.mean()) * 2.0 + 0.5, 0, 1)
    overlay = rgb.copy()
    overlay[..., 0] = np.clip(overlay[..., 0] + heat * 0.35, 0, 1)
    overlay[..., 2] = np.clip(overlay[..., 2] + heat * 0.1, 0, 1)
    blended = np.clip(rgb * 0.55 + overlay * 0.45, 0, 1)
    buffer = io.BytesIO()
    Image.fromarray((blended * 255).astype(np.uint8)).save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def demo_predict(image: Image.Image, return_heatmap: bool = False) -> dict:
    """Heuristic fallback when SolNet weights are unavailable."""
    rgb = np.array(image.convert("RGB").resize((224, 224)), dtype=np.float32) / 255.0
    brightness = float(rgb.mean())
    contrast = float(rgb.std())
    dark_ratio = float((rgb.mean(axis=2) < 0.35).mean())
    warm_ratio = float(((rgb[..., 0] > rgb[..., 1] + 0.08) & (rgb[..., 0] > 0.45)).mean())

    scores = {name: 0.12 for name in CLASS_NAMES}

    if brightness > 0.58 and contrast < 0.18:
        scores["healthy"] += 0.55
    if dark_ratio > 0.18:
        scores["shading"] += 0.42
    if warm_ratio > 0.08:
        scores["hotspot"] += 0.38
    if contrast > 0.22 and brightness < 0.55:
        scores["soiling"] += 0.35
    if contrast > 0.28:
        scores["micro_crack"] += 0.3

    probs = _normalize_scores(scores)
    class_name = max(probs, key=probs.get)
    confidence = probs[class_name]

    result = {
        "prediction": {
            "class_name": class_name,
            "confidence": confidence,
            "severity": SEVERITY_BY_CLASS[class_name],
        },
        "probabilities": probs,
        "inference_mode": "demo",
    }

    if return_heatmap:
        result["heatmap_base64"] = _preview_heatmap(image)

    return result
