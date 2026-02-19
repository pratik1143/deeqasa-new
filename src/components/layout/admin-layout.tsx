"use client";

import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-body overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="flex flex-col min-h-screen bg-transparent relative">
          <Header />
          <main className={cn(
            "flex-1 pt-24 pb-12 px-6 lg:px-10 max-w-[1600px] mx-auto w-full relative z-10",
            className
          )}>
            <div className="fixed inset-0 command-grid pointer-events-none opacity-10" />
            <div className="scanline" />
            
            {/* Context-aware Sidebar Trigger for Mobile/Collapsed desktop */}
            <div className="mb-6 flex items-center gap-4 lg:hidden">
              <SidebarTrigger className="h-10 w-10 border-white/10 bg-white/5 hover:bg-primary/10 hover:text-primary transition-all" />
              <div className="h-px flex-1 bg-white/5" />
            </div>

            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}