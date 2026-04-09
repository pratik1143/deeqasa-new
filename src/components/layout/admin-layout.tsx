"use client";

import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";
import { Header } from "./header";
import { WacusBackground } from "./wacus-background";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f8fafc] font-[Outfit] text-slate-900 selection:bg-primary/30 overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="flex flex-col min-h-screen bg-transparent relative">
          <Header />
          <main className={cn(
            "flex-1 pt-24 pb-12 px-6 lg:px-10 max-w-[1700px] mx-auto w-full relative z-10",
            className
          )}>
            {/* SaaS Status Bar */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-11 w-11 border-slate-100 bg-white hover:bg-slate-50 hover:text-primary transition-all shadow-sm rounded-xl" />
                <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                    System Operational
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                  v4.2.0-STABLE
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {children}
            </motion.div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
