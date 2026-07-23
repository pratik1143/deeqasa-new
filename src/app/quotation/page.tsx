'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Server, Cpu, CheckCircle2, ArrowRight, Calculator, FileText, Send, Building2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SmoothScrollProvider } from '@/components/ui/smooth-scroll-provider';
import { CustomCursor } from '@/components/ui/custom-cursor';

const solutionOptions = [
  { id: 'infrastructure', name: 'Enterprise IT Infrastructure', desc: 'Workstations, HPE Servers & Networking' },
  { id: 'cloud', name: 'Cloud Solutions & Migration', desc: 'Microsoft 365, Google Workspace & Hybrid Backup' },
  { id: 'security', name: 'Cyber Security & Zero Trust', desc: 'HP Wolf Security, Firewalls & SOC' },
  { id: 'software', name: 'Software Development & ERP', desc: 'Custom Business Apps, Hospital ERP & CRM' },
  { id: 'ai', name: 'AI & Automation Solutions', desc: 'Private LLM, OCR Document & Chatbots' },
  { id: 'surveillance', name: 'Surveillance & Access Control', desc: 'IP CCTV, Biometric Attendance & Gates' },
  { id: 'amc', name: 'Annual Maintenance Contract', desc: '24/7 SLA Support & On-Site Engineers' }
];

