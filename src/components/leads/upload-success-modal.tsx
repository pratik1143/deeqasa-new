"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertTriangle, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface UploadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    total: number;
    uploaded: number;
    skipped: number;
    failed: number;
  };
  onDownloadFailed?: () => void;
}

export function UploadSuccessModal({ isOpen, onClose, stats, onDownloadFailed }: UploadSuccessModalProps) {
  React.useEffect(() => {
    if (isOpen && stats.uploaded > 0) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [isOpen, stats.uploaded]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto"
          >
            <div className="p-10 text-center">
              {/* Paytm-Style Animated Checkmark */}
              <div className="relative flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.1 
                  }}
                  className="w-24 h-24 rounded-full border-[3px] border-primary/20 flex items-center justify-center"
                >
                    <motion.svg
                        viewBox="0 0 52 52"
                        className="w-16 h-16 text-primary"
                    >
                        <motion.circle
                            cx="26"
                            cy="26"
                            r="25"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                        <motion.path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 27l7 7 16-16"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                        />
                    </motion.svg>
                </motion.div>
                
                {/* Background pulse effect */}
                <motion.div
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1.5, opacity: 0 }}
                   transition={{ duration: 1, repeat: Infinity, delay: 0.8 }}
                   className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-2"
              >
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                    Upload Successful
                </h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                    {stats.uploaded} Leads synchronization complete
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-10 grid grid-cols-3 gap-4"
              >
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg mb-2">
                    <Check size={14} />
                  </div>
                  <span className="text-xs font-black text-slate-900">{stats.uploaded}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Uploaded</span>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg mb-2">
                    <AlertTriangle size={14} />
                  </div>
                  <span className="text-xs font-black text-slate-900">{stats.skipped}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Skipped</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg mb-2">
                    <X size={14} />
                  </div>
                  <span className="text-xs font-black text-slate-900">{stats.failed}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Failed</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-10 space-y-3"
              >
                <Button 
                    onClick={onClose}
                    className="w-full h-14 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl transition-all gap-2 group"
                >
                    Go to Leads Matrix
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>

                {stats.failed > 0 && onDownloadFailed && (
                   <Button 
                      variant="ghost"
                      onClick={onDownloadFailed}
                      className="w-full h-12 text-slate-400 font-bold uppercase tracking-widest text-[9px] hover:bg-slate-50 rounded-xl gap-2"
                   >
                       <Download size={14} /> Download Failed Records
                   </Button>
                )}
              </motion.div>
            </div>
            
            <div className="h-2 w-full bg-slate-50 relative overflow-hidden">
                <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="absolute inset-0 bg-primary"
                    onAnimationComplete={onClose}
                />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
