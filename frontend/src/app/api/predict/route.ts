import { NextResponse } from "next/server";
import { ML_ENGINE_URL } from "@/lib/mlEngine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${ML_ENGINE_URL}/predict_health`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying to ML engine:", error);
    return NextResponse.json({ error: "Failed to communicate with ML Engine" }, { status: 503 });
  }
}
