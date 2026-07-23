'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ShieldCheck, Zap } from 'lucide-react';

const stages = [
  {
    id: '01',
    title: 'Sub-Millisecond Analysis',
    desc: 'Detects hardware & network anomalies in <1µs, 100x faster than software.',
    stat: '<1µs Latency'
  },
  {
    id: '02',
    title: 'Real-Time Telemetry & Isolation',
    desc: 'Hardware-enforced HP Wolf sandbox prevents zero-day payload execution.',
    stat: '100% Isolation'
  },
  {
    id: '03',
    title: 'Deterministic SLA Enforcement',
    desc: 'Guarantees 99.999% uptime with automated self-healing firmware.',
    stat: '99.999% SLA'
  }
];

export function DeeqasaChipHowItWorks() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage(prev => (prev + 1) % stages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = stages[activeStage];

  return (
    <section className="py-28 px-6 bg-[#040a1b] text-white relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-70"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59, 130, 246, 0.25) 0%, rgba(30, 58, 138, 0.1) 45%, rgba(4, 10, 27, 0.95) 75%)'
        }}
      />

      <div className="container-enterprise relative z-10 space-y-16">
        
        {/* Section Header matching Screenshot */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">
            HOW IT WORKS —
          </span>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white leading-tight">
            Deploy DEEQASA as an enforcement layer for Enterprise Architecture
          </h2>
        </div>

        {/* Center Display: Left Title | 3D Metallic Chip | Right Spec */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px]">
          
          {/* Left Column: Active Step Title with Vertical Bar Indicator */}
          <div className="lg:col-span-4 flex items-center justify-start lg:justify-end">
            <div className="flex items-center gap-6">
              <div className="h-20 w-1.5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] shrink-0" />
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-blue-400 tracking-widest block">
                  STAGE {current.id}
                </span>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={current.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl sm:text-3xl font-normal text-white tracking-tight leading-snug max-w-xs"
                  >
                    {current.title}
                  </motion.h3>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Center Column: 3D Metallic DEEQASA Hardware Chip (Exact Screenshot Replica!) */}
          <div className="lg:col-span-4 flex justify-center relative py-12">
            
            {/* Surrounding Radial Glow & Dial Ticks */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full border border-blue-500/20 animate-spin-slow opacity-60 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border border-blue-400/30 border-dashed" />
              </div>
            </div>

            {/* 3D Metallic Processor Die Container */}
            <motion.div
              animate={{ rotateX: [15, 20, 15], rotateY: [-20, -15, -20], y: [-6, 6, -6] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-64 h-64 sm:w-72 sm:h-72 bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 p-1 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(59,130,246,0.4)] flex items-center justify-center border border-slate-300/40"
              style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px) rotateX(20deg) rotateY(-20deg)' }}
            >
              {/* Corner Mounting Screws */}
              <div className="absolute top-3 left-3 h-4 w-4 rounded-full bg-slate-400 border border-slate-600 shadow-inner flex items-center justify-center">
                <div className="h-2 w-0.5 bg-slate-700 transform rotate-45" />
              </div>
              <div className="absolute top-3 right-3 h-4 w-4 rounded-full bg-slate-400 border border-slate-600 shadow-inner flex items-center justify-center">
                <div className="h-2 w-0.5 bg-slate-700 transform -rotate-45" />
              </div>
              <div className="absolute bottom-3 left-3 h-4 w-4 rounded-full bg-slate-400 border border-slate-600 shadow-inner flex items-center justify-center">
                <div className="h-2 w-0.5 bg-slate-700 transform -rotate-45" />
              </div>
              <div className="absolute bottom-3 right-3 h-4 w-4 rounded-full bg-slate-400 border border-slate-600 shadow-inner flex items-center justify-center">
                <div className="h-2 w-0.5 bg-slate-700 transform rotate-45" />
              </div>

              {/* Outer Pin Grid Fringe */}
              <div className="absolute inset-2 rounded-2xl border-2 border-slate-500/60 border-dashed pointer-events-none" />

              {/* Inner Raised Metallic Die Plate */}
              <div className="w-48 h-48 sm:w-52 sm:h-52 bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 rounded-2xl border border-slate-200 shadow-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                
                {/* Metallic Heat Spreader Lines */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/60" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-600/40" />

                {/* Engraved DEEQASA Brand Logo */}
                <div className="text-center space-y-1">
                  <div className="h-7 w-7 rounded-lg bg-blue-500/20 border border-blue-400/40 mx-auto flex items-center justify-center text-blue-600 mb-1">
                    <Cpu size={16} />
                  </div>
                  <span className="text-xl sm:text-2xl font-black tracking-[0.3em] text-slate-800 uppercase block font-mono">
                    DEEQASA
                  </span>
                  <span className="text-[8px] font-bold tracking-[0.4em] text-slate-600 uppercase block font-mono">
                    SECURITY MATRIX
                  </span>
                </div>

                {/* Electric Blue Pulsing Core Glow */}
                <div className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-blue-400 animate-ping" />
              </div>
            </motion.div>

          </div>

          {/* Right Column: Monospaced Technical Spec Description */}
          <div className="lg:col-span-4 flex items-center justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 font-mono max-w-xs"
              >
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed tracking-wider">
                  {current.desc}
                </p>
                <div className="text-xs text-blue-400 font-bold tracking-widest pt-2">
                  BENCHMARK: {current.stat}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom Interactive Stage Indicator Dots */}
        <div className="flex items-center justify-center gap-3 pt-6">
          {stages.map((stg, i) => (
            <button
              key={stg.id}
              onClick={() => setActiveStage(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === activeStage 
                  ? "w-10 bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]" 
                  : "w-2.5 bg-slate-800 hover:bg-slate-700"
              }`}
              aria-label={`Go to stage ${stg.id}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
