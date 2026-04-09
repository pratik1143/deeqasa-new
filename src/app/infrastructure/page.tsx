'use client';

import { motion } from "framer-motion";
import { Server, Shield, Network, Cpu, Database, Cloud, ArrowRight } from "lucide-react";
import { CorporatePageLayout } from "@/components/layout/corporate-page-layout";
import Image from "next/image";

const layers = [
  {
    title: "Edge Resilience",
    icon: Network,
    description: "Highly distributed CDN and edge computing points ensuring sub-10ms latency for global applications.",
    specs: ["Multi-CDN Steering", "Edge Compute Units", "Secure Access Service Edge"]
  },
  {
    title: "Core Data Centers",
    icon: Database,
    description: "Tier III and IV facilities with N+1 redundancy and hardware-level root-of-trust encryption.",
    specs: ["Liquid Cooling Systems", "High-Density Racks", "Biometric Multi-Layer Security"]
  },
  {
    title: "Sovereign Cloud",
    icon: Cloud,
    description: "Multi-region cloud infrastructure designed for strict data sovereignty and local compliance.",
    specs: ["Local Residency", "Private Networking", "Compliance Frameworks"]
  }
];

export default function InfrastructurePage() {
  return (
    <CorporatePageLayout 
      title="Global Backbone" 
      subtitle="Comprehensive technical overview of the infrastructure powering the next generation of enterprise digital solutions."
    >
      <div className="container-enterprise pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center mb-40">
           <div className="lg:col-span-12 relative h-[600px] rounded-[4rem] overflow-hidden group shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1558444479-c8f027d6a5ad?w=1600&q=80" 
                alt="Technical Infrastructure" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-20 left-20 right-20 flex justify-between items-end">
                 <div className="space-y-4">
                    <span className="px-6 py-2 bg-primary rounded-full text-[10px] font-black uppercase tracking-widest text-white">Live Status</span>
                    <h3 className="text-6xl font-black text-white uppercase tracking-tighter">99.99% Guaranteed</h3>
                 </div>
                 <div className="flex gap-10">
                    {[
                      { val: "24", unit: "Regions" },
                      { val: "100+", unit: "Nodes" },
                      { val: "10PB", unit: "Storage" }
                    ].map((stat, i) => (
                      <div key={i} className="text-right">
                         <div className="text-4xl font-black text-white">{stat.val}</div>
                         <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">{stat.unit}</div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {layers.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 1 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-100 p-16 rounded-[3.5rem] space-y-12 group hover:border-primary/40 hover:shadow-2xl transition-all duration-700"
            >
               <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                  <layer.icon size={36} />
               </div>
               
               <div className="space-y-6">
                  <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 group-hover:text-primary transition-colors">{layer.title}</h3>
                  <p className="text-lg text-slate-400 font-bold italic leading-relaxed">{layer.description}</p>
               </div>

               <div className="space-y-4 pt-8">
                  {layer.specs.map((spec, j) => (
                    <div key={j} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-900">
                       <ArrowRight size={14} className="text-primary" />
                       {spec}
                    </div>
                  ))}
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CorporatePageLayout>
  );
}
