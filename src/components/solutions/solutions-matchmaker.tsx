'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Cloud, 
  Monitor, 
  Bot, 
  Leaf, 
  Server,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const stepsData = [
  {
    step: 1,
    title: "Primary Enterprise Objective",
    subtitle: "What is your main IT infrastructure priority for 2026?",
    options: [
      { id: "workplace", label: "Empower Remote & Hybrid Workforce", icon: Monitor, tag: "Modern Workplace" },
      { id: "cloud", label: "Cloud Migration & Infrastructure Scale", icon: Cloud, tag: "Cloud Infrastructure" },
      { id: "security", label: "Zero Trust Cybersecurity & Defense", icon: ShieldCheck, tag: "Cybersecurity" },
      { id: "ai", label: "Deploy On-Prem / Hybrid AI Workloads", icon: Bot, tag: "AI & Automation" },
      { id: "datacenter", label: "Data Center Modernization & Storage", icon: Server, tag: "Data Center" },
      { id: "sustainability", label: "Sustainable IT & Carbon Reduction", icon: Leaf, tag: "Sustainable IT" }
    ]
  },
  {
    step: 2,
    title: "Organization & Fleet Scope",
    subtitle: "Select the scale of your current or target deployment.",
    options: [
      { id: "smb", label: "Growth / SMB (50 - 200 Users / Endpoints)" },
      { id: "midmarket", label: "Mid-Market Enterprise (200 - 1,000 Users)" },
      { id: "enterprise", label: "Large Enterprise (1,000 - 5,000 Users)" },
      { id: "global", label: "Global Enterprise (5,000+ Endpoints & Multi-Site)" }
    ]
  },
  {
    step: 3,
    title: "Primary Success Metric",
    subtitle: "Which outcome matters most to your leadership team?",
    options: [
      { id: "security_first", label: "Uncompromising Security & Compliance SLA" },
      { id: "cost_savings", label: "OpEx Reduction & Energy Efficiency" },
      { id: "speed", label: "Deployment Speed & High Workload Bandwidth" },
      { id: "reliability", label: "99.999% SLA Uptime & 24/7 Managed Response" }
    ]
  }
];

const recommendationsMap: Record<string, {
  title: string;
  badge: string;
  description: string;
  hpRecommended: string[];
  keyBenefits: string[];
  estRoi: string;
  targetPath: string;
}> = {
  workplace: {
    title: "HP Anyware & Wolf Protected Modern Workplace",
    badge: "HYBRID WORKPLACE BLUEPRINT",
    description: "Ultra-secure, cloud-managed desktop infrastructure powered by HP EliteBook Z-series and HP Wolf Pro Security. Provides seamless remote performance without compromising enterprise perimeter safety.",
    hpRecommended: ["HP EliteBook 800 G10", "HP ZBook Firefly G10", "HP Wolf Security Enterprise", "HP Poly Studio Video Bars"],
    keyBenefits: ["Zero-touch cloud provisioning", "Hardware-enforced malware protection", "45% reduction in IT helpdesk tickets"],
    estRoi: "38% Faster Onboarding & 99.9% Endpoint Uptime",
    targetPath: "/services/managed-services"
  },
  cloud: {
    title: "Multi-Cloud & Hybrid Infrastructure Architecture",
    badge: "HYBRID CLOUD BLUEPRINT",
    description: "High-density compute and software-defined storage integrated with AWS/Azure for resilient, scalable workload orchestration with low latency.",
    hpRecommended: ["HPE ProLiant DL380 Gen11", "HPE GreenLake Cloud Services", "Aruba CX 8360 Switches"],
    keyBenefits: ["Automated elasticity across hybrid nodes", "Single-pane infrastructure monitoring", "Integrated disaster recovery failover"],
    estRoi: "42% Reduction in Cloud Over-provisioning Costs",
    targetPath: "/services/cloud"
  },
  security: {
    title: "Zero-Trust Enterprise Defense Stack",
    badge: "CYBERSECURITY BLUEPRINT",
    description: "End-to-end security architecture covering micro-segmentation, hardware-isolated virtual machines, and 24/7 active threat hunting.",
    hpRecommended: ["HP Wolf Security Enterprise Edition", "Aruba ClearPass Policy Manager", "HPE Z-Central Remote Boost"],
    keyBenefits: ["Self-healing BIOS protection", "Real-time threat containment under 60 seconds", "Full NIST & ISO27001 audit compliance"],
    estRoi: "Zero Ransomware Downtime SLA & 60% Faster Audits",
    targetPath: "/services/cybersecurity"
  },
  ai: {
    title: "Enterprise AI & GenAI Workload Acceleration",
    badge: "AI & HIGH-PERFORMANCE BLUEPRINT",
    description: "Optimized high-density GPU nodes and Z-Workstations configured for local LLM fine-tuning, computer vision, and real-time enterprise AI analytics.",
    hpRecommended: ["HP Z8 Fury G5 Workstations", "HPE Cray AI Supercomputers", "NVIDIA RTX 6000 Ada GPUs"],
    keyBenefits: ["Local data privacy for proprietary models", "Sub-millisecond model inference latency", "Scalable dual & quad GPU configurations"],
    estRoi: "3.5x Faster Model Inference vs Cloud GPUs",
    targetPath: "/services/ai-automation"
  },
  datacenter: {
    title: "High-Density Software-Defined Data Center",
    badge: "DATA CENTER MODERNIZATION",
    description: "Modernize legacy server rooms into compact, high-performance hyperconverged nodes with direct liquid cooling options and maximum storage density.",
    hpRecommended: ["HPE Alletra Storage", "HPE ProLiant RL300 Ampere Servers", "Aruba Fabric Composer"],
    keyBenefits: ["70% reduction in rack footprint", "NVMe-over-Fabrics high-speed throughput", "Predictive AI hardware monitoring"],
    estRoi: "50% Savings in Cooling & Rack Power Costs",
    targetPath: "/services/datacenter"
  },
  sustainability: {
    title: "Circular Eco-IT & Green Data Architecture",
    badge: "SUSTAINABLE IT BLUEPRINT",
    description: "Future-proof enterprise IT with Energy Star certified hardware, asset recovery programs, and carbon offset analytics.",
    hpRecommended: ["HP Carbon Neutral Elite PCs", "HPE Asset Lifecycle Services", "Renewable Energy Server Racks"],
    keyBenefits: ["100% compliant e-waste disposition", "Real-time carbon footprint metrics dashboard", "Extended lifecycle asset buyback guaranteed"],
    estRoi: "30% Reduction in Scope 3 IT Emissions",
    targetPath: "/services/sustainable-it"
  }
};

