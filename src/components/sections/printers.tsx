
"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ShieldCheck, ChevronsDown } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const PRINTER_VIDEO_URL = "/printer.mp4";

export function Printers() {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const posterImage = PlaceHolderImages.find(img => img.id === 'case-study-2')?.imageUrl;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && videoRef.current) {
        const playVideo = async () => {
            try {
                await videoRef.current?.play();
            } catch (err) {
                console.warn("Autoplay blocked. User interaction may be required.", err);
            }
        };
        playVideo();
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
          <source src={PRINTER_VIDEO_URL} type="video/mp4" />
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
          Enterprise Printers
        </motion.h2>

        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="border-primary/20 bg-primary/20 text-white backdrop-blur-sm px-4 py-1.5 font-bold"><Zap className="mr-2 h-3 w-3 text-primary"/>High-Speed Printing</Badge>
            <Badge variant="secondary" className="border-primary/20 bg-primary/20 text-white backdrop-blur-sm px-4 py-1.5 font-bold"><ShieldCheck className="mr-2 h-3 w-3 text-primary"/>Enterprise Security</Badge>
            <Badge variant="secondary" className="border-primary/20 bg-primary/20 text-white backdrop-blur-sm px-4 py-1.5 font-bold"><ChevronsDown className="mr-2 h-3 w-3 text-primary" />Low Cost per Page</Badge>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="h-16 px-10 bg-primary text-black font-black uppercase tracking-widest hover:shadow-[0_0_20px_5px_rgba(0,224,255,0.3)] transition-all rounded-full">
            <a href="https://www.hp.com/in-en/shop/printers/business-printers.html" target="_blank" rel="noopener noreferrer">
              Explore Printers
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
