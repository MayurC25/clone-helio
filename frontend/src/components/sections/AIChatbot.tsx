"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Send, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessageContent } from "@/components/sections/ChatMessageContent";
import {
  buildHelioContext,
  type HelioLiveContext,
} from "@/lib/helioContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatbotProps {
  telemetry?: HelioLiveContext["telemetry"];
}

const QUICK_PROMPTS = [
  "Give me a current conditions update",
  "Any stow or wind alerts?",
  "Best tilt angle right now?",
];

export function AIChatbot({ telemetry }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your HelioGrid AI Agent. I can brief you on live weather, solar output, and panel recommendations using your GPS and dashboard data.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [liveContext, setLiveContext] = useState<HelioLiveContext | null>(
    null
  );
  const [contextStatus, setContextStatus] = useState<
    "loading" | "ready" | "partial" | "unavailable"
  >("loading");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    buildHelioContext({ telemetry })
      .then((context) => {
        if (cancelled) return;
        setLiveContext(context);
        if (context.location && context.weather) {
          setContextStatus("ready");
        } else if (context.telemetry || context.scanner?.backendOnline) {
          setContextStatus("partial");
        } else {
          setContextStatus("unavailable");
        }
      })
      .catch(() => {
        if (!cancelled) setContextStatus("unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, [telemetry]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const context =
        liveContext ?? (await buildHelioContext({ telemetry }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, context }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please check your API key and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const contextLabel =
    contextStatus === "ready"
      ? "Live GPS + system data"
      : contextStatus === "partial"
        ? "Partial system data"
        : contextStatus === "loading"
          ? "Syncing live data..."
          : "Enable location for weather data";

  return (
    <Card className="border-slate-200 shadow-sm flex flex-col h-[560px] bg-white">
      <CardHeader className="bg-slate-50/50 border-b border-slate-200 py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Helio-AI Expert Agent
        </CardTitle>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              contextStatus === "ready"
                ? "bg-emerald-500 animate-pulse"
                : contextStatus === "loading"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-slate-300"
            )}
          />
          <span className="text-[10px] text-slate-400 font-medium">
            {contextLabel}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b border-slate-100">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => sendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3",
                m.role === "user"
                  ? "ml-auto flex-row-reverse max-w-[80%]"
                  : "mr-auto w-full"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                  m.role === "assistant"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                )}
              >
                {m.role === "assistant" ? (
                  <Bot className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div
                className={cn(
                  "rounded-2xl shadow-sm min-w-0",
                  m.role === "assistant"
                    ? "flex-1 bg-white border border-slate-200 text-slate-700 px-3.5 py-3"
                    : "bg-emerald-600 text-white px-3 py-2.5"
                )}
              >
                <ChatMessageContent content={m.content} role={m.role} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-emerald-50 border-emerald-100 text-emerald-600">
                <Bot className="w-5 h-5 animate-bounce" />
              </div>
              <div className="p-3 rounded-2xl text-sm bg-white border border-slate-200 text-slate-400 italic">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder={
                isLoading ? "AI is thinking..." : "Ask the solar expert..."
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-300"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
