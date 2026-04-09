"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserWithRole } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase";
import { Lead } from "@/lib/types";
import { formatDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { CRMAnalytics } from "./crm-analytics";
import { isToday } from "date-fns";

export function DashboardHome() {
  const { user, profile } = useUserWithRole();
  const firestore = useFirestore();

  const allLeadsQuery = useMemoFirebase(() => firestore ? query(
    collection(firestore, "leads"),
    orderBy("createdAt", "desc")
  ) : null, [firestore]);
  
  const { data: allLeads } = useCollection<Lead>(allLeadsQuery);

  const stats = React.useMemo(() => {
    if (!allLeads) return [];
    
    const converted = allLeads.filter(l => l.status === 'Converted').length;
    const pending = allLeads.filter(l => ['New', 'Follow-up Scheduled', 'Contacted'].includes(l.status)).length;
    const totalRevenue = allLeads.filter(l => l.status === 'Converted').reduce((acc, curr) => acc + (curr.revenue || 0), 0);

    return [
      { 
        label: "Total Pipeline", 
        value: allLeads.length.toString(), 
        change: "+12.5%", 
        trend: "up", 
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50"
      },
      { 
        label: "Success Conversion", 
        value: converted.toString(), 
        change: "+4.3%", 
        trend: "up", 
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
      },
      { 
        label: "Active Protocols", 
        value: pending.toString(), 
        change: "-2.1%", 
        trend: "down", 
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50"
      },
      { 
        label: "Projected Revenue", 
        value: `₹${(totalRevenue / 100000).toFixed(1)}L`, 
        change: "+18.2%", 
        trend: "up", 
        icon: DollarSign,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
      },
    ];
  }, [allLeads]);

  const todayFollowUps = React.useMemo(() => {
    if (!allLeads) return [];
    return allLeads.filter(l => {
        if (!l.followUpDate) return false;
        try {
            return isToday(new Date(l.followUpDate));
        } catch (e) {
            return false;
        }
    });
  }, [allLeads]);

  return (
    <div className="space-y-10 pb-20 font-[Outfit]">
      {/* Welcome & Profile Strip */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm gap-8"
      >
        <div className="flex items-center gap-6">
          <Avatar className="h-28 w-28 border-4 border-slate-50 shadow-xl rounded-[2.5rem]">
            <AvatarImage src={profile?.photoURL || user?.photoURL || ""} className="object-cover" />
            <AvatarFallback className="bg-primary text-white text-4xl font-black rounded-[2.5rem]">
              {profile?.displayName?.[0].toUpperCase() || user?.email?.[0].toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">ADMIN ACCESS GRANTED</span>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              Welcome back, <span className="text-primary">{profile?.displayName || profile?.email.split('@')[0] || "Admin"}</span>
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">
              Profile ID: {user?.uid.slice(0, 8).toUpperCase()} // Sector: {profile?.designation || "Operations"}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="px-8 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-center min-w-[140px]">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Local Time</p>
               <p className="text-xl font-black text-slate-900 tracking-tighter">{formatDate(new Date(), "HH:mm")}</p>
            </div>
           <div className="px-8 py-4 bg-primary/5 border border-primary/10 rounded-[2rem] text-center min-w-[140px]">
              <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Matrix Status</p>
              <p className="text-xl font-black text-primary tracking-tighter uppercase">Optimal</p>
           </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between py-6 px-8 border-b border-slate-50">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
                  stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                )}>
                  {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Matrix */}
      <CRMAnalytics leads={allLeads || []} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Activity Timeline */}
        <Card className="lg:col-span-2 bg-white border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Protocol Logs</CardTitle>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Recent Activity</h3>
            </div>
            <Activity className="text-slate-200" size={32} />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {allLeads && allLeads.length > 0 ? (
                allLeads.slice(0, 8).map((lead, i) => (
                  <div key={lead.id} className="p-8 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-lg group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        {lead.name[0]}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">New Lead Added</p>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">{lead.name} // <span className="text-slate-400 font-bold italic">{lead.company}</span></h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{formatDate(lead.createdAt, "MMM dd, HH:mm")}</p>
                      <Badge variant="outline" className="rounded-full font-bold text-[9px] uppercase tracking-widest border-slate-100 bg-white">
                        {lead.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center space-y-4">
                   <AlertCircle size={48} className="mx-auto text-slate-100" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No recent protocol logs archived.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tactical Agenda (Today's Follow-ups) */}
        <div className="space-y-10">
          <Card className="bg-slate-900 text-white border-none rounded-[3rem] shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={120} />
            </div>
            <CardHeader className="p-10 relative z-10">
              <CardTitle className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Tactical Agenda</CardTitle>
              <h3 className="text-4xl font-black tracking-tighter leading-none uppercase italic">Today's <br /> Follow-ups</h3>
            </CardHeader>
            <CardContent className="p-10 pt-0 relative z-10 space-y-6">
               {todayFollowUps.length > 0 ? (
                  todayFollowUps.slice(0, 3).map((lead, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group/follow hover:bg-white/10 transition-colors">
                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black">
                            {lead.name[0]}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-white group-hover/follow:text-primary transition-colors">{lead.name}</p>
                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{lead.company}</p>
                        </div>
                        <ArrowUpRight size={14} className="text-white/20 group-hover/follow:text-primary" />
                    </div>
                  ))
               ) : (
                  <div className="py-6 text-center border border-white/10 rounded-2xl border-dashed">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">No active follow-ups detected</p>
                  </div>
               )}
               
               <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Pipeline Health</span>
                    <span className="text-2xl font-black text-white">Optimal</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-primary to-emerald-400" />
                  </div>
               </div>
            </CardContent>
          </Card>
          
          <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">System Protocols</h4>
            <div className="space-y-2">
              <button className="w-full h-14 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-between px-8 group">
                Access Audit Logs <ChevronDown size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full h-14 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-between px-8 group">
                Export Intelligence <ChevronDown size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronDown({ size, className }: { size: number, className?: string }) {
  return <ArrowUpRight size={size} className={className} />;
}
