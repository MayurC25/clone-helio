export type AnomalyClass =
  | "healthy"
  | "hotspot"
  | "micro_crack"
  | "shading"
  | "soiling";

export type Severity = "none" | "low" | "medium" | "high";

export interface ScanResult {
  id: string;
  panelId: string;
  timestamp: string;
  predictedClass: AnomalyClass;
  confidence: number;
  severity: Severity;
  probabilities: Record<AnomalyClass, number>;
}

export interface AnomalyTimelinePoint {
  date: string;
  healthy: number;
  hotspot: number;
  micro_crack: number;
  shading: number;
  soiling: number;
}

export interface ScannerKpiStats {
  scansToday: number;
  anomaliesFound: number;
  avgConfidence: number;
  modelAccuracy: number;
}

export const ANOMALY_CLASS_LABELS: Record<AnomalyClass, string> = {
  healthy: "Healthy",
  hotspot: "Hotspot",
  micro_crack: "Micro Crack",
  shading: "Shading",
  soiling: "Soiling",
};

export const MOCK_KPI_STATS: ScannerKpiStats = {
  scansToday: 12,
  anomaliesFound: 3,
  avgConfidence: 96.2,
  modelAccuracy: 99.0,
};

export const MOCK_LATEST_SCAN: ScanResult = {
  id: "scan-001",
  panelId: "Panel-A3",
  timestamp: "2026-08-18T09:14:00",
  predictedClass: "hotspot",
  confidence: 99.67,
  severity: "low",
  probabilities: {
    healthy: 0.12,
    hotspot: 99.67,
    micro_crack: 0.05,
    shading: 0.08,
    soiling: 0.08,
  },
};

export const MOCK_SCAN_HISTORY: ScanResult[] = [
  MOCK_LATEST_SCAN,
  {
    id: "scan-002",
    panelId: "Panel-B1",
    timestamp: "2026-08-18T08:42:00",
    predictedClass: "healthy",
    confidence: 94.56,
    severity: "none",
    probabilities: {
      healthy: 94.56,
      hotspot: 1.2,
      micro_crack: 1.5,
      shading: 1.4,
      soiling: 1.34,
    },
  },
  {
    id: "scan-003",
    panelId: "Panel-C2",
    timestamp: "2026-08-18T07:55:00",
    predictedClass: "soiling",
    confidence: 87.3,
    severity: "low",
    probabilities: {
      healthy: 2.1,
      hotspot: 3.4,
      micro_crack: 1.8,
      shading: 5.4,
      soiling: 87.3,
    },
  },
  {
    id: "scan-004",
    panelId: "Panel-D4",
    timestamp: "2026-08-18T06:30:00",
    predictedClass: "shading",
    confidence: 91.2,
    severity: "medium",
    probabilities: {
      healthy: 1.5,
      hotspot: 2.0,
      micro_crack: 0.8,
      shading: 91.2,
      soiling: 4.5,
    },
  },
  {
    id: "scan-005",
    panelId: "Panel-E1",
    timestamp: "2026-08-18T05:18:00",
    predictedClass: "micro_crack",
    confidence: 88.9,
    severity: "medium",
    probabilities: {
      healthy: 2.0,
      hotspot: 3.1,
      micro_crack: 88.9,
      shading: 3.5,
      soiling: 2.5,
    },
  },
];

export const MOCK_ANOMALY_TIMELINE: AnomalyTimelinePoint[] = [
  { date: "Aug 12", healthy: 8, hotspot: 1, micro_crack: 0, shading: 1, soiling: 2 },
  { date: "Aug 13", healthy: 10, hotspot: 0, micro_crack: 1, shading: 0, soiling: 1 },
  { date: "Aug 14", healthy: 7, hotspot: 2, micro_crack: 1, shading: 1, soiling: 0 },
  { date: "Aug 15", healthy: 9, hotspot: 1, micro_crack: 0, shading: 2, soiling: 1 },
  { date: "Aug 16", healthy: 11, hotspot: 0, micro_crack: 1, shading: 0, soiling: 2 },
  { date: "Aug 17", healthy: 8, hotspot: 2, micro_crack: 0, shading: 1, soiling: 1 },
  { date: "Aug 18", healthy: 9, hotspot: 1, micro_crack: 1, shading: 1, soiling: 0 },
];

export function formatScanTime(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function probabilitiesToChartData(
  probabilities: Record<AnomalyClass, number>
): { class: string; value: number; key: AnomalyClass }[] {
  return (Object.keys(probabilities) as AnomalyClass[]).map((key) => ({
    key,
    class: ANOMALY_CLASS_LABELS[key],
    value: probabilities[key],
  }));
}
