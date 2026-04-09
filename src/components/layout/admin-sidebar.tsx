"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { useAuth, useUser } from "@/firebase";
import { motion } from "framer-motion";

const ADMIN_EMAILS = ['deeqasa@admin.in'];

const baseAdminLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Lead Management", href: "/dashboard/leads", icon: Users },
  { name: "Sales Funnel", href: "/dashboard/funnel", icon: TrendingUp },
  { name: "Intelligence", href: "/deal-intelligence", icon: BrainCircuit },
  { name: "Quotations", href: "/quotation-builder", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const { state } = useSidebar();

  const isAdminEmail = user && ADMIN_EMAILS.includes(user.email || '');

  const adminLinks = React.useMemo(() => {
    const links = [...baseAdminLinks];
    // Additional admin-only links can be added here
    return links;
  }, [isAdminEmail]);

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-slate-100 bg-white group-data-[collapsible=icon]:w-[80px]"
    >
      <SidebarHeader className="h-20 flex items-center px-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldCheck size={20} />
          </div>
          {state === "expanded" && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase">Deeqasa Core</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Terminal</span>
            </motion.div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-4 mb-4">Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {adminLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "h-11 px-4 transition-all duration-200 rounded-lg",
                        isActive 
                          ? "bg-slate-900 text-white shadow-md font-bold" 
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-primary" : "text-slate-400")} />
                        <span className="text-[13px] font-medium tracking-tight">{item.name}</span>
                        {isActive && state === "expanded" && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-4 mb-4">Preferences</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className={cn(
                    "h-11 px-4 transition-all rounded-lg",
                    pathname === "/dashboard/settings" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <Link href="/dashboard/settings" className="flex items-center gap-3">
                    <Settings className="h-4.5 w-4.5 shrink-0 text-slate-400" />
                    <span className="text-[13px] font-medium tracking-tight">Setings & Security</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-50 bg-slate-50/50">
        <SidebarMenuButton 
          onClick={handleSignOut}
          className="h-11 px-4 text-slate-500 hover:text-destructive hover:bg-destructive/5 transition-all rounded-lg group"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span className="text-[13px] font-medium tracking-tight italic">Sign Out Protocol</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
