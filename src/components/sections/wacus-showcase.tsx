"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ShieldCheck, Cpu, Activity, Layout } from "lucide-react";

const expertise = [
  {
    title: "Secure Infrastructure",
    description: "Zero-trust network architectures built for high availability.",
    icon: ShieldCheck,
    color: "from-[#FF4D00]",
  },
  {
    title: "Enterprise Solutions",
    description: "Integrated tech stacks bridging hardware and critical software.",
    icon: Layout,
    color: "from-[#A855F7]",
  },
  {
    title: "Deep Intelligence",
    description: "Analytics and telemetry powered by advanced AI processing.",
    icon: Cpu,
    color: "from-[#3B82F6]",
  },
  {
    title: "NOC Operations",
    description: "24/7 autonomous monitoring and preemptive security.",
    icon: Activity,
    color: "from-[#10B981]",
  }
];

export function WacusShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-40 bg-slate-50 relative z-10 overflow-hidden border-y border-slate-100">
      <div className="absolute inset-0 w-full h-full command-grid opacity-[0.05] pointer-events-none" />
      
      <div className="container-enterprise relative">
        <div className="text-center md:text-left mb-24 max-w-4xl">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 font-[Outfit]"
          >
            Capabilities <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-slate-400">
              Beyond Limits
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {expertise.map((item, i) => (
            <motion.div
              key={i}
              style={{ y: i % 2 !== 0 ? y : useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
              className="bg-white/80 backdrop-blur-xl border border-slate-100 p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden group shadow-[0_10px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_70px_-12px_rgba(26,140,255,0.15)] hover:border-primary/30 transition-all duration-700"
            >
              <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl ${item.color} to-transparent opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700 rounded-full blur-[80px] -mr-20 -mt-20`} />
              
              <div className="mb-10 text-slate-200 group-hover:text-primary group-hover:scale-110 transition-all duration-500 origin-left">
                <item.icon size={56} strokeWidth={1} />
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4 font-[Outfit]">
                {item.title}
              </h3>
              <p className="text-xl text-slate-500 leading-relaxed font-bold italic">
                {item.description}
              </p>
              
              <div className="mt-12 flex items-center gap-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary">Engage Protocol</span>
                <div className="w-12 h-[1px] bg-primary" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
