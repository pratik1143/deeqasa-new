"use client";

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Clients } from '@/components/sections/clients';
import { Services } from '@/components/sections/services';
import { Proof } from '@/components/sections/proof';
import { QasaAssistant } from '@/components/qasa/qasa-assistant';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { Preloader } from '@/components/layout/preloader';
import { Printers } from '@/components/sections/printers';
import { 
  ShieldCheck, 
  Settings, 
  Terminal, 
  Activity, 
  Cpu, 
  Globe, 
  Zap, 
  Layout, 
  ArrowRight,
  Award,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeatureSection = () => (
  <section className="py-24 bg-background border-y border-white/5">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-primary/30" />
            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Why DeeQasa</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-8 tracking-tighter uppercase leading-none">
            Infrastructure <br /> <span className="text-primary">Redefined</span>
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg font-medium">
            <p>"We bridge the gap between technical complexity and business outcome. Our framework is built on three core pillars: Security by Design, Operational Scalability, and Environmental Responsibility."</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-3xl font-black text-foreground mb-1">500+</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Deployments</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-3xl font-black text-primary mb-1">24/7</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Expert Support</p>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4 pt-12">
            <div className="h-64 rounded-3xl overflow-hidden relative border border-white/10">
              <Image src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80" alt="Cloud" fill className="object-cover" />
            </div>
            <div className="h-48 rounded-3xl overflow-hidden relative border border-white/10">
              <Image src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" alt="Tech" fill className="object-cover" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-48 rounded-3xl overflow-hidden relative border border-white/10">
              <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" alt="Cyber" fill className="object-cover" />
            </div>
            <div className="h-64 rounded-3xl overflow-hidden relative border border-white/10">
              <Image src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80" alt="NOC" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProcessSection = () => (
  <section className="py-32 bg-card/20 relative overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="text-center mb-20">
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 mb-4">Our Protocol</h2>
        <h3 className="text-5xl font-black text-foreground uppercase tracking-tighter">Deployment Workflow</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { step: "01", title: "Analyze", desc: "Comprehensive audit of existing infrastructure silos and security vulnerabilities.", icon: Terminal },
          { step: "02", title: "Design", desc: "Engineered solution architecture mapped to specific enterprise growth KPIs.", icon: Layout },
          { step: "03", title: "Deploy", desc: "Zero-downtime integration of HP Enterprise and OEM technical stacks.", icon: Activity },
          { step: "04", title: "Scale", desc: "Continuous 24/7 monitoring and predictive maintenance for long-term health.", icon: Globe },
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ y: -10 }} className="p-8 rounded-3xl bg-card/40 border border-white/5 relative group overflow-hidden">
            <span className="text-6xl font-black text-white/5 absolute -top-2 -right-2 transition-colors group-hover:text-primary/10">{item.step}</span>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <item.icon size={24} />
            </div>
            <h4 className="text-xl font-bold uppercase tracking-tight mb-4">{item.title}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onLoaded={handleLoaded} />}
      </AnimatePresence>
      
      <CustomCursor />
      <div className="relative z-10">
        <Header />
        <main className="flex flex-col">
          <Hero />
          <Clients />
          <Services />
          <FeatureSection />
          <Proof />
          <ProcessSection />
          <Printers />
          
          {/* FINAL CTA STRIP */}
          <section className="py-24 bg-primary overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full command-grid opacity-10 pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none mb-4">Ready to <br /> Transform?</h2>
                  <p className="text-black/60 font-bold uppercase tracking-[0.2em] text-xs">Consult with our Lead Solution Architects today.</p>
                </div>
                <div className="flex gap-4">
                  <Button asChild size="lg" className="h-16 px-10 bg-black text-white font-black uppercase tracking-widest hover:bg-black/80 transition-all">
                    <Link href="/contact">Initiate Uplink</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-16 px-10 border-black/20 bg-transparent text-black font-black uppercase tracking-widest hover:bg-black/5 transition-all">
                    <Link href="/solutions">Explore Solutions</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
      <QasaAssistant />
    </>
  );
}