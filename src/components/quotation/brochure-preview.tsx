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
    <div id="brochure-export-root" className="w-full flex flex-col items-center gap-10">
      {products.map((product) => {
        const marketing = marketingData.brochureItems.find(m => m.sku === product.id);
        if (!marketing) return null;

        return (
          <React.Fragment key={product.id}>
            {/* PAGE 1: PRODUCT OVERVIEW & STRATEGIC HIGHLIGHTS */}
            <div className="quotation-page flex flex-col bg-white text-gray-900 border-none relative">
              {/* HP Partner Header */}
              <div className="flex justify-between items-start mb-16 border-b-2 border-primary pb-8">
                <div className="flex flex-col">
                  <div className="text-[24pt] font-headline font-black text-gray-900 leading-none">hp</div>
                  <span className="text-[8pt] font-bold text-gray-400 tracking-[0.3em] uppercase mt-2">Connect Partner</span>
                </div>
                <div className="text-right">
                  <h2 className="text-[14pt] font-headline font-bold text-gray-900 tracking-tighter">DEEQASA TECH</h2>
                  <p className="text-[7pt] text-gray-400 uppercase tracking-widest font-bold">Smart. Secure. Sustainable.</p>
                </div>
              </div>

              {/* Title & Headline */}
              <div className="mb-12">
                <div className="inline-block bg-primary/10 text-primary text-[8pt] font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-widest">
                  Enterprise Solutions Brief
                </div>
                <h1 className="text-[36pt] font-headline font-bold leading-none tracking-tighter text-gray-900 uppercase mb-4">
                  {product.model}
                </h1>
                <p className="text-[16pt] text-primary font-medium italic leading-tight max-w-[90%]">
                  {marketing.headline}
                </p>
              </div>

              {/* High-Level Specs Banner (Replacing Hero Image) */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                  <Cpu size={32} className="text-primary mb-3" />
                  <span className="text-[7pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Compute</span>
                  <span className="text-[10pt] font-bold text-gray-800 uppercase">{product.processor}</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                  <Database size={32} className="text-primary mb-3" />
                  <span className="text-[7pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Memory</span>
                  <span className="text-[10pt] font-bold text-gray-800 uppercase">{product.memory} RAM</span>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                  <Server size={32} className="text-primary mb-3" />
                  <span className="text-[7pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Storage</span>
                  <span className="text-[10pt] font-bold text-gray-800 uppercase">{product.hdd}</span>
                </div>
              </div>

              {/* Executive Summary Section */}
              <div className="mb-12">
                <h3 className="text-[10pt] font-bold uppercase tracking-[0.2em] text-primary border-l-4 border-primary pl-6 mb-6">Strategic Overview</h3>
                <div className="text-[12pt] leading-relaxed text-gray-600 justified-text bg-gray-50/50 p-8 rounded-3xl border border-gray-50">
                  {marketing.executiveSummary}
                </div>
              </div>

              {/* Key Capabilities List */}
              <div className="flex-1">
                <h3 className="text-[10pt] font-bold uppercase tracking-[0.2em] text-primary mb-8 flex items-center gap-2">
                  <Layers size={18} /> Enterprise Capabilities
                </h3>
                <div className="grid grid-cols-2 gap-x-16 gap-y-8">
                  {marketing.highlights.map((h, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={14} className="text-primary" />
                      </div>
                      <span className="text-[10.5pt] leading-relaxed font-medium text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer P1 */}
              <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                <p className="text-[8pt] font-bold uppercase tracking-widest text-gray-400 italic">DQT/BROCHURE/V2.0</p>
                <div className="flex gap-6 items-center">
                  <div className="h-4 w-px bg-gray-200"></div>
                  <p className="text-[8pt] font-bold uppercase text-gray-400">Section 1: Strategic Brief</p>
                </div>
              </div>
            </div>

            {/* PAGE 2: TECHNICAL ARCHITECTURE & ENTERPRISE VALUE */}
            <div className="quotation-page flex flex-col bg-white text-gray-900 border-none relative">
              {/* Header P2 */}
              <div className="flex justify-between items-center mb-12 opacity-60">
                <div className="text-[18pt] font-headline font-black text-gray-900 leading-none">hp</div>
                <p className="text-[9pt] font-bold uppercase tracking-widest text-primary">{product.model} | Engineering & Value Brief</p>
              </div>

              {/* Technical Overview (Large Text Block) */}
              <div className="mb-12">
                <h2 className="text-[20pt] font-headline font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Zap size={24} className="text-primary" /> Engineering Excellence
                </h2>
                <div className="text-[11pt] leading-relaxed text-gray-600 justified-text italic bg-gray-50 p-10 rounded-3xl border border-gray-100 border-l-[12px] border-l-primary">
                  {marketing.technicalOverview}
                </div>
              </div>

              {/* Technical Spec Matrix */}
              <div className="mb-12">
                <h3 className="text-[10pt] font-bold uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                  <Settings size={18} /> Hardware Architecture Matrix
                </h3>
                <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                   <div className="grid grid-cols-2 text-[10pt]">
                      <div className="p-6 border-b border-r border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Main Processor</span>
                        <span className="font-bold text-gray-800">{product.processor}</span>
                      </div>
                      <div className="p-6 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">System Memory</span>
                        <span className="font-bold text-gray-800">{product.memory} High-Performance RAM</span>
                      </div>
                      <div className="p-6 border-b border-r border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Primary Storage</span>
                        <span className="font-bold text-gray-800">{product.hdd} {product.hdd2 !== '-' ? `+ ${product.hdd2}` : ''}</span>
                      </div>
                      <div className="p-6 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Graphics Controller</span>
                        <span className="font-bold text-gray-800">{product.gfx}</span>
                      </div>
                      <div className="p-6 border-r border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Operating System</span>
                        <span className="font-bold text-gray-800">{product.os}</span>
                      </div>
                      <div className="p-6 hover:bg-gray-50/50 transition-colors">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-2 tracking-widest">Support Lifecycle</span>
                        <span className="font-bold text-gray-800">{product.warranty} OEM Support</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Use Cases Section */}
              <div className="mb-12">
                <h3 className="text-[10pt] font-bold uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                  <Award size={18} /> Market Application
                </h3>
                <div className="flex flex-wrap gap-3">
                  {marketing.useCases.map((u, i) => (
                    <span key={i} className="bg-gray-900 text-white text-[9pt] px-6 py-3 rounded-2xl font-bold uppercase tracking-widest">
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              {/* Business Value Pillars */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <ShieldCheck size={24} className="text-primary mb-4" />
                  <h4 className="text-[9pt] font-bold uppercase mb-3 text-gray-800 tracking-widest">Security</h4>
                  <p className="text-[8.5pt] leading-relaxed text-gray-500">{marketing.businessValue.security}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <Zap size={24} className="text-primary mb-4" />
                  <h4 className="text-[9pt] font-bold uppercase mb-3 text-gray-800 tracking-widest">Reliability</h4>
                  <p className="text-[8.5pt] leading-relaxed text-gray-500">{marketing.businessValue.reliability}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <Globe size={24} className="text-green-600 mb-4" />
                  <h4 className="text-[9pt] font-bold uppercase mb-3 text-gray-800 tracking-widest">Impact</h4>
                  <p className="text-[8.5pt] leading-relaxed text-gray-500">{marketing.businessValue.sustainability}</p>
                </div>
              </div>

              {/* Partner Footer Block */}
              <div className="mt-auto p-10 bg-gray-900 rounded-[2.5rem] flex items-center justify-between">
                 <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-1 bg-primary"></div>
                    <span className="text-[8pt] font-bold uppercase text-primary tracking-[0.3em]">Partner Trust Statement</span>
                  </div>
                  <p className="text-[11pt] leading-relaxed text-gray-300 italic font-medium max-w-[90%]">
                    {marketing.trustStatement}
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <p className="text-[10pt] font-bold text-white uppercase tracking-tighter">DEEQASA TECH</p>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <p className="text-[8pt] font-bold text-gray-500 uppercase tracking-widest">HP Connect Authorized</p>
                  </div>
                 </div>
                 <div className="ml-10 shrink-0 opacity-20">
                    <Info size={48} className="text-white" />
                 </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
