'use client';

import React from 'react';
import { type Product } from '@/lib/quotation-schemas';
import { type BrochureOutput } from '@/ai/flows/ai-brochure-generation';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
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

const HP_LOGO_URL = "/hp-logo.png";

export function BrochurePreview({ products, marketingData }: BrochurePreviewProps) {
  
  const PageHeader = ({ model }: { model: string }) => (
    <div className="print-header">
      <div className="flex items-center gap-3">
        <img src={HP_LOGO_URL} alt="HP" className="h-[8mm] w-auto" />
        <div className="h-5 w-px bg-gray-200"></div>
        <div className="text-[12pt] font-black text-gray-900 tracking-tighter leading-none uppercase">hp</div>
      </div>
      <div className="text-right">
        <p className="text-[6pt] font-black text-gray-400 uppercase tracking-[0.2em]">Solution Brief</p>
        <p className="text-[7pt] text-primary font-bold uppercase tracking-[0.1em]">{model}</p>
      </div>
    </div>
  );

  const PageFooter = ({ page }: { page: number }) => (
    <div className="print-footer">
      <p>Innovation that powers business. HP Enterprise.</p>
      <p>Page {page.toString().padStart(2, '0')} of 03</p>
    </div>
  );

  return (
    <div id="brochure-export-root" className="document-canvas">
      {products.map((product) => {
        const marketing = marketingData.brochureItems.find(m => m.sku === product.id);
        if (!marketing) return null;

        return (
          <React.Fragment key={product.id}>
            {/* PAGE 1: EXECUTIVE OVERVIEW */}
            <div className="a4-page">
              <PageHeader model={product.model} />
              <div className="a4-content">
                <div className="mb-6">
                  <h1 className="text-[28pt] font-black leading-none tracking-tighter text-gray-900 uppercase mb-3">
                    {product.model}
                  </h1>
                  <p className="text-[12pt] text-primary font-bold tracking-tight uppercase border-l-4 border-primary pl-5 py-1">
                    {marketing.tagline}
                  </p>
                </div>

                <div className="w-full h-[50mm] bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                  <div className="text-center opacity-30 flex flex-col items-center gap-2">
                      <Server size={48} className="text-gray-400" />
                      <p className="text-[7pt] font-bold uppercase tracking-widest">{product.model} Enterprise Node</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { icon: <Cpu size={16}/>, label: 'Compute', value: product.processor },
                    { icon: <Database size={16}/>, label: 'Memory', value: product.memory },
                    { icon: <HardDrive size={16}/>, label: 'Storage', value: product.hdd },
                    { icon: <Zap size={16}/>, label: 'Grade', value: 'Pro' }
                  ].map((chip, i) => (
                    <div key={i} className="bg-gray-900 text-white p-3 rounded-xl flex flex-col items-center text-center">
                      <div className="mb-1 opacity-60">{chip.icon}</div>
                      <span className="text-[5.5pt] font-bold uppercase opacity-50 mb-0.5 tracking-wider">{chip.label}</span>
                      <span className="text-[7pt] font-black uppercase leading-tight truncate w-full">{chip.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="text-[7.5pt] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Executive Summary</h3>
                  <p className="text-[10pt] leading-[1.6] text-gray-700 justified-text font-medium bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
                    "{marketing.executiveSummary}"
                  </p>
                </div>
              </div>
              <PageFooter page={1} />
            </div>

            {/* PAGE 2: TECHNICAL & ARCHITECTURE */}
            <div className="a4-page">
              <PageHeader model={product.model} />
              <div className="a4-content">
                <div className="mb-6">
                  <h2 className="text-[16pt] font-black text-gray-900 mb-5 flex items-center gap-3 tracking-tighter uppercase">
                    <Layers size={20} className="text-primary" /> Engineering & Innovation
                  </h2>
                  <div className="text-[9.5pt] leading-[1.6] text-gray-100 justified-text bg-gray-900 p-6 rounded-2xl border-l-[5pt] border-primary shadow-lg">
                    {marketing.technicalNarrative}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-[7.5pt] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Enterprise Pillars</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: 'Performance', icon: <Zap size={14}/>, text: marketing.businessValue.performance },
                      { title: 'Security', icon: <ShieldCheck size={14}/>, text: marketing.businessValue.security },
                      { title: 'Sustainability', icon: <Globe size={14}/>, text: marketing.businessValue.sustainability },
                      { title: 'Scalability', icon: <Layers size={14}/>, text: marketing.businessValue.scalability }
                    ].map((pillar, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 no-break">
                        <div className="mb-1.5 text-primary">{pillar.icon}</div>
                        <h4 className="text-[8pt] font-black uppercase mb-0.5 tracking-widest">{pillar.title}</h4>
                        <p className="text-[7pt] leading-relaxed text-gray-500">{pillar.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-[7.5pt] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Technical Matrix</h3>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden no-break">
                     <div className="grid grid-cols-2">
                        {[
                          { label: 'Compute Core', val: product.processor },
                          { label: 'System Memory', val: product.memory },
                          { label: 'Storage Array', val: product.hdd },
                          { label: 'Graphics', val: product.gfx },
                          { label: 'OS Environment', val: product.os },
                          { label: 'Lifecycle', val: product.warranty }
                        ].map((spec, i) => (
                          <div key={i} className={cn("p-3 border-gray-50 flex flex-col", i % 2 === 0 ? "border-r" : "", i < 4 ? "border-b" : "", Math.floor(i/2) % 2 === 0 ? "bg-gray-50/40" : "")}>
                            <span className="text-[5.5pt] font-black uppercase text-gray-400 block mb-0.5 tracking-widest">{spec.label}</span>
                            <span className="text-[7.5pt] font-bold text-gray-800">{spec.val}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
              <PageFooter page={2} />
            </div>

            {/* PAGE 3: USE CASES & DEPLOYMENT */}
            <div className="a4-page">
              <PageHeader model={product.model} />
              <div className="a4-content">
                <div className="mb-6">
                  <h2 className="text-[16pt] font-black text-gray-900 mb-6 tracking-tighter uppercase">
                    Sector Deployment
                  </h2>
                  <div className="space-y-2.5">
                    {[
                      { id: 'government', title: 'Government & PSU', text: marketing.sectors.government },
                      { id: 'education', title: 'Education & Research', text: marketing.sectors.education },
                      { id: 'corporate', title: 'Enterprise & MNC', text: marketing.sectors.corporate },
                      { id: 'specialized', title: 'Specialized Workloads', text: marketing.sectors.specialized }
                    ].map((sector, i) => (
                      <div key={i} className="flex gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100 items-center no-break">
                         <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-primary">
                            <SectorIcon sector={sector.id} />
                         </div>
                         <div>
                            <h4 className="text-[9pt] font-bold text-gray-900 mb-0.5 uppercase tracking-wide">{sector.title}</h4>
                            <p className="text-[8pt] text-gray-600 leading-relaxed italic">{sector.text}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-6">
                   <div className="p-5 bg-blue-50/40 rounded-2xl border border-blue-100 no-break">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Award size={16} />
                        <h4 className="text-[7.5pt] font-black uppercase tracking-widest">Enterprise</h4>
                      </div>
                      <p className="text-[7.5pt] leading-relaxed text-blue-900/70 font-medium">
                        {marketing.professionalVsConsumer}
                      </p>
                   </div>
                   <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100 no-break">
                      <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <History size={16} />
                        <h4 className="text-[7.5pt] font-black uppercase tracking-widest">Lifecycle</h4>
                      </div>
                      <p className="text-[7.5pt] leading-relaxed text-emerald-900/70 font-medium">
                        {marketing.lifecycleAssurance}
                      </p>
                   </div>
                </div>

                <div className="mt-auto no-break">
                   <div className="bg-gray-900 text-white p-6 rounded-[24px] relative overflow-hidden flex items-center justify-between">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[60px] -mr-20 -mt-20"></div>
                      <div className="relative z-10 max-w-[75%]">
                        <h3 className="text-[14pt] font-black mb-2 tracking-tighter leading-tight uppercase">HP Excellence.</h3>
                        <p className="text-[8pt] text-gray-400 font-medium italic">
                          "Deploy with confidence. Our enterprise solutions are designed to scale."
                        </p>
                      </div>
                      <div className="relative z-10 opacity-30">
                        <Award size={40} className="text-primary" />
                      </div>
                   </div>
                </div>
              </div>
              <PageFooter page={3} />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}