'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Laptop, 
  Server, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  Building2, 
  Globe,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LeadForm } from '@/components/campaigns/hp-intel-spark/LeadForm';
import { OfficialPackageNotice } from '@/components/campaigns/hp-intel-spark/OfficialPackageNotice';
import { trackCTAClick, trackPageView } from '@/lib/analytics';
import { captureUTMParameters } from '@/lib/utm-tracker';

export default function HPIntelSparkPage() {
  useEffect(() => {
    // Capture UTM attribution on page visit
    captureUTMParameters();
    // Track PageView for GA4
    trackPageView('/hp-intel-spark');
  }, []);

  const scrollToForm = (location: string, ctaName: string) => {
    trackCTAClick(ctaName, location, 'hp_intel_spark_2026');
    const formElement = document.getElementById('enquire-lead-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030716] text-white font-[Outfit] selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Navigation Header */}
      <Header />

      {/* Radiant Background Glow & Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.18) 45%, rgba(3, 7, 22, 0.98) 85%),
            radial-gradient(ellipse 90% 60% at 50% 80%, rgba(30, 64, 175, 0.25) 0%, transparent 70%)
          `
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 space-y-20 max-w-full">

        {/* 1. HERO SECTION */}
        <section className="container-enterprise px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 text-center space-y-8">
          
          {/* Partnership Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] sm:text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.25)]"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>HP & INTEL SPARK PROGRAM — DEEQASA ALLIANCE</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 max-w-5xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-[Outfit]">
              Power Enterprise GenAI & Compute with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400">
                HP & Intel SPARK Program
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed pt-2">
              Transform your organization's digital architecture with high-performance HP ZBook workstations, Intel® Core™ Ultra AI processors, and Intel® Xeon® server nodes backed by DeeQasa’s certified fleet deployment.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Button
              onClick={() => scrollToForm('hero', 'get_started')}
              className="h-14 px-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-600 text-slate-950 font-black uppercase tracking-widest text-xs rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
            >
              Get Started Now <ArrowRight size={16} className="ml-2" />
            </Button>

            <Button
              onClick={() => scrollToForm('hero', 'enquire_now')}
              variant="outline"
              className="h-14 px-8 bg-slate-900/90 border-slate-700 hover:border-cyan-400 text-white font-mono font-bold uppercase tracking-wider text-xs rounded-full hover:bg-slate-800 transition-all"
            >
              Enquire Now
            </Button>
          </motion.div>

          {/* Key Value Pill Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto font-mono text-[11px] text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
              <span>Intel® NPU AI Hardware</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
              <span>HP Wolf Pro Security</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
              <span>OpEx DaaS Leasing</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
              <span>24/7 Enterprise Uplink</span>
            </div>
          </div>

        </section>

        {/* 2. PROGRAM OVERVIEW & ARCHITECTURE HIGHLIGHTS */}
        <section className="container-enterprise px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 sm:p-12 space-y-12 backdrop-blur-xl">
            
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 block">
                ENTERPRISE SPECIFICATIONS —
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                Engineered for Next-Gen Compute
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                The HP & Intel SPARK initiative provides organizations with immediate access to cutting-edge hardware architectures designed for high-density computing, local AI model execution, and Zero-Trust cyber resilience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all space-y-4 group">
                <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Cpu size={28} />
                </div>
                <h3 className="text-xl font-bold text-white">Intel® Core™ Ultra AI Acceleration</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Integrated Neural Processing Units (NPUs) deliver energy-efficient on-device AI inference for enterprise LLMs, data analytics, and real-time processing without cloud dependency.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all space-y-4 group">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Laptop size={28} />
                </div>
                <h3 className="text-xl font-bold text-white">HP Commercial ZBook & EliteBook Fleet</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Ultra-rugged mobile workstations engineered for data scientists, engineers, and executive teams, featuring HP Wolf Security and self-healing BIOS architecture.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all space-y-4 group">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Server size={28} />
                </div>
                <h3 className="text-xl font-bold text-white">Intel® Xeon® Scalable Compute Clusters</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Enterprise datacenter nodes optimized for high-concurrency cloud workloads, deep learning acceleration, and scalable virtualized infrastructures.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 3. MID-PAGE CTA BANNER */}
        <section className="container-enterprise px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400 block">
                SPECIAL PROGRAM ALLOCATION
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                Ready to Upgrade Your Enterprise Compute Fleet?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm">
                Get custom HP Gold Partner pricing, proof-of-concept units, and dedicated technical assistance under the HP & Intel SPARK Program.
              </p>
            </div>
            
            <Button
              onClick={() => scrollToForm('mid_page', 'talk_to_us')}
              className="h-14 px-8 bg-white hover:bg-slate-100 text-slate-950 font-black uppercase tracking-widest text-xs rounded-full shadow-[0_0_25px_rgba(255,255,255,0.3)] shrink-0 transition-transform hover:scale-105"
            >
              Talk to Solutions Architect <PhoneCall size={16} className="ml-2" />
            </Button>
          </div>
        </section>

        {/* 4. LEAD GENERATION FORM SECTION */}
        <section id="enquire-lead-form" className="container-enterprise px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* High Conversion Lead Form Component */}
            <LeadForm />

          </div>
        </section>

      </main>

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#030716]/95 border-t border-slate-800 p-4 backdrop-blur-xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-mono uppercase text-cyan-400 block">HP & INTEL SPARK</span>
          <span className="text-xs font-bold text-white">Priority Registration</span>
        </div>
        <Button
          onClick={() => scrollToForm('mobile_sticky', 'register_interest')}
          className="h-11 px-6 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black uppercase tracking-wider text-xs rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        >
          Enquire Now
        </Button>
      </div>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
