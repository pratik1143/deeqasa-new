'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WacusBackground } from "@/components/layout/wacus-background";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Quote, TrendingUp, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const cases = [
  {
    client: "Global Financial Corporation",
    problem: "Legacy mainframe dependency preventing real-time fraud detection and customer service scaling.",
    solution: "End-to-end multi-cloud migration with high-performance HP ProLiant compute clusters and AI integration.",
    result: "45% reduction in operational latency and $2M annual cost saving.",
    icon: TrendingUp,
    accent: "from-blue-500 to-cyan-400"
  },
  {
    client: "State Education Department",
    problem: "Disconnected student portals across 500+ locations causing massive data silos and security risks.",
    solution: "Centralized Hyper-Converged Infrastructure (HCI) with Zero Trust perimeter security architecture.",
    result: "Unified identity management for 1M+ users and 100% security uptime.",
    icon: ShieldCheck,
    accent: "from-primary to-blue-600"
  },
  {
    client: "National Logistics Leader",
    problem: "Inefficient supply chain tracking leading to high-energy waste and low delivery predictability.",
    solution: "Edge computing deployment with Sustainable IT hardware lifecycle and predictive analytics.",
    result: "20% energy cost reduction and 30% increase in fleet operational efficiency.",
    icon: Zap,
    accent: "from-cyan-500 to-primary"
  }
];

export default function CaseStudiesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="flex flex-col min-h-screen bg-black font-[Outfit] selection:bg-primary/30 text-white">
      <Header />
      <WacusBackground />
      
      <main ref={containerRef} className="flex-1 pt-40 pb-24 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-40 sticky top-40"
          >
             <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-[12px] font-black tracking-[0.5em] text-primary uppercase">Performance Validation</span>
            </div>
            
            <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter text-white uppercase leading-[0.85] mb-8">
              Success <br /> 
              <span className="text-transparent text-stroke-white opacity-20" style={{ WebkitTextStroke: '2px white' }}>Logic</span>
            </h1>
          </motion.div>

          {/* Spacer to allow sticky header to stay visible while starting the grid */}
          <div className="h-[20vh]" />

          <div className="grid grid-cols-1 gap-32">
            {cases.map((item, i) => (
              <CaseCard key={i} item={item} index={i} />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-60 p-12 md:p-24 bg-primary text-black rounded-[60px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
              <Quote size={200} />
            </div>
            <div className="max-w-4xl relative z-10">
              <p className="text-4xl md:text-6xl font-black leading-[0.9] mb-12 uppercase tracking-tighter">
                "DeeQasa didn't just sell us hardware; they redesigned our entire operational capability for the AI era."
              </p>
              <div className="flex items-center gap-6">
                <div className="h-px w-20 bg-black/20" />
                <p className="text-lg font-black uppercase tracking-widest">— CTO, Regional Infrastructure Authority</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function CaseCard({ item, index }: { item: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, scale }}
      className="relative"
    >
      <Card className="bg-white/[0.02] backdrop-blur-3xl border-white/5 overflow-hidden rounded-[40px] p-8 md:p-16 hover:border-primary/40 transition-colors duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div>
               <div className={`h-20 w-20 rounded-3xl bg-gradient-to-br ${item.accent} flex items-center justify-center text-black mb-10`}>
                <item.icon size={40} />
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                {item.client}
              </h3>
              <div className="h-1 w-20 bg-primary opacity-50" />
            </div>

            <div className="space-y-10">
              <div className="group">
                <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 group-hover:text-primary transition-colors">Phase 01: Challenge</p>
                <p className="text-2xl text-white/60 leading-tight font-medium italic">"{item.problem}"</p>
              </div>
              
              <div className="group">
                <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 group-hover:text-primary transition-colors">Phase 02: Core Catalyst</p>
                <p className="text-2xl text-white/80 leading-tight font-bold">{item.solution}</p>
              </div>
            </div>
          </div>

          <motion.div style={{ y }} className="space-y-12 lg:pt-24">
            <div className={`p-10 bg-gradient-to-br ${item.accent} rounded-[40px] text-black shadow-2xl`}>
              <p className="text-[12px] font-black uppercase tracking-[0.4em] mb-4 opacity-60">Quantifiable Impact</p>
              <p className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-8">{item.result}</p>
              <div className="h-px w-full bg-black/10 mb-8" />
              <button className="flex items-center gap-3 font-black uppercase tracking-widest text-xs hover:gap-6 transition-all">
                Full Technical Audit <ArrowRight size={16} />
              </button>
            </div>

            <div className="p-8 border border-white/5 rounded-[32px] bg-white/[0.01]">
               <div className="flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-widest">
                 <ShieldCheck size={14} className="text-primary" /> Verified Case Study SEC-09-24
               </div>
            </div>
          </motion.div>
        </div>

        {/* Big Watermark Icon */}
        <div className="absolute -bottom-20 -right-20 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
          <item.icon size={400} />
        </div>
      </Card>
    </motion.div>
  );
}