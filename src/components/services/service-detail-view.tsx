
"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Download, 
  CheckCircle2, 
  Building2, 
  Terminal,
  ChevronRight,
  ShieldCheck,
  Globe,
  Zap,
  Activity
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
  overviewImage: string;
  archImage: string;
  capabilities: Capability[];
  useCases: UseCase[];
  benefits: string[];
}

export function ServiceDetailView({
  title,
  tagline,
  heroImage,
  overview,
  overviewImage,
  archImage,
  capabilities,
  useCases,
  benefits
}: ServiceDetailProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body selection:bg-primary/30">
      <Header />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <Image 
              src={heroImage} 
              alt={title} 
              fill 
              className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
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
                <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Enterprise Capability Matrix</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground uppercase leading-none mb-6">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium italic mb-10">
                "{tagline}"
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="h-14 px-10 bg-primary text-primary-foreground font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,224,255,0.4)] transition-all">
                  <Link href="/contact">Get Consultation</Link>
                </Button>
                <Button variant="outline" className="h-14 px-10 border-white/10 bg-white/5 text-foreground font-bold uppercase tracking-widest hover:bg-white/10">
                  <Download className="mr-2 h-4 w-4" /> Download Brief
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="scanline" />
        </section>

        {/* OVERVIEW SECTION */}
        <section className="py-24 bg-background border-y border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6 flex items-center gap-3">
                  <div className="h-px w-8 bg-primary/30" /> Executive Summary
                </h2>
                <h3 className="text-4xl font-bold text-foreground mb-8 tracking-tight uppercase">Scaling Mission-Critical Architecture</h3>
                <div className="space-y-6 text-muted-foreground leading-relaxed text-lg font-medium">
                  <p>{overview}</p>
                  <p>Our framework provides the stability and performance required to maintain operational edge. We integrate OEM-certified solutions with bespoke strategic architecture to ensure 99.99% infrastructure availability.</p>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-3xl font-black text-foreground mb-1">99.9%</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Uptime Reliability</p>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-primary mb-1">24/7</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Expert Monitoring</p>
                    </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 holographic-edge shadow-2xl"
              >
                <Image 
                  src={overviewImage} 
                  alt="Enterprise Architecture" 
                  fill 
                  className="object-cover opacity-80 transition-transform duration-1000 hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px]" />
                <div className="absolute bottom-0 left-0 p-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="text-primary h-4 w-4" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Node Visualization</span>
                  </div>
                  <p className="text-white font-bold uppercase tracking-widest text-sm">Enterprise Grid Alpha-01</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* KEY CAPABILITIES */}
        <section className="py-32 bg-card/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 mb-4">Core Competencies</h2>
              <h3 className="text-5xl font-black text-foreground uppercase tracking-tighter">Technical Capabilities</h3>
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
                    <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/30 transition-all group overflow-hidden h-full relative">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icon size={80} />
                      </div>
                      <CardHeader className="relative z-10">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon size={24} />
                        </div>
                        <CardTitle className="text-foreground text-xl font-bold uppercase tracking-tight mb-2">{cap.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{cap.description}</p>
                        <div className="flex items-center text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          View Technical Specs <ChevronRight size={12} className="ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ARCHITECTURE VISUAL SECTION */}
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4">Architecture</h2>
                    <h3 className="text-4xl font-bold text-foreground uppercase tracking-tighter">Solution Topology</h3>
                </div>
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative h-[600px] w-full rounded-[40px] overflow-hidden border border-white/5 bg-white/5 backdrop-blur-3xl"
                >
                    <Image src={archImage} alt="Network Architecture" fill className="object-cover opacity-40 mix-blend-screen" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                        <div className="max-w-2xl space-y-6">
                            <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center mx-auto mb-8 bg-primary/5">
                                <Activity className="text-primary animate-pulse" size={32} />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase tracking-widest">Engineered for Scalability</h4>
                            <p className="text-white/60 text-lg italic">"Our architecture utilizes multi-tier redundancy and software-defined optimization to ensure that your infrastructure grows seamlessly with your enterprise demands."</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* REAL ENVIRONMENT STRIP */}
        <section className="h-[400px] relative overflow-hidden">
            <Image 
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80" 
                alt="Engineering Environment" 
                fill 
                className="object-cover grayscale"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter opacity-80">PROVEN IN DEPLOYMENT</h2>
                </div>
            </div>
        </section>

        {/* USE CASES */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-black text-foreground mb-16 uppercase tracking-tighter text-center">Sector Deployment Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {useCases.map((uc, i) => (
                <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="p-10 rounded-3xl bg-card/40 border border-white/5 hover:border-primary/20 transition-all duration-500 relative group overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                  <Building2 size={40} className="text-primary/40 mb-8 group-hover:text-primary transition-colors" />
                  <h4 className="text-foreground font-black uppercase tracking-widest text-sm mb-4">{uc.sector}</h4>
                  <p className="text-muted-foreground text-sm italic leading-relaxed">"{uc.description}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-32 bg-primary overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full command-grid opacity-10 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
              <div className="lg:col-span-1">
                <h2 className="text-primary-foreground font-black text-6xl uppercase tracking-tighter leading-none mb-8">Business Impact</h2>
                <p className="text-primary-foreground/70 font-bold uppercase tracking-[0.2em] text-xs">Unlocking operational excellence through technical precision.</p>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="p-8 bg-background rounded-2xl flex items-center justify-between border border-white/10 hover:border-white/30 transition-colors"
                  >
                    <span className="text-foreground font-black uppercase tracking-widest text-sm">{benefit}</span>
                    <CheckCircle2 className="text-primary h-6 w-6" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TRUST & PARTNER */}
        <section className="py-24 bg-background border-b border-white/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 mb-16">Authorized Enterprise Ecosystem</h2>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
              <span className="text-3xl font-black text-foreground tracking-tighter">HP ENTERPRISE</span>
              <div className="h-8 w-px bg-white/10 hidden md:block" />
              <span className="text-3xl font-black text-foreground tracking-tighter">CISCO SOLUTIONS</span>
              <div className="h-8 w-px bg-white/10 hidden md:block" />
              <span className="text-3xl font-black text-foreground tracking-tighter">DELL TECHNOLOGIES</span>
              <div className="h-8 w-px bg-white/10 hidden md:block" />
              <span className="text-3xl font-black text-foreground tracking-tighter">MICROSOFT AZURE</span>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-40 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,224,255,0.05)_0%,transparent_70%)]" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-6xl md:text-8xl font-black text-foreground uppercase tracking-tighter leading-none mb-12">
                Initiate <br /> <span className="text-primary">Transformation</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                <Button asChild className="h-20 px-16 bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-sm hover:shadow-[0_0_50px_rgba(0,224,255,0.4)] transition-all">
                  <Link href="/contact">Talk to Solution Architect</Link>
                </Button>
                <Button variant="outline" className="h-20 px-16 border-white/10 bg-white/5 text-foreground font-black uppercase tracking-[0.3em] text-sm hover:bg-white/10">
                  Request Custom Proposal
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="scanline" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
