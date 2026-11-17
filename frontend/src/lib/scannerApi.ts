import type { AnomalyClass, ScanResult, Severity } from "@/lib/mockScannerData";

export interface ScannerStatusResponse {
  backend_online?: boolean;
  model_loaded: boolean;
  inference_mode?: "solnet" | "demo" | "offline";
  device?: string;
  weights_path?: string;
  classes?: AnomalyClass[];
  model_accuracy?: number | null;
  error?: string;
}

export interface ScanApiResponse {
  prediction: {
    class_name: AnomalyClass;
    confidence: number;
    severity: Severity;
  };
  probabilities: Record<AnomalyClass, number>;
  heatmap_base64?: string;
  inference_mode?: "solnet" | "demo";
}

export function scanResponseToResult(
  response: ScanApiResponse,
  panelId: string,
  imagePreview?: string
): ScanResult & { imagePreview?: string; heatmapBase64?: string } {
  return {
    id: `scan-${Date.now()}`,
    panelId,
    timestamp: new Date().toISOString(),
    predictedClass: response.prediction.class_name,
    confidence: response.prediction.confidence,
    severity: response.prediction.severity,
    probabilities: response.probabilities,
    imagePreview,
    heatmapBase64: response.heatmap_base64,
  };
}

export async function fetchScannerStatus(): Promise<ScannerStatusResponse> {
  const res = await fetch("/api/scan", { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      backend_online: false,
      model_loaded: false,
      inference_mode: "offline",
      error: data.error ?? "Scanner unavailable",
    };
  }
  return data;
}

export async function scanPanelImage(file: File): Promise<ScanApiResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("return_heatmap", "true");

  const res = await fetch("/api/scan", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Scan failed");
  }

  return data;
}

export function computeKpiStats(history: ScanResult[], modelAccuracy = 99) {
  const today = new Date().toDateString();
  const todayScans = history.filter(
    (s) => new Date(s.timestamp).toDateString() === today
  );
  const anomalies = todayScans.filter((s) => s.predictedClass !== "healthy");
  const avgConfidence =
    todayScans.length > 0
      ? todayScans.reduce((sum, s) => sum + s.confidence, 0) / todayScans.length
      : 0;

  return {
    scansToday: todayScans.length,
    anomaliesFound: anomalies.length,
    avgConfidence: todayScans.length > 0 ? Math.round(avgConfidence * 10) / 10 : 0,
    modelAccuracy,
  };
}

export function buildTimelineFromHistory(history: ScanResult[]) {
  const days: Record<string, Record<AnomalyClass, number>> = {};

  history.forEach((scan) => {
    const date = new Date(scan.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!days[date]) {
      days[date] = {
        healthy: 0,
        hotspot: 0,
        micro_crack: 0,
        shading: 0,
        soiling: 0,
      };
    }
    days[date][scan.predictedClass] += 1;
  });

  return Object.entries(days).map(([date, counts]) => ({
    date,
    ...counts,
  }));
}
