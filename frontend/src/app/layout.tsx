"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="antialiased bg-white text-slate-900">
        {isLandingPage ? (
          <main className="w-full min-h-screen overflow-x-hidden">
            <TooltipProvider>{children}</TooltipProvider>
          </main>
        ) : (
          <div className="flex w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
              <TopBar />
              <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50">
                <TooltipProvider>{children}</TooltipProvider>
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
