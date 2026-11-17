import { NextResponse } from "next/server";
import { ML_ENGINE_URL } from "@/lib/mlEngine";

export async function GET() {
  try {
    const res = await fetch(`${ML_ENGINE_URL}/scanner/status`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json({ ...data, backend_online: true });
  } catch (error) {
    console.error("Error fetching scanner status:", error);
    return NextResponse.json(
      {
        backend_online: false,
        model_loaded: false,
        inference_mode: "offline",
        error: "ML Engine unreachable. Start backend on port 8000.",
      },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const outbound = new FormData();
    outbound.append("file", file, file instanceof File ? file.name : "panel.jpg");

    const returnHeatmap = formData.get("return_heatmap");
    const url =
      returnHeatmap === "false"
        ? `${ML_ENGINE_URL}/scanner/scan?return_heatmap=false`
        : `${ML_ENGINE_URL}/scanner/scan?return_heatmap=true`;

    const res = await fetch(url, {
      method: "POST",
      body: outbound,
      signal: AbortSignal.timeout(60000),
    });

    const data = await res.json();
    if (!res.ok) {
      const detail = Array.isArray(data.detail)
        ? data.detail.map((item: { msg?: string }) => item.msg).join(", ")
        : data.detail;
      return NextResponse.json(
        { error: detail ?? data.error ?? "Scan failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying scan request:", error);
    return NextResponse.json(
      { error: "Failed to communicate with ML Engine. Is the backend running on port 8000?" },
      { status: 503 }
    );
  }
}
