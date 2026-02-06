'use client';

import React from 'react';
import { type Product } from '@/lib/quotation-schemas';
import { type BrochureOutput } from '@/ai/flows/ai-brochure-generation';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  CheckCircle2, 
  Globe, 
  Zap, 
  Award, 
  Layers,
  Server,
  Building2,
  GraduationCap,
  Briefcase,
  Target,
  History,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrochurePreviewProps {
  products: Product[];
  marketingData: BrochureOutput;
}

const SectorIcon = ({ sector }: { sector: string }) => {
  switch (sector) {
    case 'government': return <Building2 size={24} />;
    case 'education': return <GraduationCap size={24} />;
    case 'corporate': return <Briefcase size={24} />;
    default: return <Target size={24} />;
  }
};

const HP_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/1024px-HP_logo_2012.svg.png";

export function BrochurePreview({ products, marketingData }: BrochurePreviewProps) {
  return (
    <div id="brochure-export-root" className="w-full flex flex-col items-center">
      {products.map((product) => {
        const marketing = marketingData.brochureItems.find(m => m.sku === product.id);
        if (!marketing) return null;

        return (
          <React.Fragment key={product.id}>
            {/* PAGE 1: EXECUTIVE OVERVIEW */}
            <div className="brochure-page bg-white text-gray-900 shadow-none border-none">
              <div className="flex justify-between items-center mb-12 border-b-2 border-gray-100 pb-8">
                <div className="flex items-center gap-4">
                  <img src={HP_LOGO_URL} alt="HP" className="h-[20mm] w-auto" />
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="text-[20pt] font-black text-gray-900 tracking-tighter leading-none">hp</div>
                </div>
                <div className="text-right">
                  <p className="text-[8.5pt] font-bold text-gray-900 uppercase tracking-[0.3em]">HP Enterprise Series</p>
                  <p className="text-[7pt] text-primary font-bold uppercase tracking-[0.2em] mt-1">Official Solution Brief</p>
                </div>
              </div>

              <div className="mb-12">
                <h1 className="text-[44pt] font-black leading-none tracking-tighter text-gray-900 uppercase mb-4">
                  {product.model}
                </h1>
                <p className="text-[18pt] text-primary font-bold tracking-tight uppercase border-l-4 border-primary pl-6 py-2">
                  {marketing.tagline}
                </p>
              </div>

              {/* Hero Image Container */}
              <div className="w-full h-[60mm] bg-gray-50 rounded-3xl flex items-center justify-center mb-12 border border-gray-100 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="text-center opacity-30 flex flex-col items-center gap-3 group-hover:opacity-50 transition-opacity">
                    <Server size={64} className="text-gray-400" />
                    <p className="text-[10pt] font-bold uppercase tracking-widest">{product.model} Visual Representation</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-12">
                {[
                  { icon: <Cpu size={20}/>, label: 'Compute', value: product.processor },
                  { icon: <Database size={20}/>, label: 'Memory', value: product.memory },
                  { icon: <HardDrive size={20}/>, label: 'Storage', value: product.hdd },
                  { icon: <Zap size={20}/>, label: 'Performance', value: 'Optimized' }
                ].map((chip, i) => (
                  <div key={i} className="bg-gray-900 text-white p-4 rounded-2xl flex flex-col items-center text-center hover:bg-primary transition-colors cursor-default">
                    <div className="mb-2 opacity-60">{chip.icon}</div>
                    <span className="text-[7pt] font-bold uppercase opacity-50 mb-1">{chip.label}</span>
                    <span className="text-[9pt] font-black uppercase leading-tight">{chip.value}</span>
                  </div>
                ))}
              </div>

              <div className="mb-12">
                <h3 className="text-[9pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Executive Summary</h3>
                <p className="text-[13pt] leading-[1.6] text-gray-700 justified-text font-medium bg-gray-50 p-8 rounded-3xl italic">
                  "{marketing.executiveSummary}"
                </p>
              </div>

              <div className="flex-1">
                <h3 className="text-[9pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Strategic Advantages</h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  {marketing.keyHighlights.map((h, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-all">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-[11pt] leading-snug font-bold text-gray-800">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center opacity-40">
                <p className="text-[8pt] font-bold uppercase tracking-[0.3em]">HP Connect Partner Ecosystem</p>
                <p className="text-[8pt] font-bold uppercase tracking-widest">Page 01 of 03</p>
              </div>
            </div>

            {/* PAGE 2: TECHNICAL & BUSINESS DEPTH */}
            <div className="brochure-page bg-white text-gray-900 shadow-none border-none">
              <div className="flex justify-between items-center mb-10 opacity-70 border-b border-gray-100 pb-6">
                <img src={HP_LOGO_URL} alt="HP" className="h-8 w-auto" />
                <p className="text-[8.5pt] font-bold uppercase tracking-[0.4em] text-primary">{product.model} | Engineering Analysis</p>
              </div>

              <div className="mb-10">
                <h2 className="text-[22pt] font-bold text-gray-900 mb-6 flex items-center gap-4">
                  <Layers size={28} className="text-primary" /> Architecture & Innovation
                </h2>
                <div className="text-[11pt] leading-[1.8] text-gray-600 justified-text bg-gray-900 text-gray-100 p-8 rounded-3xl border-l-[10pt] border-primary shadow-xl">
                  {marketing.technicalNarrative}
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-[9pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">The Four Pillars of HP Enterprise</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { title: 'Performance', icon: <Zap/>, text: marketing.businessValue.performance, color: 'text-orange-500' },
                    { title: 'Security', icon: <ShieldCheck/>, text: marketing.businessValue.security, color: 'text-blue-500' },
                    { title: 'Sustainability', icon: <Globe/>, text: marketing.businessValue.sustainability, color: 'text-emerald-500' },
                    { title: 'Scalability', icon: <Layers/>, text: marketing.businessValue.scalability, color: 'text-purple-500' }
                  ].map((pillar, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-primary transition-colors">
                      <div className={cn("mb-3", pillar.color)}>{pillar.icon}</div>
                      <h4 className="text-[10pt] font-black uppercase mb-2 tracking-widest">{pillar.title}</h4>
                      <p className="text-[9pt] leading-relaxed text-gray-500">{pillar.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-[9pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Technical Specification Matrix</h3>
                <div className="border border-gray-100 rounded-3xl overflow-hidden">
                   <div className="grid grid-cols-2">
                      {[
                        { label: 'Platform', val: product.model },
                        { label: 'Compute Core', val: product.processor },
                        { label: 'System Memory', val: product.memory },
                        { label: 'Storage Array', val: product.hdd },
                        { label: 'Graphics Architecture', val: product.gfx },
                        { label: 'Operating Environment', val: product.os },
                        { label: 'Lifecycle Support', val: product.warranty },
                        { label: 'Reliability Standard', val: 'Enterprise Grade' }
                      ].map((spec, i) => (
                        <div key={i} className={cn("p-5 border-gray-50 flex flex-col", i % 2 === 0 ? "border-r" : "", i < 6 ? "border-b" : "", Math.floor(i/2) % 2 === 0 ? "bg-gray-50/50" : "")}>
                          <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1 tracking-widest">{spec.label}</span>
                          <span className="text-[9.5pt] font-bold text-gray-800">{spec.val}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center opacity-40">
                <p className="text-[8pt] font-bold uppercase tracking-[0.3em]">Built for Business. Built for Reliability.</p>
                <p className="text-[8pt] font-bold uppercase tracking-widest">Page 02 of 03</p>
              </div>
            </div>

            {/* PAGE 3: USE CASES & DEPLOYMENT */}
            <div className="brochure-page bg-white text-gray-900 shadow-none border-none">
              <div className="flex justify-between items-center mb-10 opacity-70 border-b border-gray-100 pb-6">
                <img src={HP_LOGO_URL} alt="HP" className="h-8 w-auto" />
                <p className="text-[8.5pt] font-bold uppercase tracking-[0.4em] text-primary">{product.model} | Sector Analysis</p>
              </div>

              <div className="mb-12">
                <h2 className="text-[22pt] font-bold text-gray-900 mb-8 tracking-tighter">
                  Strategic Sector Deployment
                </h2>
                <div className="space-y-6">
                  {[
                    { id: 'government', title: 'Government & PSU', text: marketing.sectors.government },
                    { id: 'education', title: 'Education & Research', text: marketing.sectors.education },
                    { id: 'corporate', title: 'Enterprise & MNC', text: marketing.sectors.corporate },
                    { id: 'specialized', title: 'Specialized Workloads', text: marketing.sectors.specialized }
                  ].map((sector, i) => (
                    <div key={i} className="flex gap-8 p-8 bg-gray-50 rounded-3xl border border-gray-100 items-center hover:bg-white hover:shadow-2xl hover:scale-[1.01] transition-all">
                       <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-primary">
                          <SectorIcon sector={sector.id} />
                       </div>
                       <div>
                          <h4 className="text-[12pt] font-bold text-gray-900 mb-2 uppercase tracking-wide">{sector.title}</h4>
                          <p className="text-[10pt] text-gray-600 leading-relaxed italic">{sector.text}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12">
                 <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
                    <div className="flex items-center gap-3 text-blue-600 mb-4">
                      <Award size={24} />
                      <h4 className="text-[10pt] font-black uppercase tracking-widest">Enterprise Class</h4>
                    </div>
                    <p className="text-[9.5pt] leading-relaxed text-blue-900/70 font-medium">
                      {marketing.professionalVsConsumer}
                    </p>
                 </div>
                 <div className="p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                    <div className="flex items-center gap-3 text-emerald-600 mb-4">
                      <History size={24} />
                      <h4 className="text-[10pt] font-black uppercase tracking-widest">Lifecycle Assurance</h4>
                    </div>
                    <p className="text-[9.5pt] leading-relaxed text-emerald-900/70 font-medium">
                      {marketing.lifecycleAssurance}
                    </p>
                 </div>
              </div>

              <div className="mt-auto">
                 <div className="bg-gray-900 text-white p-12 rounded-[40px] relative overflow-hidden flex items-center justify-between group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32"></div>
                    <div className="relative z-10 max-w-[70%]">
                      <h3 className="text-[20pt] font-black mb-4 tracking-tighter leading-tight">Innovation backed by HP Excellence.</h3>
                      <p className="text-[11pt] text-gray-400 font-medium italic mb-6">
                        "Deploy with confidence. Our enterprise solutions are designed to scale with your organization's vision."
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="h-1 w-12 bg-primary"></div>
                        <span className="text-[9pt] font-bold uppercase tracking-[0.3em]">Official HP Connect Partner Solution</span>
                      </div>
                    </div>
                    <div className="relative z-10 opacity-20 group-hover:opacity-100 transition-opacity">
                      <Award size={80} className="text-primary" />
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center opacity-40">
                <p className="text-[8pt] font-bold uppercase tracking-[0.3em]">Strategic. Secure. Sustainable.</p>
                <p className="text-[8pt] font-bold uppercase tracking-widest">Page 03 of 03</p>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
