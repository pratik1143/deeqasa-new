import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, ShieldCheck, Database, Leaf, Zap, Bot } from 'lucide-react';

const solutions = [
  { title: "Cloud Transformation", description: "Multi-cloud strategy, Hybrid cloud solutions, Cloud security.", icon: <Cloud size={32} /> },
  { title: "Data Center Modernization", description: "Hyper-converged infrastructure, Edge computing, Disaster recovery.", icon: <Database size={32} /> },
  { title: "Cybersecurity Suite", description: "Zero Trust Architecture, Threat intelligence, Compliance as a service.", icon: <ShieldCheck size={32} /> },
  { title: "AI & Automation", description: "Enterprise AI integration, Process automation, Predictive analytics.", icon: <Bot size={32} /> },
  { title: "Sustainable IT", description: "Green data centers, Energy optimization, E-waste management.", icon: <Leaf size={32} /> },
  { title: "Managed Services", description: "24/7 NOC/SOC, Proactive monitoring, Strategic IT consulting.", icon: <Zap size={32} /> },
];

export function Services() {
  return (
    <section id="solutions" className="bg-card py-24 sm:py-32">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter">
            Solutions Overview
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Precision-engineered solutions for your most complex challenges.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((service, index) => (
            <Card key={index} className="bg-secondary/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
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
          ))}
        </div>
      </div>
    </section>
  );
}
