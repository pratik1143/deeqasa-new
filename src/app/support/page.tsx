'use client';

import { CorporatePageLayout } from "@/components/layout/corporate-page-layout";
import { motion } from "framer-motion";
import { Headphones, Settings, ShieldCheck, Activity, Zap, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const supportLinks = [
  { title: "Service Request", desc: "Open a priority technical support ticket for your mission-critical hardware.", icon: Headphones, badge: "< 4h Response" },
  { title: "AMC Management", desc: "Renew or manage your institutional Annual Maintenance Contracts with zero friction.", icon: Settings, badge: "Account Managed" },
  { title: "Security Patch Hub", desc: "Access the latest HP Wolf Security firmware and validated software updates.", icon: ShieldCheck, badge: "Critical Priority" },
];

export default function SupportPage() {
  return (
    <CorporatePageLayout 
      title="Global Support" 
      subtitle="Enterprise support protocols with guaranteed SLA response metrics and verified hardware uptime."
    >
      <div className="container-enterprise pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">
          {supportLinks.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white border border-slate-100 hover:border-primary/40 transition-all duration-700 group overflow-hidden relative rounded-[4rem] shadow-sm hover:shadow-2xl">
                 <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between py-8 px-10">
                  <div className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em]">{item.badge}</div>
                  <Zap size={20} className="text-slate-200 group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent className="p-12">
                  <div className="h-20 w-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <item.icon size={36} />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-6 leading-tight group-hover:text-primary transition-colors">
                     {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-12 text-lg font-bold italic">
                    {item.desc}
                  </p>
                  <Button variant="ghost" className="w-full h-18 border border-slate-100 hover:bg-slate-900 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all rounded-2xl flex items-center justify-center gap-4 group/btn shadow-sm">
                    Initialize Protocol <ArrowRight size={18} className="group-hover/btn:translate-x-3 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
           >
              <Card className="bg-white border border-slate-100 p-16 rounded-[5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-16 opacity-[0.02] text-primary pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
                   <Activity size={200} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[1em] text-primary mb-12 flex items-center gap-4">
                  <Activity size={18} className="animate-pulse" /> NETWORK STATUS TERMINAL
                </h3>
                <div className="space-y-10">
                  {[
                    { label: "Technical NOC", status: "Operational", color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Dispatch Latency", status: "Nominal // 14ms", color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Active Engineers", status: "Deployable", color: "text-primary", bg: "bg-primary/5" },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-8 last:border-0 last:pb-0">
                      <span className="text-xl font-black uppercase text-slate-400 tracking-tighter">{stat.label}</span>
                      <span className={`text-[10px] font-black ${stat.color} uppercase tracking-widest ${stat.bg} px-6 py-2 rounded-full border border-slate-100`}>
                        {stat.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
           </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
             className="flex flex-col justify-center space-y-12"
          >
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[1em] text-primary">EMERGENCY UPLINK</span>
              </div>
              <h3 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] text-slate-900">
                Critical <br /> <span className="text-slate-200">System Failure?</span>
              </h3>
              <p className="text-2xl text-slate-400 font-bold italic leading-relaxed max-w-xl">
                For high-priority system breaches requiring <span className="text-slate-900 font-black underline decoration-primary decoration-4 underline-offset-8">Priority-1</span> onsite tactical deployment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-12 bg-white rounded-[3.5rem] border border-slate-100 hover:border-primary/40 transition-all duration-500 group shadow-sm hover:shadow-xl">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6 group-hover:text-primary transition-colors">Direct Response Line</p>
                <div className="space-y-2">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">+91 85952 70950</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">+91 89755 06300</p>
                </div>
              </div>
              <div className="p-12 bg-slate-900 rounded-[3.5rem] flex flex-col justify-center items-center text-center group shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 relative z-10 font-[Outfit]">Onsite Benchmark</p>
                <div className="flex items-center gap-6 relative z-10">
                  <Clock size={40} className="text-primary animate-pulse" />
                  <p className="text-5xl font-black text-white uppercase tracking-tighter">60 Mins</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </CorporatePageLayout>
  );
}
