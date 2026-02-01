"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HeroVideoBackground } from './hero-video-background';

export function Hero() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1500); // Wait for DEEQASA intro
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative h-screen min-h-[700px] w-full flex flex-col items-center justify-center overflow-hidden">
      <HeroVideoBackground />
      
      <div className="relative z-20 flex flex-col items-center justify-center text-center p-4">
        {/* Scene 1 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter animate-dee-qasa">
            DEEQASA
          </h1>
        </div>
        
        {/* Scene 2 & 4 */}
        <div className={`transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="font-headline text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter space-x-4">
            <span className="inline-block animate-reveal-up text-primary" style={{ animationDelay: `0.2s` }}>Smart</span>
            <span className="inline-block animate-reveal-up text-emerald" style={{ animationDelay: `0.4s` }}>Secure</span>
            <span className="inline-block animate-reveal-up text-violet" style={{ animationDelay: `0.6s` }}>Sustainable</span>
          </h2>
          <p className="font-headline text-3xl md:text-5xl font-bold tracking-tight mt-4 animate-reveal-up" style={{ animationDelay: '1s' }}>
            IT Solutions
          </p>
          <div className="mt-12 animate-reveal-up" style={{ animationDelay: '1.5s' }}>
            <Button size="lg" className="font-headline font-bold text-lg bg-gradient-to-r from-primary via-emerald to-accent text-background hover:shadow-[0_0_20px_5px_hsl(var(--primary)/0.5)] transition-shadow duration-300 rounded-full px-8 py-6">
              Initiate Transformation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
