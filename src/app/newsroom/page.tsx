'use client';

import { motion } from "framer-motion";
import { Newspaper, Calendar, ArrowRight, Share2, Tag } from "lucide-react";
import { CorporatePageLayout } from "@/components/layout/corporate-page-layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const news = [
  {
    date: "08 APR 2026",
    category: "Expansion",
    title: "DEEQASA TECH Expands Cloud Infrastructure to New European Regions",
    excerpt: "Strengthening our global footprint to support enterprise scale-out with low-latency sovereign cloud architectures.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
  },
  {
    date: "25 MAR 2026",
    category: "Security",
    title: "Zero Trust Architecture: The New Standard for Managed Infrastructure",
    excerpt: "How we are implementing hardware-level root-of-trust for all client-facing data center deployments.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
  },
  {
    date: "12 MAR 2026",
    category: "Sustainability",
    title: "DEEQASA Achieves 100% Carbon Neutral Data Center Operations",
    excerpt: "A major milestone in our commitment to sustainable IT and circular hardware lifecycle management.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80"
  }
];

export default function NewsroomPage() {
  return (
    <CorporatePageLayout 
      title="Global Newsroom" 
      subtitle="The latest updates on infrastructure innovations, global expansions, and strategic shifts."
    >
      <div className="container-enterprise pb-40">
        <div className="space-y-32">
          {news.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row gap-20 items-stretch group"
            >
              <div className="flex-1 w-full min-h-[400px] relative rounded-[3rem] overflow-hidden shadow-2xl">
                <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-[2s] group-hover:scale-105" />
                <div className="absolute top-8 left-8">
                  <span className="px-6 py-2 bg-white/90 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-xl">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 py-10 flex flex-col justify-center space-y-8">
                <div className="flex items-center gap-4 text-slate-300">
                  <Calendar size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">{item.date}</span>
                </div>
                
                <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                
                <p className="text-xl text-slate-400 font-bold italic leading-relaxed">
                  {item.excerpt}
                </p>
                
                <div className="flex items-center gap-6 pt-6">
                  <Button variant="ghost" className="h-16 border border-slate-100 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all group/btn">
                    Read Report <ArrowRight size={18} className="ml-3 group-hover/btn:translate-x-2 transition-transform" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-16 w-16 border border-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-all">
                    <Share2 size={20} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CorporatePageLayout>
  );
}
