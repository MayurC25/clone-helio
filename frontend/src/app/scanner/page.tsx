"use client";

import { ScannerSection } from "@/components/sections/ScannerSection";
import { Badge } from "@/components/ui/badge";
import { Scan, Cpu, ShieldCheck, Flame, Droplets, Cloud, Zap, CheckCircle2 } from "lucide-react";

export default function ScannerPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Header matching Agent & Weather pages */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Scan className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">SolNet Panel Anomaly Scanner</h2>
          </div>
          <p className="text-slate-500 text-sm">
            AI-powered solar photovoltaic defect inspection using ResNet-50 classification and GradCAM explainability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs">
            <Cpu className="w-3 h-3 mr-1.5 text-emerald-600" />
            ResNet-50 Engine
          </Badge>
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border border-slate-200 px-3 py-1 font-mono text-xs">
            <ShieldCheck className="w-3 h-3 mr-1.5 text-slate-600" />
            5 Class Multimodal
          </Badge>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="w-full">
        <ScannerSection embedded={false} />
      </div>

      {/* Class Reference Guide Cards with Visual Thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
        
        {/* Healthy */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-24 w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-900">
              <img 
                src="/sample-panels/healthy.jpg" 
                alt="Healthy Solar Panel"
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Healthy (30%)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Clean silicon cells, uniform dark blue/black anti-reflective coating, and intact silver busbars.
            </p>
          </div>
        </div>

        {/* Micro-Crack (User-provided defect image) */}
        <div className="p-4 rounded-xl bg-white border border-amber-200/90 shadow-2xs space-y-2.5 flex flex-col justify-between ring-1 ring-amber-400/20">
          <div className="space-y-2">
            <div className="h-24 w-full rounded-lg overflow-hidden border border-amber-100 bg-slate-900 relative">
              <img 
                src="/sample-panels/micro_crack.png" 
                alt="Micro-Crack Solar Cell with Snail Trails"
                className="w-full h-full object-cover" 
              />
              <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-amber-300 font-bold">
                Active Sample
              </span>
            </div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
              <Zap className="w-4 h-4" />
              <span>Micro-Crack (15%)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hairline dendritic fractures (snail trails) spreading outward from busbars. High risk of electrical isolation.
            </p>
          </div>
        </div>

        {/* Hotspot */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-24 w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-900">
              <img 
                src="/sample-panels/hotspot.jpg" 
                alt="Hotspot Thermal Solar Panel"
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-xs">
              <Flame className="w-4 h-4" />
              <span>Hotspot (20%)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Localized thermal dissipation and overheated cells caused by damaged bypass diodes or cell shunting.
            </p>
          </div>
        </div>

        {/* Soiling */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-24 w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-900">
              <img 
                src="/sample-panels/soiling.jpg" 
                alt="Soiling Dust Solar Panel"
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
              <Droplets className="w-4 h-4" />
              <span>Soiling (25%)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Accumulation of dust, particulate matter, or bird droppings reducing irradiance by 10%–35%.
            </p>
          </div>
        </div>

        {/* Shading */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-24 w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-900">
              <img 
                src="/sample-panels/shading.jpg" 
                alt="Shading Shadow Solar Panel"
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
              <Cloud className="w-4 h-4" />
              <span>Shading (10%)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Partial shadow casting from obstacles, nearby trees, or structural poles across string cells.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
