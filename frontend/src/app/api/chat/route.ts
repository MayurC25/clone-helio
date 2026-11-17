import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Prioritized list of responsive, operational models for the Gemini Interactions API
const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
].filter(Boolean) as string[];

const BASE_INSTRUCTION = `You are the HelioGrid AI Expert for solar operations.

Rules:
- Use LIVE SYSTEM CONTEXT when it is provided. Do NOT ask for GPS, city, or location if context already includes coordinates or weather.
- When the user asks for current conditions, status, or an update, give an immediate operational briefing using the context.
- Structure briefings with short sections: Weather & Irradiance, Generation/Telemetry, Wind & Stow, Tilt/Tracking, Health & Actions.
- Give practical recommendations (stow if wind is high, cooling if hot, cleaning if soiling risk, etc.).
- Be concise, confident, and operator-focused — not generic.
- Do NOT provide financial advice, stock market predictions, or finance-related information.
- Only ask for location if context is empty or clearly missing weather/location data.`;

function buildSystemInstruction(context?: Record<string, unknown>) {
  if (!context || Object.keys(context).length === 0) {
    return `${BASE_INSTRUCTION}

LIVE SYSTEM CONTEXT: not available. You may ask for location only if needed for weather-specific advice.`;
  }

  return `${BASE_INSTRUCTION}

LIVE SYSTEM CONTEXT (authoritative — use this first):
${JSON.stringify(context, null, 2)}`;
}

function resolveApiKey(): string | undefined {
  const envKey = process.env.GOOGLE_AI_API_KEY?.trim();
  if (envKey && envKey !== "your_api_key_here") {
    return envKey;
  }

  // Fallback: Check .env.local on disk dynamically (both frontend/.env.local and root .env.local)
  const candidateFiles = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), "..", ".env.local"),
    path.join(process.cwd(), "frontend", ".env.local"),
  ];

  for (const filePath of candidateFiles) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const match = raw.match(/GOOGLE_AI_API_KEY\s*=\s*([^\r\n]+)/);
        if (match && match[1]?.trim() && match[1].trim() !== "your_api_key_here") {
          return match[1].trim();
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  return undefined;
}

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    const apiKey = resolveApiKey();

    console.log("Chat API: Received request. Messages count:", messages?.length);
    console.log("Chat API: Context present:", !!context);

    if (!apiKey) {
      console.error("Chat API Error: Missing or placeholder API key");
      return NextResponse.json({
        role: "assistant",
        content:
          "Please provide a valid GOOGLE_AI_API_KEY in your .env.local file to activate the HelioGrid AI Expert Agent.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const history = (messages ?? [])
      .slice(0, -1)
      .map((m: { role?: string; content?: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content ?? "" }],
      }));

    const firstUserIndex = history.findIndex(
      (m: { role: string }) => m.role === "user"
    );
    const validHistory =
      firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

    const lastMessage = messages[messages.length - 1]?.content ?? "";
    const systemInstruction = buildSystemInstruction(context);

    let lastError: unknown = null;

    // Attempt generation across prioritized candidate models to handle any transient 503s
    for (const model of CANDIDATE_MODELS) {
      try {
        const chat = ai.chats.create({
          model,
          history: validHistory,
          config: {
            systemInstruction,
          },
        });

        const response = await chat.sendMessage({ message: lastMessage });
        const text = response.text ?? "";

        if (text.trim().length > 0) {
          return NextResponse.json({ role: "assistant", content: text });
        }
      } catch (err) {
        console.warn(`[Chat API] Model '${model}' failed:`, err);
        lastError = err;
      }
    }

    const message = lastError instanceof Error ? lastError.message : String(lastError);
    return NextResponse.json({
      role: "assistant",
      content: `Debug Error: All candidate models (${CANDIDATE_MODELS.join(", ")}) were unavailable. Details: ${message}. Key Present: ${!!apiKey}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Chat API Unexpected Error:", error);
    return NextResponse.json({
      role: "assistant",
      content: `Debug Error: ${message}. Key Present: ${!!resolveApiKey()}`,
    });
  }
}
