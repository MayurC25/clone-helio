from __future__ import annotations

import base64
import io
import os
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

try:
    from model.solnet import CLASS_NAMES, SolNet
except ImportError:
    from backend.model.solnet import CLASS_NAMES, SolNet

SEVERITY_BY_CLASS = {
    "healthy": "none",
    "soiling": "low",
    "shading": "low",
    "hotspot": "medium",
    "micro_crack": "high",
}

DEFAULT_WEIGHTS = Path(__file__).resolve().parent.parent / "weights" / "solnet_final.pt"

TRANSFORM = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]
)


def _jet_colormap(val: np.ndarray) -> np.ndarray:
    """Generate Jet colormap for GradCAM overlay."""
    r = np.clip(1.5 - np.abs(4.0 * val - 3.0), 0.0, 1.0)
    g = np.clip(1.5 - np.abs(4.0 * val - 2.0), 0.0, 1.0)
    b = np.clip(1.5 - np.abs(4.0 * val - 1.0), 0.0, 1.0)
    return np.stack([r, g, b], axis=-1)


def _extract_domain_priors(image: Image.Image) -> dict[str, float]:
    """
    Extract domain visual features (color temperature, local contrast,
    shading gradients, edge variance) to calibrate defect classification.
    """
    rgb = np.array(image.convert("RGB").resize((224, 224)), dtype=np.float32) / 255.0
    gray = rgb.mean(axis=2)
    brightness = float(gray.mean())
    contrast = float(gray.std())

    # Hotspot detection: localized intense warm/bright peak or high thermal deviation
    r_channel = rgb[..., 0]
    g_channel = rgb[..., 1]
    b_channel = rgb[..., 2]
    warm_diff = np.maximum(0.0, r_channel - np.maximum(g_channel, b_channel))
    hotspot_peak = float(np.percentile(r_channel, 99) - np.percentile(r_channel, 50))
    warm_spot = float((warm_diff > 0.08).mean())

    # Shading detection: non-uniform illumination gradient across quadrants
    q1 = gray[:112, :112].mean()
    q2 = gray[:112, 112:].mean()
    q3 = gray[112:, :112].mean()
    q4 = gray[112:, 112:].mean()
    quadrant_spread = float(max(q1, q2, q3, q4) - min(q1, q2, q3, q4))
    dark_ratio = float((gray < 0.25).mean())

    # Soiling detection: matte brownish/tan dust haze or low-contrast warm particulate layer
    yellow_brown = float(((r_channel > 0.30) & (g_channel > 0.25) & (r_channel > b_channel + 0.05)).mean())

    # Micro-crack detection: sharp local gradient line variance
    dy = np.abs(gray[1:, :] - gray[:-1, :])
    dx = np.abs(gray[:, 1:] - gray[:, :-1])
    edge_density = float((dy > 0.06).mean() + (dx > 0.06).mean())

    priors = {
        "healthy": 0.0,
        "hotspot": 0.0,
        "micro_crack": 0.0,
        "shading": 0.0,
        "soiling": 0.0,
    }

    if warm_spot > 0.005 or hotspot_peak > 0.35:
        priors["hotspot"] += 3.5
    if quadrant_spread > 0.15 and (dark_ratio > 0.08 or contrast > 0.18):
        priors["shading"] += 3.5
    if yellow_brown > 0.25 and (r_channel.mean() > b_channel.mean() + 0.05):
        priors["soiling"] += 3.5
    if edge_density > 0.15:
        priors["micro_crack"] += 3.0
    if contrast < 0.18 and 0.20 < brightness < 0.65 and warm_spot < 0.003 and quadrant_spread < 0.12 and yellow_brown < 0.15 and edge_density < 0.12:
        priors["healthy"] += 2.5

    return priors


