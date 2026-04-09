"use client";

import React from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { LeadsTable } from "@/components/leads/leads-table";
import { AddLeadDialog } from "@/components/leads/add-lead-dialog";
import { useCollection } from "@/firebase/firestore/use-collection";
import { Lead } from "@/lib/types";
import { collection, query, orderBy } from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase";
import { Button } from "@/components/ui/button";
import { LeadsKanban } from "@/components/leads/leads-kanban";
import { LeadDetailsSheet } from "@/components/leads/lead-details-sheet";
import { DailyPerformanceTracker } from "@/components/leads/daily-performance-tracker";
import { cn } from "@/lib/utils";
import { CenteredLoader } from "@/components/ui/centered-loader";
import { motion } from "framer-motion";
import { Users, TrendingUp, ShieldAlert, Zap, LayoutGrid, List } from "lucide-react";

export default function LeadsPage() {
  const firestore = useFirestore();
  const [view, setView] = React.useState<'table' | 'kanban'>('table');
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  
  const leadsQuery = useMemoFirebase(() => firestore ? query(
    collection(firestore, "leads"),
    orderBy("createdAt", "desc")
  ) : null, [firestore]);

  const { data: leads, isLoading, error } = useCollection<Lead>(leadsQuery);

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsSheetOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Operations Center</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  Leads <span className="text-primary">Matrix</span>
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mt-4 max-w-lg">
                  Centralized entity management and pipeline synchronization. Real-time lead tracking and engagement mapping.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  <Button 
                      variant={view === 'table' ? 'secondary' : 'ghost'} 
                      size="sm"
                      onClick={() => setView('table')}
                      className={cn(
                          "h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2",
                          view === 'table' ? "bg-white shadow-sm text-primary" : "text-slate-400"
                      )}
                  >
                      <List size={14} /> Matrix View
                  </Button>
                  <Button 
                      variant={view === 'kanban' ? 'secondary' : 'ghost'} 
                      size="sm"
                      onClick={() => setView('kanban')}
                      className={cn(
                          "h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2",
                          view === 'kanban' ? "bg-white shadow-sm text-primary" : "text-slate-400"
                      )}
                  >
                      <LayoutGrid size={14} /> Pipeline View
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AddLeadDialog />
          </motion.div>
        </div>

        {/* Daily Intel Tracker */}
        <DailyPerformanceTracker leads={leads || []} />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Active Prospects", value: leads?.length || 0, icon: Users, color: "text-blue-600" },
            { label: "Conversion Velocity", value: "24%", icon: TrendingUp, color: "text-emerald-600" },
            { label: "SLA Response Rate", value: "99.8%", icon: Zap, color: "text-amber-500" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <stat.icon size={18} className={cn(stat.color, "opacity-40 group-hover:opacity-100 transition-opacity")} />
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-1">
          <div className="bg-slate-50/50 rounded-[2.2rem] p-8 md:p-12">
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <CenteredLoader text="Synchronizing lead matrix..." />
              </div>
            ) : error ? (
              <div className="h-[400px] flex flex-col items-center justify-center gap-6 text-center">
                <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
                  <ShieldAlert size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Connection Interrupted</h3>
                  <p className="text-slate-400 font-medium italic">Failed to retrieve entity data from Central Intelligence.</p>
                </div>
              </div>
            ) : view === 'table' ? (
              <LeadsTable 
                data={leads || []} 
                onLeadClick={handleLeadSelect} 
              />
            ) : (
              <LeadsKanban 
                leads={leads || []} 
                onLeadClick={handleLeadSelect}
              />
            )}
          </div>
        </div>
      </div>

      <LeadDetailsSheet 
          lead={selectedLead}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
      />
    </AdminLayout>
  );
}


