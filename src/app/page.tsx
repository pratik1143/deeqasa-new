import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';
import { Problem } from '@/components/sections/problem';
import { Services } from '@/components/sections/services';
import { Proof } from '@/components/sections/proof';
import { Sustainability } from '@/components/sections/sustainability';
import { QasaAssistant } from '@/components/qasa/qasa-assistant';
import { CustomCursor } from '@/components/ui/custom-cursor';

export default function Home() {
  return (
    <>
      <CustomCursor />
      <div className="relative z-10">
        <Header />
        <main className="flex flex-col">
          <Hero />
          <Problem />
          <Services />
          <Proof />
          <Sustainability />
        </main>
      </div>
      <QasaAssistant />
    </>
  );
}
