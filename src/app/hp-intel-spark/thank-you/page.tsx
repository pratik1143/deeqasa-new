'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { trackPageView } from '@/lib/analytics';

export default function ThankYouPage() {
  useEffect(() => {
    // Track thank-you page view for analytics
    trackPageView('/hp-intel-spark/thank-you');
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030716] text-white font-[Outfit] selection:bg-cyan-500/30 overflow-x-hidden flex flex-col justify-between">
      
      <Header />

      {/* Radiant Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 30%, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.15) 45%, rgba(3, 7, 22, 0.98) 85%)
          `
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      <main className="relative z-10 pt-36 pb-20 flex-grow flex items-center justify-center px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-slate-950/90 border border-cyan-500/30 p-8 sm:p-14 rounded-[2.5rem] text-center space-y-8 shadow-[0_0_60px_rgba(6,182,212,0.2)] backdrop-blur-2xl"
        >
          
          {/* Animated Success Badge */}
          <div className="h-24 w-24 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(6,182,212,0.5)]">
            <CheckCircle2 size={48} />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-cyan-400 block">
              ENQUIRY RECEIVED —
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Thank You for Your Interest
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Your request for the <strong className="text-white">HP & Intel SPARK Program</strong> has been successfully registered. A Senior Solutions Architect from DeeQasa will reach out to you shortly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400 text-left space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <ShieldCheck size={16} />
              <span>Next Steps:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 font-sans text-xs">
              <li>Our team will review your organization's compute requirements.</li>
              <li>You will receive customized HP partner pricing and spec sheets via email.</li>
              <li>We will arrange a priority hardware demo or proof-of-concept unit deployment.</li>
            </ul>
          </div>

          <div className="pt-2">
            <Button
              asChild
              className="h-14 px-8 bg-white hover:bg-slate-100 text-slate-950 font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-transform hover:scale-105"
            >
              <Link href="/">
                <ArrowLeft size={16} className="mr-2" /> Back to Website
              </Link>
            </Button>
          </div>

        </motion.div>
      </main>

      <Footer />

    </div>
  );
}
