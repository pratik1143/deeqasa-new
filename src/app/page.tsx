'use client';

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowRight, 
  Terminal, 
  Lock, 
  Zap, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  XCircle,
  Server,
  Monitor
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LucienHero } from "@/components/sections/lucien-hero";
import { DeeqasaConfiguratorDemo } from "@/components/sections/deeqasa-configurator-demo";
import { DeeqasaChipHowItWorks } from "@/components/sections/deeqasa-chip-how-it-works";
import { HorizontalScrollTrack } from "@/components/sections/horizontal-scroll-track";
import { TextRevealSection } from "@/components/sections/text-reveal-section";
import { SolutionRevealSection } from "@/components/sections/solution-reveal-section";
import { ClientLogoMarquee } from "@/components/sections/client-logo-marquee";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";

const clientSectors = [
  "BFSI & Banking",
  "Healthcare & Pharma",
  "Public Sector & Defense",
  "High-Tech & Engineering",
  "Global Enterprise Fleet",
  "Media & Entertainment"
];

const solutionBenefits = [
  {
    title: "Enterprise HP Hardware Suite",
    desc: "Deploy HP EliteBooks, Z-Workstations, HPE ProLiant Gen11 servers, and HPE Alletra flash storage engineered for zero downtime.",
    icon: Monitor
  },
  {
    title: "Unified Software & Security Engine",
    desc: "Combine HP Wolf Security, Microsoft Intune, AI process automation, and micro-segmentation into a single managed operating stack.",
    icon: Cpu
  },
  {
    title: "24/7 Managed IT & Circular Refresh",
    desc: "Enjoy zero-touch cloud device enrollment, predictive hardware failure telemetry, and guaranteed circular lifecycle e-waste buyback.",
    icon: ShieldCheck
  }
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Persona & Workload Sizing",
    desc: "We analyze your exact enterprise workloads, latency needs, and security compliance to architect the perfect HP hardware + software blueprint."
  },
  {
    step: "02",
    title: "Zero-Touch Cloud Dispatch",
    desc: "Devices and server racks are pre-configured in cloud telemetry and shipped directly to global sites for out-of-box 15-minute setup."
  },
  {
    step: "03",
    title: "24/7 Managed Telemetry & Lifecycle",
    desc: "Continuous predictive hardware diagnostics, automated security patching, and circular e-waste refresh keep your fleet at peak performance."
  }
];

const transformationRows = [
  {
    feature: "Hardware Reliability & Fleet Uptime",
    traditional: "Fragmented multi-vendor hardware with frequent failures",
    deeqasa: "Integrated HP Elite & HPE ProLiant suite with 99.999% SLA Uptime"
  },
  {
    feature: "Endpoint Provisioning Speed",
    traditional: "Days or weeks of manual OS imaging & physical setup",
    deeqasa: "Under 15-minute zero-touch cloud enrollment via Intune"
  },
  {
    feature: "Cybersecurity Protection Level",
    traditional: "Basic software anti-virus prone to zero-day breaches",
    deeqasa: "Hardware-enforced HP Wolf Zero-Trust isolation with self-healing BIOS"
  },
  {
    feature: "Energy Efficiency & Carbon Tracking",
    traditional: "High power consumption with zero Scope 3 visibility",
    deeqasa: "Direct liquid cooling options & certified carbon neutral PC fleets"
  }
];

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      
      <div className="relative min-h-screen bg-slate-950 text-white font-[Outfit] selection:bg-blue-500/30">
        
        {/* Navigation Header */}
        <Header />

        {/* Main Content */}
        <main className="relative z-10 space-y-24">
          
          {/* 1. Lucien Hero Section */}
          <LucienHero />

          {/* 2. Official 26 Valued Clients Logo Marquee */}
          <ClientLogoMarquee />

          {/* 3. Scroll-Driven Word Reveal Mission Section */}
          <TextRevealSection />

          {/* 4. Horizontal Scroll Track (Problem Stack) */}
          <HorizontalScrollTrack />

          {/* 5. Scroll-Driven Solution Reveal Section */}
          <SolutionRevealSection />

          {/* 6. Interactive Workload Configurator Simulator */}
          <DeeqasaConfiguratorDemo />

          {/* 7. 3D Metallic Chip How It Works Section */}
          <DeeqasaChipHowItWorks />

          {/* 8. Transformation Comparison Table */}
          <section className="py-20 px-6 container-enterprise space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 block">
                BENCHMARK ADVANTAGE
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                Traditional IT vs DEEQASA Integrated Architecture
              </h2>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-xs font-black uppercase tracking-widest text-slate-400">
                      <th className="p-6 md:p-8">Feature Dimension</th>
                      <th className="p-6 md:p-8 text-slate-500">Traditional Unmanaged IT</th>
                      <th className="p-6 md:p-8 text-blue-400 bg-blue-500/10">DEEQASA Integrated Solution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {transformationRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-6 md:p-8 font-bold text-white uppercase text-xs tracking-wider">
                          {row.feature}
                        </td>
                        <td className="p-6 md:p-8 text-slate-400 font-medium">
                          <div className="flex items-start gap-3">
                            <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                            <span>{row.traditional}</span>
                          </div>
                        </td>
                        <td className="p-6 md:p-8 font-semibold text-white bg-blue-500/5 border-l border-blue-500/20">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
                            <span>{row.deeqasa}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 9. Build Quotation CTA Banner */}
          <section className="py-20 px-6 container-enterprise">
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-[2.5rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-[140px] pointer-events-none" />
              
              <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 block">
                  READY TO TRANSFORM YOUR ENTERPRISE IT?
                </span>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                  Build Your Enterprise Hardware & Software Quotation
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed font-medium">
                  Configure your exact hardware, software licenses, and SLA parameters with custom HP partner pricing.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    asChild 
                    className="w-full sm:w-auto h-16 px-10 bg-white hover:bg-slate-100 text-slate-950 font-black uppercase tracking-widest text-xs rounded-full shadow-xl transition-transform hover:scale-105 group"
                  >
                    <Link href="/quotation">
                      Configure Quotation Now <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <Footer />

      </div>
    </SmoothScrollProvider>
  );
}
