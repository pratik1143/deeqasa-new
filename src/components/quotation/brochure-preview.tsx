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
  HardDrive,
  Activity
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
    <div className="flex justify-between items-center mb-10 border-b-2 border-gray-900 pb-6 shrink-0 w-full bg-white">
      <div className="flex items-center gap-4">
        <img src={HP_LOGO_URL} alt="HP" className="h-[10mm] w-auto" />
        <div className="h-6 w-px bg-gray-200"></div>
        <div className="text-[14pt] font-black text-gray-900 tracking-tighter leading-none uppercase font-[Outfit]">HP ENTERPRISE</div>
      </div>
      <div className="text-right">
        <p className="text-[7pt] font-black text-primary uppercase tracking-[0.3em] font-[Outfit]">Strategic Data Brief</p>
        <p className="text-[9pt] text-gray-900 font-bold uppercase tracking-tight font-[Outfit] mt-1">{model}</p>
      </div>
    </div>
  );

  const PageFooter = ({ page }: { page: number }) => (
    <div className="mt-auto pt-8 border-t border-gray-100 flex justify-between items-center text-[8pt] font-black text-gray-400 uppercase tracking-[0.2em] bg-white font-[Outfit]">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <p>Innovation Paradigm. DEEQASA TECH x HP.</p>
      </div>
      <p>PRTCL: PAGE {page.toString().padStart(2, '0')}</p>
    </div>
  );

  return (
    <div className="a4-container font-[Outfit] selection:bg-primary/20">
      {products.map((product) => {
        const marketing = marketingData.brochureItems.find(m => m.sku === product.id);
        if (!marketing) return null;

        return (
          <React.Fragment key={product.id}>
            {/* PAGE 1: STRATEGIC OVERVIEW */}
            <div className="a4-page">
              <PageHeader model={product.model} />
              <div className="flex-1 flex flex-col">
                <div className="mb-10">
                  <h1 className="text-[40pt] font-black leading-none tracking-tighter text-gray-900 uppercase mb-4">
                    {product.model}
                  </h1>
                  <p className="text-[14pt] text-primary font-black tracking-widest uppercase border-l-[6pt] border-primary pl-6 py-2">
                    {marketing.tagline}
                  </p>
                </div>

                <div className="w-full h-[60mm] bg-gray-50 rounded-[2rem] flex items-center justify-center mb-10 border border-gray-100 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                  <div className="absolute inset-0 border-[10px] border-white/50"></div>
                  <div className="text-center opacity-40 flex flex-col items-center gap-4">
                      <Server size={64} className="text-primary" />
                      <p className="text-[8pt] font-black uppercase tracking-[0.5em] text-gray-900">{product.model} Enterprise Compute Node</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-10">
                  {[
                    { icon: <Cpu size={20}/>, label: 'Compute Core', value: product.processor },
                    { icon: <Database size={20}/>, label: 'Memory Bank', value: product.memory },
                    { icon: <HardDrive size={20}/>, label: 'Data Array', value: product.hdd },
                    { icon: <ShieldCheck size={20}/>, label: 'Security', value: 'Silicon Root' }
                  ].map((chip, i) => (
                    <div key={i} className="bg-gray-900 text-white p-5 rounded-2xl flex flex-col items-center text-center shadow-lg transform hover:-translate-y-1 transition-all">
                      <div className="mb-2 text-primary">{chip.icon}</div>
                      <span className="text-[6pt] font-black uppercase opacity-40 mb-1 tracking-[0.2em]">{chip.label}</span>
                      <span className="text-[8pt] font-black uppercase leading-tight truncate w-full">{chip.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-10">
                  <h3 className="text-[9pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-2">
                    <Activity size={14} className="text-primary"/> Executive Intelligence
                  </h3>
                  <div className="text-[11.5pt] leading-[1.8] text-gray-700 justified-text font-medium bg-primary/5 p-8 rounded-[2rem] border border-primary/10 relative">
                    <div className="absolute top-0 left-10 transform -translate-y-1/2 bg-white px-4 text-[15pt] font-serif text-primary">“</div>
                    {marketing.executiveSummary}
                  </div>
                </div>
              </div>
              <PageFooter page={1} />
            </div>

            {/* PAGE 2: ARCHITECTURAL MATRIX */}
            <div className="a4-page">
              <PageHeader model={product.model} />
              <div className="flex-1 flex flex-col">
                <div className="mb-8">
                  <h2 className="text-[20pt] font-black text-gray-900 mb-6 flex items-center gap-4 tracking-tighter uppercase">
                    <Layers size={24} className="text-primary" /> Engineering Synthesis
                  </h2>
                  <div className="text-[10pt] font-bold leading-[1.8] text-white justified-text bg-gray-900 p-8 rounded-[2rem] border-l-[8pt] border-primary shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={80} /></div>
                    {marketing.technicalNarrative}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-[8pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-5 pl-2">Value Determinants</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: 'Velocity', icon: <Zap size={16}/>, text: marketing.businessValue.performance },
                      { title: 'Fortress', icon: <ShieldCheck size={16}/>, text: marketing.businessValue.security },
                      { title: 'Ecosystem', icon: <Globe size={16}/>, text: marketing.businessValue.sustainability },
                      { title: 'Scalability', icon: <Layers size={16}/>, text: marketing.businessValue.scalability }
                    ].map((pillar, i) => (
                      <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-start group hover:border-primary/30 transition-all">
                        <div className="mb-3 text-primary p-2 bg-primary/5 rounded-lg">{pillar.icon}</div>
                        <h4 className="text-[9pt] font-black uppercase mb-1.5 tracking-widest text-gray-900">{pillar.title}</h4>
                        <p className="text-[8pt] leading-relaxed text-gray-500 font-medium italic">{pillar.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-[8pt] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 pl-2">Engineering Specs</h3>
                  <div className="border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                     <div className="grid grid-cols-2">
                        {[
                          { label: 'Compute Unit', val: product.processor },
                          { label: 'System Memory', val: product.memory },
                          { label: 'Primary Array', val: product.hdd },
                          { label: 'Graphics Node', val: product.gfx },
                          { label: 'Protocol Environment', val: product.os },
                          { label: 'Lifecycle Trust', val: product.warranty }
                        ].map((spec, i) => (
                          <div key={i} className={cn("p-5 border-gray-50 flex flex-col", i % 2 === 0 ? "border-r" : "", i < 4 ? "border-b" : "", Math.floor(i/2) % 2 === 0 ? "bg-gray-50/50" : "bg-white")}>
                            <span className="text-[6.5pt] font-black uppercase text-primary/60 block mb-1 tracking-[0.2em]">{spec.label}</span>
                            <span className="text-[9pt] font-black text-gray-900 tracking-tight">{spec.val}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
              <PageFooter page={2} />
            </div>

            {/* PAGE 3: DEPLOYMENT LOGIC */}
            <div className="a4-page">
              <PageHeader model={product.model} />
              <div className="flex-1 flex flex-col">
                <div className="mb-10">
                  <h2 className="text-[20pt] font-black text-gray-900 mb-8 tracking-tighter uppercase">
                    Sector Integration Matrix
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { id: 'government', title: 'Public Sector Hub', text: marketing.sectors.government },
                      { id: 'education', title: 'Research & Academia', text: marketing.sectors.education },
                      { id: 'corporate', title: 'Global Enterprise', text: marketing.sectors.corporate },
                      { id: 'specialized', title: 'Edge Intelligence', text: marketing.sectors.specialized }
                    ].map((sector, i) => (
                      <div key={i} className="flex gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 items-center transform transition-all hover:bg-white hover:shadow-xl">
                         <div className="h-14 w-14 rounded-full bg-white shadow-md flex items-center justify-center shrink-0 text-primary border border-gray-50">
                            <SectorIcon sector={sector.id} />
                         </div>
                         <div>
                            <h4 className="text-[10pt] font-black text-gray-900 mb-1 uppercase tracking-tight">{sector.title}</h4>
                            <p className="text-[9pt] text-gray-500 font-medium leading-[1.6] italic">{sector.text}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="p-8 bg-blue-50/30 rounded-[2rem] border border-blue-100 group">
                      <div className="flex items-center gap-3 text-blue-600 mb-4">
                        <Award size={20} />
                        <h4 className="text-[9pt] font-black uppercase tracking-[0.3em]">Compliance</h4>
                      </div>
                      <p className="text-[8.5pt] leading-relaxed text-blue-900/80 font-bold italic">
                        {marketing.professionalVsConsumer}
                      </p>
                   </div>
                   <div className="p-8 bg-emerald-50/30 rounded-[2rem] border border-emerald-100 group">
                      <div className="flex items-center gap-3 text-emerald-600 mb-4">
                        <History size={20} />
                        <h4 className="text-[9pt] font-black uppercase tracking-[0.3em]">Durability</h4>
                      </div>
                      <p className="text-[8.5pt] leading-relaxed text-emerald-900/80 font-bold italic">
                        {marketing.lifecycleAssurance}
                      </p>
                   </div>
                </div>

                <div className="mt-auto">
                   <div className="bg-gray-900 text-white p-10 rounded-[3rem] relative overflow-hidden flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-[8pt] border-white">
                      <div className="absolute top-0 right-0 w-60 h-60 bg-primary/20 blur-[100px] -mr-20 -mt-20"></div>
                      <div className="relative z-10 max-w-[70%]">
                        <h3 className="text-[20pt] font-black mb-4 tracking-tighter leading-none uppercase">The HP Edge.</h3>
                        <p className="text-[10pt] text-gray-400 font-bold italic uppercase tracking-tighter leading-relaxed">
                          Synchronizing with the future. Deploying the elite standard.
                        </p>
                      </div>
                      <div className="relative z-10 opacity-30 animate-pulse">
                        <Award size={64} className="text-primary" />
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
