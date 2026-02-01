import { Monolith } from './monolith';
import { Database, Cloud, ShieldCheck } from 'lucide-react';

export function Problem() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto text-center">
        <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter">
          The Unseen Barriers to Innovation
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Legacy systems, security threats, and scalability challenges are holding you back. We see them. We solve them.
        </p>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <Monolith
            icon={<Database size={48} />}
            title="Outdated Infrastructure"
            statistic="45%"
            description="of IT budgets are wasted on maintaining legacy systems."
          />
          <Monolith
            icon={<ShieldCheck size={48} />}
            title="Evolving Security Risks"
            statistic="39s"
            description="is the average time between new cyber attacks on the web."
          />
          <Monolith
            icon={<Cloud size={48} />}
            title="Scalability Plateaus"
            statistic="70%"
            description="of companies report cloud challenges as a top concern."
          />
        </div>
      </div>
    </section>
  );
}
