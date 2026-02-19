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
    <section className="relative h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center overflow-hidden font-code bg-black">
      <HeroVideoBackground />
      
      {/* Dark Overlay for Hero */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      
      <div className="relative z-20 flex flex-col items-center justify-center text-center p-4 w-full">
        <div className="w-full">
          <AnimatePresence>
          {show && (
              <motion.div 
                  className="flex flex-col items-center"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  variants={containerVariants}
              >
                  <motion.div variants={itemVariants} className="inline-block px-6 py-2 bg-black/50 rounded-lg mb-8 border border-white/10">
                      <span className="text-sm text-primary tracking-widest font-black">
                      STATUS: OPERATIONAL
                      </span>
                  </motion.div>
              
                  <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-black tracking-tight text-white uppercase leading-none">
                      <span className="text-white/40">smart</span>
                      <span className="mx-4 text-white/10">/</span>
                      <span className="text-primary drop-shadow-[0_0_15px_rgba(0,224,255,0.4)]">secure</span>
                      <span className="mx-4 text-white/10">/</span>
                      <span className="text-white/40">sustainable</span>
                  </motion.h1>
                  
                  <motion.p variants={itemVariants} className="mt-8 text-lg md:text-xl text-white/60 font-medium">
                      {'> enterprise_it_solutions.init()'}
                  </motion.p>

                  <motion.div variants={itemVariants} className="mt-12">
                      <Button asChild size="lg" className="h-16 px-10 bg-primary text-black font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,224,255,0.5)] transition-all rounded-full">
                        <Link href="/contact">Initiate Transformation</Link>
                      </Button>
                  </motion.div>
              </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}