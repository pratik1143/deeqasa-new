
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, ShieldCheck, Database, Leaf, Zap, Bot, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const solutions = [
  { 
    title: "Cloud Transformation", 
    description: "Multi-cloud strategy, Hybrid cloud solutions, Cloud security.", 
    icon: <Cloud size={32} />,
    href: "/services/cloud"
  },
  { 
    title: "Data Center Modernization", 
    description: "Hyper-converged infrastructure, Edge computing, Disaster recovery.", 
    icon: <Database size={32} />,
    href: "/services/datacenter"
  },
  { 
    title: "Cybersecurity Suite", 
    description: "Zero Trust Architecture, Threat intelligence, Compliance as a service.", 
    icon: <ShieldCheck size={32} />,
    href: "/services/cybersecurity"
  },
  { 
    title: "AI & Automation", 
    description: "Enterprise AI integration, Process automation, Predictive analytics.", 
    icon: <Bot size={32} />,
    href: "/services/ai-automation"
  },
  { 
    title: "Sustainable IT", 
    description: "Green data centers, Energy optimization, E-waste management.", 
    icon: <Leaf size={32} />,
    href: "/services/sustainable-it"
  },
  { 
    title: "Managed Services", 
    description: "24/7 NOC/SOC, Proactive monitoring, Strategic IT consulting.", 
    icon: <Zap size={32} />,
    href: "/services/managed-services"
  },
];

export function Services() {
  return (
    <section id="solutions" className="bg-card py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
              Solutions Overview
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Precision-engineered solutions for your most complex challenges.
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((service, index) => (
            <Link key={index} href={service.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="h-full bg-secondary/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 group hover:shadow-2xl hover:shadow-primary/10 cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-primary h-5 w-5" />
                  </div>
                  <CardHeader>
                    <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
                      {service.icon}
                    </div>
                    <CardTitle className="font-headline text-foreground">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
