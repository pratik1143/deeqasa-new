'use client';

import React from 'react';
import { type Product } from '@/lib/quotation-schemas';
import { type BrochureOutput } from '@/ai/flows/ai-brochure-generation';
import { ShieldCheck, Cpu, Database, Monitor, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrochurePreviewProps {
  products: Product[];
  marketingData: BrochureOutput;
  companyName: string;
}

export function BrochurePreview({ products, marketingData, companyName }: BrochurePreviewProps) {
  return (
    <div id="brochure-export-root" className="w-full flex flex-col items-center">
      {products.map((product, index) => {
        const marketing = marketingData.brochureItems.find(m => m.sku === product.id);
        if (!marketing) return null;

        return (
          <div key={product.id} className="quotation-page flex flex-col bg-white text-gray-900 overflow-hidden relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b-2 border-primary pb-6">
              <img src="/hp-logo.png" alt="HP" className="h-[25mm] w-auto bg-white" />
              <div className="text-right">
                <h2 className="text-[18pt] font-headline font-bold text-primary tracking-tighter">DEEQASA TECH</h2>
                <p className="text-[9pt] text-muted-foreground uppercase tracking-widest">Authorized HP Enterprise Partner</p>
              </div>
            </div>

            {/* Product Title & Hero Area */}
            <div className="flex-1 flex flex-col">
              <div className="mb-10">
                <h1 className="text-[32pt] font-headline font-bold leading-tight tracking-tighter text-gray-900 uppercase">
                  {product.model}
                </h1>
                <p className="text-[14pt] text-primary font-medium mt-2 italic">
                  {marketing.headline}
                </p>
              </div>

              {/* Product Visual Mockup */}
              <div className="w-full h-[80mm] bg-gray-50 rounded-2xl mb-10 flex items-center justify-center relative overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <Monitor className="w-32 h-32 text-gray-200" />
                <div className="absolute bottom-6 left-6 flex gap-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <Cpu size={16} className="text-primary" />
                    <span className="text-[9pt] font-bold">{product.processor}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <Database size={16} className="text-primary" />
                    <span className="text-[9pt] font-bold">{product.memory} / {product.hdd}</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-12 flex-1">
                {/* Highlights */}
                <div className="space-y-6">
                  <h3 className="text-[11pt] font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2">Key Highlights</h3>
                  <ul className="space-y-4">
                    {marketing.highlights.map((h, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-[10.5pt] leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specs & Use Cases */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-[11pt] font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-2">Ideal Use Cases</h3>
                    <div className="flex flex-wrap gap-2">
                      {marketing.useCases.map((u, i) => (
                        <span key={i} className="bg-gray-100 text-[9pt] px-3 py-1.5 rounded-lg font-bold text-gray-600 uppercase">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-900 text-white p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <ShieldCheck size={28} className="text-primary mb-3" />
                    <h4 className="text-[10pt] font-bold uppercase tracking-widest mb-2">HP Wolf Security</h4>
                    <p className="text-[9pt] leading-relaxed opacity-80">{marketing.trustStatement}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[8pt] font-bold uppercase text-gray-400">Prepared for: {companyName}</p>
                <p className="text-[7pt] text-gray-300 italic">Smart. Secure. Sustainable. IT Infrastructure.</p>
              </div>
              <div className="text-right">
                <p className="text-[8pt] font-bold uppercase text-primary tracking-widest">Page {index + 1} of {products.length}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
