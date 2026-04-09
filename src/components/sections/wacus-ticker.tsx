"use client";

import { motion } from "framer-motion";

export function WacusTicker() {
  const partners = [
    "HP Enterprise",
    "Microsoft",
    "Cisco",
    "AWS",
    "Dell Technologies",
    "VMware",
    "SAP",
    "Intel",
  ];
  const repeatedPartners = [...partners, ...partners];

  return (
    <div className="w-full bg-slate-950 overflow-hidden py-10 border-y border-white/5 rotate-[-1deg] scale-[1.02] my-32 shadow-2xl relative z-20">
      <div className="flex w-max animate-marquee-infinite">
        {repeatedPartners.map((partner, index) => (
          <div key={index} className="flex items-center mx-8 whitespace-nowrap">
            <span 
              className={`text-5xl md:text-7xl font-black uppercase tracking-tighter font-[Outfit] ${index % 2 === 0 ? 'text-white' : 'text-transparent text-stroke'}`}
              style={index % 2 !== 0 ? { WebkitTextStroke: "1px rgba(255,255,255,0.3)" } : {}}
            >
              {partner}
            </span>
            <div className="mx-12 h-2 w-2 rounded-full bg-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}
