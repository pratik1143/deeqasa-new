"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ShieldCheck, ChevronsDown } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function Printers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-20"
        poster="/printer-poster.jpg"
      >
        <source src="/printer.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center p-4 container mx-auto"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.h2
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground font-headline"
        >
          Enterprise Printers
        </motion.h2>
        
        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-2xl text-lg text-muted-foreground"
        >
          High-Performance, Secure & Reliable Printing Solutions
        </motion.p>
        
        <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-md text-foreground/80"
        >
            Fast, secure, and cost-efficient printers designed for
            modern enterprises, high-volume workloads, and hybrid offices.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary-foreground/90"><Zap className="mr-2 h-3 w-3"/>High-Speed Printing</Badge>
            <Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary-foreground/90"><ShieldCheck className="mr-2 h-3 w-3"/>Enterprise Security</Badge>
            <Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary-foreground/90"><ChevronsDown className="mr-2 h-3 w-3" />Low Cost per Page</Badge>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 flex gap-4">
          <Button asChild size="lg" className="font-headline font-bold text-lg bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground hover:shadow-[0_0_20px_5px_hsl(var(--primary)/0.5)] transition-shadow duration-300 rounded-full px-8 py-6">
            <a href="https://www.hp.com/in-en/shop/printers/business-printers.html" target="_blank" rel="noopener noreferrer">
              Explore Printers
            </a>
          </Button>
          <Button size="lg" variant="outline" className="font-headline font-bold text-lg rounded-full px-8 py-6">
            View Specifications
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
