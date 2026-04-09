'use client';

import { motion } from "framer-motion";
import { Building2, GraduationCap, Hospital, Factory, Cpu, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CorporatePageLayout } from "@/components/layout/corporate-page-layout";

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
    <CorporatePageLayout 
      title="Sector Expertise" 
      subtitle="Specialized infrastructure frameworks tailored for mission-critical industry requirements."
    >
      <div className="container-enterprise pb-40">
        <div className="space-y-64">
          {industries.map((industry, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className={cn(
                "flex flex-col lg:flex-row gap-32 items-center",
                i % 2 !== 0 && "lg:flex-row-reverse"
              )}
            >
              <div className="flex-1 space-y-12 text-center lg:text-left">
                <div className="space-y-6">
                  <div className="h-20 w-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-primary mb-10 mx-auto lg:ml-0 shadow-sm">
                    <industry.icon size={36} />
                  </div>
                  <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-slate-900">{industry.title}</h2>
                </div>
                
                <p className="text-3xl text-slate-400 leading-relaxed font-bold italic max-w-2xl">
                  {industry.useCase}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                  {industry.benefits.map((benefit, j) => (
                    <div key={j} className="flex items-center gap-6 px-10 py-6 bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:border-primary/30 hover:translate-x-2 transition-all duration-500 group">
                      <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                      <span className="text-[12px] font-black uppercase tracking-widest text-slate-900">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 w-full h-[650px] relative rounded-[4rem] overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]">
                <Image 
                  src={industry.image} 
                  alt={industry.title} 
                  fill 
                  className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-[1.5s]" />
                <div className="absolute inset-0 border-[20px] border-white/5 group-hover:border-primary/5 transition-colors duration-1000 rounded-[4rem]" />
                <div className="absolute inset-0 p-1 pointer-events-none">
                   <div className="w-full h-full rounded-[3.8rem] border border-white/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CorporatePageLayout>
  );
}