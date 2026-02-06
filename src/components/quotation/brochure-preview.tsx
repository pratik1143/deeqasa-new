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
      <div className="flex items-center gap-4">
        <img src={HP_LOGO_URL} alt="HP" className="h-[10mm] w-auto" />
        <div className="h-6 w-px bg-gray-200"></div>
        <div className="text-[14pt] font-black text-gray-900 tracking-tighter leading-none">hp</div>
      </div>
      <div className="text-right">
        <p className="text-[7pt] font-black text-gray-400 uppercase tracking-[0.3em]">Solution Brief</p>
        <p className="text-[8pt] text-primary font-bold uppercase tracking-[0.1em]">{model}</p>
      </div>
    </div>
  );

  const PageFooter = ({ page }: { page: number }) => (
    <div className="print-footer">
      <p>Innovation that powers your business. HP Enterprise.</p>
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
            <div className="brochure-page">
              <PageHeader model={product.model} />
              <div className="print-body">
                <div className="mb-8">
                  <h1 className="text-[32pt] font-black leading-none tracking-tighter text-gray-900 uppercase mb-4">
                    {product.model}
                  </h1>
                  <p className="text-[14pt] text-primary font-bold tracking-tight uppercase border-l-4 border-primary pl-6 py-1">
                    {marketing.tagline}
                  </p>
                </div>

                <div className="w-full h-[55mm] bg-gray-50 rounded-3xl flex items-center justify-center mb-8 border border-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                  <div className="text-center opacity-30 flex flex-col items-center gap-3">
                      <Server size={64} className="text-gray-400" />
                      <p className="text-[8pt] font-bold uppercase tracking-widest">{product.model} Enterprise Node</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: <Cpu size={18}/>, label: 'Compute', value: product.processor },
                    { icon: <Database size={18}/>, label: 'Memory', value: product.memory },
                    { icon: <HardDrive size={18}/>, label: 'Storage', value: product.hdd },
                    { icon: <Zap size={18}/>, label: 'Grade', value: 'Pro' }
                  ].map((chip, i) => (
                    <div key={i} className="bg-gray-900 text-white p-4 rounded-2xl flex flex-col items-center text-center">
                      <div className="mb-2 opacity-60">{chip.icon}</div>
                      <span className="text-[6pt] font-bold uppercase opacity-50 mb-1 tracking-wider">{chip.label}</span>
                      <span className="text-[7.5pt] font-black uppercase leading-tight truncate w-full">{chip.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <h3 className="text-[8pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Executive Summary</h3>
                  <p className="text-[11pt] leading-[1.6] text-gray-700 justified-text font-medium bg-gray-50 p-8 rounded-3xl border border-gray-100 italic">
                    "{marketing.executiveSummary}"
                  </p>
                </div>
              </div>
              <PageFooter page={1} />
            </div>

            {/* PAGE 2: TECHNICAL & ARCHITECTURE */}
            <div className="brochure-page">
              <PageHeader model={product.model} />
              <div className="print-body">
                <div className="mb-8">
                  <h2 className="text-[18pt] font-black text-gray-900 mb-6 flex items-center gap-4 tracking-tighter uppercase">
                    <Layers size={24} className="text-primary" /> Engineering & Innovation
                  </h2>
                  <div className="text-[10pt] leading-[1.7] text-gray-100 justified-text bg-gray-900 p-8 rounded-3xl border-l-[6pt] border-primary shadow-lg">
                    {marketing.technicalNarrative}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-[8pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Enterprise Pillars</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: 'Performance', icon: <Zap size={16}/>, text: marketing.businessValue.performance },
                      { title: 'Security', icon: <ShieldCheck size={16}/>, text: marketing.businessValue.security },
                      { title: 'Sustainability', icon: <Globe size={16}/>, text: marketing.businessValue.sustainability },
                      { title: 'Scalability', icon: <Layers size={16}/>, text: marketing.businessValue.scalability }
                    ].map((pillar, i) => (
                      <div key={i} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="mb-2 text-primary">{pillar.icon}</div>
                        <h4 className="text-[8.5pt] font-black uppercase mb-1 tracking-widest">{pillar.title}</h4>
                        <p className="text-[7.5pt] leading-relaxed text-gray-500">{pillar.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-[8pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Technical Matrix</h3>
                  <div className="border border-gray-100 rounded-3xl overflow-hidden">
                     <div className="grid grid-cols-2">
                        {[
                          { label: 'Compute Core', val: product.processor },
                          { label: 'System Memory', val: product.memory },
                          { label: 'Storage Array', val: product.hdd },
                          { label: 'Graphics', val: product.gfx },
                          { label: 'OS Environment', val: product.os },
                          { label: 'Lifecycle', val: product.warranty }
                        ].map((spec, i) => (
                          <div key={i} className={cn("p-4 border-gray-50 flex flex-col", i % 2 === 0 ? "border-r" : "", i < 4 ? "border-b" : "", Math.floor(i/2) % 2 === 0 ? "bg-gray-50/40" : "")}>
                            <span className="text-[6pt] font-black uppercase text-gray-400 block mb-1 tracking-widest">{spec.label}</span>
                            <span className="text-[8pt] font-bold text-gray-800">{spec.val}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
              <PageFooter page={2} />
            </div>

            {/* PAGE 3: USE CASES & DEPLOYMENT */}
            <div className="brochure-page">
              <PageHeader model={product.model} />
              <div className="print-body">
                <div className="mb-8">
                  <h2 className="text-[18pt] font-black text-gray-900 mb-8 tracking-tighter uppercase">
                    Sector Deployment
                  </h2>
                  <div className="space-y-3">
                    {[
                      { id: 'government', title: 'Government & PSU', text: marketing.sectors.government },
                      { id: 'education', title: 'Education & Research', text: marketing.sectors.education },
                      { id: 'corporate', title: 'Enterprise & MNC', text: marketing.sectors.corporate },
                      { id: 'specialized', title: 'Specialized Workloads', text: marketing.sectors.specialized }
                    ].map((sector, i) => (
                      <div key={i} className="flex gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-100 items-center">
                         <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-primary">
                            <SectorIcon sector={sector.id} />
                         </div>
                         <div>
                            <h4 className="text-[10pt] font-bold text-gray-900 mb-1 uppercase tracking-wide">{sector.title}</h4>
                            <p className="text-[8.5pt] text-gray-600 leading-relaxed italic">{sector.text}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                   <div className="p-6 bg-blue-50/40 rounded-3xl border border-blue-100">
                      <div className="flex items-center gap-3 text-blue-600 mb-3">
                        <Award size={18} />
                        <h4 className="text-[8pt] font-black uppercase tracking-widest">Enterprise</h4>
                      </div>
                      <p className="text-[8pt] leading-relaxed text-blue-900/70 font-medium">
                        {marketing.professionalVsConsumer}
                      </p>
                   </div>
                   <div className="p-6 bg-emerald-50/40 rounded-3xl border border-emerald-100">
                      <div className="flex items-center gap-3 text-emerald-600 mb-3">
                        <History size={18} />
                        <h4 className="text-[8pt] font-black uppercase tracking-widest">Lifecycle</h4>
                      </div>
                      <p className="text-[8pt] leading-relaxed text-emerald-900/70 font-medium">
                        {marketing.lifecycleAssurance}
                      </p>
                   </div>
                </div>

                <div className="mt-auto">
                   <div className="bg-gray-900 text-white p-8 rounded-[30px] relative overflow-hidden flex items-center justify-between">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[80px] -mr-24 -mt-24"></div>
                      <div className="relative z-10 max-w-[75%]">
                        <h3 className="text-[16pt] font-black mb-3 tracking-tighter leading-tight uppercase">HP Excellence.</h3>
                        <p className="text-[9pt] text-gray-400 font-medium italic">
                          "Deploy with confidence. Our enterprise solutions are designed to scale."
                        </p>
                      </div>
                      <div className="relative z-10 opacity-30">
                        <Award size={48} className="text-primary" />
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
