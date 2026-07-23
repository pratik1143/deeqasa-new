'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Monitor, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const solutionHeadline = "Integrated Hardware & Software Ecosystem";

const solutionBenefits = [
  {
    title: "Enterprise HP Hardware Suite",
    desc: "Deploy HP EliteBooks, Z-Workstations, HPE ProLiant Gen11 servers, and HPE Alletra flash storage engineered for zero downtime.",
    icon: Monitor,
    tag: "HARDWARE FLEET"
  },
  {
    title: "Unified Software & Security Engine",
    desc: "Combine HP Wolf Security, Microsoft Intune, AI process automation, and micro-segmentation into a single managed operating stack.",
    icon: Cpu,
    tag: "SOFTWARE & CYBER"
  },
  {
    title: "24/7 Managed IT & Circular Refresh",
    desc: "Enjoy zero-touch cloud device enrollment, predictive hardware failure telemetry, and guaranteed circular lifecycle e-waste buyback.",
    icon: ShieldCheck,
    tag: "MANAGED SLA"
  }
];

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const color = useTransform(progress, range, ["rgba(148, 163, 184, 0.25)", "rgba(255, 255, 255, 1)"]);
  const textShadow = useTransform(progress, range, ["0 0 0px transparent", "0 0 20px rgba(59, 130, 246, 0.6)"]);

  return (
    <span className="relative inline-block mr-3 md:mr-4 my-1">
      <motion.span 
        style={{ opacity, color, textShadow }} 
        className="transition-colors duration-200"
      >
        {word}
      </motion.span>
    </span>
  );
}

export function SolutionRevealSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "end 0.35"]
  });

  const words = solutionHeadline.split(" ");

  return (
    <section ref={targetRef} className="py-28 px-6 bg-[#030716] text-white relative overflow-hidden font-[Outfit]">
      
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-70"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 35%, rgba(59, 130, 246, 0.2) 0%, transparent 75%)'
        }}
      />

      <div className="container-enterprise relative z-10 space-y-16">
        
        {/* Section Header with Scroll-Driven Word Reveal */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">
            THE DEEQASA SOLUTION —
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.12] text-center select-none">
            {words.map((word, idx) => {
              const start = idx / words.length;
              const end = (idx + 1) / words.length;
              return (
                <Word 
                  key={idx} 
                  word={word} 
                  progress={scrollYProgress} 
                  range={[start, end]} 
                />
              );
            })}
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-normal max-w-xl mx-auto pt-2">
            Precision-engineered for reliability, performance, and Zero-Trust security.
          </p>
        </div>

        {/* 3 High-Tech Glass Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutionBenefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-slate-900/80 border border-slate-800/90 hover:border-blue-500/60 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_70px_rgba(59,130,246,0.25)] transition-all duration-500 flex flex-col justify-between backdrop-blur-2xl h-[380px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                      <Icon size={26} />
                    </div>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-light text-white tracking-tight mb-3 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">
                    Explore Solution
                  </span>
                  <div className="h-10 w-10 rounded-full bg-slate-800 group-hover:bg-blue-500 flex items-center justify-center text-white transition-all group-hover:scale-110">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
