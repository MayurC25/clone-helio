"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip as UITooltip, TooltipContent as UITooltipContent, TooltipTrigger as UITooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Zap, ThermometerSun, Sun, TrendingUp, TrendingDown, Scan, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip } from "recharts";
import { WeatherSection } from "@/components/sections/WeatherSection";
import { AIChatbot } from "@/components/sections/AIChatbot";

// Dummy data for charts
const solarData = [
  { time: "06:00", actual: 10, predicted: 12 },
  { time: "09:00", actual: 45, predicted: 48 },
  { time: "12:00", actual: 85, predicted: 80 },
  { time: "15:00", actual: 65, predicted: 70 },
  { time: "18:00", actual: 20, predicted: 22 },
];



export default function Dashboard() {
  const [telemetry, setTelemetry] = useState({
    irradiance: 850,
    voltage: 41.2,
    current: 8.5,
    temperature: 42,
  });
  
  const [healthScore, setHealthScore] = useState(94);
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Solar Operations Center</h2>
          <p className="text-slate-500">Real-time monitoring and AI-driven asset management.</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            Live Sync
          </Badge>
          <div className="text-sm font-medium text-slate-400 border border-slate-200 rounded-md px-3 py-1">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metrics & Main Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Generation" value="4.2 kW" subValue="+12% vs exp." icon={<Zap className="text-emerald-500" />} />
            <MetricCard title="Irradiance" value={`${telemetry.irradiance} W/m²`} subValue="Peak Sun" icon={<Sun className="text-amber-500" />} />
            <MetricCard title="Current" value={`${telemetry.current} A`} subValue="Output flow" icon={<Activity className="text-blue-500" />} />
            <MetricCard title="Efficiency" value={`${healthScore}%`} subValue="System Health" icon={<Activity className="text-rose-500" />} />
          </div>

          {/* Helio-Weather Integrated Here */}
          <WeatherSection />

          {/* Large Performance Chart */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Energy Generation vs Prediction</CardTitle>
                <p className="text-xs text-slate-500 mt-1">LSTM neural model analysis for the current 24h cycle.</p>
              </div>
              <Tabs defaultValue="24h" className="w-auto">
                <TabsList className="bg-slate-100 border-none h-8">
                  <TabsTrigger value="24h" className="text-xs">24h</TabsTrigger>
                  <TabsTrigger value="7d" className="text-xs">7d</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="h-[400px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={solarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                  <Line type="monotone" dataKey="predicted" stroke="#cbd5e1" strokeDasharray="5 5" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Chatbot */}
        <div className="space-y-8 h-full">
          <AIChatbot
            telemetry={{
              generationKw: 4.2,
              voltage: telemetry.voltage,
              currentA: telemetry.current,
              healthScore,
              irradianceWm2: telemetry.irradiance,
              temperatureC: telemetry.temperature,
            }}
          />
          
          <Card className="border-slate-200 shadow-sm bg-white p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-4">Device Health Status</h3>
            <div className="space-y-4">
              <HealthStatus label="Inverter A" status="Active" color="bg-emerald-500" />
              <HealthStatus label="Inverter B" status="Active" color="bg-emerald-500" />
              <HealthStatus label="Main Meter" status="Syncing" color="bg-amber-500" />
            </div>
          </Card>
        </div>
      </div>

      {/* SolNet Anomaly Scanner Quick Access Banner */}
      <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-emerald-50/60 via-white to-slate-50 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Scan className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">SolNet Panel Anomaly Scanner</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  SolNet Ready · 99.0% Acc
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Visual inspection powered by ResNet-50. Detect soiling, shading, hotspots, and micro-cracks with GradCAM heatmaps.
              </p>
            </div>
          </div>
          <Link
            href="/scanner"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Open Panel Scanner</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </Card>
    </div>
  );
}

function HealthStatus({ label, status, color }: { label: string, status: string, color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase">{status}</span>
        <div className={cn("w-2 h-2 rounded-full", color)} />
      </div>
    </div>
  );
}

function MetricCard({ title, value, subValue, icon }: { title: string, value: string, subValue: string, icon: React.ReactNode }) {
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
