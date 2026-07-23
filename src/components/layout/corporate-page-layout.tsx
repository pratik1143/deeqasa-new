"use client";

import { motion } from "framer-motion";
import { Header } from "./header";
import { Footer } from "./footer";
import { WacusBackground } from "./wacus-background";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

interface CorporatePageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function CorporatePageLayout({ children, title, subtitle, className }: CorporatePageLayoutProps) {
  return (
    <div className={cn("relative min-h-screen bg-background text-foreground font-[Outfit]", className)}>
      <Header />
      <WacusBackground />
      
      <AnimatePresence mode="wait">
        <motion.div
           key={title}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <section className="relative pt-48 pb-24 px-6 overflow-hidden">
            <div className="container-enterprise">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-12 bg-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">DEEQASA // ENTERPRISE ARCHITECTURE</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] select-none">
                  {title.split(' ').map((word, i) => (
                    <span 
                      key={i} 
                      className={cn(
                        "block", 
                        i % 2 === 0 
                          ? "text-slate-900 dark:text-white" 
                          : "bg-gradient-to-r from-primary via-blue-500 to-cyan-400 bg-clip-text text-transparent"
                      )}
                    >
                      {word}
                    </span>
                  ))}
                </h1>
                
                {subtitle && (
                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-widest max-w-3xl leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </motion.div>
            </div>
            
            {/* Dynamic Accents */}
            <div className="absolute top-1/2 right-0 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </section>

          {/* Main Content Area */}
          <main className="relative z-10">
            {children}
          </main>
        </motion.div>
      </AnimatePresence>

      <Footer />

      {/* Corporate Sentinel Footer Detail */}
      <div className="container-enterprise py-20 opacity-10 font-bold uppercase tracking-widest text-[9px] text-slate-400">
        <div className="h-px w-full bg-slate-200 mb-8" />
        <div className="flex justify-between items-center">
            <span>DEEQASA TECH x HP CONNECT</span>
            <span>SECURE TERMINAL v4.0.1</span>
        </div>
      </div>
    </div>
  );
}
