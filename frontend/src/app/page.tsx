"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Activity,
  ArrowRight,
  Cpu,
  BarChart3,
  Globe,
  Scan,
  CheckCircle2,
  Sparkles,
  Layers,
  Award,
  FileText,
  Download,
  Clock,
  BatteryCharging,
  ShieldCheck,
  MapPin,
  ExternalLink,
  ChevronDown,
  Sun,
  Camera,
  Server,
  Database,
  Wifi,
  FileCheck2,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden font-sans">

      {/* Background Soft Organic Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[130px]" />
        <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[130px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[550px] h-[550px] bg-slate-200/50 rounded-full blur-[140px]" />
      </div>

      {/* FLOATING IN CENTER GLASSMORPHISM TASKBAR (Light White & Green Theme) */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 pointer-events-none">
        <nav
          aria-label="Floating Navigation Taskbar"
          className="pointer-events-auto rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6 bg-white/85 backdrop-blur-2xl border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5 transition-all"
        >
          {/* Brand Mark */}
          <Link href="#hero" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="leading-none hidden sm:block text-left">
              <span className="text-sm font-black tracking-tight text-slate-900">
                HELIO<span className="text-emerald-600">GRID</span>
              </span>
              <span className="block text-[8px] font-mono text-emerald-600/90 tracking-widest uppercase font-bold">
                AI·OS
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links with Smooth Scrolling */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {[
              { name: "Overview", href: "#overview" },
              { name: "3 AI Models", href: "#models" },
              { name: "Gaps Solved", href: "#gaps" },
              { name: "8-Layer Pipeline", href: "#pipeline" },
              { name: "Evaluation", href: "#results" },
              { name: "Team & Somaiya", href: "#team" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all select-none hidden md:inline-block"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Action: Launch Real Dashboard Webapp */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-mono text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SolNet Online
            </div>

            <Link
              href="/dashboard"
              className="px-4 sm:px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </nav>
      </header>

      {/* MAIN WEBSITE CONTENT CONTAINER */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-24">

        {/* Somaiya Academic Crest & End-Sem Evaluation Banner (Slide 1 & 2) */}
        <section className="p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs">
              <img
                src="/ppt-assets/image-1-1.png"
                alt="Somaiya Vidyavihar University Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs hidden sm:flex">
              <img
                src="/ppt-assets/image-1-2.png"
                alt="Somaiya Trust Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">
                SOMAIYA VIDYAVIHAR UNIVERSITY
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                K J Somaiya School of Engineering · Department of Information Technology
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              Final Year Project · Group ID: 23
            </span>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline-block">
              Guide: Dr. Sanjay Vidhani
            </span>
          </div>
        </section>

        {/* HERO SECTION */}
        <section id="hero" className="pt-2 pb-6 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <motion.div
              className="lg:col-span-7 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Unified Vision CNN + Transformer + Reinforcement Learning
                </div>
                <a
                  href="/papers/HelioGrid_AI_IEEE_Paper.pdf"
                  download="HelioGrid_AI_IEEE_Paper.pdf"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  Paper
                </a>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-slate-900">
                HelioGrid <span className="text-emerald-600">AI</span>
                <br />
                <span className="text-2xl sm:text-4xl xl:text-5xl font-extrabold text-slate-700">
                  Intelligent Solar Energy Monitoring & Optimisation
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
                A unified AI-powered IoT platform addressing the critical gaps in solar monitoring by fusing
                <strong className="text-emerald-600 font-semibold"> SolNet CNN (ResNet-50)</strong> for visual defect detection,
                <strong className="text-emerald-700 font-semibold"> SP-Transformer</strong> for 24–72h generation forecasting, and a
                <strong className="text-emerald-600 font-semibold"> DDPG Reinforcement Learning</strong> agent for autonomous energy-dispatch arbitrage.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Launch Operations Dashboard</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <a
                  href="#models"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 shadow-xs flex items-center gap-2 transition-all hover:border-emerald-300"
                >
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  Explore AI Models
                </a>
              </div>

              {/* 4 Impact Metrics (Slide 19 Conclusion) */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 block font-mono">89.0%</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">SolNet Accuracy</span>
                  <span className="block text-[9px] text-emerald-600 font-medium mt-0.5">+17 pts vs baseline</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-slate-800 block font-mono">11.1%</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Forecast RMSE</span>
                  <span className="block text-[9px] text-emerald-600 font-medium mt-0.5">7.3 pts &gt; LSTM</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 block font-mono">22.3%</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Grid Cost Cut</span>
                  <span className="block text-[9px] text-slate-500 font-medium mt-0.5">DDPG Dispatch</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-2xl sm:text-3xl font-black text-slate-800 block font-mono">&lt; 5s</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Pipeline Latency</span>
                  <span className="block text-[9px] text-emerald-600 font-medium mt-0.5">Mean 3.4s · p95 4.8s</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Card Visual (Slide 14) */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Link href="/scanner" className="block group">
                <div className="rounded-3xl p-5 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl space-y-4 hover:border-emerald-300 transition-all hover:shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-mono text-slate-600 font-medium ml-2 group-hover:text-emerald-600 transition-colors">
                        SolNet GradCAM Scanner ↗
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-semibold">
                      Micro Crack 99.78%
                    </span>
                  </div>

                  {/* Screenshot from Presentation Slide 14 */}
                  <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-900 shadow-inner">
                    <img
                      src="/ppt-assets/image-14-3.png"
                      alt="SolNet Anomaly Scanner Interface"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Sensor Benchmark pill */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">ESP32 + Raspberry Pi 5 Node</p>
                      <p className="text-[11px] text-slate-500 font-mono">Reference: 24.2V · 2.97A · 45.3°C @ 3.2s</p>
                    </div>
                    <span className="text-[10px] font-bold font-mono uppercase text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      TC_1 PASS
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>
        </section>

        {/* SECTION 2: PROBLEM DEFINITION & TRADITIONAL VS HELIOGRID ADVANTAGE (Slide 3) */}
        <section id="overview" className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">
              Slide 3 · Problem Definition
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Traditional Solar Monitoring vs. HelioGrid AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Traditional platforms display only basic telemetry (voltage, current, energy totals) without predictive or visual intelligence, forcing operators to rely on periodic manual inspections and reactive maintenance.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                  <th className="py-3.5 px-4 font-bold">Approach</th>
                  <th className="py-3.5 px-4 font-bold">Main Limitation</th>
                  <th className="py-3.5 px-4 font-bold text-emerald-600">HelioGrid AI Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Manual Inspection</td>
                  <td className="py-3.5 px-4 text-rose-600 font-medium">Time-consuming, infrequent, misses early degradation</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold bg-emerald-50/30">Continuous automated 24/7 AI fault detection</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Threshold-based Alerts</td>
                  <td className="py-3.5 px-4 text-rose-600 font-medium">Ignores visual faults (soiling, micro-cracks)</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold bg-emerald-50/30">CNN-based visual inspection (SolNet) catches non-electrical defects</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Simple ML Forecasting</td>
                  <td className="py-3.5 px-4 text-rose-600 font-medium">Weather-unaware, short windows only</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold bg-emerald-50/30">SP-Transformer fuses weather + history for 24–72h forecasts</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">Rule-based Dispatch</td>
                  <td className="py-3.5 px-4 text-rose-600 font-medium">Cannot adapt dynamically to generation variability</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold bg-emerald-50/30">DDPG RL agent adapts dispatch, cutting grid cost by 22.3%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: THE 3 CORE AI PILLARS (Slides 4, 11, 14, 15) */}
        <section id="models" className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-mono">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              Intelligence Core
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900">
              Three Collaborative AI Models
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Each AI engine operates independently to solve a distinct microgrid challenge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Model 1: SolNet CNN */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black shadow-xs">
                <Scan className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">
                  Visual Fault Inspection
                </span>
                <h3 className="text-xl font-black text-slate-900">SolNet CNN (ResNet-50)</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fine-tuned on ~2,500 solar panel images across 5 defect classes:
                <span className="text-emerald-600 font-semibold"> Healthy (30%)</span>,
                <span className="text-blue-600 font-semibold"> Soiling (25%)</span>,
                <span className="text-amber-600 font-semibold"> Hotspot (20%)</span>,
                <span className="text-rose-600 font-semibold"> Micro-crack (15%)</span>, and
                <span className="text-slate-600 font-semibold"> Shading (10%)</span>.
              </p>
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Accuracy:</span>
                  <span className="font-mono text-emerald-600 font-bold">89.0% (+17 pts vs baseline)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Explainability:</span>
                  <span className="font-mono text-slate-800 font-medium">GradCAM Heatmap Overlay</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Preprocessing:</span>
                  <span className="font-mono text-slate-800 font-medium">CLAHE + 224×224 resize</span>
                </div>
              </div>
            </div>

            {/* Model 2: SP-Transformer */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-black shadow-xs">
                <BarChart3 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-600 font-bold block mb-1">
                  Solar Power Forecasting
                </span>
                <h3 className="text-xl font-black text-slate-900">SP-Transformer</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hybrid LSTM + Attention architecture fusing 18 months of hourly solar production (5kW residential installation) with satellite weather parameters (cloud cover, temperature, irradiance, wind).
              </p>
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">24h Forecast RMSE:</span>
                  <span className="font-mono text-teal-600 font-bold">11.1% (380W mean)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">vs. Baseline:</span>
                  <span className="font-mono text-emerald-600 font-bold">7.3 pts better than LSTM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Prediction Horizon:</span>
                  <span className="font-mono text-slate-800 font-medium">24h to 72h continuous</span>
                </div>
              </div>
            </div>

            {/* Model 3: DDPG RL Agent */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black shadow-xs">
                <BatteryCharging className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">
                  Autonomous Energy Dispatch
                </span>
                <h3 className="text-xl font-black text-slate-900">DDPG RL Agent</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deep Deterministic Policy Gradient continuous action agent that arbitrates battery charging/discharging and grid import decisions dynamically against variable electricity tariffs.
              </p>
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Grid Import Cost:</span>
                  <span className="font-mono text-emerald-600 font-bold">-22.3% reduction</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Self-Consumption:</span>
                  <span className="font-mono text-emerald-600 font-bold">61% → 74% (+13 pts)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Battery Cycling:</span>
                  <span className="font-mono text-slate-800 font-medium">-18% degradation</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: 6 CRITICAL RESEARCH GAPS (Slide 8) */}
        <section id="gaps" className="space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">
              Slide 8 · Literature Analysis
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              6 Critical Research Gaps Identified & Resolved
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: "1",
                title: "No Unified Platform",
                desc: "Existing systems address monitoring, prediction, or optimisation in isolation — HelioGrid AI integrates all three with vision-based fault detection.",
                badge: "RESOLVED",
              },
              {
                id: "2",
                title: "Limited Fault Detection",
                desc: "Most systems rely purely on electrical threshold anomalies, missing visual defects like soiling and micro-cracks detected by SolNet GradCAM.",
                badge: "RESOLVED",
              },
              {
                id: "3",
                title: "RL Absent in Deployed Systems",
                desc: "Despite strong academic claims, RL dispatch is rarely operationalised. Our DDPG agent acts continuously on battery/grid schedules.",
                badge: "RESOLVED",
              },
              {
                id: "4",
                title: "Poor Weather Integration",
                desc: "Weather data was traditionally isolated; SP-Transformer fuses live satellite & weather telemetry directly into generation predictions.",
                badge: "RESOLVED",
              },
              {
                id: "5",
                title: "Scalability Gaps",
                desc: "Monolithic designs break down when expanding. Our microservices architecture scales from 10 to 500+ panels seamlessly.",
                badge: "RESOLVED",
              },
              {
                id: "6",
                title: "No Edge Intelligence",
                desc: "Cloud-only telemetry introduces latency and single-point-of-failure. Raspberry Pi 5 performs CLAHE pre-processing locally before upload.",
                badge: "RESOLVED",
              },
            ].map((gap) => (
              <div key={gap.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">GAP #{gap.id}</span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{gap.badge}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{gap.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{gap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: SYSTEM ARCHITECTURE — EIGHT-LAYER PIPELINE (Slide 10 & 11) */}
        <section id="pipeline" className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">
              Slide 10 & 11 · Figure 3
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Eight-Layer IoT-AI Pipeline Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              End-to-end telemetry from physical ESP32 sensors through MQTT, FastAPI microservices, MongoDB, and the interactive frontend.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 shadow-inner">
            <img
              src="/ppt-assets/image-10-3.png"
              alt="Eight-Layer IoT-AI Pipeline Diagram"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">1. Input Layer</span>
              <p className="text-xs font-bold text-slate-900">ESP32 & RPi 5</p>
              <p className="text-[11px] text-slate-500">1s telemetry & 15m camera captures</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-mono text-teal-600 font-bold uppercase">2. Edge Preprocessing</span>
              <p className="text-xs font-bold text-slate-900">CLAHE + OpenCV</p>
              <p className="text-[11px] text-slate-500">Contrast enhancement & 224x224</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">3. Communication</span>
              <p className="text-xs font-bold text-slate-900">MQTT Mosquitto</p>
              <p className="text-[11px] text-slate-500">Sub-second pub/sub messaging</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-mono text-teal-600 font-bold uppercase">4. Serving & Storage</span>
              <p className="text-xs font-bold text-slate-900">FastAPI & MongoDB</p>
              <p className="text-[11px] text-slate-500">Microservice AI routing & logs</p>
            </div>
          </div>
        </section>

        {/* SECTION 6: DATASET DISTRIBUTION (Slide 9) */}
        <section className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">
                Slide 9 · Dataset Description
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Curated Datasets & Class Distribution
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              ~2,500 panel images (80/10/10 split)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-4 flex items-center justify-center">
              <img
                src="/ppt-assets/image-9-3.png"
                alt="Panel Fault Class Distribution Pie Chart"
                className="w-full max-w-sm h-auto object-contain rounded-xl"
              />
            </div>
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <h4 className="text-xs font-mono text-emerald-700 font-bold uppercase">Panel Image Dataset</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ~2,500 images combining ELPV dataset and Kaggle repositories: Healthy (30%), Soiling (25%), Hotspot (20%), Micro-crack (15%), Shading (10%). Trains SolNet CNN.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <h4 className="text-xs font-mono text-teal-700 font-bold uppercase">Solar Production Time-Series</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  18 months of hourly solar production (kWh) from a 5kW residential installation coupled with weather API parameters. Trains SP-Transformer.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <h4 className="text-xs font-mono text-emerald-700 font-bold uppercase">Energy Simulation Dataset</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  30-day synthetic profiles (panel model + CERN load profiles + battery model + variable tariff schedule). Trains the DDPG agent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: IMPLEMENTATION RESULTS & TEST CASES (Slide 15 & 16) */}
        <section id="results" className="space-y-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">
              Slide 15 & 16 · Empirical Evaluation
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Experimental Results & Benchmark Discussion
            </h2>
          </div>

          {/* Benchmark Table */}
          <div className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Model Metrics vs. Standard Baselines</h3>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                All Targets Exceeded
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-6 font-bold">Model</th>
                    <th className="py-3 px-6 font-bold">Metric</th>
                    <th className="py-3 px-6 font-bold text-emerald-600">Result</th>
                    <th className="py-3 px-6 font-bold">vs. Baseline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">SolNet CNN</td>
                    <td className="py-3.5 px-6 text-slate-600">Overall fault-detection accuracy</td>
                    <td className="py-3.5 px-6 font-mono font-bold text-emerald-600">89.0%</td>
                    <td className="py-3.5 px-6 font-semibold text-emerald-700 bg-emerald-50/30">+17 pts vs. 72% threshold baseline</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">SP-Transformer</td>
                    <td className="py-3.5 px-6 text-slate-600">24-hour forecast RMSE</td>
                    <td className="py-3.5 px-6 font-mono font-bold text-emerald-600">11.1%</td>
                    <td className="py-3.5 px-6 font-semibold text-emerald-700 bg-emerald-50/30">7.3 pts better than LSTM baseline</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">DDPG Agent</td>
                    <td className="py-3.5 px-6 text-slate-600">Grid import cost reduction</td>
                    <td className="py-3.5 px-6 font-mono font-bold text-emerald-600">22.3%</td>
                    <td className="py-3.5 px-6 font-semibold text-emerald-700 bg-emerald-50/30">vs. rule-based dispatch policy</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">DDPG Agent</td>
                    <td className="py-3.5 px-6 text-slate-600">Self-consumption ratio</td>
                    <td className="py-3.5 px-6 font-mono font-bold text-emerald-600">61% → 74%</td>
                    <td className="py-3.5 px-6 font-semibold text-emerald-700 bg-emerald-50/30">+13 pts; battery cycling -18%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">End-to-end Pipeline</td>
                    <td className="py-3.5 px-6 text-slate-600">p95 latency (sensor → dashboard)</td>
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-800">4.8s (mean 3.4s)</td>
                    <td className="py-3.5 px-6 font-semibold text-emerald-700 bg-emerald-50/30">Within ≤ 5s requirement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Figure Charts Banner from Slide 15 */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm space-y-3">
            <p className="text-xs font-mono text-slate-500 font-medium">
              Fig 4: Daily Energy Generation vs Prediction Accuracy · Fig 5: Panel Health Distribution · Fig 6: Energy Optimisation Savings
            </p>
            <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 p-2">
              <img
                src="/ppt-assets/image-15-3.png"
                alt="Results Charts Fig 4, 5, 6"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Software Test Cases (Slide 16) */}
          <div className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Software Test Cases Suite (Slide 16)</h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                5 / 5 PASSED
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">Test ID</th>
                    <th className="py-3 px-4 font-bold">Test Case</th>
                    <th className="py-3 px-4 font-bold">Expected Result</th>
                    <th className="py-3 px-4 font-bold">Actual Result</th>
                    <th className="py-3 px-4 text-center font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-xs">
                  {[
                    { id: "TC_1", name: "Sensor data acquisition (ESP32 bench test)", exp: "Values on dashboard ≤ 5s", act: "24.2V, 2.97A, 45.3°C @ 3.2s", st: "PASS" },
                    { id: "TC_2", name: "SP-Transformer 24h solar forecast", exp: "RMSE ≤ 15% of mean output", act: "RMSE = 11.1% (380W mean)", st: "PASS" },
                    { id: "TC_3", name: "SolNet CNN fault classification", exp: "≥85% accuracy per class", act: "89.0% overall (micro-crack F1=81%)", st: "PASS" },
                    { id: "TC_4", name: "DDPG energy-optimisation agent", exp: "≥15% grid-import cost cut", act: "22.3% reduction; -18% battery cycles", st: "PASS" },
                    { id: "TC_5", name: "End-to-end pipeline latency", exp: "≤ 5s sensor-to-dashboard", act: "Mean 3.4s, p95 4.8s", st: "PASS" },
                  ].map((tc) => (
                    <tr key={tc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-emerald-600">{tc.id}</td>
                      <td className="py-3 px-4 font-sans text-slate-900 font-medium">{tc.name}</td>
                      <td className="py-3 px-4 font-sans text-slate-600">{tc.exp}</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">{tc.act}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {tc.st}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 8: SOMAIYA VIDYAVIHAR & PROJECT TEAM (Slide 1, 2, 17, 18) */}
        <section id="team" className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">
                Academic Evaluation & Engineering Team
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Somaiya Vidyavihar University · Group 23
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <img src="/ppt-assets/image-1-1.png" alt="Somaiya Logo" className="h-6 w-auto object-contain" />
              </div>
              <div className="h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <img src="/ppt-assets/image-1-2.png" alt="Somaiya Trust Logo" className="h-6 w-auto object-contain" />
              </div>
            </div>
          </div>

          {/* Team Members Grid (Slide 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Mayur Chavan", roll: "16014224804", initials: "MC", role: "ML & Reinforcement Learning", focus: "DDPG agent dispatch policy & simulation modeling." },
              { name: "Shubham Jadhav", roll: "16014224807", initials: "SJ", role: "Deep Learning & Vision", focus: "SolNet CNN (ResNet-50) defect detection & GradCAM." },
              { name: "Saarth Jagtap", roll: "16014224808", initials: "SJ", role: "Time-Series & Forecasting", focus: "SP-Transformer architecture & weather API fusion." },
              { name: "Vatsal Shukla", roll: "16014224820", initials: "VS", role: "IoT Hardware & Cloud", focus: "ESP32 sensors, Raspberry Pi 5, MQTT & system integration." },
            ].map((member) => (
              <div key={member.roll} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 hover:border-emerald-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center font-bold text-emerald-800 font-mono text-sm">
                    {member.initials}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold">
                    {member.roll}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                  <p className="text-xs font-semibold text-emerald-600">{member.role}</p>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  {member.focus}
                </p>
              </div>
            ))}
          </div>

          {/* Guide & Research Paper Cards (Slide 2 & 18) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">Faculty Project Guide</span>
                  <h3 className="text-base font-bold text-slate-900">Dr. Sanjay Vidhani</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                K J Somaiya School of Engineering · Department of Information Technology. Guiding the multi-model architecture and empirical microgrid validation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-600 font-bold block">Research Paper Manuscript</span>
                  <h3 className="text-base font-bold text-slate-900">IEEE Paper · HelioGrid AI</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                <em>“HelioGrid AI: A Unified IoT-AI Framework for Solar Fault Detection, Forecasting, and Energy Dispatch Optimisation”</em>
              </p>
              <a
                href="/papers/HelioGrid_AI_IEEE_Paper.pdf"
                download="HelioGrid_AI_IEEE_Paper.pdf"
                className="inline-flex items-center gap-1.5 mt-2 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 text-xs font-semibold border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                Download PDF
              </a>
            </div>
          </div>

          {/* Campus Buildings Visuals (Aryabhat & Bhaskaracharya) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl overflow-hidden border border-slate-200 relative group shadow-xs">
              <img
                src="/ppt-assets/image-1-3.png"
                alt="Aryabhat Building - KJSSE"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
                <div>
                  <p className="text-[10px] font-mono text-emerald-300 uppercase font-bold">Somaiya Vidyavihar Campus</p>
                  <p className="text-sm font-bold text-white">Aryabhat Building · K J Somaiya College of Engineering</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 relative group shadow-xs">
              <img
                src="/ppt-assets/image-1-4.png"
                alt="Bhaskaracharya Building - KJSSE"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
                <div>
                  <p className="text-[10px] font-mono text-emerald-300 uppercase font-bold">Somaiya Vidyavihar Campus</p>
                  <p className="text-sm font-bold text-white">Bhaskaracharya Building · Department of IT</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM LAUNCH CTA CARD */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-center space-y-6 shadow-xl shadow-emerald-600/20">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-white shadow-lg">
            <Zap className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Explore the Real Operations Center?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Launch into the live webapp dashboard with active ESP32 sensor telemetry, SolNet visual scanner, and real-time solar harvest forecasting.
            </p>
          </div>
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-emerald-700 font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Operations Dashboard</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-10 px-4 text-center text-xs text-slate-500 space-y-2 bg-white">
        <p className="font-semibold text-slate-700">© 2026 HelioGrid AI · Somaiya Vidyavihar University</p>
        <p className="text-[11px] text-slate-500">Department of Information Technology · K J Somaiya School of Engineering · Group 23</p>
        <div className="flex justify-center gap-6 pt-2 font-medium">
          <a href="/papers/HelioGrid_AI_IEEE_Paper.pdf" download="HelioGrid_AI_IEEE_Paper.pdf" className="hover:text-emerald-600 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            Research Paper
          </a>
          <a href="https://github.com/dub1-max/HelioGrid-AI" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 flex items-center gap-1">
            <GithubIcon className="w-3.5 h-3.5" />
            GitHub Repository
          </a>
          <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600">
            FastAPI Docs
          </a>
          <Link href="/dashboard" className="hover:text-emerald-600">
            Launch Webapp
          </Link>
        </div>
      </footer>

    </div>
  );
}
