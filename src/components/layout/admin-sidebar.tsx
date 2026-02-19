
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  Wallet
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

const ADMIN_EMAILS = ['deeqasa@admin.in'];

const baseAdminLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Quotation Builder", href: "/quotation-builder", icon: FileText },
  { name: "AI Intelligence", href: "/deal-intelligence", icon: BrainCircuit },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const { state, setOpen, isMobile } = useSidebar();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const isAdminEmail = user && ADMIN_EMAILS.includes(user.email || '');

  const adminLinks = React.useMemo(() => {
    if (isAdminEmail) {
      return [...baseAdminLinks, { name: "Expense Management", href: "/expenses", icon: Wallet }];
    }
    return baseAdminLinks;
  }, [isAdminEmail]);

  const handleSignOut = () => {
    auth.signOut();
  };

  const startAutoHideTimer = React.useCallback(() => {
    if (isMobile) return;
    
    if (state === "expanded") {
      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  }, [state, setOpen, isMobile]);

  const cancelAutoHideTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => cancelAutoHideTimer();
  }, [cancelAutoHideTimer]);

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-white/10 bg-black/95 backdrop-blur-xl"
      onMouseEnter={cancelAutoHideTimer}
      onMouseLeave={startAutoHideTimer}
    >
      <SidebarHeader className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-black shrink-0">
            <Zap size={18} fill="currentColor" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col">
              <span className="text-sm font-black text-white uppercase tracking-tighter leading-none">ADMIN CORE</span>
              <span className="text-[8px] font-bold text-primary uppercase tracking-[0.3em] mt-1">Terminal Active</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-2 py-4">Main Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "h-12 px-3 transition-all group",
                        isActive ? "bg-primary/10 text-primary" : "text-white/60 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className={cn("shrink-0", isActive ? "text-primary" : "text-white/40 group-hover:text-primary transition-colors")} />
                        <span className="font-bold uppercase tracking-widest text-[11px]">{item.name}</span>
                        {isActive && state === "expanded" && <ChevronRight className="ml-auto h-3 w-3" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-2 py-4">System Utilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-12 px-3 text-white/60 hover:text-white hover:bg-white/5 group">
                  <Settings className="shrink-0 text-white/40 group-hover:text-primary transition-colors" />
                  <span className="font-bold uppercase tracking-widest text-[11px]">System Config</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {state === "expanded" && (
              <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">Uplink Verified</span>
            )}
          </div>
          <SidebarMenuButton 
            onClick={handleSignOut}
            className="h-12 px-3 text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-colors group"
          >
            <LogOut className="shrink-0" />
            <span className="font-bold uppercase tracking-widest text-[11px]">Terminate Session</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
