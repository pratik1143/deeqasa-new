
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HeroVideoBackground } from './hero-video-background';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200); 
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };
  
  return (
    <section className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center py-20 px-4 md:px-8 overflow-hidden font-code">
      <HeroVideoBackground />
      
      {/* Dark Overlay for Hero - calibrated for visibility */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      <div className="relative z-20 flex flex-col items-center justify-center text-center w-full max-w-6xl mx-auto">
        <AnimatePresence>
          {show && (
            <motion.div 
              className="flex flex-col items-center space-y-10"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="inline-block px-6 py-2 bg-black/50 rounded-lg border border-white/10">
                <span className="text-sm text-primary tracking-[0.3em] font-black uppercase">
                  STATUS: OPERATIONAL
                </span>
              </motion.div>
          
              <motion.h1 
                variants={itemVariants} 
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase leading-[1.1]"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
                  <span className="text-white/40">smart</span>
                  <span className="hidden sm:block mx-4 text-white/10">/</span>
                  <span className="text-primary drop-shadow-[0_0_20px_rgba(0,224,255,0.5)]">secure</span>
                  <span className="hidden sm:block mx-4 text-white/10">/</span>
                  <span className="text-white/40">sustainable</span>
                </div>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/60 font-medium max-w-2xl px-4">
                {'> enterprise_it_solutions.init()'}
              </motion.p>

              <motion.div variants={itemVariants} className="pt-4">
                <Button asChild size="lg" className="h-16 px-12 bg-primary text-black font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(0,224,255,0.6)] transition-all rounded-full group">
                  <Link href="/contact" className="flex items-center gap-3">
                    Initiate Transformation
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
