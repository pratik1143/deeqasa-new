"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, MicOff, Camera } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Proof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const posterImage = PlaceHolderImages.find(img => img.id === 'case-study-1')?.imageUrl;

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
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-20 opacity-100"
        poster={posterImage}
      >
        <source src="/poly.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark Overlays removed as requested for maximum visibility */}

      <motion.div
        className="relative z-10 flex flex-col items-center text-center p-8 rounded-3xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.h2
          variants={itemVariants}
          className="text-5xl md:text-8xl font-bold tracking-tighter text-white font-headline drop-shadow-2xl"
        >
          Poly Studio
        </motion.h2>

        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="border-primary/20 bg-primary/20 text-white backdrop-blur-sm"><MicOff className="mr-2 h-3 w-3"/>AI Noise Cancellation</Badge>
            <Badge variant="secondary" className="border-primary/20 bg-primary/20 text-white backdrop-blur-sm"><Camera className="mr-2 h-3 w-3"/>4K Camera</Badge>
            <Badge variant="secondary" className="border-primary/20 bg-primary/20 text-white backdrop-blur-sm"><ShieldCheck className="mr-2 h-3 w-3"/>Enterprise Ready</Badge>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 flex gap-4">
          <Button asChild size="lg" className="font-headline font-bold text-lg bg-gradient-to-r from-primary via-emerald to-accent text-primary-foreground hover:shadow-[0_0_20px_5px_hsl(var(--primary)/0.3)] transition-shadow duration-300 rounded-full px-8 py-6">
            <a href="https://www.hp.com/in-en/poly.html" target="_blank" rel="noopener noreferrer">
              Explore Poly Studio
            </a>
          </Button>
          <Button size="lg" variant="outline" className="font-headline font-bold text-lg rounded-full px-8 py-6 border-white/20 hover:bg-white/5 text-white">
            View Specifications
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
