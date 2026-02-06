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
    <div id="brochure-export-root" className="w-full flex flex-col items-center bg-gray-100">
      {products.map((product) => {
        const marketing = marketingData.brochureItems.find(m => m.sku === product.id);
        if (!marketing) return null;

        return (
          <React.Fragment key={product.id}>
            {/* PAGE 1: EXECUTIVE OVERVIEW */}
            <div className="brochure-page bg-white text-gray-900 shadow-none border-none overflow-hidden" style={{ padding: '20mm 18mm' }}>
              <div className="flex justify-between items-center mb-12 border-b-2 border-gray-100 pb-8">
                <div className="flex items-center gap-4">
                  <img src={HP_LOGO_URL} alt="HP" className="h-[18mm] w-auto" />
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="text-[20pt] font-black text-gray-900 tracking-tighter leading-none">hp</div>
                </div>
                <div className="text-right">
                  <p className="text-[8.5pt] font-bold text-gray-900 uppercase tracking-[0.3em]">Official Solution Brief</p>
                  <p className="text-[7pt] text-primary font-bold uppercase tracking-[0.2em] mt-1">Enterprise Computing Series</p>
                </div>
              </div>

              <div className="mb-12">
                <h1 className="text-[40pt] font-black leading-none tracking-tighter text-gray-900 uppercase mb-4">
                  {product.model}
                </h1>
                <p className="text-[16pt] text-primary font-bold tracking-tight uppercase border-l-4 border-primary pl-6 py-1">
                  {marketing.tagline}
                </p>
              </div>

              {/* Hero Section - Group Locked */}
              <div className="w-full h-[65mm] bg-gray-50 rounded-3xl flex items-center justify-center mb-12 border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="text-center opacity-30 flex flex-col items-center gap-3">
                    <Server size={80} className="text-gray-400" />
                    <p className="text-[9pt] font-bold uppercase tracking-widest">{product.model} Enterprise Node</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-12">
                {[
                  { icon: <Cpu size={20}/>, label: 'Compute', value: product.processor },
                  { icon: <Database size={20}/>, label: 'Memory', value: product.memory },
                  { icon: <HardDrive size={20}/>, label: 'Storage', value: product.hdd },
                  { icon: <Zap size={20}/>, label: 'Power', value: 'High' }
                ].map((chip, i) => (
                  <div key={i} className="bg-gray-900 text-white p-4 rounded-2xl flex flex-col items-center text-center">
                    <div className="mb-2 opacity-60">{chip.icon}</div>
                    <span className="text-[6.5pt] font-bold uppercase opacity-50 mb-1 tracking-wider">{chip.label}</span>
                    <span className="text-[8pt] font-black uppercase leading-tight truncate w-full">{chip.value}</span>
                  </div>
                ))}
              </div>

              <div className="mb-12">
                <h3 className="text-[8.5pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Executive Summary</h3>
                <p className="text-[12pt] leading-[1.6] text-gray-700 justified-text font-medium bg-gray-50 p-8 rounded-3xl border border-gray-100 italic">
                  "{marketing.executiveSummary}"
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center opacity-40">
                <p className="text-[8pt] font-bold uppercase tracking-[0.3em]">Innovation that powers your business.</p>
                <p className="text-[8pt] font-bold uppercase tracking-widest">Page 01 of 03</p>
              </div>
            </div>

            {/* PAGE 2: TECHNICAL & ARCHITECTURE */}
            <div className="brochure-page bg-white text-gray-900 shadow-none border-none overflow-hidden" style={{ padding: '20mm 18mm' }}>
              <div className="flex justify-between items-center mb-10 opacity-70 border-b border-gray-100 pb-6">
                <img src={HP_LOGO_URL} alt="HP" className="h-8 w-auto" />
                <p className="text-[8.5pt] font-bold uppercase tracking-[0.4em] text-primary">{product.model} | System Architecture</p>
              </div>

              <div className="mb-10" style={{ breakInside: 'avoid' }}>
                <h2 className="text-[20pt] font-bold text-gray-900 mb-6 flex items-center gap-4 tracking-tighter uppercase">
                  <Layers size={28} className="text-primary" /> Engineering & Innovation
                </h2>
                <div className="text-[10.5pt] leading-[1.7] text-gray-100 justified-text bg-gray-900 p-8 rounded-3xl border-l-[8pt] border-primary shadow-lg">
                  {marketing.technicalNarrative}
                </div>
              </div>

              <div className="mb-10" style={{ breakInside: 'avoid' }}>
                <h3 className="text-[8.5pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Enterprise Pillars</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { title: 'Performance', icon: <Zap/>, text: marketing.businessValue.performance },
                    { title: 'Security', icon: <ShieldCheck/>, text: marketing.businessValue.security },
                    { title: 'Sustainability', icon: <Globe/>, text: marketing.businessValue.sustainability },
                    { title: 'Scalability', icon: <Layers/>, text: marketing.businessValue.scalability }
                  ].map((pillar, i) => (
                    <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <div className="mb-3 text-primary">{pillar.icon}</div>
                      <h4 className="text-[9.5pt] font-black uppercase mb-2 tracking-widest">{pillar.title}</h4>
                      <p className="text-[8.5pt] leading-relaxed text-gray-500">{pillar.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-10" style={{ breakInside: 'avoid' }}>
                <h3 className="text-[8.5pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Technical Specification Matrix</h3>
                <div className="border border-gray-100 rounded-3xl overflow-hidden">
                   <div className="grid grid-cols-2">
                      {[
                        { label: 'Platform', val: product.model },
                        { label: 'Compute Core', val: product.processor },
                        { label: 'System Memory', val: product.memory },
                        { label: 'Storage Array', val: product.hdd },
                        { label: 'Graphics', val: product.gfx },
                        { label: 'OS Environment', val: product.os },
                        { label: 'Lifecycle Support', val: product.warranty },
                        { label: 'Standard', val: 'Enterprise Grade' }
                      ].map((spec, i) => (
                        <div key={i} className={cn("p-4 border-gray-50 flex flex-col", i % 2 === 0 ? "border-r" : "", i < 6 ? "border-b" : "", Math.floor(i/2) % 2 === 0 ? "bg-gray-50/40" : "")}>
                          <span className="text-[6.5pt] font-bold uppercase text-gray-400 block mb-1 tracking-widest">{spec.label}</span>
                          <span className="text-[8.5pt] font-bold text-gray-800">{spec.val}</span>
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
            <div className="brochure-page bg-white text-gray-900 shadow-none border-none overflow-hidden" style={{ padding: '20mm 18mm' }}>
              <div className="flex justify-between items-center mb-10 opacity-70 border-b border-gray-100 pb-6">
                <img src={HP_LOGO_URL} alt="HP" className="h-8 w-auto" />
                <p className="text-[8.5pt] font-bold uppercase tracking-[0.4em] text-primary">{product.model} | Sector Analysis</p>
              </div>

              <div className="mb-10" style={{ breakInside: 'avoid' }}>
                <h2 className="text-[20pt] font-bold text-gray-900 mb-8 tracking-tighter uppercase">
                  Strategic Sector Deployment
                </h2>
                <div className="space-y-4">
                  {[
                    { id: 'government', title: 'Government & PSU', text: marketing.sectors.government },
                    { id: 'education', title: 'Education & Research', text: marketing.sectors.education },
                    { id: 'corporate', title: 'Enterprise & MNC', text: marketing.sectors.corporate },
                    { id: 'specialized', title: 'Specialized Workloads', text: marketing.sectors.specialized }
                  ].map((sector, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 items-center">
                       <div className="h-14 w-14 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-primary">
                          <SectorIcon sector={sector.id} />
                       </div>
                       <div>
                          <h4 className="text-[11pt] font-bold text-gray-900 mb-1 uppercase tracking-wide">{sector.title}</h4>
                          <p className="text-[9pt] text-gray-600 leading-relaxed italic">{sector.text}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10" style={{ breakInside: 'avoid' }}>
                 <div className="p-6 bg-blue-50/40 rounded-3xl border border-blue-100">
                    <div className="flex items-center gap-3 text-blue-600 mb-3">
                      <Award size={20} />
                      <h4 className="text-[9pt] font-black uppercase tracking-widest">Enterprise Class</h4>
                    </div>
                    <p className="text-[8.5pt] leading-relaxed text-blue-900/70 font-medium">
                      {marketing.professionalVsConsumer}
                    </p>
                 </div>
                 <div className="p-6 bg-emerald-50/40 rounded-3xl border border-emerald-100">
                    <div className="flex items-center gap-3 text-emerald-600 mb-3">
                      <History size={20} />
                      <h4 className="text-[9pt] font-black uppercase tracking-widest">Lifecycle</h4>
                    </div>
                    <p className="text-[8.5pt] leading-relaxed text-emerald-900/70 font-medium">
                      {marketing.lifecycleAssurance}
                    </p>
                 </div>
              </div>

              <div className="mt-auto">
                 <div className="bg-gray-900 text-white p-10 rounded-[30px] relative overflow-hidden flex items-center justify-between">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[80px] -mr-24 -mt-24"></div>
                    <div className="relative z-10 max-w-[75%]">
                      <h3 className="text-[18pt] font-black mb-3 tracking-tighter leading-tight uppercase">HP Excellence.</h3>
                      <p className="text-[10pt] text-gray-400 font-medium italic mb-4">
                        "Deploy with confidence. Our enterprise solutions are designed to scale with your organization's vision."
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="h-0.5 w-10 bg-primary"></div>
                        <span className="text-[8pt] font-bold uppercase tracking-[0.2em]">Authorized Signature Required</span>
                      </div>
                    </div>
                    <div className="relative z-10 opacity-30">
                      <Award size={64} className="text-primary" />
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
