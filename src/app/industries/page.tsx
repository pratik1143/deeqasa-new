'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Building2, GraduationCap, Hospital, Factory, Landmark, Cpu, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const industries = [
  {
    title: "Government & PSU",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    useCase: "Secure sovereign cloud and high-performance computing for regional data centers and smart city infrastructure.",
    benefits: ["Data Sovereignty", "Citizen Service Reliability", "Multi-Tier Security"]
  },
  {
    title: "Higher Education",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523050335392-9bc56753d130?w=800&q=80",
    useCase: "Empowering research institutes with GPU-accelerated labs and centralized virtual desktop infrastructure (VDI).",
    benefits: ["Research Mobility", "Collaborative Ecosystems", "Hardware-as-a-Service"]
  },
  {
    title: "Healthcare",
    icon: Hospital,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    useCase: "Telemedicine backbone and secure health record management systems with 99.99% availability requirements.",
    benefits: ["Patient Data Privacy", "Real-Time Telemetry", "Disaster Recovery"]
  },
  {
    title: "Manufacturing",
    icon: Factory,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    useCase: "IIoT edge computing and predictive maintenance systems for automated assembly lines and supply chains.",
    benefits: ["Operational Efficiency", "Predictive Failure Detection", "Edge Intelligence"]
  },
  {
    title: "Corporate & MNC",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    useCase: "Scalable hybrid workplace environments and enterprise resource planning (ERP) hosting across global regions.",
    benefits: ["Global Scalability", "Unified Governance", "Cloud FinOps"]
  }
];

export default function IndustriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase mb-6">
              Sector <span className="text-primary">Expertise</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Specialized infrastructure frameworks tailored for mission-critical industry requirements.
            </p>
          </motion.div>

          <div className="space-y-32">
            {industries.map((industry, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={cn(
                  "flex flex-col lg:flex-row gap-16 items-center",
                  i % 2 !== 0 && "lg:flex-row-reverse"
                )}
              >
                <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <industry.icon size={32} />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tight">{industry.title}</h2>
                  </div>
                  <p className="text-xl text-muted-foreground leading-relaxed italic">"{industry.useCase}"</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {industry.benefits.map((benefit, j) => (
                      <div key={j} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                        <ArrowRight size={14} className="text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 w-full h-[400px] relative rounded-[40px] overflow-hidden holographic-edge group">
                  <Image 
                    src={industry.image} 
                    alt={industry.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}