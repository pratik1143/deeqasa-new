"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export function WacusPrinters() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Section 1: Poly (0 to 0.5)
  // Section 2: Printers (0.5 to 1)

  const polyOpacity = useTransform(scrollYProgress, [0, 0.4, 0.5], [1, 1, 0]);
  const polyScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const printerOpacity = useTransform(scrollYProgress, [0.5, 0.6, 1], [0, 1, 1]);
  const printerScale = useTransform(scrollYProgress, [0.5, 1], [1.2, 1]);

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* POLY SECTION */}
        <motion.div 
          style={{ opacity: polyOpacity, scale: polyScale }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
           <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-20"
          >
            <source src="/poly.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white z-10" />
          
          <div className="relative z-20 text-center px-4 max-w-5xl">
            <h2 className="text-6xl md:text-9xl font-black text-slate-900 uppercase tracking-tighter mb-6 font-[Outfit]">
              POLY <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-400">STUDIO</span>
            </h2>
            <p className="text-slate-500 text-xl md:text-2xl font-bold uppercase tracking-[0.4em] mb-10">
              Immersive Enterprise Collaboration
            </p>
            <Button size="lg" className="h-20 px-12 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest rounded-full transition-all group shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] hover:shadow-primary/30">
              Launch Matrix <ArrowUpRight className="ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* PRINTERS SECTION */}
        <motion.div 
          style={{ opacity: printerOpacity, scale: printerScale }}
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
          <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-30 mix-blend-multiply"
          >
            <source src="/printer.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white z-10" />
          
          <div className="relative z-20 text-center px-4 max-w-5xl pointer-events-auto">
            <h2 className="text-6xl md:text-9xl font-black text-slate-900 uppercase tracking-tighter mb-6 font-[Outfit]">
              HP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-blue-600">PRINTERS</span>
            </h2>
            <p className="text-slate-500 text-xl md:text-2xl font-bold uppercase tracking-[0.4em] mb-10">
              High-Velocity Output Architecture
            </p>
            <Button size="lg" className="h-20 px-12 bg-primary hover:bg-slate-900 text-white font-black uppercase tracking-widest rounded-full transition-all group shadow-[0_20px_50px_-15px_rgba(26,140,255,0.4)] hover:shadow-slate-900/30">
              View Hardware <ArrowUpRight className="ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
