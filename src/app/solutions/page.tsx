'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
  Layout,
  Terminal,
  Activity
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col min-h-screen bg-background font-body selection:bg-primary/30">
      <Header />
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        <div className="fixed inset-0 command-grid pointer-events-none opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Core Capability Matrix</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase leading-none mb-6">
              Enterprise <br /> <span className="text-primary">Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium italic">
              "Precision-engineered technology architectures designed for the modern business era."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/30 transition-all group overflow-hidden relative holographic-edge">
                  <CardHeader className="relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      <solution.icon size={28} />
                    </div>
                    <CardTitle className="text-2xl font-bold uppercase tracking-tight">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground leading-relaxed mb-8">{solution.description}</p>
                    <Button asChild variant="outline" className="w-full h-12 border-white/10 hover:bg-primary hover:text-black font-black uppercase tracking-widest text-[10px] transition-all">
                      <Link href={solution.href}>View Solution Architecture <ArrowRight className="ml-2 h-3 w-3" /></Link>
                    </Button>
                  </CardContent>
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <solution.icon size={120} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}