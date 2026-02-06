"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HeroVideoBackground } from './hero-video-background';
import { motion, AnimatePresence } from 'framer-motion';

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
    <section className="relative h-screen min-h-[700px] w-full flex flex-col items-center justify-center overflow-hidden font-code">
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
                  <motion.div variants={itemVariants} className="inline-block px-6 py-2 bg-black/50 rounded-lg mb-8 border border-border">
                      <span className="text-sm text-primary tracking-widest">
                      STATUS: OPERATIONAL
                      </span>
                  </motion.div>
              
                  <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-medium tracking-tight text-foreground">
                      <span className="text-muted-foreground">smart</span>
                      <span className="mx-4 text-border">/</span>
                      <span className="text-primary">secure</span>
                      <span className="mx-4 text-border">/</span>
                      <span className="text-muted-foreground">sustainable</span>
                  </motion.h1>
                  
                  <motion.p variants={itemVariants} className="mt-8 text-lg md:text-xl text-muted-foreground">
                      {'> enterprise_it_solutions.init()'}
                  </motion.p>

                  <motion.div variants={itemVariants} className="mt-12">
                      <Button size="lg" className="font-headline font-bold text-lg bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground hover:shadow-[0_0_20px_5px_hsl(var(--primary)/0.5)] transition-shadow duration-300 rounded-full px-8 py-6">
                      Initiate Transformation
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