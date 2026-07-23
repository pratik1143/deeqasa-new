'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const missionStatement = "Enterprise IT shouldn't slow you down. Modern hardware & software architecture needs to be fast, secure, and resilient.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const color = useTransform(progress, range, ["rgba(148, 163, 184, 0.25)", "rgba(255, 255, 255, 1)"]);
  const textShadow = useTransform(progress, range, ["0 0 0px transparent", "0 0 20px rgba(59, 130, 246, 0.6)"]);

  return (
    <span className="relative inline-block mr-3 md:mr-4 my-1">
      <motion.span 
        style={{ opacity, color, textShadow }} 
        className="transition-colors duration-200"
      >
        {word}
      </motion.span>
    </span>
  );
}

export function TextRevealSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "end 0.35"]
  });

  const words = missionStatement.split(" ");

  return (
    <section ref={targetRef} className="py-32 px-6 bg-[#030716] text-white relative overflow-hidden font-[Outfit]">
      
      {/* Background Subtle Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-60"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
        }}
      />

      <div className="container-enterprise max-w-5xl mx-auto text-center space-y-10 relative z-10">
        
        <Badge variant="outline" className="px-4 py-1.5 rounded-full border-blue-500/40 bg-blue-500/10 text-blue-400 font-mono font-bold text-xs uppercase tracking-widest">
          THE MISSION —
        </Badge>

        {/* Scroll-Driven Word Reveal Headline (SR Enterprise Style!) */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.12] text-center select-none">
          {words.map((word, idx) => {
            const start = idx / words.length;
            const end = (idx + 1) / words.length;
            return (
              <Word 
                key={idx} 
                word={word} 
                progress={scrollYProgress} 
                range={[start, end]} 
              />
            );
          })}
        </h2>

        <p className="text-slate-400 text-base md:text-xl font-normal max-w-2xl mx-auto leading-relaxed pt-4">
          DEEQASA TECH brings high-performance HP hardware, cloud software integration, and hardware-enforced cybersecurity together into a single, unified enterprise ecosystem.
        </p>

      </div>
    </section>
  );
}
