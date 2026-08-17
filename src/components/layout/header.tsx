'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Menu, X, FileText } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#030716]/85 backdrop-blur-2xl border-b border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-enterprise px-6 flex items-center justify-between">
        
        {/* Left Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono tracking-widest text-slate-400">
          <Link 
            href="/about" 
            className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${
              pathname === '/about' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            <span>→</span> <span>About</span>
          </Link>
          <Link 
            href="/solutions" 
            className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${
              pathname === '/solutions' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            <span>→</span> <span>Solutions</span>
          </Link>
          
          {/* Highlighted & Glowing "Obtain Document" CTA Link */}
          <Link 
            href="/hp-intel-spark" 
            className="relative inline-flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105 transition-all group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <FileText size={15} className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-cyan-100 font-extrabold group-hover:text-white">Obtain Document</span>
          </Link>
        </div>

        {/* Center Brand Logo - Lucien + SR Enterprise Fusion */}
        <Link href="/" className="group flex flex-col items-center text-center">
          <span className="text-2xl md:text-3xl font-extrabold tracking-[0.3em] uppercase font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400 group-hover:from-cyan-300 group-hover:to-white transition-all">
            DEEQASA
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.4em] font-mono">
              HP CONNECT ENTERPRISE
            </span>
          </div>
        </Link>

        {/* Right CTA Button - Opens DeeQasa's standard quotation/demo form */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            asChild
            className="h-11 px-6 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all group"
          >
            <Link href="/quotation">
              Book a Demo <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-6 py-6 space-y-4 font-mono text-sm backdrop-blur-xl">
          <Link 
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 py-1"
          >
            → About
          </Link>
          <Link 
            href="/solutions" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 py-1"
          >
            → Solutions
          </Link>
          <Link 
            href="/hp-intel-spark" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-cyan-300 hover:text-cyan-400 py-2 font-bold bg-cyan-950/80 border border-cyan-500/50 rounded-lg px-4 text-center shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            📄 Obtain Document (HP & Intel SPARK)
          </Link>
          <Link 
            href="/quotation" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white font-bold bg-cyan-600/20 p-3 rounded-lg border border-cyan-500/30 text-center uppercase tracking-wider text-xs"
          >
            Book a Demo
          </Link>
        </div>
      )}
    </header>
  );
}