export default function QuotationPage() {
  const [scrambleTitle, setScrambleTitle] = useState("");
  const targetHeading = "Configure Enterprise IT Quotation";

  const [step, setStep] = useState(1);
  const [selectedSolution, setSelectedSolution] = useState('infrastructure');
  const [fleetSize, setFleetSize] = useState('25-100 Units');
  const [timeline, setTimeline] = useState('Immediate (Under 30 Days)');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <div className="relative min-h-screen bg-[#030716] text-white font-[Outfit] selection:bg-blue-500/30 overflow-hidden">
        <Header />

        {/* Lucien Radial Aura */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-80"
          style={{
            background: 'radial-gradient(ellipse 65% 50% at 50% 35%, rgba(147, 197, 253, 0.35) 0%, rgba(59, 130, 246, 0.18) 45%, rgba(3, 7, 22, 0.95) 75%)'
          }}
        />

        <main className="relative z-10 pt-36 pb-32 space-y-16">
          
          {/* Header */}
          <section className="container-enterprise text-center px-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block">
              INSTANT IT PROPOSAL GENERATOR —
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-tight select-none">
              {scrambleTitle || targetHeading}
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-normal">
              Select your target hardware, software, and deployment parameters to generate a custom HP Partner proposal.
            </p>
          </section>

          {/* Quotation Configurator Wizard */}
          <section className="container-enterprise px-6">
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              
              {submitted ? (
                <div className="py-16 text-center space-y-6 max-w-xl mx-auto">
                  <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-light tracking-tight text-white">
                    Quotation Request Generated
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Thank you! Your quotation parameters have been logged. A DEEQASA Enterprise Solutions Specialist will send your itemized proposal to <span className="text-blue-400 font-mono font-bold">{formData.email}</span> within 2 business hours.
                  </p>
                  <Button 
                    onClick={() => { setSubmitted(false); setStep(1); }}
                    className="bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full px-8 h-12"
                  >
                    Configure Another Quote
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Left Column: Wizard Steps */}
                  <div className="lg:col-span-8 space-y-8">
                    
                    {/* Progress Indicator */}
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-6 text-xs font-mono">
                      <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                        <span className="h-6 w-6 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[10px]">1</span>
                        <span>SOLUTION</span>
                      </div>
                      <div className="h-px w-8 bg-slate-800" />
                      <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                        <span className="h-6 w-6 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[10px]">2</span>
                        <span>SCALE & TIMELINE</span>
                      </div>
                      <div className="h-px w-8 bg-slate-800" />
                      <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                        <span className="h-6 w-6 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[10px]">3</span>
                        <span>CONTACT INFO</span>
                      </div>
                    </div>

                    {/* Step 1: Solution Selection */}
                    {step === 1 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-light text-white tracking-tight">Select Target Technology Vertical</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {solutionOptions.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedSolution(opt.id)}
                              className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                                selectedSolution === opt.id
                                  ? 'bg-blue-500/20 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                              }`}
                            >
                              <div className="font-bold text-sm text-white mb-1">{opt.name}</div>
                              <div className="text-xs text-slate-400 font-normal">{opt.desc}</div>
                            </button>
                          ))}
                        </div>
                        <Button
                          onClick={() => setStep(2)}
                          className="h-12 px-8 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full"
                        >
                          Next: Scale & Timeline <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </div>
                    )}

                    {/* Step 2: Fleet Scale & Timeline */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-light text-white tracking-tight">Specify Scale & Target Deployment Timeline</h3>
                        
                        <div className="space-y-3">
                          <label className="text-xs font-mono uppercase text-slate-400 tracking-widest block">Estimated Fleet / User Scale</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {['1-25 Units', '25-100 Units', '100-500 Units', '500+ Enterprise'].map(s => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setFleetSize(s)}
                                className={`p-3 rounded-xl border text-xs font-bold font-mono transition-all ${
                                  fleetSize === s ? 'bg-blue-500 text-white border-blue-400' : 'bg-slate-950/80 border-slate-800 text-slate-400'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <label className="text-xs font-mono uppercase text-slate-400 tracking-widest block">Target Deployment Timeline</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {['Immediate (Under 30 Days)', 'Q3 Project Rollout', 'Planning & Budgeting Phase'].map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setTimeline(t)}
                                className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-left ${
                                  timeline === t ? 'bg-blue-500 text-white border-blue-400' : 'bg-slate-950/80 border-slate-800 text-slate-400'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="h-12 px-6 bg-slate-900 border-slate-800 text-slate-300 rounded-full"
                          >
                            Back
                          </Button>
                          <Button
                            onClick={() => setStep(3)}
                            className="h-12 px-8 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-full"
                          >
                            Next: Contact Details <ArrowRight size={16} className="ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Contact Info & Submission */}
                    {step === 3 && (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <h3 className="text-xl font-light text-white tracking-tight">Enter Proposal Recipient Information</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Full Name</label>
                            <Input
                              required
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Rahul Sharma"
                              className="bg-slate-950/80 border-slate-800 h-12 text-xs text-white rounded-2xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Work Email</label>
                            <Input
                              required
                              type="email"
                              value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                              placeholder="rahul@company.com"
                              className="bg-slate-950/80 border-slate-800 h-12 text-xs text-white rounded-2xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Phone Number</label>
                            <Input
                              required
                              value={formData.phone}
                              onChange={e => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+91 9876543210"
                              className="bg-slate-950/80 border-slate-800 h-12 text-xs text-white rounded-2xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Company Name</label>
                            <Input
                              required
                              value={formData.company}
                              onChange={e => setFormData({ ...formData, company: e.target.value })}
                              placeholder="Tech Enterprises Ltd"
                              className="bg-slate-950/80 border-slate-800 h-12 text-xs text-white rounded-2xl"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Additional Notes & Specific Hardware Specs</label>
                          <textarea
                            rows={3}
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Mention specific HP Elite models, HPE server rack requirements..."
                            className="w-full bg-slate-950/80 border border-slate-800 p-4 text-xs font-medium text-white placeholder:text-slate-600 rounded-2xl focus:outline-none focus:border-blue-500 resize-none"
                          />
                        </div>

                        <div className="flex gap-4 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(2)}
                            className="h-12 px-6 bg-slate-900 border-slate-800 text-slate-300 rounded-full"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="h-14 px-8 bg-white hover:bg-slate-100 text-slate-950 font-black uppercase tracking-widest text-xs rounded-full shadow-xl"
                          >
                            Generate Proposal & Send Quote <Send size={16} className="ml-2" />
                          </Button>
                        </div>
                      </form>
                    )}

                  </div>

                  {/* Right Column: Dynamic Live Quotation Summary Panel */}
                  <div className="lg:col-span-4 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-6 font-mono shadow-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
                        <span className="font-bold text-blue-400">PROPOSAL SUMMARY</span>
                        <span className="text-emerald-400 text-[10px] font-bold">LIVE ESTIMATE</span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 block uppercase">Selected Vertical</span>
                          <span className="font-bold text-white block capitalize">{selectedSolution}</span>
                        </div>

                        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 block uppercase">Scope & Scale</span>
                          <span className="font-bold text-blue-400 block">{fleetSize}</span>
                        </div>

                        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 block uppercase">Target Timeline</span>
                          <span className="font-bold text-slate-300 block">{timeline}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] space-y-2">
                        <div className="font-bold flex items-center gap-2">
                          <ShieldCheck size={14} className="text-blue-400" /> HP Gold Partner Guarantee
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Includes tier-1 partner volume discount, 99.999% SLA hardware warranty, and zero-touch enrollment.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
                      <div>DISPATCHED TO: sales@deeqasa.com</div>
                      <div>SUPPORT DESK: +91 8595270950</div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </section>

        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
