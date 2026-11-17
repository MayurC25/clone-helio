"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Scan,
  Upload,
  CheckCircle,
  Flame,
  Zap,
  Cloud,
  Droplets,
  AlertTriangle,
  Target,
  Brain,
  Loader2,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ANOMALY_CLASS_LABELS,
  MOCK_ANOMALY_TIMELINE,
  MOCK_KPI_STATS,
  MOCK_LATEST_SCAN,
  MOCK_SCAN_HISTORY,
  formatScanTime,
  probabilitiesToChartData,
  type AnomalyClass,
  type ScanResult,
  type Severity,
} from "@/lib/mockScannerData";
import {
  buildTimelineFromHistory,
  computeKpiStats,
  fetchScannerStatus,
  scanPanelImage,
  scanResponseToResult,
  type ScannerStatusResponse,
} from "@/lib/scannerApi";

type ExtendedScanResult = ScanResult & {
  imagePreview?: string;
  heatmapBase64?: string;
};

const CLASS_ICONS: Record<AnomalyClass, React.ReactNode> = {
  healthy: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  hotspot: <Flame className="w-4 h-4 text-orange-500" />,
  micro_crack: <Zap className="w-4 h-4 text-amber-500" />,
  shading: <Cloud className="w-4 h-4 text-slate-500" />,
  soiling: <Droplets className="w-4 h-4 text-blue-500" />,
};

const CLASS_BAR_COLORS: Record<AnomalyClass, string> = {
  healthy: "#10b981",
  hotspot: "#f97316",
  micro_crack: "#f59e0b",
  shading: "#64748b",
  soiling: "#3b82f6",
};

const SEVERITY_STYLES: Record<
  Severity,
  { label: string; badge: string; progress: string }
> = {
  none: {
    label: "None",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    progress: "bg-emerald-500",
  },
  low: {
    label: "Low",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    progress: "bg-amber-500",
  },
  medium: {
    label: "Medium",
    badge: "bg-orange-50 text-orange-700 border-orange-100",
    progress: "bg-orange-500",
  },
  high: {
    label: "High",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    progress: "bg-rose-500",
  },
};

