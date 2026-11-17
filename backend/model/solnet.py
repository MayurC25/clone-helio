import torch
import torch.nn as nn
from torchvision import models

CLASS_NAMES = ["healthy", "hotspot", "micro_crack", "shading", "soiling"]
NUM_CLASSES = len(CLASS_NAMES)


class SolNet(nn.Module):
    """ResNet50-based solar panel anomaly classifier matching trained solnet_final.pt weights."""

    def __init__(self, num_classes: int = NUM_CLASSES):
        super().__init__()
        base = models.resnet50(weights=None)
        # Backbone: conv1 through avgpool (children 0 through 8)
        self.backbone = nn.Sequential(*list(base.children())[:-1])
        # Classifier: matching trained head with Flatten, Linear(2048->512), BatchNorm, ReLU, Dropout, Linear(512->128), BatchNorm, ReLU, Dropout, Linear(128->num_classes)
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(2048, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        features = self.backbone(x)
        return self.classifier(features)

    def get_cam_target_layer(self):
        # Return the final Bottleneck block of layer4 (submodule 7 of backbone)
        return self.backbone[7][-1]

