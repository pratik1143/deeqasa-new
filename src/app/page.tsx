"use client";

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Clients } from '@/components/sections/clients';
import { Services } from '@/components/sections/services';
import { Proof } from '@/components/sections/proof';
import { Sustainability } from '@/components/sections/sustainability';
import { QasaAssistant } from '@/components/qasa/qasa-assistant';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { Preloader } from '@/components/layout/preloader';
import { Printers } from '@/components/sections/printers';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader onLoaded={() => setIsLoading(false)} />}
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
          <Sustainability />
        </main>
        <Footer />
      </div>
      <QasaAssistant />
    </>
  );
}