export function ScannerSection({ embedded = false }: { embedded?: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modelStatus, setModelStatus] = useState<ScannerStatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestScan, setLatestScan] = useState<ExtendedScanResult>(MOCK_LATEST_SCAN);
  const [scanHistory, setScanHistory] = useState<ExtendedScanResult[]>(MOCK_SCAN_HISTORY);
  const [isDragOver, setIsDragOver] = useState(false);

  const backendOnline = modelStatus?.backend_online ?? false;
  const inferenceMode = modelStatus?.inference_mode ?? "offline";
  const modelLoaded = modelStatus?.model_loaded ?? false;
  const canScan = backendOnline && !!selectedFile && !scanning;
  const modelAccuracy = modelStatus?.model_accuracy ?? MOCK_KPI_STATS.modelAccuracy;
  const kpiStats = computeKpiStats(scanHistory, modelAccuracy);
  const timelineData =
    scanHistory.length > 0
      ? buildTimelineFromHistory(scanHistory)
      : MOCK_ANOMALY_TIMELINE;
  const probabilityData = probabilitiesToChartData(latestScan.probabilities);
  const severityStyle = SEVERITY_STYLES[latestScan.severity];
  const heatmapSrc = latestScan.heatmapBase64
    ? `data:image/png;base64,${latestScan.heatmapBase64}`
    : null;

  useEffect(() => {
    const loadStatus = () =>
      fetchScannerStatus()
        .then(setModelStatus)
        .finally(() => setStatusLoading(false));

    loadStatus();
    const interval = setInterval(loadStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a PNG or JPG image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be 10MB or smaller.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }, []);

  const handleScan = async () => {
    if (!selectedFile || !backendOnline) return;

    setScanning(true);
    setError(null);

    try {
      const response = await scanPanelImage(selectedFile);
      const panelId = `Panel-${selectedFile.name.replace(/\.[^.]+$/, "").slice(0, 8).toUpperCase() || "UPLOAD"}`;
      const result = scanResponseToResult(response, panelId, previewUrl ?? undefined);

      setLatestScan(result);
      setScanHistory((prev) => [result, ...prev].slice(0, 20));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  };

  const loadSampleImage = useCallback(async (filename: string) => {
    try {
      const res = await fetch(`/sample-panels/${filename}`);
      if (!res.ok) throw new Error("Sample image not found");
      const blob = await res.blob();
      const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
      handleFileSelect(file);
    } catch (err) {
      console.error("Failed to load sample panel:", err);
      setError("Failed to load sample panel image.");
    }
  }, [handleFileSelect]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file ?? null);
  };

  return (
    <section className={cn(embedded ? "pt-4 border-t border-slate-200" : "")}>
      <Card className="border-slate-200 shadow-lg overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Scan className="w-5 h-5 text-emerald-500" />
                Scanner — SolNet Anomaly Detection
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                AI-powered panel inspection using ResNet50 classification
              </p>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "px-3 py-1 w-fit border",
                statusLoading
                  ? "bg-slate-50 text-slate-500 border-slate-100"
                  : !backendOnline
                    ? "bg-rose-50 text-rose-700 border-rose-100"
                    : modelLoaded
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-blue-50 text-blue-700 border-blue-100"
              )}
            >
              {statusLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Connecting…
                </>
              ) : !backendOnline ? (
                <>
                  <XCircle className="w-3 h-3 mr-2" />
                  Backend Offline
                </>
              ) : modelLoaded ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  SolNet Ready
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse" />
                  Demo Mode
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {!statusLoading && !backendOnline && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              Cannot reach the ML engine at <code className="font-mono text-xs bg-rose-100 px-1 rounded">http://127.0.0.1:8000</code>.
              Start the backend with:{" "}
              <code className="font-mono text-xs bg-rose-100 px-1 rounded">
                cd backend && python -m uvicorn main:app --port 8000
              </code>
            </div>
          )}

          {!statusLoading && backendOnline && inferenceMode === "demo" && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              Backend connected in demo mode. Add{" "}
              <code className="font-mono text-xs bg-blue-100 px-1 rounded">solnet_final.pt</code> to{" "}
              <code className="font-mono text-xs bg-blue-100 px-1 rounded">backend/weights/</code> for full SolNet inference.
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              title="Scans Today"
              value={String(kpiStats.scansToday || MOCK_KPI_STATS.scansToday)}
              subValue="Panel inspections"
              icon={<Scan className="text-emerald-500" />}
            />
            <KpiCard
              title="Anomalies Found"
              value={String(kpiStats.anomaliesFound || MOCK_KPI_STATS.anomaliesFound)}
              subValue="Requires attention"
              icon={<AlertTriangle className="text-amber-500" />}
            />
            <KpiCard
              title="Avg Confidence"
              value={`${kpiStats.avgConfidence || MOCK_KPI_STATS.avgConfidence}%`}
              subValue="Across all scans"
              icon={<Target className="text-blue-500" />}
            />
            <KpiCard
              title="Model Accuracy"
              value={`${modelAccuracy}%`}
              subValue="SolNet test set"
              icon={<Brain className="text-rose-500" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 bg-slate-50/50 text-center transition-colors",
                  isDragOver ? "border-emerald-400 bg-emerald-50/30" : "border-slate-200"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                />
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Drop panel image here
                </p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  PNG, JPG up to 10MB
                </p>
                {selectedFile && (
                  <p className="text-xs text-emerald-600 font-medium mb-3 truncate">
                    {selectedFile.name}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={!canScan}
                    onClick={handleScan}
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Scanning…
                      </>
                    ) : (
                      "Scan Panel"
                    )}
                  </Button>
                </div>

                {/* Quick-Test Panel Samples */}
                <div className="pt-4 border-t border-slate-200/80 text-left space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡ Quick Test Sample Panels:</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {[
                      { name: "Healthy", file: "healthy.jpg", color: "hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700" },
                      { name: "Micro Crack", file: "micro_crack.png", color: "hover:bg-amber-50 hover:border-amber-300 text-amber-700" },
                      { name: "Hotspot", file: "hotspot.jpg", color: "hover:bg-orange-50 hover:border-orange-300 text-orange-700" },
                      { name: "Soiling", file: "soiling.jpg", color: "hover:bg-blue-50 hover:border-blue-300 text-blue-700" },
                      { name: "Shading", file: "shading.jpg", color: "hover:bg-slate-100 hover:border-slate-300 text-slate-700" },
                    ].map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => loadSampleImage(item.file)}
                        className={cn(
                          "px-2 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white transition-all text-center truncate shadow-2xs active:scale-95",
                          item.color
                        )}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 relative aspect-video">
                {heatmapSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heatmapSrc}
                    alt="GradCAM heatmap overlay"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Panel preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{
                        background:
                          "radial-gradient(circle at 65% 40%, rgba(249,115,22,0.7) 0%, rgba(249,115,22,0.3) 25%, transparent 50%)",
                      }}
                    />
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-px opacity-20">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="border border-slate-600" />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <Badge className="bg-black/50 text-white border-none text-[10px]">
                    {heatmapSrc ? "GradCAM Heatmap" : previewUrl ? "Panel Preview" : "GradCAM Heatmap"}
                  </Badge>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {latestScan.panelId}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-slate-200 p-5 bg-white">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-4">
                  Latest Scan Result
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                      {CLASS_ICONS[latestScan.predictedClass]}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Predicted
                      </p>
                      <p className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {ANOMALY_CLASS_LABELS[latestScan.predictedClass]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Confidence
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {latestScan.confidence}%
                      </p>
                    </div>
                    <Badge className={cn("border px-3 py-1", severityStyle.badge)}>
                      {severityStyle.label} Severity
                    </Badge>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", severityStyle.progress)}
                    style={{ width: `${latestScan.confidence}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  {latestScan.panelId} · {formatScanTime(latestScan.timestamp)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 bg-white">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-4">
                  Class Probabilities
                </p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={probabilityData}
                      layout="vertical"
                      margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <YAxis
                        type="category"
                        dataKey="class"
                        width={90}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(2)}%`, "Probability"]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                        {probabilityData.map((entry) => (
                          <Cell
                            key={entry.key}
                            fill={CLASS_BAR_COLORS[entry.key]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-4">
                Scan History
              </p>
              <div className="space-y-2">
                {scanHistory.map((scan) => (
                  <ScanHistoryRow key={scan.id} scan={scan} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-4">
                Anomaly Distribution (7 Days)
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="colorHotspot" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSoiling" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="hotspot"
                      stackId="1"
                      stroke="#f97316"
                      fill="url(#colorHotspot)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="soiling"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="url(#colorSoiling)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="shading"
                      stackId="1"
                      stroke="#64748b"
                      fill="#64748b"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="micro_crack"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {(
                  [
                    ["hotspot", "#f97316"],
                    ["soiling", "#3b82f6"],
                    ["shading", "#64748b"],
                    ["micro_crack", "#f59e0b"],
                  ] as const
                ).map(([key, color]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] font-medium text-slate-500">
                      {ANOMALY_CLASS_LABELS[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function KpiCard({
  title,
  value,
  subValue,
  icon,
}: {
  title: string;
  value: string;
  subValue: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-slate-200 shadow-sm bg-white hover:border-emerald-200 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold text-slate-900">{value}</div>
        <p className="text-[10px] font-medium text-slate-400 mt-1">{subValue}</p>
      </CardContent>
    </Card>
  );
}

function ScanHistoryRow({ scan }: { scan: ExtendedScanResult }) {
  const severityStyle = SEVERITY_STYLES[scan.severity];

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
          {CLASS_ICONS[scan.predictedClass]}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-700 truncate">
            {scan.panelId}
          </p>
          <p className="text-[10px] text-slate-400">
            {formatScanTime(scan.timestamp)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
          {ANOMALY_CLASS_LABELS[scan.predictedClass]}
        </span>
        <span className="text-xs font-bold text-slate-900 tabular-nums">
          {scan.confidence}%
        </span>
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            scan.severity === "none"
              ? "bg-emerald-500"
              : scan.severity === "low"
                ? "bg-amber-500"
                : scan.severity === "medium"
                  ? "bg-orange-500"
                  : "bg-rose-500"
          )}
          title={`${severityStyle.label} severity`}
        />
      </div>
    </div>
  );
}
