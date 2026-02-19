
"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, MicOff, Camera } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const POLY_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-modern-office-business-meeting-room-4444-large.mp4";

export function Proof() {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const posterImage = PlaceHolderImages.find(img => img.id === 'case-study-1')?.imageUrl;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked, will wait for interaction
            });
        }
    }
  }, [mounted]);

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
    <section ref={ref} className="relative h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {mounted && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover -z-20 opacity-60"
          poster={posterImage}
        >
          <source src={POLY_VIDEO_URL} type="video/mp4" />
        </video>
      )}
      
      <div className="absolute inset-0 bg-black/40 z-0" />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center p-8 container-enterprise rounded-3xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.h2
          variants={itemVariants}
          className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase drop-shadow-2xl"
        >
          Poly Studio
        </motion.h2>

        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="border-primary/20 bg-primary/20 text-white backdrop-blur-sm px-4 py-1.5 font-bold"><MicOff className="mr-2 h-3 w-3 text-primary"/>AI Noise Cancellation</Badge>
            <Badge variant="secondary" className="border-primary/20 bg-primary/20 text-white backdrop-blur-sm px-4 py-1.5 font-bold"><Camera className="mr-2 h-3 w-3 text-primary"/>4K Camera</Badge>
            <Badge variant="secondary" className="border-primary/20 bg-primary/20 text-white backdrop-blur-sm px-4 py-1.5 font-bold"><ShieldCheck className="mr-2 h-3 w-3 text-primary"/>Enterprise Ready</Badge>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="h-16 px-10 bg-primary text-black font-black uppercase tracking-widest hover:shadow-[0_0_20px_5px_rgba(0,224,255,0.3)] transition-all rounded-full">
            <a href="https://www.hp.com/in-en/poly.html" target="_blank" rel="noopener noreferrer">
              Explore Poly Studio
            </a>
          </Button>
          <Button size="lg" variant="outline" className="h-16 px-10 border-white/20 hover:bg-white/5 text-white font-black uppercase tracking-widest rounded-full">
            View Specifications
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
