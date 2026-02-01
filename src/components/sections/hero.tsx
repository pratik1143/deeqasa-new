"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";

const HeroText = ({ text, className, delay, animationType }: { text: string, className?: string, delay: number, animationType: string }) => (
  <span
    className={`inline-block opacity-0 ${className}`}
    style={{ animation: `${animationType} 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`, animationDelay: `${delay}s` }}
  >
    {text.split('').map((char, i) => <span key={i} className="inline-block" style={{animation: `reveal-char 0.5s ease-out forwards`, animationDelay: `${delay + i * 0.03}s`}}>{char === ' ' ? '\u00A0' : char}</span>)}
  </span>
);

export function Hero() {
  const [show, setShow] = useState(false);
  const position = useMousePosition();

  const parallaxOffset = (factor: number) => {
    if (typeof window === 'undefined') return {};
    const x = (position.x - window.innerWidth / 2) * factor;
    const y = (position.y - window.innerHeight / 2) * factor;
    return { transform: `translate(${x}px, ${y}px)` };
  };

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1500); // Wait for DEEQASA intro
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative h-screen min-h-[700px] w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-background" />
      
      {/* Parallax Background Layers */}
      <div className="absolute inset-[-10vw] z-1" style={parallaxOffset(0.01)}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(10,20,41,0.5)_0%,_transparent_70%)]" />
      </div>
      <div className="absolute inset-[-10vw] z-0" style={parallaxOffset(0.005)}>
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.1), transparent 30%),
                            radial-gradient(circle at 80% 70%, hsl(var(--accent) / 0.1), transparent 30%)`
        }}/>
      </div>
      
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
