'use client';

import React from 'react';
import { type Product } from '@/lib/quotation-schemas';
import { type BrochureOutput } from '@/ai/flows/ai-brochure-generation';
import { ShieldCheck, Cpu, Database, Monitor, CheckCircle2, Globe, Zap, Settings, ShieldAlert, Award } from 'lucide-react';

interface BrochurePreviewProps {
  products: Product[];
  marketingData: BrochureOutput;
  companyName: string;
}

export function BrochurePreview({ products, marketingData, companyName }: BrochurePreviewProps) {
  return (
    <div id="brochure-export-root" className="w-full flex flex-col items-center">
      {products.map((product) => {
        const marketing = marketingData.brochureItems.find(m => m.sku === product.id);
        if (!marketing) return null;

        // Simulate model-based image search seed
        const imageSeed = product.model.replace(/\s+/g, '-').toLowerCase();

        return (
          <React.Fragment key={product.id}>
            {/* PAGE 1: PRODUCT OVERVIEW */}
            <div className="quotation-page flex flex-col bg-white text-gray-900 overflow-hidden relative border-none">
              {/* Header */}
              <div className="flex justify-between items-center mb-10 border-b-2 border-primary pb-6">
                <img src="/hp-logo.png" alt="HP" className="h-[20mm] w-auto bg-white" />
                <div className="text-right">
                  <h2 className="text-[14pt] font-headline font-bold text-primary tracking-tighter">DEEQASA TECH</h2>
                  <p className="text-[7pt] text-gray-400 uppercase tracking-widest font-bold">Official HP Connect Partner</p>
                </div>
              </div>

              {/* Main Visual & Title */}
              <div className="mb-10">
                <h1 className="text-[36pt] font-headline font-bold leading-none tracking-tighter text-gray-900 uppercase">
                  {product.model}
                </h1>
                <p className="text-[16pt] text-primary font-medium mt-3 italic">
                  {marketing.headline}
                </p>
              </div>

              {/* Hero Image Block */}
              <div className="w-full h-[90mm] bg-gray-50 rounded-3xl mb-10 flex items-center justify-center relative overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <img 
                  src={`https://picsum.photos/seed/${imageSeed}/1200/800`} 
                  alt={product.model}
                  className="w-full h-full object-cover"
                  data-ai-hint="hp laptop enterprise"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-primary/10 flex items-center gap-2">
                    <Cpu size={14} className="text-primary" />
                    <span className="text-[8pt] font-bold uppercase">{product.processor}</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-primary/10 flex items-center gap-2">
                    <Database size={14} className="text-primary" />
                    <span className="text-[8pt] font-bold uppercase">{product.memory} RAM</span>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="mb-10">
                <h3 className="text-[11pt] font-bold uppercase tracking-[0.2em] text-primary border-l-4 border-primary pl-4 mb-4">Executive Summary</h3>
                <p className="text-[11pt] leading-relaxed text-gray-600 justified-text">
                  {marketing.executiveSummary}
                </p>
              </div>

              {/* Highlights List */}
              <div className="flex-1">
                <h3 className="text-[11pt] font-bold uppercase tracking-[0.2em] text-primary mb-6">Key Capabilities</h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  {marketing.highlights.map((h, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={12} className="text-primary" />
                      </div>
                      <span className="text-[9.5pt] leading-snug font-medium text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Page 1 */}
              <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center opacity-40">
                <p className="text-[7pt] font-bold uppercase tracking-widest">Page 1: Strategic Overview</p>
                <p className="text-[7pt] italic">Smart. Secure. Sustainable. IT Solutions.</p>
              </div>
            </div>

            {/* PAGE 2: TECHNICAL & BUSINESS VALUE */}
            <div className="quotation-page flex flex-col bg-white text-gray-900 overflow-hidden relative border-none">
              {/* Header Page 2 */}
              <div className="flex justify-between items-center mb-10 opacity-60">
                <img src="/hp-logo.png" alt="HP" className="h-[12mm] w-auto grayscale" />
                <p className="text-[8pt] font-bold uppercase tracking-widest text-primary">{product.model} | Technical Brief</p>
              </div>

              {/* Technical Overview Section */}
              <div className="mb-12">
                <h2 className="text-[20pt] font-headline font-bold text-gray-900 mb-4">Technical Architecture</h2>
                <p className="text-[10pt] leading-relaxed text-gray-600 justified-text italic">
                  {marketing.technicalOverview}
                </p>
              </div>

              {/* Configuration Table */}
              <div className="mb-12">
                <h3 className="text-[10pt] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Settings size={16} /> Detailed Configuration
                </h3>
                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
                   <div className="grid grid-cols-2">
                      <div className="p-4 border-b border-r border-gray-100"><span className="text-[8pt] font-bold uppercase text-gray-400 block mb-1">Processor</span><span className="text-[10pt] font-medium">{product.processor}</span></div>
                      <div className="p-4 border-b border-gray-100"><span className="text-[8pt] font-bold uppercase text-gray-400 block mb-1">Memory</span><span className="text-[10pt] font-medium">{product.memory}</span></div>
                      <div className="p-4 border-b border-r border-gray-100"><span className="text-[8pt] font-bold uppercase text-gray-400 block mb-1">Storage</span><span className="text-[10pt] font-medium">{product.hdd} {product.hdd2 !== '-' ? `+ ${product.hdd2}` : ''}</span></div>
                      <div className="p-4 border-b border-gray-100"><span className="text-[8pt] font-bold uppercase text-gray-400 block mb-1">Graphics</span><span className="text-[10pt] font-medium">{product.gfx}</span></div>
                      <div className="p-4 border-r border-gray-100"><span className="text-[8pt] font-bold uppercase text-gray-400 block mb-1">Operating System</span><span className="text-[10pt] font-medium">{product.os}</span></div>
                      <div className="p-4"><span className="text-[8pt] font-bold uppercase text-gray-400 block mb-1">Warranty</span><span className="text-[10pt] font-medium">{product.warranty}</span></div>
                   </div>
                </div>
              </div>

              {/* Business Value Cards */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-900 text-white p-6 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <ShieldCheck size={24} className="text-primary mb-3" />
                  <h4 className="text-[9pt] font-bold uppercase tracking-widest mb-2">Security</h4>
                  <p className="text-[7.5pt] leading-relaxed opacity-70">{marketing.businessValue.security}</p>
                </div>
                <div className="bg-primary/5 p-6 rounded-3xl relative overflow-hidden group border border-primary/10">
                  <Zap size={24} className="text-primary mb-3" />
                  <h4 className="text-[9pt] font-bold uppercase tracking-widest mb-2">Performance</h4>
                  <p className="text-[7.5pt] leading-relaxed text-gray-600">{marketing.businessValue.reliability}</p>
                </div>
                <div className="bg-green-500/5 p-6 rounded-3xl relative overflow-hidden group border border-green-500/10">
                  <Globe size={24} className="text-green-500 mb-3" />
                  <h4 className="text-[9pt] font-bold uppercase tracking-widest mb-2 text-green-700">Eco-Impact</h4>
                  <p className="text-[7.5pt] leading-relaxed text-gray-600">{marketing.businessValue.sustainability}</p>
                </div>
              </div>

              {/* Vertical Use Cases */}
              <div className="mb-12">
                <h3 className="text-[10pt] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Award size={16} /> Enterprise Use Cases
                </h3>
                <div className="flex flex-wrap gap-2">
                  {marketing.useCases.map((u, i) => (
                    <span key={i} className="bg-gray-100 text-[8pt] px-4 py-2 rounded-full font-bold text-gray-600 uppercase tracking-tighter">
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              {/* Final Trust Message */}
              <div className="mt-auto p-6 bg-gray-50 rounded-2xl border-l-8 border-primary">
                 <p className="text-[10pt] leading-relaxed text-gray-700 italic font-medium">
                  {marketing.trustStatement}
                 </p>
                 <div className="mt-4 flex items-center justify-between">
                    <p className="text-[8pt] font-bold text-primary uppercase tracking-widest">DEEQASA TECH | HP CONNECT PARTNER</p>
                    <div className="flex gap-4">
                        <ShieldAlert size={16} className="text-gray-300" />
                        <Award size={16} className="text-gray-300" />
                    </div>
                 </div>
              </div>

              {/* Footer Page 2 */}
              <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center opacity-40">
                <p className="text-[7pt] font-bold uppercase tracking-widest">Page 2: Technical Specifications</p>
                <p className="text-[7pt] font-bold uppercase">Ref: DQT/BRCH/{product.id}</p>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
