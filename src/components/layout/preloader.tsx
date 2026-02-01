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
  const width = useTransform(count, v => `${v}%`);


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
      
      <div className="w-1/2 max-w-md flex flex-col items-center gap-4">
        {/* Line progress bar */}
        <div className="relative w-full h-1.5 overflow-hidden rounded-full bg-primary/10">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary"
            style={{ width, boxShadow: '0 0 8px hsl(var(--primary)/0.7)' }}
          />
        </div>

        <div className="w-full flex justify-between items-center mt-2">
            {/* Loading Text */}
            <div className="relative h-6 overflow-hidden">
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
            {/* Percentage */}
            <motion.div
                className="font-code text-sm text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5, duration: 1 } }}
            >
                {displayPercentage}
            </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
