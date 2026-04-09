"use client";

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { QasaAssistant } from '@/components/qasa/qasa-assistant';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { Preloader } from '@/components/layout/preloader';
import { WacusHero } from '@/components/sections/wacus-hero';
import { WacusShowcase } from '@/components/sections/wacus-showcase';
import { WacusTicker } from '@/components/sections/wacus-ticker';
import { WacusPrinters } from '@/components/sections/wacus-printers';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="bg-background min-h-screen text-foreground font-[Outfit]">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onLoaded={handleLoaded} />}
      </AnimatePresence>
      
      <CustomCursor />
      <div className="relative z-10">
        <Header />
        <main className="flex flex-col">
          <WacusHero />
          <WacusTicker />
          <WacusShowcase />
          <WacusPrinters />
          
          {/* SECURE COMM STRIP */}
          <section className="py-32 bg-slate-50 overflow-hidden relative border-y border-slate-100">
            <div className="container-enterprise relative z-10 flex flex-col items-center justify-center text-center">
               <h2 className="text-5xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8 font-[Outfit]">
                  INITIATE <br />
                  <span className="text-slate-200">THE FUTURE</span>
               </h2>
               <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm mb-12 max-w-2xl mx-auto">
                 Partner with DEEQASA TECH to engineer a reliable, secure, and infinitely scalable digital infrastructure.
               </p>
               <a href="/contact" className="px-12 py-5 rounded-full bg-primary hover:bg-slate-900 hover:text-white text-white font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-primary/20">
                 Start Project
               </a>
            </div>
          </section>

        </main>
        <Footer />
      </div>
      <QasaAssistant />
    </div>
  );
}
