
"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Globe, 
  Activity,
  Layers,
  Building2,
  Terminal,
  Cpu
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Capability {
  title: string;
  description: string;
  icon: any;
}

interface UseCase {
  sector: string;
  description: string;
}

interface ServiceDetailProps {
  title: string;
  tagline: string;
  heroImage: string;
  overview: string;
  capabilities: Capability[];
  useCases: UseCase[];
  benefits: string[];
}

export function ServiceDetailView({
  title,
  tagline,
  heroImage,
  overview,
  capabilities,
  useCases,
  benefits
}: ServiceDetailProps) {
  return (
    <div className="flex flex-col min-h-screen bg-black font-body selection:bg-primary/30">
      <Header />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <Image 
              src={heroImage} 
              alt={title} 
              fill 
              className="object-cover opacity-40 grayscale"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="fixed inset-0 command-grid pointer-events-none opacity-10" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Enterprise Capability</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none mb-6">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-medium italic mb-10">
                "{tagline}"
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="h-14 px-8 bg-primary text-black font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,224,255,0.4)]">
                  Get Consultation
                </Button>
                <Button variant="outline" className="h-14 px-8 border-white/10 bg-white/5 text-white font-bold uppercase tracking-widest hover:bg-white/10">
                  <Download className="mr-2 h-4 w-4" /> Download Brochure
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* OVERVIEW SECTION */}
        <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6">Executive Overview</h2>
                <h3 className="text-4xl font-bold text-white mb-8 tracking-tight uppercase">Scaling your mission-critical infrastructure</h3>
                <div className="space-y-6 text-white/60 leading-relaxed text-lg font-medium">
                  <p>{overview}</p>
                  <p>In the era of rapid digital evolution, our {title.toLowerCase()} framework provides the stability and performance required to maintain operational edge. We integrate OEM-certified solutions with bespoke strategic architecture.</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-[400px] rounded-3xl overflow-hidden border border-white/10 holographic-edge"
              >
                <Image 
                  src={heroImage} 
                  alt="Architecture" 
                  fill 
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px]" />
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="text-primary h-4 w-4" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">System Visualization</span>
                  </div>
                  <p className="text-white font-bold uppercase tracking-tighter">Enterprise Grid Alpha-01</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* KEY CAPABILITIES */}
        <section className="py-24 bg-[#050505]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Core Competencies</h2>
              <h3 className="text-4xl font-bold text-white uppercase tracking-tighter">Technical Capabilities</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-black border-white/5 hover:border-primary/30 transition-all group overflow-hidden h-full">
                      <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                          <Icon size={24} />
                        </div>
                        <CardTitle className="text-white text-xl uppercase tracking-tight">{cap.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/40 text-sm leading-relaxed">{cap.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* USE CASES / INDUSTRIES */}
        <section className="py-24 bg-black border-t border-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 uppercase tracking-tighter text-center">Sector Deployment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((uc, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <Building2 size={32} className="text-primary/40 mb-6" />
                  <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">{uc.sector}</h4>
                  <p className="text-white/40 text-sm italic leading-relaxed">"{uc.description}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-24 bg-primary overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full command-grid opacity-10 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-1">
                <h2 className="text-black font-black text-5xl uppercase tracking-tighter leading-none mb-6">Business Value Impact</h2>
                <p className="text-black/70 font-bold uppercase tracking-widest text-xs">Unlocking operational excellence through technical precision.</p>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-black rounded-xl flex items-center justify-between"
                  >
                    <span className="text-white font-black uppercase tracking-widest text-sm">{benefit}</span>
                    <CheckCircle2 className="text-primary h-5 w-5" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TRUST & PARTNER */}
        <section className="py-24 bg-black border-b border-white/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12">Authorized Enterprise Ecosystem</h2>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
              <span className="text-2xl font-black text-white">HP ENTERPRISE</span>
              <span className="text-2xl font-black text-white">CISCO</span>
              <span className="text-2xl font-black text-white">DELL TECH</span>
              <span className="text-2xl font-black text-white">MICROSOFT</span>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 bg-[#050505] relative overflow-hidden">
          <div className="scanline" />
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-12">
                Ready to initiate <br /> <span className="text-primary">transformation?</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                <Button asChild className="h-20 px-12 bg-primary text-black font-black uppercase tracking-[0.3em] text-sm hover:shadow-[0_0_40px_rgba(0,224,255,0.3)]">
                  <Link href="/contact">Talk to Solution Architect</Link>
                </Button>
                <Button variant="outline" className="h-20 px-12 border-white/10 bg-white/5 text-white font-black uppercase tracking-[0.3em] text-sm hover:bg-white/10">
                  Request Proposal
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
