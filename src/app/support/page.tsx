'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Headphones, Settings, ShieldCheck, Clock, Terminal, Activity, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const supportLinks = [
  { title: "Service Request", desc: "Open a technical support ticket for your enterprise hardware.", icon: Headphones, badge: "< 4h Response" },
  { title: "AMC Management", desc: "Renew or manage your Annual Maintenance Contracts.", icon: Settings, badge: "Account Managed" },
  { title: "Security Patch Hub", desc: "Access the latest HP Wolf Security firmware and updates.", icon: ShieldCheck, badge: "Critical Priority" },
];

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Mission Support Terminal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase mb-6">
              SLA <span className="text-primary">Direct</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Enterprise support protocols with guaranteed response metrics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportLinks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card/40 border-white/5 hover:border-primary/20 transition-all overflow-hidden holographic-edge h-full">
                  <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between py-4">
                    <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[8px] font-black text-primary uppercase">{item.badge}</div>
                    <Zap size={14} className="text-primary/40" />
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                      <item.icon size={24} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8">{item.desc}</p>
                    <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]">
                      Access Protocol
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-black/40 border-white/5 p-8 border-l-4 border-l-primary">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                <Activity size={12}/> Global Network Status
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-white/40">Technical NOC</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-white/40">Dispatch Latency</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Minimal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-white/40">Active Engineers</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Deployable</span>
                </div>
              </div>
            </Card>

            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-black uppercase mb-4 leading-tight">Need Immediate <br /> Emergency Uplink?</h3>
              <p className="text-muted-foreground italic mb-8">For critical system failures requiring <span className="text-primary font-bold">Priority-1</span> onsite intervention.</p>
              <div className="flex items-center gap-6">
                <div className="flex-1 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-[8px] font-black text-white/30 uppercase mb-1">Direct Line</p>
                  <p className="text-xl font-black text-primary">+91 172 272 0000</p>
                </div>
                <div className="flex-1 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <p className="text-[8px] font-black text-white/30 uppercase mb-1">Response Target</p>
                  <p className="text-xl font-black text-primary">60 Mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}