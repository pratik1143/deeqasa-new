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
  Settings, 
  Award, 
  Info,
  Layers,
  Server
} from 'lucide-react';

interface BrochurePreviewProps {
  products: Product[];
  marketingData: BrochureOutput;
  companyName: string;
}

export function BrochurePreview({ products, marketingData }: BrochurePreviewProps) {
  return (
    <div id="brochure-export-root" className="w-full flex flex-col items-center">
      {products.map((product) => {
        const marketing = marketingData.brochureItems.find(m => m.sku === product.id);
        if (!marketing) return null;

        return (
          <React.Fragment key={product.id}>
            {/* PAGE 1: STRATEGIC SOLUTION BRIEF */}
            <div className="brochure-page bg-white text-gray-900">
              {/* Premium Header */}
              <div className="flex justify-between items-start mb-12 border-b-[3pt] border-primary pb-6">
                <div className="flex flex-col">
                  <div className="text-[28pt] font-black text-gray-900 leading-none tracking-tighter">hp</div>
                  <span className="text-[8pt] font-bold text-gray-400 tracking-[0.4em] uppercase mt-2">Connect Partner</span>
                </div>
                <div className="text-right">
                  <h2 className="text-[14pt] font-bold text-gray-900 tracking-tighter uppercase">DEEQASA TECH</h2>
                  <p className="text-[7.5pt] text-gray-400 uppercase tracking-[0.2em] font-bold">Smart. Secure. Sustainable.</p>
                </div>
              </div>

              {/* Product Identity */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[9pt] font-bold px-5 py-1.5 rounded-full mb-6 uppercase tracking-widest border border-primary/20">
                  <ShieldCheck size={14} /> Enterprise Solutions Brief
                </div>
                <h1 className="text-[42pt] font-black leading-none tracking-tight text-gray-900 uppercase mb-5">
                  {product.model}
                </h1>
                <p className="text-[18pt] text-primary font-semibold italic leading-snug max-w-[95%]">
                  {marketing.headline}
                </p>
              </div>

              {/* Core Architecture Matrix */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center shadow-sm">
                  <Cpu size={36} className="text-primary mb-3" />
                  <span className="text-[7.5pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Processing</span>
                  <span className="text-[11pt] font-black text-gray-800 uppercase">{product.processor}</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center shadow-sm">
                  <Database size={36} className="text-primary mb-3" />
                  <span className="text-[7.5pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Memory Pool</span>
                  <span className="text-[11pt] font-black text-gray-800 uppercase">{product.memory} High-Speed</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center shadow-sm">
                  <Server size={36} className="text-primary mb-3" />
                  <span className="text-[7.5pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Architecture</span>
                  <span className="text-[11pt] font-black text-gray-800 uppercase">{product.chassis}</span>
                </div>
              </div>

              {/* Executive Value Proposition */}
              <div className="mb-12">
                <h3 className="text-[11pt] font-bold uppercase tracking-[0.3em] text-primary border-l-[6pt] border-primary pl-6 mb-6">Strategic Value</h3>
                <div className="text-[12.5pt] leading-[1.7] text-gray-700 justified-text bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-50 shadow-inner">
                  {marketing.executiveSummary}
                </div>
              </div>

              {/* Capabilities List */}
              <div className="flex-1">
                <h3 className="text-[11pt] font-bold uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-2">
                  <Layers size={20} /> Solution Capabilities
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  {marketing.highlights.map((h, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                        <CheckCircle2 size={16} className="text-primary" />
                      </div>
                      <span className="text-[11pt] leading-relaxed font-semibold text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Page 1 */}
              <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center opacity-60">
                <p className="text-[8.5pt] font-bold uppercase tracking-[0.3em] text-gray-400">DQT/BROCHURE/V3.0</p>
                <div className="flex gap-6 items-center">
                  <div className="h-4 w-px bg-gray-200"></div>
                  <p className="text-[8.5pt] font-bold uppercase text-gray-400">Strategic Overview • Page 1</p>
                </div>
              </div>
            </div>

            {/* PAGE 2: TECHNICAL SPECIFICATIONS & ENTERPRISE COMPLIANCE */}
            <div className="brochure-page bg-white text-gray-900">
              {/* Header P2 */}
              <div className="flex justify-between items-center mb-10 opacity-70">
                <div className="text-[20pt] font-black text-gray-900 leading-none">hp</div>
                <p className="text-[10pt] font-bold uppercase tracking-[0.4em] text-primary">{product.model} | Compliance & Data</p>
              </div>

              {/* Detailed Technical Narrative */}
              <div className="mb-10">
                <h2 className="text-[22pt] font-bold text-gray-900 mb-6 flex items-center gap-3 tracking-tight">
                  <Zap size={28} className="text-primary" /> Technical Architecture
                </h2>
                <div className="text-[11.5pt] leading-[1.8] text-gray-600 justified-text italic bg-gray-50 p-10 rounded-[2.5rem] border-l-[10px] border-primary shadow-sm">
                  {marketing.technicalOverview}
                </div>
              </div>

              {/* Specification Grid */}
              <div className="mb-10">
                <h3 className="text-[10pt] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                  <Settings size={20} /> Hardware Specification Matrix
                </h3>
                <div className="border border-gray-100 rounded-[2rem] overflow-hidden shadow-md">
                   <div className="grid grid-cols-2 text-[10.5pt]">
                      <div className="p-6 border-b border-r border-gray-50 bg-gray-50/20">
                        <span className="text-[8pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Model Identifier</span>
                        <span className="font-black text-gray-800">{product.model}</span>
                      </div>
                      <div className="p-6 border-b border-gray-50 bg-white">
                        <span className="text-[8pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Memory Config</span>
                        <span className="font-black text-gray-800">{product.memory} ECC Ready</span>
                      </div>
                      <div className="p-6 border-b border-r border-gray-50 bg-white">
                        <span className="text-[8pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Storage Array</span>
                        <span className="font-black text-gray-800">{product.hdd} {product.hdd2 !== '-' ? `+ ${product.hdd2}` : ''}</span>
                      </div>
                      <div className="p-6 border-b border-gray-50 bg-gray-50/20">
                        <span className="text-[8pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Graphics Unit</span>
                        <span className="font-black text-gray-800">{product.gfx}</span>
                      </div>
                      <div className="p-6 border-r border-gray-50 bg-gray-50/20">
                        <span className="text-[8pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Operating Platform</span>
                        <span className="font-black text-gray-800">{product.os}</span>
                      </div>
                      <div className="p-6 bg-white">
                        <span className="text-[8pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Lifecycle Support</span>
                        <span className="font-black text-gray-800">{product.warranty} Onsite</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Vertical Pillars */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center">
                  <ShieldCheck size={28} className="text-primary mb-3" />
                  <h4 className="text-[9pt] font-black uppercase mb-2 tracking-widest">Security</h4>
                  <p className="text-[8.5pt] leading-relaxed text-gray-500">{marketing.businessValue.security}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center">
                  <Zap size={28} className="text-primary mb-3" />
                  <h4 className="text-[9pt] font-black uppercase mb-2 tracking-widest">Reliability</h4>
                  <p className="text-[8.5pt] leading-relaxed text-gray-500">{marketing.businessValue.reliability}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center">
                  <Globe size={28} className="text-green-600 mb-3" />
                  <h4 className="text-[9pt] font-black uppercase mb-2 tracking-widest">Sustainable</h4>
                  <p className="text-[8.5pt] leading-relaxed text-gray-500">{marketing.businessValue.sustainability}</p>
                </div>
              </div>

              {/* Partner Final Statement */}
              <div className="mt-auto p-10 bg-gray-900 rounded-[3rem] shadow-xl flex items-center justify-between border-[2pt] border-primary">
                 <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-8 w-[4pt] bg-primary"></div>
                    <span className="text-[9pt] font-bold uppercase text-primary tracking-[0.4em]">Enterprise Partner Commitment</span>
                  </div>
                  <p className="text-[12pt] leading-[1.6] text-gray-200 italic font-medium max-w-[95%] mb-6">
                    {marketing.trustStatement}
                  </p>
                  <div className="flex items-center gap-6">
                    <p className="text-[11pt] font-black text-white uppercase tracking-tighter">DEEQASA TECH</p>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <p className="text-[9pt] font-bold text-gray-500 uppercase tracking-widest">HP Connect Authorized Specialist</p>
                  </div>
                 </div>
                 <div className="ml-10 shrink-0 opacity-30">
                    <Award size={64} className="text-white" />
                 </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}