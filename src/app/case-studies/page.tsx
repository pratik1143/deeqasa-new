'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Quote, TrendingUp, ShieldCheck, Zap } from "lucide-react";

const cases = [
  {
    client: "Global Financial Corporation",
    problem: "Legacy mainframe dependency preventing real-time fraud detection and customer service scaling.",
    solution: "End-to-end multi-cloud migration with high-performance HP ProLiant compute clusters and AI integration.",
    result: "45% reduction in operational latency and $2M annual cost saving.",
    icon: TrendingUp
  },
  {
    client: "State Education Department",
    problem: "Disconnected student portals across 500+ locations causing massive data silos and security risks.",
    solution: "Centralized Hyper-Converged Infrastructure (HCI) with Zero Trust perimeter security architecture.",
    result: "Unified identity management for 1M+ users and 100% security uptime.",
    icon: ShieldCheck
  },
  {
    client: "National Logistics Leader",
    problem: "Inefficient supply chain tracking leading to high-energy waste and low delivery predictability.",
    solution: "Edge computing deployment with Sustainable IT hardware lifecycle and predictive analytics.",
    result: "20% energy cost reduction and 30% increase in fleet operational efficiency.",
    icon: Zap
  }
];

export default function CaseStudiesPage() {
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
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase mb-6">
              Success <span className="text-primary">Logic</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Data-driven proof of transformation across enterprise ecosystems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/30 transition-all p-8 flex flex-col holographic-edge">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-4">{item.client}</h3>
                  <div className="space-y-6 flex-1">
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Challenge</p>
                      <p className="text-sm text-foreground/80 leading-relaxed font-medium">{item.problem}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Deployment</p>
                      <p className="text-sm text-foreground/80 leading-relaxed font-medium">{item.solution}</p>
                    </div>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Impact Result</p>
                      <p className="text-sm text-emerald-200/80 font-bold">{item.result}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-32 p-12 bg-primary text-black rounded-[40px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10"><Quote size={120} /></div>
            <div className="max-w-3xl relative z-10">
              <p className="text-3xl font-black leading-tight mb-8 uppercase tracking-tighter">
                "DeeQasa didn't just sell us hardware; they redesigned our entire operational capability for the AI era."
              </p>
              <p className="text-sm font-bold uppercase tracking-widest">— CTO, Regional Infrastructure Authority</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}