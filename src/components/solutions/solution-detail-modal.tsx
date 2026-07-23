'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Zap,
  Server,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export interface SolutionData {
  id: string;
  title: string;
  category: string;
  badgeText: string;
  description: string;
  fullOverview: string;
  icon: any;
  image?: string;
  href: string;
  heroColor: string;
  metrics: { label: string; value: string; sub: string }[];
  capabilities: string[];
  techStack: string[];
  hpEquipment: string[];
  roadmap: { step: string; title: string; desc: string }[];
  targetIndustries: string[];
}

interface SolutionDetailModalProps {
  solution: SolutionData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SolutionDetailModal({ solution, isOpen, onClose }: SolutionDetailModalProps) {
  if (!solution) return null;

  const Icon = solution.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-xl font-[Outfit]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-3xl my-6 bg-slate-900/90 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-100 max-h-[85vh] flex flex-col backdrop-blur-2xl"
          >
            {/* Header / Top Bar */}
            <div className="relative p-6 md:p-8 bg-slate-950/90 border-b border-slate-800 shrink-0">
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 h-10 w-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Optional Generated AI Image Banner */}
              {solution.image && (
                <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-6 border border-slate-800">
                  <img src={solution.image} alt={solution.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="px-3 py-1 rounded-full border-blue-500/40 bg-blue-500/10 text-blue-400 font-mono font-bold text-[10px] uppercase tracking-widest">
                  {solution.category}
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono font-bold text-[10px] uppercase tracking-widest">
                  {solution.badgeText}
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white">
                    {solution.title}
                  </h2>
                  <p className="text-slate-400 text-xs md:text-sm font-normal">
                    {solution.description}
                  </p>
                </div>
              </div>

            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
              
              {/* Architecture Overview */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400 mb-3 flex items-center gap-2 font-bold">
                  <Layers size={14} /> Architectural Blueprint Overview
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/80 p-5 rounded-2xl border border-slate-800 font-normal">
                  {solution.fullOverview}
                </p>
              </div>

              {/* Quantifiable Metrics / ROI */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400 mb-4 flex items-center gap-2 font-bold">
                  <TrendingUp size={14} /> Benchmark Enterprise Impact & ROI
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                  {solution.metrics.map((m, idx) => (
                    <div key={idx} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                      <div className="text-2xl md:text-3xl font-light text-blue-400 tracking-tight mb-1">
                        {m.value}
                      </div>
                      <div className="text-[11px] font-bold text-white uppercase tracking-wider mb-0.5">{m.label}</div>
                      <div className="text-[9px] text-slate-500">{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capabilities & Equipment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-blue-400 font-bold tracking-widest border-b border-slate-800 pb-2">
                    Core Capabilities
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {solution.capabilities.map((cap, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-blue-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-widest border-b border-slate-800 pb-2">
                    HP Equipment Stack
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {solution.hpEquipment.map((eq, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Cpu size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Footer / CTA Bar */}
            <div className="p-5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hidden sm:block">
                DEEQASA ARCHITECTURE MATRIX // READY
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button 
                  onClick={onClose} 
                  variant="outline" 
                  className="h-11 px-5 bg-slate-900 border-slate-800 text-slate-300 rounded-full text-xs font-bold"
                >
                  Close Detail
                </Button>
                <Button 
                  asChild 
                  className="h-11 px-6 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full shadow-lg"
                >
                  <Link href="/quotation" onClick={onClose}>
                    Configure Quotation <ArrowRight size={14} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
