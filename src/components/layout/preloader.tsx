"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const loadingTexts = [
  "Bootstrapping quantum cores...",
  "Compiling neural networks...",
  "Syncing datacenter fabrics...",
  "Initializing secure systems...",
  "Preparing intelligent infrastructure...",
];

export function Preloader({ onLoaded }: { onLoaded: () => void }) {
  const [loadingIndex, setLoadingIndex] = useState(0);
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const displayPercentage = useTransform(rounded, v => `${v.toString().padStart(2, '0')}%`);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingIndex(prev => (prev + 1) % loadingTexts.length);
    }, 1200);

    const controls = animate(count, 100, {
      duration: 5,
      ease: [0.42, 0, 0.58, 1],
      onComplete: () => {
        clearInterval(textInterval);
        setTimeout(onLoaded, 500);
      },
    });

    return () => {
      clearInterval(textInterval);
      controls.stop();
    };
  }, [onLoaded, count]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeOut' } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.1),transparent)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22hsl(219,63%25,10%25)%22%20fill-opacity%3D%220.4%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020M40%2040V20L20%2040%22/%3E%3C/g%3E%3C/svg%3E')]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } }}
        className="relative w-48 h-48"
      >
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--primary) / 0.1)"
            strokeWidth="2"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset={useTransform(count, v => 283 * (1 - v / 100))}
            transform="rotate(-90 50 50)"
            style={{ filter: 'drop-shadow(0 0 5px hsl(var(--primary)))' }}
          />
        </svg>

        {/* DQ Monogram */}
        <div className="absolute inset-0 flex items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.circle 
                    cx="12" 
                    cy="12" 
                    r="8"
                    stroke="hsl(var(--primary) / 0.7)" 
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, transition: { duration: 1.5, delay: 0.5, ease: 'easeInOut' } }}
                />
                <motion.path 
                    d="M10 8 V 16"
                    stroke="hsl(var(--primary))" 
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, transition: { duration: 1, delay: 1.0, ease: 'easeInOut' } }}
                />
                 <motion.path 
                    d="M15 15 L 17 17"
                    stroke="hsl(var(--primary))" 
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, transition: { duration: 1, delay: 1.2, ease: 'easeInOut' } }}
                />
            </svg>
        </div>

        {/* Percentage */}
        <motion.div
            className="absolute inset-0 flex items-center justify-center font-code text-2xl text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 2.5, duration: 1 } }}
        >
            {displayPercentage}
        </motion.div>
      </motion.div>

      {/* Loading Text */}
      <div className="relative h-6 mt-8 overflow-hidden">
        <AnimatePresence mode="sync">
            <motion.p
                key={loadingIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
                exit={{ y: -20, opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } }}
                className="font-code text-sm text-muted-foreground tracking-wider"
            >
                {loadingTexts[loadingIndex]}
            </motion.p>
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
