'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Award, 
  Server, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Users,
  MapPin,
  Sparkles,
  Target,
  Eye,
  Handshake,
  Wrench,
  Globe,
  Bot
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";

const whyChooseUsPoints = [
  "Authorized HP Connect Partner",
  "Complete End-to-End IT Infrastructure Solutions",
  "Enterprise Hardware & Commercial Computing",
  "Custom Software & Web Application Development",
  "AI-Powered Business Automation Solutions",
  "Cloud, Networking & Cybersecurity Expertise",
  "CCTV, Access Control & Surveillance Systems",
  "Annual Maintenance Contracts (AMC)",
  "Professional Deployment & Technical Support",
  "Solutions for Healthcare, Education, Government, Retail & Corporate",
  "Genuine Products with Trusted Service",
  "Customer-First Approach with Long-Term Partnership"
];

const portfolioHighlights = [
  { title: "Enterprise Computing", desc: "Desktops, laptops, workstations & HPE servers", icon: Server },
  { title: "Cloud & Cyber Security", desc: "M365, Google Workspace, HP Wolf & Firewalls", icon: ShieldCheck },
  { title: "Software & AI Solutions", desc: "ERP, CRM, Hospital Software & AI Automation", icon: Bot },
  { title: "Surveillance & Physical Security", desc: "CCTV, Biometric Attendance & Access Control", icon: Building2 },
  { title: "Managed Services & AMC", desc: "24/7 SLA Support, On-Site Engineers & Updates", icon: Wrench },
  { title: "Web & Digital Portals", desc: "Corporate Sites, E-Commerce & Customer Portals", icon: Globe }
];

export default function AboutPage() {
  const [scrambleTitle, setScrambleTitle] = useState("");
  const targetHeading = "About Deeqasa Tech – Authorized HP Connect Partner";

  useEffect(() => {
    let iteration = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const interval = setInterval(() => {
      setScrambleTitle(
        targetHeading
          .split('')
          .map((char, idx) => (idx < iteration ? targetHeading[idx] : chars[Math.floor(Math.random() * chars.length)]))
          .join('')
      );
      if (iteration >= targetHeading.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <div className="relative min-h-screen bg-[#030716] text-white font-[Outfit] selection:bg-blue-500/30 overflow-hidden">
        <Header />

        {/* Lucien Signature Next-Level Animated Blue Radial Aura Mesh */}
        <motion.div 
          animate={{ opacity: [0.7, 0.95, 0.7], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 55% at 50% 30%, rgba(147, 197, 253, 0.4) 0%, rgba(59, 130, 246, 0.22) 40%, rgba(3, 7, 22, 0.95) 75%),
              radial-gradient(ellipse 100% 70% at 50% 80%, rgba(30, 64, 175, 0.25) 0%, transparent 70%)
            `
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

        <main className="relative z-10 pt-36 pb-24 space-y-24">
          
          {/* Hero Section */}
          <section className="container-enterprise relative px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
              <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">
                ABOUT DEEQASA TECH —
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.05] text-white select-none">
                {scrambleTitle || targetHeading}
              </h1>
              <p className="text-slate-300 text-lg md:text-xl font-normal leading-relaxed max-w-3xl mx-auto">
                Deeqasa Tech is a trusted IT solutions provider committed to helping businesses embrace digital transformation through innovative technology, enterprise infrastructure, and intelligent software solutions.
              </p>
            </div>
          </section>

          {/* Core Introduction & Authorized HP Partner Card */}
          <section className="container-enterprise px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/90 p-8 md:p-12 rounded-[2.5rem] space-y-6 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Award size={24} className="text-blue-400" />
                    <span className="text-xs font-mono uppercase text-blue-400 tracking-widest font-bold">
                      AUTHORIZED HP CONNECT PARTNER
                    </span>
                  </div>
                  <h2 className="text-3xl font-light tracking-tight text-white">
                    End-to-End Technology Ecosystems
                  </h2>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    We are proud to be an Authorized HP Connect Partner, offering genuine HP products along with expert consultation, deployment, and after-sales support. Our experience spans corporate offices, educational institutions, healthcare organizations, government departments, retail businesses, manufacturing units, and startups.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    At Deeqasa Tech, we believe technology should simplify business, improve productivity, and accelerate growth. That's why we don't just sell products—we design complete technology ecosystems tailored to each client's unique requirements.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                  <span className="text-blue-400 font-bold">✓ Genuine Products</span>
                  <span className="text-blue-400 font-bold">✓ Direct HP SLA</span>
                  <span className="text-blue-400 font-bold">✓ PAN India Support</span>
                </div>
              </div>

              {/* Showroom Location Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-8 md:p-10 rounded-[2.5rem] space-y-6 shadow-2xl backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <MapPin size={24} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 block">
                    OUR CORPORATE SHOWROOM
                  </span>
                  <h3 className="text-2xl font-light tracking-tight text-white">
                    Deeqasa Tech – HP Connect
                  </h3>
                  <p className="text-slate-300 text-sm font-mono leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    1st Floor, SCO 105 & 106, Sector 70, Sahibzada Ajit Singh Nagar (Mohali), Punjab – 160071
                  </p>
                </div>

                <Button 
                  asChild 
                  className="w-full h-12 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full shadow-lg"
                >
                  <Link href="/contact">
                    Visit Showroom & Map <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>

            </div>
          </section>

          {/* Portfolio Highlights */}
          <section className="container-enterprise px-6 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">
                OUR SOLUTION PORTFOLIO —
              </span>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white">
                Comprehensive Technology Ecosystem
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-slate-900/80 border border-slate-800 p-8 rounded-[2.5rem] space-y-4 hover:border-blue-500/50 transition-colors backdrop-blur-xl group">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-light tracking-tight text-white">{item.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed font-normal">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Why Businesses Choose Deeqasa Tech */}
          <section className="container-enterprise px-6 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">
                THE DEEQASA ADVANTAGE —
              </span>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white">
                Why Businesses Choose Deeqasa Tech
              </h2>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {whyChooseUsPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-slate-300 leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission & Vision Section */}
          <section className="container-enterprise px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-slate-900/80 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] space-y-6 backdrop-blur-2xl relative overflow-hidden">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Target size={24} />
              </div>
              <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">OUR MISSION</span>
              <h3 className="text-2xl font-light text-white tracking-tight">Empowering Digital Operational Growth</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                To empower organizations with reliable, innovative, and scalable technology solutions that improve operational efficiency, strengthen security, and accelerate digital transformation.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] space-y-6 backdrop-blur-2xl relative overflow-hidden">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Eye size={24} />
              </div>
              <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">OUR VISION</span>
              <h3 className="text-2xl font-light text-white tracking-tight">India's Most Trusted Tech Partner</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                To become one of India's most trusted technology partners by delivering exceptional products, innovative software solutions, and world-class customer service that enable businesses to grow with confidence.
              </p>
            </div>

          </section>

          {/* Closing Partnership Banner */}
          <section className="container-enterprise px-6">
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-[2.5rem] p-10 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                <div className="h-14 w-14 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center mx-auto">
                  <Handshake size={28} />
                </div>
                <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
                  Long-Term Partnerships That Help Businesses Scale
                </h2>
                <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal">
                  At Deeqasa Tech, we don't simply provide technology—we build long-term partnerships that help businesses innovate, scale, and succeed in an ever-changing digital world.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    asChild 
                    className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full shadow-xl"
                  >
                    <Link href="/quotation">
                      Configure IT Proposal <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
