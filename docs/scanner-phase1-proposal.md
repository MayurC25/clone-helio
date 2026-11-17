# Phase 1 Proposal — Scanner Anomaly Detection UI

## 1. Context Analysis

### Dashboard patterns (existing)

The Dashboard lives in `frontend/src/app/dashboard/page.tsx` and follows a consistent structure:

| Pattern | Convention |
|---|---|
| **Layout** | `max-w-7xl mx-auto`, `space-y-8`, responsive grids |
| **Sections** | Dedicated components in `frontend/src/components/sections/` (`WeatherSection`, `AIChatbot`) |
| **Cards** | shadcn `Card` — `border-slate-200 shadow-sm bg-white` |
| **Typography** | `text-2xl font-bold` page titles; `text-lg font-bold` section titles; `text-xs uppercase tracking-wider` labels |
| **Accent** | Emerald (`#10b981`) for primary/healthy states |
| **Charts** | Recharts (`AreaChart`, `LineChart`, `BarChart`) with slate gridlines |
| **Icons** | lucide-react |
| **Badges** | Status pills (e.g. "Live Sync", "Real-time GPS Sync") |

The main grid is `lg:grid-cols-3` (2 cols left metrics/charts, 1 col right chatbot). **Scanner will sit full-width below this entire grid**, matching how `WeatherSection` spans the left column but at page level.

### Notebook (`heliogrid.ipynb`) — Scanner data model

From the SolNet pipeline in the notebook:

**Inputs**
- Solar panel image (upload / synthetic generation)
- Optional heatmap flag: `return_heatmap=True`

**Anomaly classes (5)**
- `healthy`, `hotspot`, `micro_crack`, `shading`, `soiling`

**Prediction output** (`result['prediction']`)
```typescript
{
  class_name: string;      // e.g. "hotspot"
  confidence: number;      // e.g. 99.67 (%)
  severity: "none" | "low" | "medium" | "high";  // "none" for healthy, "low" in samples
}
```

**Additional model artifacts** (for Phase 2, but useful as UI placeholders now)
- Training curves PNG
- Confusion matrix PNG
- Model accuracy ~99% on test set

**Expected API** (Phase 2 only — `anomaly_api.py` via FastAPI + multipart upload)

---

## 2. Proposed UI Layout

Full-width section at the **very bottom** of the Dashboard, visually separated from the main grid with a subtle divider.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🔍 Scanner — SolNet Anomaly Detection          [Model Ready ●] badge  │
│  AI-powered panel inspection using ResNet50 classification             │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Scans    │ │ Anomalies│ │ Avg Conf │ │ Model    │  ← KPI stat row    │
│  │ Today: 12│ │ Found: 3 │ │ 96.2%    │ │ Acc: 99% │                   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                   │
├──────────────────────────────┬──────────────────────────────────────────┤
│  LEFT (lg:col-span-1)        │  RIGHT (lg:col-span-2)                   │
│                              │                                          │
│  ┌────────────────────────┐  │  ┌─ Latest Scan Result ────────────────┐ │
│  │  Image Upload Zone     │  │  │  Predicted: HOTSPOT                 │ │
│  │  (dashed border, mock) │  │  │  Confidence: 99.67%  [LOW severity] │ │
│  │  "Drop panel image"    │  │  │  ████████████░░ 99.67%              │ │
│  │  [Scan Panel] button   │  │  └─────────────────────────────────────┘ │
│  └────────────────────────┘  │                                          │
│                              │  ┌─ Class Probabilities (BarChart) ────┐ │
│  ┌────────────────────────┐  │  │  healthy ████ 2%                    │ │
│  │  Heatmap Overlay       │  │  │  hotspot ████████████ 99.67%        │ │
│  │  (gradient placeholder)│  │  │  soiling ██ 1%  ...                 │ │
│  └────────────────────────┘  │  └─────────────────────────────────────┘ │
├──────────────────────────────┴──────────────────────────────────────────┤
│  BOTTOM ROW (2 cols)                                                      │
│  ┌─ Scan History Timeline ──────────┐  ┌─ Anomaly Distribution ────────┐ │
│  │  09:14  Panel-A3  hotspot  99%  │  │  AreaChart: scans over 7 days│ │
│  │  08:42  Panel-B1  healthy  94%   │  │  stacked by anomaly type     │ │
│  │  07:55  Panel-C2  soiling  87%   │  └───────────────────────────────┘ │
│  └──────────────────────────────────┘                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

**Severity color mapping** (consistent with Dashboard palette):

| Severity | Badge color |
|---|---|
| `none` | Emerald (healthy) |
| `low` | Amber |
| `medium` | Orange |
| `high` | Rose/destructive |

**Anomaly class icons** (lucide-react):
- `healthy` → CheckCircle
- `hotspot` → Flame
- `micro_crack` → Zap
- `shading` → Cloud
- `soiling` → Droplets

---

## 3. Component File Structure

```
frontend/src/
├── components/
│   └── sections/
│       └── ScannerSection.tsx       ← NEW: main UI component (~200–250 lines)
├── lib/
│   └── mockScannerData.ts           ← NEW: types + hardcoded mock data
└── app/
    └── dashboard/
        └── page.tsx                 ← MODIFY: add <ScannerSection /> at bottom
```

**`ScannerSection.tsx`** will contain:
- Section header (title, subtitle, status badge)
- 4 KPI stat cards (reusing the inline `MetricCard` pattern from Dashboard, or a local variant)
- Upload dropzone (visual only — disabled/mock in Phase 1)
- Latest scan result card with severity badge + confidence progress bar
- Recharts horizontal bar chart for class probabilities
- Heatmap placeholder (CSS gradient overlay on a mock panel image)
- Scan history list (recent scans with timestamp, panel ID, class, confidence)
- 7-day anomaly timeline area chart

**`mockScannerData.ts`** will export:
```typescript
export type AnomalyClass = "healthy" | "hotspot" | "micro_crack" | "shading" | "soiling";
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

export const MOCK_LATEST_SCAN: ScanResult;
export const MOCK_SCAN_HISTORY: ScanResult[];
export const MOCK_ANOMALY_TIMELINE: {...}[];
export const MOCK_KPI_STATS: {...};
```

Mock values will mirror notebook outputs (e.g. healthy → 94.56% / none, soiling → 99.67% / low).

---

## 4. Files to Modify

| File | Change |
|---|---|
| `frontend/src/app/dashboard/page.tsx` | Add one import + `<ScannerSection />` after the closing `</div>` of the main grid (before the page wrapper closes). **No other edits** to existing Dashboard logic. |
| `frontend/src/components/sections/ScannerSection.tsx` | **New file** — entire Scanner UI |
| `frontend/src/lib/mockScannerData.ts` | **New file** — types and mock data |

**No changes to:** backend, API routes, sidebar, layout, or any existing section components.

---

## 5. Phase 1 Boundaries (confirmed)

- All data is hardcoded in `mockScannerData.ts`
- Upload button and "Scan Panel" are visual only (no `fetch`, no file handling)
- Heatmap is a CSS/gradient placeholder, not a real GradCAM image
- No new npm dependencies (Recharts + lucide already installed)

---

## 6. Design Decisions

- **Section title:** "Scanner — SolNet Anomaly Detection"
- **Upload zone:** Styled UI with disabled "Scan Panel" button and "Coming in Phase 2" tooltip
- **Scan history:** Compact card list matching Device Health Status style
