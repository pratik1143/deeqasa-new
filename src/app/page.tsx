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

export default function Home() {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#030716] text-white font-[Outfit] selection:bg-blue-500/30 overflow-hidden">
        
        {/* Navigation Bar */}
        <Header />

        {/* Hero Section */}
        <main className="relative z-10 space-y-0">
          <LucienHero />
          
          <ClientLogoMarquee />

          <TextRevealSection />

          <SolutionRevealSection />

          <DeeqasaChipHowItWorks />

          <DeeqasaConfiguratorDemo />

          <HorizontalScrollTrack />
        </main>

        {/* Global Enterprise Footer */}
        <Footer />

      </div>
    </SmoothScrollProvider>
  );
}
