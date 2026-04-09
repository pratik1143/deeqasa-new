"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { CyberGlobe } from "@/components/3d/cyber-globe";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WacusHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[120vh] bg-slate-50 flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 z-0 opacity-[0.4] mix-blend-multiply pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-purple-200/5 blur-[80px]" />
      </div>
      <CyberGlobe />

      <div className="container-enterprise relative z-10 w-full">
        <motion.div 
          style={{ y: y1, opacity }}
          className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-slate-400">
              Transforming Digital Infrastructure
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-slate-900 font-[Outfit]"
          >
            NEXT LEVEL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-slate-500 to-primary">
              ENTERPRISE
            </span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex flex-col sm:flex-row gap-6 items-center"
          >
            <Button 
              asChild 
              size="lg" 
              className="h-16 px-12 rounded-full bg-slate-900 hover:bg-primary text-white font-bold uppercase tracking-widest transition-all duration-500 overflow-hidden group shadow-2xl"
            >
              <Link href="/contact">
                <span className="relative z-10 flex items-center gap-3">
                  Initiate Link <ArrowDownRight className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
                </span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-10 left-10 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-300"
      >
        <span>SCROLL DOWN</span>
        <div className="w-12 h-[1px] bg-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full bg-slate-400 animate-line-loader" />
        </div>
      </motion.div>
    </section>
  );
}
