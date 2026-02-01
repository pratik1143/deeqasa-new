"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CenteredLoader({ text = "Initializing", className }: { text?: string, className?: string }) {
  return (
    <div className={cn("fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none", className)}>
        <div className="relative w-12 h-12">
            {/* Outer Ring */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 3,
                    ease: 'linear',
                    repeat: Infinity,
                }}
            >
                <motion.svg className="w-full h-full" viewBox="0 0 48 48">
                    <motion.circle
                        cx="24"
                        cy="24"
                        r="23.25"
                        stroke="hsl(var(--primary) / 0.7)"
                        strokeWidth="1.5"
                        fill="transparent"
                        animate={{ opacity: [0.7, 0.85, 0.7] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            repeatDelay: 5.2,
                            ease: 'easeInOut',
                        }}
                    />
                </motion.svg>
            </motion.div>

            {/* Inner Ring */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: -360 }}
                transition={{
                    duration: 2,
                    ease: 'linear',
                    repeat: Infinity,
                }}
            >
                <motion.svg className="w-full h-full" viewBox="0 0 48 48">
                    <motion.circle
                        cx="24"
                        cy="24"
                        r="16"
                        stroke="hsl(var(--primary) / 0.3)"
                        strokeWidth="1"
                        fill="transparent"
                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            repeatDelay: 5.2,
                            ease: 'easeInOut',
                        }}
                    />
                </motion.svg>
            </motion.div>
        </div>
        {text && <p className="mt-3 font-code text-[11px] text-muted-foreground/60 tracking-[0.05em]">{text}</p>}
    </div>
  );
}
