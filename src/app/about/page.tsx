'use client';

import { motion } from 'framer-motion';
import { CorporatePageLayout } from '@/components/layout/corporate-page-layout';
import { ShieldCheck, Zap, Globe, Cpu, Users, Award, Target, Landmark, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function AboutPage() {
  const stats = [
    { label: 'Infrastructure Nodes', value: '25,000+', icon: Cpu },
    { label: 'Security Protocols', value: 'Infinite', icon: ShieldCheck },
    { label: 'Global Compliance', value: '100%', icon: Globe },
    { label: 'OEM Partnership', value: 'Platinum', icon: Award },
  ];

  const values = [
    {
      title: "The Architecture Paradigm",
      description: "We don't just build infrastructure; we engineer digital resilience. Our philosophy centers on pure efficiency and unyielding security protocols.",
      icon: Target
    },
    {
      title: "Strategic Intelligence",
      description: "Harnessing the power of HP Enterprise solutions to deliver mission-critical reliability for the modern world's most demanding sectors.",
      icon: Zap
    },
    {
      title: "Institutional Trust",
      description: "Trusted by government agencies and academic institutions across the region for over a decade of operational excellence and transparency.",
      icon: Landmark
    }
  ];

  return (
    <CorporatePageLayout 
      title="Foundations of Trust" 
      subtitle="DEEQASA TECH is the mission-control partner for global institutional and enterprise infrastructure."
    >
      {/* Vision Section */}
      <section className="py-48 px-6">
        <div className="container-enterprise">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px w-12 bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[1em] text-primary">STRATEGIC VISION</span>
              </div>
              <div className="space-y-16">
                <h2 className="text-7xl md:text-9xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase whitespace-pre-line">
                  Engineering the{"\n"}
                  <span className="text-primary italic">Foundation</span>{"\n"}
                  of Sovereignty.
                </h2>
                <p className="text-2xl text-slate-400 font-bold italic leading-relaxed max-w-xl">
                  At DEEQASA TECH, we envision a world where the infrastructure is invisible but invincible. We provide the hardware, security, and intelligence that powers the future of civilization.
                </p>
                <div className="flex items-center gap-10 pt-10">
                   <div className="flex -space-x-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-16 w-16 rounded-full border-4 border-white bg-slate-100 overflow-hidden relative shadow-xl">
                           <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="Partner" fill className="object-cover grayscale" />
                        </div>
                      ))}
                   </div>
                   <div className="space-y-1">
                      <div className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Coalition</div>
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">HP Connect Accredited</div>
                   </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="bg-white border border-slate-100 p-12 rounded-[3.5rem] group hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)]"
                >
                  <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <stat.icon size={32} />
                  </div>
                  <div className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 group-hover:text-primary transition-colors">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="py-48 px-6 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-full opacity-[0.03] pointer-events-none grayscale">
           <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80" alt="Building" fill className="object-cover" />
        </div>
        
        <div className="container-enterprise relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-10">
            <div className="max-w-3xl space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[1em] text-primary">CORE PHILOSOPHY</span>
              </div>
              <h3 className="text-7xl md:text-9xl font-black text-slate-900 uppercase tracking-tighter leading-[0.85]">
                The <span className="text-slate-200">Collective</span>{"\n"}Intelligence Matrix.
              </h3>
            </div>
            <div className="text-right space-y-2 pb-4">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">REGIONAL HQ // SECTOR 14</p>
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">ESTABLISHED MMXVI</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 1 }}
                className="relative p-16 bg-white border border-slate-100 rounded-[4rem] overflow-hidden group hover:shadow-2xl transition-all duration-700 shadow-sm"
              >
                <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity text-primary">
                   <val.icon size={180} />
                </div>
                <div className="relative z-10 space-y-8">
                   <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-primary transition-colors leading-tight">{val.title}</h4>
                   <p className="text-xl text-slate-400 leading-relaxed font-bold italic">
                     {val.description}
                   </p>
                   <div className="h-px w-20 bg-slate-100 group-hover:w-full transition-all duration-1000" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-64 px-6 relative overflow-hidden">
        <div className="container-enterprise text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-16"
          >
            <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full border border-slate-100 bg-white shadow-xl">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Initialize Enterprise Protocol</span>
            </div>
            <h2 className="text-7xl md:text-[12rem] font-black text-slate-900 uppercase tracking-tighter leading-[0.75] max-w-7xl">
              Your <span className="text-slate-200">Infrastructure</span>{"\n"}Command Center.
            </h2>
            <button className="group relative h-24 px-20 rounded-3xl bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-xs overflow-hidden shadow-2xl hover:bg-primary transition-colors duration-500">
              <span className="relative z-10 flex items-center gap-4">
                Establish Direct Link <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>
      </section>
    </CorporatePageLayout>
  );
}
