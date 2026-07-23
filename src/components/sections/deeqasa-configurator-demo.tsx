'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Server, Monitor, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const workloadBlueprints = [
  {
    id: 'workplace',
    title: 'Hybrid Workforce Fleet',
    category: 'ENDPOINT & WORKSPACE',
    hardware: ['HP EliteBook 800 G10', 'HP ZBook Firefly', 'HP Poly Studio Video'],
    software: ['Microsoft Intune Cloud', 'HP Wolf Pro Security', 'HP TechPulse Telemetry'],
    outcome: '45% Helpdesk Reduction & 15-min Cloud Enrollment',
    sla: '99.9% Endpoint Availability',
    icon: Monitor
  },
  {
    id: 'ai_compute',
    title: 'Enterprise AI & GPU Compute',
    category: 'HIGH PERFORMANCE COMPUTE',
    hardware: ['HP Z8 Fury G5 Workstations', 'NVIDIA RTX 6000 Ada GPUs', 'HPE Cray Nodes'],
    software: ['PyTorch & CUDA Runtime', 'Genkit AI Orchestrator', 'On-Prem Local LLM RAG'],
    outcome: '3.5x Faster Model Inference & Zero Cloud Data Leakage',
    sla: 'Sub-millisecond Model Latency',
    icon: Cpu
  },
  {
    id: 'datacenter',
    title: 'Hyperconverged Data Center',
    category: 'CORE INFRASTRUCTURE',
    hardware: ['HPE ProLiant DL380 Gen11', 'HPE Alletra Storage', 'Aruba CX 8360 Switches'],
    software: ['VMware vSphere / Nutanix', 'HPE InfoSight Predictive AI', 'Veeam Backup'],
    outcome: '70% Rack Footprint Cut & 50% Energy Reduction',
    sla: '99.999% SLA Uptime',
    icon: Server
  },
  {
    id: 'security',
    title: 'Zero-Trust Cyber Defense',
    category: 'ENTERPRISE SECURITY',
    hardware: ['HP Wolf Hardware Security Shield', 'Aruba ClearPass Appliance'],
    software: ['CrowdStrike Falcon SIEM', 'Hardware BIOS Isolation', 'NIST Micro-segmentation'],
    outcome: 'Zero Ransomware Loss SLA & < 60s Threat Isolation',
    sla: '100% Audit Compliance',
    icon: ShieldCheck
  }
];

export function DeeqasaConfiguratorDemo() {
  const [selectedId, setSelectedId] = useState('workplace');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [activeBlueprint, setActiveBlueprint] = useState(workloadBlueprints[0]);

  const handleSelectWorkload = (bp: typeof workloadBlueprints[0]) => {
    setSelectedId(bp.id);
    setIsConfiguring(true);
    setTimeout(() => {
      setActiveBlueprint(bp);
      setIsConfiguring(false);
    }, 300);
  };

  const IconComp = activeBlueprint.icon;

  return (
    <section id="configurator-demo" className="py-24 px-6 bg-[#030716] text-white relative overflow-hidden font-[Outfit]">
      
      {/* Lucien Signature Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-70"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 75%)'
        }}
      />

      <div className="container-enterprise relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block flex items-center justify-center gap-2">
            <Terminal size={14} /> DEEQASA ENGINE SIMULATOR
          </span>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-white">
            Interactive Hardware & Software Configurator
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-normal">
            Select your target enterprise workload below to generate an optimized DEEQASA hardware + software blueprint in real time.
          </p>
        </div>

        {/* Workload Configurator Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Select Workload */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800/90 rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-blue-400 flex items-center gap-2 font-bold">
                <Cpu size={16} /> 1. Select Enterprise Workload
              </h3>
              <span className="text-[10px] font-mono text-slate-500">DEEQASA v4.0</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {workloadBlueprints.map((bp) => {
                const BpIcon = bp.icon;
                const isSelected = selectedId === bp.id;
                return (
                  <button
                    key={bp.id}
                    onClick={() => handleSelectWorkload(bp)}
                    className={`p-6 rounded-3xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-500/20 border-blue-400 text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] scale-[1.01]"
                        : "bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-blue-500 text-white" : "bg-slate-900 text-blue-400 border border-slate-800"
                      }`}>
                        <BpIcon size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-blue-400 tracking-widest block mb-1">
                          {bp.category}
                        </span>
                        <span className="text-lg font-light tracking-tight text-white block">
                          {bp.title}
                        </span>
                      </div>
                    </div>

                    <div className={`h-3 w-3 rounded-full border transition-all ${
                      isSelected ? "bg-blue-400 border-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.8)]" : "border-slate-700"
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Real-Time Generated Blueprint Output */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800/90 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative min-h-[500px]">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2 font-bold">
                <Zap size={16} /> 2. Generated DEEQASA Blueprint
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                SLA READY
              </span>
            </div>

            {isConfiguring ? (
              <div className="py-24 text-center space-y-4">
                <div className="h-10 w-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <span className="text-xs font-mono text-blue-400 uppercase tracking-widest block">
                  Computing Hardware & Software Matrix...
                </span>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Blueprint Title Header */}
                <div className="flex items-start gap-4 bg-slate-950/80 p-6 rounded-3xl border border-slate-800">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-light tracking-tight text-white mb-1">
                      {activeBlueprint.title}
                    </h4>
                    <span className="text-xs font-mono text-blue-400 font-bold">
                      BENCHMARK: {activeBlueprint.sla}
                    </span>
                  </div>
                </div>

                {/* Hardware & Software Stack Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono">
                  
                  {/* Hardware Stack */}
                  <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] uppercase text-blue-400 font-bold tracking-widest block border-b border-slate-800 pb-2">
                      PROVISIONED HARDWARE
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {activeBlueprint.hardware.map((hw, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-blue-400 font-bold">•</span>
                          <span>{hw}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Software Stack */}
                  <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] uppercase text-emerald-400 font-bold tracking-widest block border-b border-slate-800 pb-2">
                      INTEGRATED SOFTWARE
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {activeBlueprint.software.map((sw, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{sw}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Target Business Outcome */}
                <div className="bg-blue-500/10 border border-blue-500/30 p-5 rounded-2xl text-blue-300 text-xs font-mono flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 block tracking-widest">ESTIMATED ENTERPRISE IMPACT</span>
                    <span className="font-bold text-white text-xs">{activeBlueprint.outcome}</span>
                  </div>
                </div>

                {/* Call to Action Button */}
                <div className="pt-2">
                  <Button 
                    asChild 
                    className="w-full h-14 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full shadow-xl transition-transform hover:scale-[1.01]"
                  >
                    <Link href="/quotation">
                      Generate Quotation for this Blueprint <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>

              </motion.div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
