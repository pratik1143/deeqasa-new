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
            <div className="fixed inset-0 command-grid pointer-events-none opacity-[0.03] dark:opacity-10" />
            <div className="scanline opacity-0 dark:opacity-100" />
            
            {/* Sidebar Toggle Trigger */}
            <div className="mb-6 flex items-center gap-4">
              <SidebarTrigger className="h-10 w-10 border-border bg-card hover:bg-accent hover:text-primary transition-all shadow-sm" />
              <div className="h-px flex-1 bg-border" />
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] hidden sm:block">
                Mission Workspace Control
              </div>
            </div>

            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
