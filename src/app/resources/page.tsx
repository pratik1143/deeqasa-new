'use client';

import { motion } from "framer-motion";
import { FileText, Download, Shield, Layout, Settings, Database, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CorporatePageLayout } from "@/components/layout/corporate-page-layout";

const resources = [
  { title: "Enterprise Cloud Strategy 2025", type: "Whitepaper", icon: Layout },
  { title: "HP Z-Series Performance Guide", type: "Technical Brochure", icon: Settings },
  { title: "Zero Trust Deployment Matrix", type: "Security Brief", icon: Shield },
  { title: "Data Center Modernization Catalog", type: "Product Catalog", icon: Database },
  { title: "Sustainable IT Infrastructure", type: "Industry Report", icon: FileText },
];

export default function ResourcesPage() {
  return (
    <CorporatePageLayout 
      title="Knowledge Repository" 
      subtitle="Deep-dive technical documentation, solution frameworks, and validated architectural blueprints for the global enterprise."
    >
      <div className="container-enterprise pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-40">
          {resources.map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border border-slate-100 p-12 group rounded-[3.5rem] shadow-sm hover:border-primary/40 transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 relative z-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
                    <div className="h-24 w-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                      <res.icon size={40} />
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">{res.type}</span>
                      <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-tight group-hover:text-primary transition-colors">{res.title}</h3>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-20 w-20 rounded-2xl bg-slate-50 text-slate-300 border border-slate-100 hover:text-white hover:bg-slate-900 transition-all group/btn">
                    <Download size={32} className="group-hover/btn:translate-y-1 transition-transform" />
                  </Button>
                </div>
                
                {/* Background Icon Watermark */}
                <div className="absolute -bottom-16 -right-16 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-1000 text-primary">
                  <res.icon size={250} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="p-16 md:p-32 rounded-[5rem] border border-slate-100 bg-white/50 backdrop-blur-xl text-center relative overflow-hidden group shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]"
        >
          <div className="relative z-10 space-y-12">
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-slate-100 bg-white">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bespoke Technical Support</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-[0.85]">
              Request Custom <br /> 
              <span className="text-slate-200">Documentation</span>
            </h2>
            <p className="text-2xl text-slate-400 max-w-2xl mx-auto font-bold italic leading-relaxed">
              Looking for specific tender documents or global RFP responses? Our technical team provides tailored documentation modules.
            </p>
            <Button size="lg" className="h-24 px-20 bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-primary transition-all rounded-3xl group/req shadow-2xl">
              Initiate Request <ArrowRight size={20} className="ml-4 group-hover/req:translate-x-3 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </CorporatePageLayout>
  );
}