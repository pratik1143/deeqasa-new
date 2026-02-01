import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, ShieldCheck, Database, Leaf } from 'lucide-react';

const services = [
  { title: "Cloud Architecture", description: "Scalable, resilient cloud foundations.", icon: <Cloud size={32} /> },
  { title: "Cybersecurity", description: "Proactive defense against digital threats.", icon: <ShieldCheck size={32} /> },
  { title: "Data Intelligence", description: "Turn data into your most valuable asset.", icon: <Database size={32} /> },
  { title: "Sustainable IT", description: "Eco-friendly solutions for a greener future.", icon: <Leaf size={32} /> },
  { title: "Digital Transformation", description: "Modernize your operations for the new era.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> },
];

export function Services() {
  return (
    <section className="bg-card py-24 sm:py-32">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter">
            Our Core Services
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Precision-engineered solutions for your most complex challenges.
          </p>
        </div>
        <div className="flex overflow-x-auto snap-x-mandatory gap-8 pb-8" style={{ scrollbarWidth: 'none' }}>
          <div className="shrink-0 snap-center">
            <div className="w-4" />
          </div>
          {services.map((service, index) => (
            <div key={index} className="snap-center shrink-0 w-[80vw] md:w-[400px]">
              <Card className="h-full bg-secondary/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
                    {service.icon}
                  </div>
                  <CardTitle className="font-headline">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
          <div className="shrink-0 snap-center">
            <div className="w-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
