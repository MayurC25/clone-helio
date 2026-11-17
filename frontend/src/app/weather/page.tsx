"use client";

import { WeatherSection } from "@/components/sections/WeatherSection";

export default function WeatherPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Helio-Weather Intelligence</h2>
        <p className="text-slate-500">Hyper-local solar forecasting and environmental analytics.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <WeatherSection />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase mb-4">Atmospheric Pressure</h3>
          <div className="h-32 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center">
            <span className="text-slate-400 text-xs font-medium italic">Advanced barometric data loading...</span>
          </div>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase mb-4">Cloud Cover Probability</h3>
          <div className="h-32 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center">
            <span className="text-slate-400 text-xs font-medium italic">Satellite imagery processing...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
