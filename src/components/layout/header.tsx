'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Quotation', href: '/quotation' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
        
        {/* Left Nav Link */}
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-slate-400">
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

        {/* Right CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            asChild
            className="h-11 px-6 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all group"
          >
            <Link href="/hp-intel-spark?intent=demo">
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
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#030716] border-b border-slate-800 p-6 space-y-4 font-mono text-sm"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-cyan-400 py-2 border-b border-slate-900 uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
          <Button
            asChild
            className="w-full h-12 bg-white text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full mt-4"
          >
            <Link href="/quotation" onClick={() => setMobileMenuOpen(false)}>
              Book a Demo
            </Link>
          </Button>
        </motion.div>
      )}

    </header>
  );
}
