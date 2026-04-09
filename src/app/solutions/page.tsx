'use client';

import { motion } from "framer-motion";
import { 
  Cloud, 
  ShieldCheck, 
  Database, 
  Leaf, 
  Zap, 
  Bot, 
  ArrowRight,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CorporatePageLayout } from "@/components/layout/corporate-page-layout";

const solutions = [
  { 
    title: "Cloud & Hybrid Infrastructure", 
    description: "Accelerate your digital transformation with high-performance multi-cloud and hybrid architectures.", 
    icon: Cloud,
    href: "/services/cloud"
  },
  { 
    title: "Modern Workplace", 
    description: "Empower your global workforce with secure, collaborative, and intelligent endpoint solutions.", 
    icon: Monitor,
    href: "/services/managed-services"
  },
  { 
    title: "Cybersecurity Suite", 
    description: "Uncompromising protection for your enterprise assets built on a Zero Trust foundation.", 
    icon: ShieldCheck,
    href: "/services/cybersecurity"
  },
  { 
    title: "Data Center Modernization", 
    description: "Consolidate complexity with software-defined compute and high-density storage solutions.", 
    icon: Database,
    href: "/services/datacenter"
  },
  { 
    title: "AI & Automation", 
    description: "Turn raw data into strategic advantage with enterprise-ready Generative AI and process automation.", 
    icon: Bot,
    href: "/services/ai-automation"
  },
  { 
    title: "Sustainable IT", 
    description: "Future-proof your operations with green technology and circular lifecycle management.", 
    icon: Leaf,
    href: "/services/sustainable-it"
  },
];

export default function SolutionsPage() {
  return (
    <CorporatePageLayout 
      title="Industrial Solutions" 
      subtitle="Precision-engineered technology architectures designed for the modern business era."
    >
      <div className="container-enterprise pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {solutions.map((solution, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white border border-slate-100 hover:border-primary/40 transition-all duration-700 group overflow-hidden relative rounded-[2.5rem] p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-2xl">
                <CardHeader className="relative z-10 pb-6 pt-10 px-8">
                  <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:shadow-[0_20px_40px_-10px_rgba(26,140,255,0.4)]">
                    <solution.icon size={36} />
                  </div>
                  <CardTitle className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-tight mb-4 group-hover:text-primary transition-colors">
                     {solution.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 flex flex-col h-full px-8 pb-10">
                  <p className="text-slate-400 leading-relaxed mb-12 text-lg flex-grow font-bold italic">
                    {solution.description}
                  </p>
                  <Button asChild variant="ghost" className="w-full h-16 border border-slate-100 hover:bg-slate-900 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all rounded-2xl group/btn">
                    <Link href={solution.href} className="flex items-center justify-center gap-4">
                      Explore Architecture 
                      <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                    </Link>
                  </Button>
                </CardContent>
                
                {/* Background Icon Watermark */}
                <div className="absolute -bottom-16 -right-16 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-1000 text-primary">
                  <solution.icon size={300} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </CorporatePageLayout>
  );
}