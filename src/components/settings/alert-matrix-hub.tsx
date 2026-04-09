"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp, 
  Zap, 
  MessageSquare, 
  PhoneCall,
  Search,
  Filter,
  ArrowRight,
  MoreVertical,
  Settings2,
  BrainCircuit,
  ShieldCheck,
  Smartphone,
  Mail,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase";
import { Lead } from "@/lib/types";
import { isToday, isPast, parseISO, format } from "date-fns";
import { cn } from "@/lib/utils";

const CHART_DATA = [
  { day: "Mon", alerts: 12 },
  { day: "Tue", alerts: 19 },
  { day: "Wed", alerts: 15 },
  { day: "Thu", alerts: 22 },
  { day: "Fri", alerts: 30 },
  { day: "Sat", alerts: 10 },
  { day: "Sun", alerts: 8 },
];

export function AlertMatrixHub() {
  const firestore = useFirestore();
  const [focusMode, setFocusMode] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Fetch Leads for Real-time Data
  const leadsQuery = useMemoFirebase(() => firestore ? query(
    collection(firestore, "leads"),
    orderBy("createdAt", "desc")
  ) : null, [firestore]);

  const { data: leads } = useCollection<Lead>(leadsQuery);

  // Calculate Matrix Stats
  const matrixStats = React.useMemo(() => {
    if (!leads) return { overdue: 0, today: 0, completed: 0, new: 0, callsToday: 0 };
    
    // Calculate calls made today from activity logs
    let callsToday = 0;
    leads.forEach(lead => {
      lead.activityLog?.forEach(activity => {
        if (activity.type === 'call' && activity.timestamp) {
          let date: Date;
          if (typeof activity.timestamp.toDate === 'function') {
            date = activity.timestamp.toDate();
          } else {
            date = new Date(activity.timestamp);
          }
          
          if (!isNaN(date.getTime()) && isToday(date)) {
            callsToday++;
          }
        }
      });
    });

    return {
      overdue: leads.filter(l => l.followUpDate && isPast(parseISO(l.followUpDate)) && !isToday(parseISO(l.followUpDate)) && l.status !== 'Won').length,
      today: leads.filter(l => l.followUpDate && isToday(parseISO(l.followUpDate))).length,
      completed: leads.filter(l => l.status === 'Won').length,
      new: leads.filter(l => l.status === 'New').length,
      callsToday
    };
  }, [leads]);

  // AI Suggestions Logic
  const aiSuggestions = React.useMemo(() => {
    if (!leads) return [];
    const suggestions: any[] = [];
    
    leads.forEach(lead => {
      if (lead.status === 'New') {
        suggestions.push({
          id: lead.id,
          name: lead.name,
          tip: "Initiate contact uplink → High priority for new entry.",
          type: "action"
        });
      }
      if (lead.score && lead.score > 80 && lead.status !== 'Won') {
        suggestions.push({
          id: lead.id,
          name: lead.name,
          tip: "Call this lead now → High conversion probability detected.",
          type: "high-score"
        });
      }
    });

    return suggestions.slice(0, 3);
  }, [leads]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* 🚀 Top Summary Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Overdue Follow-ups", count: matrixStats.overdue, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
          { label: "Calls Taken Today", count: matrixStats.callsToday, icon: PhoneCall, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
          { label: "Successful Closure", count: matrixStats.completed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "New Leads Found", count: matrixStats.new, icon: Users, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
        ].map((item, i) => (
          <Card key={i} className={cn("bg-white border shadow-sm rounded-3xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group", item.border)}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                <h3 className={cn("text-3xl font-black tracking-tighter", item.color)}>{item.count}</h3>
              </div>
              <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", item.bg)}>
                <item.icon className={cn("w-6 h-6", item.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 🧠 AI Brain & Smart Suggestions */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="bg-white border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
            <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/30">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit className="text-primary w-4 h-4" />
                  <CardTitle className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">AI Alert Engine</CardTitle>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Smart Suggestions</h3>
              </div>
              <Button onClick={handleRefresh} variant="ghost" className="rounded-full h-12 w-12 p-0 hover:bg-white shadow-sm border border-slate-100">
                <RefreshCw className={cn("w-5 h-5 text-slate-400", isRefreshing && "animate-spin")} />
              </Button>
            </CardHeader>
            <CardContent className="p-10 space-y-4">
              <AnimatePresence mode="popLayout">
                {aiSuggestions.map((sug, i) => (
                  <motion.div 
                    key={sug.id + i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between hover:bg-white hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        {sug.type === 'action' ? <Zap className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{sug.name}</p>
                        <p className="text-sm font-bold text-slate-700 tracking-tight">{sug.tip}</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="rounded-xl h-12 w-12 p-0 group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <PhoneCall className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* 📡 Live Alert Stream */}
          <Card className="bg-white border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
             <CardHeader className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Satellite Protocol</CardTitle>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Live Alert Stream</h3>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">System Live</span>
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y divide-slate-50">
                    {[
                      { msg: "Follow-up missed for Rahul Singh", time: "2 min ago", priority: "critical", lead: "Rahul Singh" },
                      { msg: "Proposal acknowledged by TechCorp", time: "15 min ago", priority: "medium", lead: "TechCorp" },
                      { msg: "New lead ingested via Matrix Link", time: "45 min ago", priority: "low", lead: "Matrix Lead" },
                      { msg: "Meeting scheduled with Zenith Prime", time: "2 hours ago", priority: "medium", lead: "Zenith Prime" },
                      { msg: "Negotiation phase initiated for HP Order", time: "4 hours ago", priority: "critical", lead: "HP Order" },
                    ].filter(f => !focusMode || f.priority === 'critical').map((alert, i) => (
                      <div key={i} className="p-8 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                           <div className={cn(
                             "w-1.5 h-12 rounded-full",
                             alert.priority === 'critical' ? 'bg-red-500' : alert.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                           )} />
                           <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{alert.time}</p>
                             <h4 className="text-lg font-black text-slate-900 tracking-tight italic truncate max-w-md">{alert.msg}</h4>
                           </div>
                        </div>
                        <Badge variant="outline" className={cn(
                          "rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest border-none",
                          alert.priority === 'critical' ? 'bg-red-50 text-red-500' : alert.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                        )}>
                          {alert.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
             </CardContent>
          </Card>
        </div>

        {/* 🛠️ Dashboard Right Sidebar (Rules & Reminders) */}
        <div className="space-y-10">
          {/* Rules Engine */}
          <Card className="bg-slate-900 text-white border-none rounded-[3rem] shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Settings2 size={120} />
            </div>
            <CardHeader className="p-10 relative z-10">
              <CardTitle className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Master Controls</CardTitle>
              <h3 className="text-4xl font-black tracking-tighter uppercase leading-none italic">Alert Rules <br /> Matrix</h3>
            </CardHeader>
            <CardContent className="p-10 pt-0 relative z-10 space-y-8">
               <div className="space-y-6">
                  {[
                    { label: "Follow-up missed alert", desc: "Notify instantly on overdue", active: true },
                    { label: "Inactive protocols", desc: "Alert after 2 days idle", active: true },
                    { label: "High-budget uplink", desc: "Mark hot leads automatically", active: false },
                  ].map((rule, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="space-y-1">
                          <p className="text-[11px] font-black uppercase">{rule.label}</p>
                          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{rule.desc}</p>
                        </div>
                        <Switch defaultChecked={rule.active} />
                    </div>
                  ))}
               </div>

               <div className="pt-6 border-t border-white/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-black uppercase italic text-primary">Focus Mode</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Silences low-priority noise</p>
                    </div>
                    <Switch checked={focusMode} onCheckedChange={setFocusMode} />
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Smart Reminders */}
          <Card className="bg-white border-slate-100 rounded-[3rem] shadow-sm">
             <CardHeader className="p-10">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Timed Resonance</CardTitle>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Reminders</h3>
             </CardHeader>
             <CardContent className="p-10 pt-0 space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trigger Notifications Before:</p>
                  <div className="flex flex-wrap gap-2">
                    {["10 Min", "1 Hour", "1 Day"].map(time => (
                      <Button key={time} variant="outline" className={cn(
                        "rounded-full h-10 px-6 text-[10px] font-black uppercase border-slate-100",
                        time === "10 Min" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900"
                      )}>
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication Channels:</p>
                  <div className="grid grid-cols-2 gap-3">
                     <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-slate-900 transition-all">
                        <Mail className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                        <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white">Email</span>
                     </button>
                     <button className="flex flex-col items-center gap-2 p-4 bg-primary/5 rounded-2xl border border-primary/10 group hover:bg-primary transition-all">
                        <Smartphone className="w-5 h-5 text-primary group-hover:text-white" />
                        <span className="text-[9px] font-black uppercase text-primary group-hover:text-white">Mobile</span>
                     </button>
                  </div>
                </div>
             </CardContent>
          </Card>

          {/* Alert Analytics */}
          <Card className="bg-white border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
             <CardHeader className="p-10">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Operational Velocity</CardTitle>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Resolution Trend</h3>
             </CardHeader>
             <CardContent className="p-0 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F172A" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="alerts" stroke="#0F172A" fillOpacity={1} fill="url(#colorAlerts)" strokeWidth={3} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: 'white' }}
                      itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
