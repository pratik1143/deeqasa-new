'use client';

import { motion } from "framer-motion";
import { Users, Rocket, Heart, Globe, ArrowRight, Briefcase } from "lucide-react";
import { CorporatePageLayout } from "@/components/layout/corporate-page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const jobs = [
  { title: "Senior Cloud Architect", department: "Infrastructure", location: "Remote / Bengaluru", type: "Full-Time" },
  { title: "Cybersecurity Lead", department: "Security Operations", location: "Bengaluru", type: "Full-Time" },
  { title: "AI Research Engineer", department: "Intelligence Lab", location: "Remote", type: "Contract" },
  { title: "Enterprise Account Manager", department: "Sales", location: "Mumbai", type: "Full-Time" },
];

export default function CareersPage() {
  return (
    <CorporatePageLayout 
      title="Join The Mission" 
      subtitle="Architecting the future of global enterprise infrastructure. Your next big leap starts here."
    >
      <div className="container-enterprise pb-40">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {[
            { icon: Heart, title: "Culture of Trust", desc: "We build on transparency and mutual respect in a high-performance environment." },
            { icon: Rocket, title: "Rapid Growth", desc: "Scale your career at the speed of cloud transformation with global projects." },
            { icon: Globe, title: "Global Impact", desc: "Work on infrastructure that powers mission-critical services worldwide." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-6 group hover:border-primary/40 transition-all duration-500"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{item.title}</h3>
              <p className="text-slate-400 font-bold italic leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="space-y-12">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900">Current Openings</h2>
            <div className="h-px flex-1 bg-slate-100" />
            <div className="px-6 py-2 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {jobs.length} Positions Available
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer bg-white border border-slate-100 p-8 rounded-[2rem] hover:border-primary/40 hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-8"
              >
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{job.department}</span>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{job.title}</h4>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest justify-center md:justify-start">
                    <span>{job.location}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                    <span>{job.type}</span>
                  </div>
                </div>
                <Button className="h-14 px-10 bg-slate-50 text-slate-900 border border-slate-100 hover:bg-primary hover:text-white hover:border-primary uppercase font-black tracking-widest text-[10px] rounded-2xl group/btn transition-all">
                  Apply Now <ArrowRight size={16} className="ml-3 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </CorporatePageLayout>
  );
}
