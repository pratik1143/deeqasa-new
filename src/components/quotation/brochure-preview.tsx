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
  Search,
  Box
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

        // Image Fail-safe Logic
        const hasVerifiedImages = false; // Simulated verification state

        return (
          <React.Fragment key={product.id}>
            {/* PAGE 1: PRODUCT OVERVIEW */}
            <div className="quotation-page flex flex-col bg-white text-gray-900 border-none relative">
              {/* HP Partner Header */}
              <div className="flex justify-between items-start mb-12 border-b-2 border-primary pb-6">
                <div className="flex flex-col">
                  <img src="/hp-logo.png" alt="HP" className="h-[18mm] w-auto object-contain bg-white" />
                  <span className="text-[7pt] font-bold text-gray-400 tracking-widest uppercase mt-2">Official Connect Partner</span>
                </div>
                <div className="text-right">
                  <h2 className="text-[12pt] font-headline font-bold text-gray-900 tracking-tighter">DEEQASA TECH</h2>
                  <p className="text-[7pt] text-gray-400 uppercase tracking-widest font-bold">IT Infrastructure Specialist</p>
                </div>
              </div>

              {/* Title & Headline */}
              <div className="mb-10">
                <h1 className="text-[32pt] font-headline font-bold leading-none tracking-tighter text-gray-900 uppercase">
                  {product.model}
                </h1>
                <p className="text-[14pt] text-primary font-medium mt-3 italic leading-tight">
                  {marketing.headline}
                </p>
              </div>

              {/* HERO IMAGE (Page 1) */}
              <div className="w-full h-[85mm] bg-gray-50 rounded-3xl mb-10 flex items-center justify-center relative overflow-hidden border border-gray-100">
                {hasVerifiedImages ? (
                  <img 
                    src={`https://picsum.photos/seed/${product.id}-hero/1200/800`} 
                    alt={product.model}
                    className="w-full h-full object-cover"
                    data-ai-hint={marketing.imageSearchQueries[0]}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 h-full w-full">
                    <Box size={80} className="text-gray-200 mb-4" />
                    <p className="text-[10pt] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.model}</p>
                    <p className="text-[7pt] italic text-gray-400">Official product image will be provided upon confirmation.</p>
                  </div>
                )}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-primary/10 flex items-center gap-2">
                    <Cpu size={14} className="text-primary" />
                    <span className="text-[8pt] font-bold uppercase">{product.processor}</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-primary/10 flex items-center gap-2">
                    <Database size={14} className="text-primary" />
                    <span className="text-[8pt] font-bold uppercase">{product.memory} RAM</span>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="mb-10">
                <h3 className="text-[10pt] font-bold uppercase tracking-[0.2em] text-primary border-l-4 border-primary pl-4 mb-4">Strategic Overview</h3>
                <p className="text-[11pt] leading-relaxed text-gray-600 justified-text">
                  {marketing.executiveSummary}
                </p>
              </div>

              {/* Highlights List */}
              <div className="flex-1">
                <h3 className="text-[10pt] font-bold uppercase tracking-[0.2em] text-primary mb-6">Key Capabilities</h3>
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

              {/* Footer P1 */}
              <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center opacity-40">
                <p className="text-[7pt] font-bold uppercase tracking-widest">Section 1: Product Architecture</p>
                <div className="flex gap-4">
                  <img src="/hp-logo.png" alt="HP" className="h-[4mm] grayscale" />
                  <p className="text-[7pt] font-bold uppercase">Ref: DQT/BRCH/{product.id}</p>
                </div>
              </div>
            </div>

            {/* PAGE 2: TECHNICAL & BUSINESS VALUE */}
            <div className="quotation-page flex flex-col bg-white text-gray-900 border-none relative">
              {/* Header P2 */}
              <div className="flex justify-between items-center mb-10 opacity-60">
                <img src="/hp-logo.png" alt="HP" className="h-[10mm] w-auto grayscale" />
                <p className="text-[8pt] font-bold uppercase tracking-widest text-primary">{product.model} | Engineering Brief</p>
              </div>

              {/* Technical Detail Section */}
              <div className="mb-10">
                <h2 className="text-[18pt] font-headline font-bold text-gray-900 mb-4">Performance & Reliability</h2>
                <p className="text-[10pt] leading-relaxed text-gray-600 justified-text italic bg-gray-50 p-6 rounded-2xl">
                  {marketing.technicalOverview}
                </p>
              </div>

              {/* Supporting Images (Page 2) */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="h-[40mm] bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                  {hasVerifiedImages ? (
                    <img 
                      src={`https://picsum.photos/seed/${product.id}-side/800/600`} 
                      alt="Side View"
                      className="w-full h-full object-cover"
                      data-ai-hint={marketing.imageSearchQueries[1]}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Search size={24} className="text-gray-200 mb-2" />
                      <p className="text-[6pt] text-gray-300 uppercase font-bold tracking-widest">Official Angle View</p>
                    </div>
                  )}
                </div>
                <div className="h-[40mm] bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                   {hasVerifiedImages ? (
                    <img 
                      src={`https://picsum.photos/seed/${product.id}-rear/800/600`} 
                      alt="Rear View"
                      className="w-full h-full object-cover"
                      data-ai-hint={marketing.imageSearchQueries[2]}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Search size={24} className="text-gray-200 mb-2" />
                      <p className="text-[6pt] text-gray-300 uppercase font-bold tracking-widest">Official Rear View</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Spec Table */}
              <div className="mb-10">
                <h3 className="text-[9pt] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Settings size={14} /> Full Hardware Configuration
                </h3>
                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                   <div className="grid grid-cols-2 text-[9pt]">
                      <div className="p-4 border-b border-r border-gray-50"><span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1">Processor</span>{product.processor}</div>
                      <div className="p-4 border-b border-gray-50"><span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1">Memory</span>{product.memory}</div>
                      <div className="p-4 border-b border-r border-gray-50"><span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1">Storage</span>{product.hdd} {product.hdd2 !== '-' ? `+ ${product.hdd2}` : ''}</div>
                      <div className="p-4 border-b border-gray-50"><span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1">Graphics</span>{product.gfx}</div>
                      <div className="p-4 border-r border-gray-50"><span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1">OS</span>{product.os}</div>
                      <div className="p-4"><span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1">Warranty</span>{product.warranty}</div>
                   </div>
                </div>
              </div>

              {/* Value Propositions */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-gray-900 text-white p-5 rounded-2xl">
                  <ShieldCheck size={20} className="text-primary mb-3" />
                  <h4 className="text-[8pt] font-bold uppercase mb-2">Security</h4>
                  <p className="text-[7pt] leading-relaxed opacity-60">{marketing.businessValue.security}</p>
                </div>
                <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl">
                  <Zap size={20} className="text-primary mb-3" />
                  <h4 className="text-[8pt] font-bold uppercase mb-2">Power</h4>
                  <p className="text-[7pt] leading-relaxed text-gray-600">{marketing.businessValue.reliability}</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/10 p-5 rounded-2xl">
                  <Globe size={20} className="text-green-600 mb-3" />
                  <h4 className="text-[8pt] font-bold uppercase mb-2 text-green-700">Green</h4>
                  <p className="text-[7pt] leading-relaxed text-gray-600">{marketing.businessValue.sustainability}</p>
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-10">
                <h3 className="text-[9pt] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Award size={14} /> Strategic Applications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {marketing.useCases.map((u, i) => (
                    <span key={i} className="bg-gray-100 text-[8pt] px-4 py-2 rounded-lg font-bold text-gray-500 uppercase">
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              {/* Partner Footer */}
              <div className="mt-auto p-6 bg-gray-50 rounded-2xl border-l-8 border-primary flex items-center justify-between">
                 <div className="flex-1">
                  <p className="text-[9.5pt] leading-relaxed text-gray-700 italic font-medium">
                    {marketing.trustStatement}
                  </p>
                  <p className="mt-3 text-[8pt] font-bold text-primary uppercase tracking-widest">DEEQASA TECH | HP CONNECT PARTNER</p>
                 </div>
                 <div className="ml-6 shrink-0 flex flex-col items-center gap-2 opacity-20">
                    <Info size={24} />
                    <span className="text-[6pt] font-bold uppercase">Official Brief</span>
                 </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
