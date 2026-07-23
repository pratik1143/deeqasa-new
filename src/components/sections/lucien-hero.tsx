'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const scramblePhrases = [
  { line1: "High-Performance", line2: "Enterprise Hardware & Software", line3: "Solutions for Business" },
  { line1: "Next-Gen Hybrid", line2: "Cloud & HP Z-Workstation", line3: "Fleet Architecture" },
  { line1: "Zero-Trust Cyber", line2: "Defense & 24/7 Managed", line3: "IT Infrastructure" }
];

const tickerStats = [
  "1000+ concurrent sessions",
  "FPGA acceleration",
  "0.7 Gbps throughput",
  "99.999% SLA uptime",
  "Cryptographically signed"
];

export function LucienHero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [line2Display, setLine2Display] = useState("");
  const [tickerIndex, setTickerIndex] = useState(0);

  // Trigger Scramble Animation Function
  const triggerScramble = (targetText: string, onComplete?: () => void) => {
    let iteration = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    
    const scrambleInterval = setInterval(() => {
      setLine2Display(
        targetText
          .split('')
          .map((char, idx) => (idx < iteration ? targetText[idx] : chars[Math.floor(Math.random() * chars.length)]))
          .join('')
      );

      if (iteration >= targetText.length) {
        clearInterval(scrambleInterval);
        if (onComplete) onComplete();
      }
      iteration += 1 / 2;
    }, 25);
  };

  useEffect(() => {
    // 1. Trigger text scramble IMMEDIATELY on load!
    triggerScramble(scramblePhrases[0].line2);

    // 2. Cycle scramble animation every 5.5 seconds
    const phraseTimer = setInterval(() => {
      setPhraseIndex(prevIndex => {
        const nextIdx = (prevIndex + 1) % scramblePhrases.length;
        triggerScramble(scramblePhrases[nextIdx].line2);
        return nextIdx;
      });
    }, 5500);

    // 3. Cycle bottom right ticker stats every 3 seconds
    const statTimer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerStats.length);
    }, 3000);

    return () => {
      clearInterval(phraseTimer);
      clearInterval(statTimer);
    };
  }, []);

  const currentPhrase = scramblePhrases[phraseIndex];

  return (
    <section className="relative min-h-screen pt-32 pb-16 px-6 overflow-hidden bg-[#030716] text-white flex flex-col justify-between selection:bg-blue-500/30">
      
      {/* Lucien Curved Blue Crescent Aura Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-90 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% 60%, rgba(147, 197, 253, 0.45) 0%, rgba(59, 130, 246, 0.3) 30%, rgba(29, 78, 216, 0.15) 55%, rgba(3, 7, 22, 1) 85%),
            radial-gradient(ellipse 120% 80% at 50% -10%, rgba(30, 64, 175, 0.35) 0%, transparent 70%)
          `
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Centered Hero Headline */}
      <div className="container-enterprise relative z-10 my-auto flex flex-col items-center justify-center text-center">
        <div className="max-w-6xl space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-light tracking-tight leading-[1.02] text-white select-none">
              <span className="block font-normal text-slate-100">
                {currentPhrase.line1}
              </span>
              <span className="block font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400">
                {line2Display || currentPhrase.line2}
              </span>
              <span className="block font-normal text-slate-100">
                {currentPhrase.line3}
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-6"
          >
            <Button
              asChild
              className="h-14 px-8 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full shadow-2xl transition-transform hover:scale-105"
            >
              <Link href="/quotation">
                Configure Quotation <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-14 px-8 bg-slate-900/60 border-slate-700/80 hover:bg-slate-800 text-slate-200 font-bold uppercase tracking-wider text-xs rounded-full backdrop-blur-xl"
            >
              <Link href="/solutions">
                Explore Architectures
              </Link>
            </Button>
          </motion.div>

        </div>
      </div>

      {/* Lucien Signature Bottom Right Ticker & Scroll Line */}
      <div className="container-enterprise relative z-10 flex items-end justify-between pt-8 pb-4">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-slate-400">
          DEEQASA TECH // HP CONNECT ENTERPRISE
        </div>

        <div className="flex items-center gap-6">
          <div className="text-xs md:text-sm font-mono text-slate-300 tracking-wider transition-all duration-300">
            {tickerStats[tickerIndex]} <span className="text-blue-400 font-bold">←</span>
          </div>

          {/* Vertical Scroll Indicator Line */}
          <div className="h-12 w-[1.5px] bg-gradient-to-b from-blue-400 via-blue-600/50 to-transparent animate-pulse" />
        </div>
      </div>

    </section>
  );
}
