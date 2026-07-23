'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, Award } from 'lucide-react';

const clientsTrack1 = [
  "IT By Design",
  "TAC Security",
  "Greystar",
  "Jubilee",
  "IIT Ropar",
  "SEOYODHA",
  "Vardhman Industries",
  "CenturyPly",
  "QE Global",
  "Tynor",
  "Tricon IT Solutions",
  "Euclidee Software Solutions",
  "MabZone"
];

const clientsTrack2 = [
  "Sanako",
  "Compac",
  "CGC University",
  "SRPL",
  "Punjab Police",
  "Janta Voice",
  "IISER Mohali",
  "INST Mohali",
  "Bilco Antifire Engineering",
  "Growing Bricks Realty",
  "Nadar Properties",
  "PharmaLife",
  "HP Connect Enterprise"
];

export function ClientLogoMarquee() {
  return (
    <section className="py-20 bg-[#030712] text-white relative overflow-hidden border-y border-slate-900 font-[Outfit]">
      
      {/* Background Radial Spotlights */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-50"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 75%)'
        }}
      />

      <div className="container-enterprise relative z-10 text-center space-y-4 px-6 mb-12">
        <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-400 block flex items-center justify-center gap-2">
          <Building2 size={14} /> TRUSTED BY 26+ ENTERPRISES & GOVERNMENT ORGANIZATIONS —
        </span>
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
          Powering India's Leading Enterprises, Universities & Public Sector
        </h2>
      </div>

      {/* Marquee Track 1 (Scrolling Left) */}
      <div className="relative w-full overflow-hidden mb-6 flex">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-20 pointer-events-none" />
        
        <div className="flex gap-6 animate-marquee whitespace-nowrap py-2 shrink-0">
          {[...clientsTrack1, ...clientsTrack1, ...clientsTrack1].map((client, idx) => (
            <div 
              key={idx} 
              className="bg-slate-900/80 border border-slate-800/90 hover:border-blue-400/60 rounded-2xl px-6 py-3.5 flex items-center gap-3 font-mono font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-all text-xs tracking-wider shadow-lg shrink-0 backdrop-blur-xl group cursor-default"
            >
              <span className="h-2 w-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
              <span>{client}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Track 2 (Scrolling Right) */}
      <div className="relative w-full overflow-hidden flex">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-20 pointer-events-none" />
        
        <div className="flex gap-6 animate-marquee-reverse whitespace-nowrap py-2 shrink-0">
          {[...clientsTrack2, ...clientsTrack2, ...clientsTrack2].map((client, idx) => (
            <div 
              key={idx} 
              className="bg-slate-900/80 border border-slate-800/90 hover:border-emerald-400/60 rounded-2xl px-6 py-3.5 flex items-center gap-3 font-mono font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-all text-xs tracking-wider shadow-lg shrink-0 backdrop-blur-xl group cursor-default"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
              <span>{client}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
