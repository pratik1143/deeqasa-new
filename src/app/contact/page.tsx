'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [scrambleTitle, setScrambleTitle] = useState("");
  const targetHeading = "Connect with DEEQASA Senior Solutions Architect";

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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    workload: 'Hybrid Workplace Fleet',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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

        {/* High-Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

        <main className="relative z-10 pt-36 pb-24 space-y-16">
          
          {/* Header */}
          <section className="container-enterprise text-center px-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">
              BOOK A STRATEGY DEMO —
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-tight select-none">
              {scrambleTitle || targetHeading}
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto font-normal">
              Schedule a personalized demo of our enterprise hardware fleets, HPE server nodes, and Zero-Trust security stack.
            </p>
          </section>

          {/* Form & Info Section */}
          <section className="container-enterprise px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Info */}
              <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/90 p-8 sm:p-10 rounded-[2.5rem] space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase text-blue-400 tracking-widest block mb-2">
                    DEEQASA HEADQUARTERS
                  </span>
                  <h3 className="text-2xl font-light tracking-tight text-white">
                    Enterprise IT Command Center
                  </h3>
                </div>

                <div className="space-y-6 text-sm text-slate-300">
                  
                  {/* Official Address */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block font-mono">Corporate Address</span>
                      <p className="font-bold text-white leading-relaxed">
                        1st Floor, SCO 105 & 106, Sector 70, Sahibzada Ajit Singh Nagar, Punjab 160071
                      </p>
                    </div>
                  </div>

                  {/* Primary Email */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block font-mono">Primary Sales Email</span>
                      <a href="mailto:sales@deeqasa.com" className="font-bold text-white font-mono hover:text-blue-400 transition-colors">
                        sales@deeqasa.com
                      </a>
                    </div>
                  </div>

                  {/* Secondary Email */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block font-mono">Official Partner Desk</span>
                      <a href="mailto:pratikofficial@deeqasa.com" className="font-bold text-white font-mono hover:text-blue-400 transition-colors">
                        pratikofficial@deeqasa.com
                      </a>
                    </div>
                  </div>

                  {/* Direct Support Phone */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block font-mono">Direct Support Line</span>
                      <a href="tel:+918595270950" className="font-bold text-white font-mono hover:text-blue-400 transition-colors">
                        +91 8595270950
                      </a>
                    </div>
                  </div>

                  {/* HP Partner Status */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block font-mono">HP Partnership Tier</span>
                      <span className="font-bold text-white">Authorized HP Gold Partner</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Form */}
              <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/90 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                {submitted ? (
                  <div className="py-16 text-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-3xl font-light tracking-tight text-white">
                      Demo Request Submitted
                    </h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto">
                      Thank you! A DEEQASA Senior Enterprise Architect will reach out within 2 business hours with custom HP partner pricing and demo details.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      className="bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full px-8 h-12"
                    >
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Full Name</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Jane Doe"
                          className="bg-slate-950/80 border-slate-800 h-12 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Work Email</label>
                        <Input
                          required
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jane@company.com"
                          className="bg-slate-950/80 border-slate-800 h-12 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Company Name</label>
                        <Input
                          required
                          value={formData.company}
                          onChange={e => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Acme Enterprise"
                          className="bg-slate-950/80 border-slate-800 h-12 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Target Workload</label>
                        <select
                          value={formData.workload}
                          onChange={e => setFormData({ ...formData, workload: e.target.value })}
                          className="w-full bg-slate-950/80 border border-slate-800 h-12 text-xs font-medium text-white rounded-2xl px-4 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Hybrid Workplace Fleet">Hybrid Workplace Fleet</option>
                          <option value="AI & GPU Compute Cluster">AI & GPU Compute Cluster</option>
                          <option value="Hyperconverged Data Center">Hyperconverged Data Center</option>
                          <option value="Zero Trust Cyber Defense">Zero Trust Cyber Defense</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Project Requirements & Timeline</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your fleet size, security requirements, or target deployment date..."
                        className="w-full bg-slate-950/80 border border-slate-800 p-4 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full h-14 bg-white hover:bg-slate-100 text-slate-950 font-black uppercase tracking-widest text-xs rounded-full shadow-xl transition-transform hover:scale-[1.02]"
                    >
                      Request Architecture Demo <Send size={16} className="ml-2" />
                    </Button>
                  </form>
                )}
              </div>

            </div>
          </section>

          {/* Interactive Google Map Section */}
          <section className="container-enterprise px-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block mb-1">
                  FIND US ON THE MAP —
                </span>
                <h2 className="text-3xl font-light tracking-tight text-white">
                  Sahibzada Ajit Singh Nagar Command Center
                </h2>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Sector 70, Mohali, Punjab 160071
              </div>
            </div>

            {/* Embedded Google Map iframe */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl h-[420px] relative">
              <iframe
                title="DEEQASA TECH Corporate Office Map"
                src="https://maps.google.com/maps?q=SCO%20105%20Sector%2070%20Sahibzada%20Ajit%20Singh%20Nagar%20Punjab%20160071&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
