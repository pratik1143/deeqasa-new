'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldAlert, Server, Zap, ArrowRight, Activity, ShieldCheck, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

const floatingPills = [
  { text: "Zero-Day Exploit Blocked", tag: "HP WOLF", type: "danger" },
  { text: "HP Wolf Shielded Host", tag: "VERIFIED", type: "clean" },
  { text: "Unsanitized USB Driver", tag: "CONTAINED", type: "warning" },
];

export function HorizontalScrollTrack() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-65%']);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#030716] text-white">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden px-6">
        
        {/* Section Header matching Lucien Screenshot */}
        <div className="container-enterprise mb-10 text-center max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block flex items-center justify-center gap-2">
            <Activity size={14} className="animate-pulse" /> THE PROBLEM & DEEQASA ARCHITECTURE
          </span>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white">
            Enterprise IT adoption is outpacing security
          </h2>
        </div>

        {/* Horizontal Track Container */}
        <div className="container-enterprise">
          <motion.div style={{ x }} className="flex gap-8">
            
            {/* CARD 1: Legacy Hardware Bottlenecks */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="w-[90vw] sm:w-[650px] md:w-[750px] lg:w-[840px] shrink-0 bg-slate-900/90 border border-slate-800/90 hover:border-blue-500/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 group shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_70px_rgba(59,130,246,0.25)] relative overflow-hidden"
            >
              {/* Top Accent Ping Dot */}
              <div className="absolute top-6 right-8 h-2 w-2 rounded-full bg-blue-400 animate-ping" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
                
                {/* Left Column: Clean Uncluttered Text */}
                <div className="md:col-span-6 space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-5">
                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                      <Server size={28} />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-blue-100 group-hover:text-white transition-colors">
                      Legacy Hardware Bottlenecks
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      72% of enterprise IT teams suffer from unplanned downtime and latency due to outdated server racks and unmonitored desktop fleets.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                      72% DOWNTIME EXPOSURE
                    </span>
                    <div className="h-10 w-10 rounded-full bg-slate-800 group-hover:bg-blue-500 flex items-center justify-center text-white transition-all group-hover:scale-110 shadow-lg">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Right Column: Dedicated High-Tech HUD Terminal Graphics Box (Zero Overlap!) */}
                <div className="md:col-span-6 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-4 font-mono shadow-2xl relative overflow-hidden">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-[10px] text-slate-400">
                    <span className="font-bold text-blue-400">SERVER_RACK_01 // HUD</span>
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" /> OVERLOAD
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 flex items-center justify-between text-xs">
                    <span className="font-semibold">LATENCY_SPIKE</span>
                    <span className="font-black text-red-400">450ms (CRITICAL)</span>
                  </div>

                  <div className="space-y-2 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-[11px]">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>CPU_LOAD_MAX</span>
                      <span className="text-amber-400 font-bold">98.4%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[98%]" />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
                    <div>STATUS: 01 UNPLANNED OUTAGE</div>
                    <div>HEAT_PUE: 2.4 (ELEVATED RACK TEMP)</div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* CARD 2: Fragmented Fleet Security (Interactive Threat Node Mesh) */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="w-[90vw] sm:w-[650px] md:w-[750px] lg:w-[840px] shrink-0 bg-slate-900/90 border border-slate-800/90 hover:border-blue-500/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 group shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_70px_rgba(59,130,246,0.25)] relative overflow-hidden"
            >
              {/* Top Accent Ping Dot */}
              <div className="absolute top-6 right-8 h-2 w-2 rounded-full bg-red-500 animate-ping" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
                
                {/* Left Column: Clean Uncluttered Text */}
                <div className="md:col-span-6 space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-5">
                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                      <ShieldAlert size={28} />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-blue-100 group-hover:text-white transition-colors">
                      Fragmented Fleet Security
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      58% of remote & hybrid employee devices lack hardware-enforced Zero-Trust protection, exposing corporate networks to zero-day breaches.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                      58% FLEET EXPOSURE
                    </span>
                    <div className="h-10 w-10 rounded-full bg-slate-800 group-hover:bg-blue-500 flex items-center justify-center text-white transition-all group-hover:scale-110 shadow-lg">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Right Column: Dedicated Threat Telemetry Box (Zero Overlap!) */}
                <div className="md:col-span-6 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-3 font-mono shadow-2xl relative overflow-hidden">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-[10px] text-slate-400">
                    <span className="font-bold text-blue-400">ZERO-TRUST TELEMETRY MESH</span>
                    <span className="text-emerald-400 font-bold">SOC MESH ACTIVE</span>
                  </div>

                  {floatingPills.map((pill, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                      className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between backdrop-blur-md ${
                        pill.type === 'danger'
                          ? 'bg-red-950/50 border-red-500/50 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                          : pill.type === 'warning'
                          ? 'bg-amber-950/50 border-amber-500/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {pill.type === 'danger' ? (
                          <AlertTriangle size={14} className="text-red-400 shrink-0" />
                        ) : pill.type === 'warning' ? (
                          <AlertCircle size={14} className="text-amber-400 shrink-0" />
                        ) : (
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        )}
                        <span className="font-medium">{pill.text}</span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {pill.tag}
                      </span>
                    </motion.div>
                  ))}
                </div>

              </div>
            </motion.div>

            {/* CARD 3: High OpEx & Energy Waste */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="w-[90vw] sm:w-[650px] md:w-[750px] lg:w-[840px] shrink-0 bg-slate-900/90 border border-slate-800/90 hover:border-blue-500/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 group shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_70px_rgba(59,130,246,0.25)] relative overflow-hidden"
            >
              {/* Top Accent Ping Dot */}
              <div className="absolute top-6 right-8 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
                
                {/* Left Column: Clean Uncluttered Text */}
                <div className="md:col-span-6 space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-5">
                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                      <Zap size={28} />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-blue-100 group-hover:text-white transition-colors">
                      High OpEx & Energy Waste
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed font-normal">
                      Up to 40% in wasted power and over-provisioned cloud nodes. Unoptimized cooling and legacy data center designs silently drain corporate budgets.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                      UP TO 40% OPEX WASTED
                    </span>
                    <div className="h-10 w-10 rounded-full bg-slate-800 group-hover:bg-blue-500 flex items-center justify-center text-white transition-all group-hover:scale-110 shadow-lg">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Right Column: Dedicated Financial & Energy HUD Box (Zero Overlap!) */}
                <div className="md:col-span-6 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-4 font-mono shadow-2xl relative overflow-hidden">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-[10px] text-slate-400">
                    <span className="font-bold text-blue-400">ENERGY & FINANCIAL HUD</span>
                    <span className="text-blue-400 font-bold">AUDIT READY</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/40 text-blue-300 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">ANNUAL_OPEX_DRAIN</span>
                      <span className="font-black text-blue-400 text-sm">+$420,000 / YR</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full w-[85%]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>DEEQASA Liquid Cooling</span>
                    </div>
                    <span className="font-bold text-emerald-400">-50% Power Saved</span>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-[10px] text-slate-400">
                    SCOPE 3 CARBON EMISSIONS: REDUCED BY 35%
                  </div>
                </div>

              </div>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
