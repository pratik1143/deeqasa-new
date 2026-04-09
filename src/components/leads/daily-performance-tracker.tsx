"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Handshake, 
  Target, 
  TrendingUp, 
  ArrowUpRight,
  Zap
} from "lucide-react";
import { Lead } from "@/lib/types";
import { isToday, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface DailyPerformanceTrackerProps {
  leads: Lead[];
}

export function DailyPerformanceTracker({ leads }: DailyPerformanceTrackerProps) {
  const stats = React.useMemo(() => {
    let calls = 0;
    let meetings = 0;
    let converted = 0;
    
    leads.forEach(lead => {
      // Count today's conversions
      if (lead.status === 'Won' && lead.updatedAt) {
          try {
            const updateDate = typeof lead.updatedAt === 'string' ? parseISO(lead.updatedAt) : new Date(lead.updatedAt);
            if (isToday(updateDate)) converted++;
          } catch(e) {}
      }

      // Count today's activities
      lead.activityLog?.forEach(activity => {
        try {
          const actDate = typeof activity.timestamp === 'string' ? parseISO(activity.timestamp) : new Date(activity.timestamp);
          if (isToday(actDate)) {
            if (activity.type === 'call') calls++;
            if (activity.action.toLowerCase().includes('meeting')) meetings++;
          }
        } catch(e) {}
      });
    });

    return { calls, meetings, converted };
  }, [leads]);

  const cards = [
    { label: "Today's Calls", value: stats.calls, icon: Phone, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Meetings Held", value: stats.meetings, icon: Handshake, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Converted Today", value: stats.converted, icon: Target, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="relative bg-white border border-slate-100 p-6 rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-6 relative z-10">
            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12", card.bg, card.color)}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{card.value}</h3>
                <div className="flex items-center text-[10px] font-black text-emerald-500 mb-1">
                   <ArrowUpRight size={12} className="mr-0.5" />
                   12%
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle background graphic */}
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:scale-125 transition-transform duration-700">
             <card.icon size={100} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
