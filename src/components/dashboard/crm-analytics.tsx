"use client";

import * as React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CRMAnalyticsProps {
  leads: Lead[];
}

const COLORS = ['#1a8cff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

export function CRMAnalytics({ leads }: CRMAnalyticsProps) {
  // 1. Status Distribution
  const statusData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(lead => {
      counts[lead.status] = (counts[lead.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  // 2. Leads per Month (Mocking months based on createdAt if it's available as ISO)
  const monthlyData = React.useMemo(() => {
    const months: Record<string, number> = {};
    leads.forEach(lead => {
      const date = lead.createdAt && typeof lead.createdAt === 'string' ? new Date(lead.createdAt) : new Date();
      const month = date.toLocaleString('default', { month: 'short' });
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months).map(([name, leads]) => ({ name, leads }));
  }, [leads]);

  // 3. Conversion Rate Calculation
  const convertedCount = leads.filter(l => l.status === 'Converted').length;
  const lostCount = leads.filter(l => l.status === 'Lost').length;
  const totalClosed = convertedCount + lostCount;
  const conversionRate = totalClosed > 0 ? (convertedCount / totalClosed) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Lead Status Distribution */}
      <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <CardHeader className="px-10 py-8 border-b border-slate-50">
          <CardTitle className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Matrix Segmentation</CardTitle>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Status Distribution</h3>
        </CardHeader>
        <CardContent className="p-10 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    textTransform: 'uppercase',
                    fontSize: '10px',
                    fontWeight: '900'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {statusData.slice(0, 4).map((entry, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{entry.name}</span>
                 <span className="text-[9px] font-black text-slate-900 ml-auto">{entry.value}</span>
               </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Lead Generation */}
      <Card className="bg-white border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <CardHeader className="px-10 py-8 border-b border-slate-50">
          <CardTitle className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Growth Analytics</CardTitle>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Volume Timeline</h3>
        </CardHeader>
        <CardContent className="p-10 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a8cff" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1a8cff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
              />
              <Tooltip 
                cursor={{ stroke: '#1a8cff', strokeWidth: 2 }}
                contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    textTransform: 'uppercase',
                    fontSize: '10px',
                    fontWeight: '900'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="leads" 
                stroke="#1a8cff" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorLeads)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Conversion Stats Card */}
      <Card className="lg:col-span-2 bg-slate-900 border-none rounded-[3rem] shadow-2xl overflow-hidden relative group">
         <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center md:text-left">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Operational Efficiency</p>
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                Mission <span className="text-primary italic">Success rate</span>
              </h3>
              <p className="text-white/40 font-bold uppercase tracking-widest text-[9px] max-w-xs">
                Analyzing the conversion integrity of closed leads across the primary sales matrix.
              </p>
            </div>
            <div className="flex gap-10">
              <div className="text-center">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Protocol Conversion</p>
                <p className="text-5xl font-black text-emerald-400 tracking-tighter italic">{conversionRate.toFixed(1)}%</p>
              </div>
              <div className="h-20 w-[1px] bg-white/10 hidden md:block" />
              <div className="text-center">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Converted Entities</p>
                <p className="text-5xl font-black text-white tracking-tighter">{convertedCount}</p>
              </div>
            </div>
            <div className="h-16 w-16 rounded-full border-2 border-primary/20 flex items-center justify-center animate-pulse">
              <TrendingUp className="text-primary" size={24} />
            </div>
         </div>
      </Card>
    </div>
  );
}
