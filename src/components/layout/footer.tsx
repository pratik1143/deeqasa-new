'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-[#030712] text-white relative z-20 overflow-hidden font-[Outfit] border-t border-blue-900/30">
      
      {/* Lucien Exact Background Spotlight Gradient & Matrix Character Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% 30%, rgba(37, 99, 235, 0.4) 0%, rgba(29, 78, 216, 0.2) 45%, rgba(3, 7, 18, 0.98) 80%),
            radial-gradient(ellipse 100% 70% at 50% 100%, rgba(37, 99, 235, 0.65) 0%, rgba(30, 58, 138, 0.4) 40%, rgba(3, 7, 18, 1) 90%)
          `
        }}
      />

      {/* Subtle Digital Code Grid Overlay (Exact Lucien Style) */}
      <div className="absolute inset-0 opacity-15 pointer-events-none z-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Lucien Pre-Footer CTA Section */}
      <div className="pt-32 pb-24 px-6 text-center space-y-8 relative z-10">
        
        {/* Centered Logo Emblem */}
        <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 mx-auto shadow-[0_0_25px_rgba(59,130,246,0.5)]">
          <ShieldCheck size={26} />
        </div>

        {/* Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-[1.08]">
            Deploy with certainty, <br />
            scale without hesitation
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto font-normal pt-2">
            Your AI investments deserve protection you can prove. <br className="hidden sm:inline" />
            Let us show you how Deeqasa delivers it.
          </p>
        </div>

        {/* Center Contact Button */}
        <div className="pt-4 flex justify-center">
          <Button
            asChild
            className="h-12 px-8 bg-white hover:bg-slate-100 text-slate-950 font-mono font-bold text-xs rounded-lg shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all group"
          >
            <Link href="/contact">
              Contact
            </Link>
          </Button>
        </div>

      </div>

      {/* Monospace Links & Copyright Line */}
      <div className="container-enterprise px-8 pb-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-slate-300">
          
          {/* Monospace Links */}
          <div className="flex flex-wrap items-center gap-8">
            <Link href="/about" className="hover:text-cyan-400 transition-colors">
              → About
            </Link>
            <Link href="/contact" className="hover:text-cyan-400 transition-colors">
              → Contact
            </Link>
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">
              → Terms and Conditions
            </Link>
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
              → Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-slate-300 tracking-wider">
            @ {new Date().getFullYear()} Deeqasa Technologies, Inc. All rights reserved.
          </div>

        </div>
      </div>

      {/* Lucien Exact Giant Full-Width DEEQASA Bottom Typography */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none pt-2 pb-0">
        <div className="w-full px-2 text-center relative z-10">
          <span className="text-[17.5vw] leading-none font-extrabold uppercase font-mono tracking-[-0.03em] text-white block opacity-95">
            DEEQASA
          </span>
        </div>
      </div>

    </footer>
  );
}
