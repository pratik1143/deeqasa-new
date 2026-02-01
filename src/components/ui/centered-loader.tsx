"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CenteredLoader({ text, className }: { text?: string, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <motion.div
        className="relative w-8 h-8"
        animate={{ rotate: 360 }}
        transition={{
          loop: Infinity,
          ease: "linear",
          duration: 1.2,
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 50 50">
          <defs>
            <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
          </defs>
          <circle
            cx="25"
            cy="25"
            r="22"
            stroke="hsl(var(--primary) / 0.1)"
            strokeWidth="2"
            fill="transparent"
          />
          <motion.circle
            cx="25"
            cy="25"
            r="22"
            stroke="url(#loader-gradient)"
            strokeWidth="2"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray="40 100"
            style={{ filter: 'drop-shadow(0 0 3px hsl(var(--primary) / 0.5))' }}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -140 }}
            transition={{
              loop: Infinity,
              ease: 'linear',
              duration: 1.2,
            }}
          />
        </svg>
      </motion.div>
      {text && <p className="text-xs text-muted-foreground">{text}</p>}
    </div>
  );
}
