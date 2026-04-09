"use client";

import { motion } from "framer-motion";

export function WacusBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-slate-50 z-[-1]" />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 command-grid opacity-25 text-primary/5" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[180px] pointer-events-none opacity-40 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[150px] pointer-events-none opacity-30" />
      </div>
    </>
  );
}