export function SolutionsMatchmaker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedObjective, setSelectedObjective] = useState<string>("workplace");
  const [selectedScope, setSelectedScope] = useState<string>("midmarket");
  const [selectedMetric, setSelectedMetric] = useState<string>("security_first");
  const [isCompleted, setIsCompleted] = useState(false);

  const activeStep = stepsData[currentStep];

  const handleSelectOption = (optionId: string) => {
    if (currentStep === 0) setSelectedObjective(optionId);
    if (currentStep === 1) setSelectedScope(optionId);
    if (currentStep === 2) setSelectedMetric(optionId);

    if (currentStep < stepsData.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const recommendation = recommendationsMap[selectedObjective] || recommendationsMap.workplace;

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden shadow-2xl">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-slate-800/80 pb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-[0.3em] mb-2">
            <Sparkles size={16} /> Interactive Architecture Matchmaker
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            Find Your Solution Blueprint
          </h2>
        </div>

        {!isCompleted && (
          <div className="flex items-center gap-3">
            {stepsData.map((s, idx) => (
              <div
                key={idx}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  idx === currentStep 
                    ? "w-10 bg-primary shadow-[0_0_15px_rgba(26,140,255,0.8)]" 
                    : idx < currentStep 
                    ? "w-4 bg-primary/40" 
                    : "w-4 bg-slate-800"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Step {activeStep.step} of 3
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2">
                  {activeStep.title}
                </h3>
                <p className="text-slate-400 font-medium text-base">
                  {activeStep.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeStep.options.map((opt) => {
                  const IconComp = (opt as any).icon || Zap;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className="p-6 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-primary/60 rounded-3xl text-left transition-all duration-300 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between h-full"
                    >
                      <div className="flex items-center justify-between w-full mb-6">
                        <div className="h-14 w-14 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <IconComp size={26} />
                        </div>
                        <ArrowRight size={18} className="text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                          {opt.label}
                        </h4>
                        {(opt as any).tag && (
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mt-2">
                            {(opt as any).tag}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 space-y-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-xs uppercase tracking-widest inline-block mb-3">
                    {recommendation.badge}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                    {recommendation.title}
                  </h3>
                </div>
                <Button 
                  onClick={handleReset}
                  variant="ghost" 
                  className="h-10 px-4 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  <RotateCcw size={14} className="mr-2" /> Start Over
                </Button>
              </div>

              <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                {recommendation.description}
              </p>

              {/* ROI Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/30">
                  <Zap size={24} />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary block">
                    Estimated ROI & Efficiency Outcome
                  </span>
                  <p className="text-white text-xl font-extrabold">
                    {recommendation.estRoi}
                  </p>
                </div>
              </div>

              {/* Grid Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Key Architecture Differentiators
                  </h4>
                  <ul className="space-y-3">
                    {recommendation.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <Cpu size={16} /> Recommended HP Hardware Suite
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.hpRecommended.map((eq, i) => (
                      <span key={i} className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-4">
                <Button 
                  asChild
                  className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-xl shadow-primary/25 group"
                >
                  <Link href="/quotation">
                    Request Architecture Quote <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
