"use client";

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Clients } from '@/components/sections/clients';
import { Services } from '@/components/sections/services';
import { Proof } from '@/components/sections/proof';
import { QasaAssistant } from '@/components/qasa/qasa-assistant';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { Preloader } from '@/components/layout/preloader';
import { Printers } from '@/components/sections/printers';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onLoaded={handleLoaded} />}
      </AnimatePresence>
      
      <CustomCursor />
      <div className="relative z-10">
        <Header />
        <main className="flex flex-col">
          <Hero />
          <Clients />
          <Services />
          <Proof />
          <Printers />
        </main>
        <Footer />
      </div>
      <QasaAssistant />
    </>
  );
}