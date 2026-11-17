"use client";

import { Bell, Search, User, Menu, X, LayoutDashboard, CloudSun, MessageSquare, BarChart3, Settings, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Helio-Weather", href: "/weather", icon: CloudSun },
  { name: "AI Agent", href: "/agent", icon: MessageSquare },
  { name: "Panel Scanner", href: "/scanner", icon: Scan },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function TopBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard": return "Dashboard";
      case "/weather": return "Helio-Weather";
      case "/agent": return "AI Agent";
      case "/scanner":
      case "/scan": return "Panel Scanner";
      case "/analytics": return "Analytics";
      case "/settings": return "Settings";
      default: return "Dashboard";
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden md:block min-w-[120px]">
            {getPageTitle(pathname)}
          </h1>
          
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search telemetry..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2" />
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">Solar Admin</p>
            <p className="text-xs text-slate-500 mt-1">Premium Operator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div className={cn(
        "lg:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 z-30 transition-all duration-300 ease-in-out shadow-xl",
        mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <nav className="flex flex-col px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-colors",
                  isActive 
                    ? "bg-emerald-50 text-emerald-600" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-600" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
