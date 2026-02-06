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
  Layers,
  Server,
  Building2,
  Stethoscope,
  GraduationCap,
  Briefcase
} from 'lucide-react';

interface BrochurePreviewProps {
  products: Product[];
  marketingData: BrochureOutput;
}

const UseCaseIcon = ({ text }: { text: string }) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('medical') || lowerText.includes('health')) return <Stethoscope size={20} />;
  if (lowerText.includes('education') || lowerText.includes('university') || lowerText.includes('school')) return <GraduationCap size={20} />;
  if (lowerText.includes('corporate') || lowerText.includes('business')) return <Briefcase size={20} />;
  return <Building2 size={20} />;
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
            {/* PAGE 1: STRATEGIC SOLUTION BRIEF */}
            <div className="brochure-page bg-white text-gray-900 shadow-none border-none">
              {/* Premium HP Header */}
              <div className="flex justify-between items-center mb-12 border-b-[2pt] border-gray-100 pb-8">
                <div className="flex items-center gap-4">
                  <img src={HP_LOGO_URL} alt="HP" className="h-[22mm] w-auto" />
                  <div className="h-12 w-px bg-gray-200"></div>
                  <div className="text-[24pt] font-black text-gray-900 tracking-tighter leading-none">hp</div>
                </div>
                <div className="text-right">
                  <p className="text-[9pt] font-bold text-gray-900 uppercase tracking-[0.3em] mb-1">Strategic Computing Solutions</p>
                  <p className="text-[7.5pt] text-primary font-bold uppercase tracking-[0.2em]">Innovation that powers your business.</p>
                </div>
              </div>

              {/* Product Identity */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-[8pt] font-bold px-4 py-1 rounded-sm mb-6 uppercase tracking-widest">
                  <ShieldCheck size={12} /> Solution Intelligence
                </div>
                <h1 className="text-[40pt] font-black leading-none tracking-tight text-gray-900 uppercase mb-4">
                  {product.model}
                </h1>
                <div className="h-[2pt] w-24 bg-primary mb-6"></div>
                <p className="text-[17pt] text-gray-600 font-medium leading-snug max-w-[95%]">
                  {marketing.headline}
                </p>
              </div>

              {/* Core Architecture Matrix */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                  <Cpu size={32} className="text-primary mb-3" />
                  <span className="text-[7pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Compute</span>
                  <span className="text-[10pt] font-black text-gray-800 uppercase leading-tight">{product.processor}</span>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                  <Database size={32} className="text-primary mb-3" />
                  <span className="text-[7pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Memory</span>
                  <span className="text-[10pt] font-black text-gray-800 uppercase leading-tight">{product.memory} High-Speed</span>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                  <Server size={32} className="text-primary mb-3" />
                  <span className="text-[7pt] font-bold text-gray-400 uppercase tracking-widest mb-1">Architecture</span>
                  <span className="text-[10pt] font-black text-gray-800 uppercase leading-tight">{product.chassis}</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="mb-12">
                <h3 className="text-[10pt] font-black uppercase tracking-[0.25em] text-gray-400 mb-6">Executive Summary</h3>
                <div className="text-[12pt] leading-[1.7] text-gray-700 justified-text p-8 bg-gray-50 rounded-2xl border border-gray-100 italic">
                  {marketing.executiveSummary}
                </div>
              </div>

              {/* Highlights */}
              <div className="flex-1">
                <h3 className="text-[10pt] font-black uppercase tracking-[0.25em] text-gray-400 mb-8">Key Capabilities</h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                  {marketing.highlights.map((h, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={14} className="text-primary" />
                      </div>
                      <span className="text-[10.5pt] leading-tight font-bold text-gray-700">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Page 1 */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center opacity-40">
                <p className="text-[8pt] font-bold uppercase tracking-[0.3em]">HP Enterprise Series</p>
                <p className="text-[8pt] font-bold uppercase">Strategic Brief • 01</p>
              </div>
            </div>

            {/* PAGE 2: TECHNICAL SPECIFICATIONS & USE CASES */}
            <div className="brochure-page bg-white text-gray-900 shadow-none border-none">
              {/* Header P2 */}
              <div className="flex justify-between items-center mb-10 opacity-70 border-b border-gray-100 pb-6">
                <img src={HP_LOGO_URL} alt="HP" className="h-10 w-auto" />
                <p className="text-[9pt] font-bold uppercase tracking-[0.4em] text-primary">{product.model} | Deployment Analysis</p>
              </div>

              {/* Detailed Technical Narrative */}
              <div className="mb-10">
                <h2 className="text-[20pt] font-bold text-gray-900 mb-6 flex items-center gap-3 tracking-tighter">
                  <Zap size={24} className="text-primary" /> System Architecture
                </h2>
                <div className="text-[11pt] leading-[1.8] text-gray-600 justified-text bg-gray-900 text-gray-200 p-8 rounded-2xl shadow-lg border-l-[8pt] border-primary">
                  {marketing.technicalOverview}
                </div>
              </div>

              {/* Specification Matrix */}
              <div className="mb-10">
                <h3 className="text-[9pt] font-black uppercase tracking-[0.25em] text-gray-400 mb-6">Technical Matrix</h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                   <div className="grid grid-cols-2 text-[10pt]">
                      <div className="p-5 border-b border-r border-gray-50 bg-gray-50/30">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1 tracking-widest">Processor</span>
                        <span className="font-bold text-gray-800">{product.processor}</span>
                      </div>
                      <div className="p-5 border-b border-gray-50">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1 tracking-widest">Memory</span>
                        <span className="font-bold text-gray-800">{product.memory}</span>
                      </div>
                      <div className="p-5 border-b border-r border-gray-50">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1 tracking-widest">Primary Storage</span>
                        <span className="font-bold text-gray-800">{product.hdd}</span>
                      </div>
                      <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1 tracking-widest">Graphics Unit</span>
                        <span className="font-bold text-gray-800">{product.gfx}</span>
                      </div>
                      <div className="p-5 border-r border-gray-50 bg-gray-50/30">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1 tracking-widest">OS & Platform</span>
                        <span className="font-bold text-gray-800">{product.os}</span>
                      </div>
                      <div className="p-5">
                        <span className="text-[7pt] font-bold uppercase text-gray-400 block mb-1 tracking-widest">Warranty Support</span>
                        <span className="font-bold text-gray-800">{product.warranty}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-10">
                <h3 className="text-[9pt] font-black uppercase tracking-[0.25em] text-gray-400 mb-6">Strategic Deployment</h3>
                <div className="grid grid-cols-2 gap-4">
                  {marketing.useCases.map((useCase, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <div className="text-primary bg-white p-2 rounded-full shadow-sm shrink-0">
                        <UseCaseIcon text={useCase} />
                      </div>
                      <span className="text-[9.5pt] font-bold text-gray-700 leading-tight">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillars */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                  <ShieldCheck size={24} className="text-primary mb-2" />
                  <h4 className="text-[8pt] font-black uppercase mb-1 tracking-widest">Security</h4>
                  <p className="text-[7.5pt] leading-relaxed text-gray-500">{marketing.businessValue.security}</p>
                </div>
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                  <Zap size={24} className="text-primary mb-2" />
                  <h4 className="text-[8pt] font-black uppercase mb-1 tracking-widest">Power</h4>
                  <p className="text-[7.5pt] leading-relaxed text-gray-500">{marketing.businessValue.reliability}</p>
                </div>
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                  <Globe size={24} className="text-emerald-600 mb-2" />
                  <h4 className="text-[8pt] font-black uppercase mb-1 tracking-widest">Green</h4>
                  <p className="text-[7.5pt] leading-relaxed text-gray-500">{marketing.businessValue.sustainability}</p>
                </div>
              </div>

              {/* Final Statement */}
              <div className="mt-auto p-10 bg-gray-900 rounded-3xl border-l-[10px] border-primary flex items-center justify-between">
                 <div className="flex-1">
                  <p className="text-[12pt] leading-[1.6] text-white italic font-medium max-w-[95%] mb-4">
                    {marketing.trustStatement}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-[11pt] font-black text-white uppercase tracking-tighter">HP Global Enterprise</div>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <p className="text-[8.5pt] font-bold text-gray-500 uppercase tracking-widest">Innovation Powered by HP</p>
                  </div>
                 </div>
                 <div className="ml-10 shrink-0 opacity-20">
                    <Award size={56} className="text-white" />
                 </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