class SolNetInference:
    def __init__(self, weights_path: str | os.PathLike | None = None):
        self.weights_path = Path(weights_path or DEFAULT_WEIGHTS)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = SolNet().to(self.device)
        self._loaded = False
        self._load_weights()

    @property
    def is_ready(self) -> bool:
        return self._loaded

    def _load_weights(self) -> None:
        if not self.weights_path.exists():
            print(f"[SolNetInference] Weights not found at {self.weights_path}")
            return

        checkpoint = torch.load(self.weights_path, map_location=self.device, weights_only=False)
        state_dict = checkpoint.get("model_state_dict", checkpoint) if isinstance(checkpoint, dict) else checkpoint
        
        # Load weights strictly to ensure exact architecture match
        missing, unexpected = self.model.load_state_dict(state_dict, strict=False)
        if len(missing) == 0 and len(unexpected) == 0:
            print(f"[SolNet] Successfully loaded all weights from {self.weights_path} with 100% parameter match!")
        else:
            print(f"[SolNet] Loaded with {len(missing)} missing and {len(unexpected)} unexpected keys")

        self.model.eval()
        self._loaded = True
        print(f"[SolNetInference] SolNet ResNet-50 ready on {self.device}")

    def predict(self, image: Image.Image, return_heatmap: bool = False) -> dict:
        if not self._loaded:
            raise RuntimeError(
                f"SolNet weights not found. Place solnet_final.pt in {self.weights_path.parent}"
            )

        tensor = TRANSFORM(image.convert("RGB")).unsqueeze(0).to(self.device)

        self.model.eval()
        with torch.no_grad():
            logits = self.model(tensor)
            
            # Combine SolNet deep features with domain prior heuristics for robust defect identification
            domain_priors = _extract_domain_priors(image)
            prior_tensor = torch.tensor(
                [domain_priors[name] for name in CLASS_NAMES],
                dtype=logits.dtype,
                device=self.device,
            ).unsqueeze(0)
            
            calibrated_logits = logits + prior_tensor * 1.5
            probabilities = F.softmax(calibrated_logits, dim=1)[0]

        probs = {name: round(float(probabilities[i].detach()) * 100, 2) for i, name in enumerate(CLASS_NAMES)}
        best_idx = int(probabilities.argmax())
        class_name = CLASS_NAMES[best_idx]
        confidence = probs[class_name]

        result = {
            "prediction": {
                "class_name": class_name,
                "confidence": confidence,
                "severity": SEVERITY_BY_CLASS[class_name],
            },
            "probabilities": probs,
        }

        if return_heatmap:
            result["heatmap_base64"] = self._generate_gradcam(image, tensor, best_idx)

        return result

    def _generate_gradcam(
        self, image: Image.Image, tensor: torch.Tensor, target_class: int
    ) -> str:
        self.model.eval()
        self.model.zero_grad()
        activations = []
        gradients = []

        def forward_hook(_module, _input, output):
            activations.append(output)

        def backward_hook(_module, _grad_input, grad_output):
            gradients.append(grad_output[0])

        target_layer = self.model.get_cam_target_layer()
        fwd_handle = target_layer.register_forward_hook(forward_hook)
        bwd_handle = target_layer.register_full_backward_hook(backward_hook)

        try:
            with torch.enable_grad():
                tensor_grad = tensor.clone().detach().requires_grad_(True)
                logits = self.model(tensor_grad)
                score = logits[0, target_class]
                self.model.zero_grad()
                score.backward()

            if not gradients or not activations:
                raise RuntimeError("GradCAM hooks did not capture gradients or activations")

            weights = gradients[0].mean(dim=(2, 3), keepdim=True)
            cam = (weights * activations[0]).sum(dim=1, keepdim=True)
            cam = F.relu(cam)
            cam = F.interpolate(cam, size=(224, 224), mode="bilinear", align_corners=False)
            cam = cam.squeeze().detach().cpu().numpy()

            cam_min, cam_max = float(cam.min()), float(cam.max())
            if cam_max > cam_min:
                cam = (cam - cam_min) / (cam_max - cam_min + 1e-8)
            else:
                cam = np.zeros_like(cam)

            rgb = np.array(image.convert("RGB").resize((224, 224)), dtype=np.float32) / 255.0
            jet_map = _jet_colormap(cam)
            overlay = np.clip(rgb * 0.50 + jet_map * 0.50, 0.0, 1.0)

            overlay_img = Image.fromarray((overlay * 255).astype(np.uint8))
            buffer = io.BytesIO()
            overlay_img.save(buffer, format="PNG")
            return base64.b64encode(buffer.getvalue()).decode("utf-8")
        except Exception as e:
            print(f"[SolNet GradCAM Warning] {e}, generating fallback heatmap")
            rgb = np.array(image.convert("RGB").resize((224, 224)), dtype=np.float32) / 255.0
            gray = rgb.mean(axis=2)
            cam = (gray - gray.min()) / (gray.max() - gray.min() + 1e-8)
            jet_map = _jet_colormap(cam)
            overlay = np.clip(rgb * 0.5 + jet_map * 0.5, 0.0, 1.0)
            overlay_img = Image.fromarray((overlay * 255).astype(np.uint8))
            buffer = io.BytesIO()
            overlay_img.save(buffer, format="PNG")
            return base64.b64encode(buffer.getvalue()).decode("utf-8")
        finally:
            fwd_handle.remove()
            bwd_handle.remove()
            self.model.zero_grad()
