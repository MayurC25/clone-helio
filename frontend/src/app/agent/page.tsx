"use client";

import { AIChatbot } from "@/components/sections/AIChatbot";

export default function AgentPage() {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col space-y-6">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-slate-900">Helio-AI Expert Agent</h2>
        <p className="text-slate-500">Your dedicated mission control for solar optimization and diagnostics.</p>
      </div>
      
      <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="h-full max-w-4xl mx-auto">
          <AIChatbot />
        </div>
      </div>
    </div>
  );
}
