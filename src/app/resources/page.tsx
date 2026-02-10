'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { FileText, Download, Shield, Layout, Settings, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const resources = [
  { title: "Enterprise Cloud Strategy 2025", type: "Whitepaper", icon: Layout },
  { title: "HP Z-Series Performance Guide", type: "Technical Brochure", icon: Settings },
  { title: "Zero Trust Deployment Matrix", type: "Security Brief", icon: Shield },
  { title: "Data Center Modernization Catalog", type: "Product Catalog", icon: Database },
  { title: "Sustainable IT Infrastructure", type: "Industry Report", icon: FileText },
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase mb-6">
              Knowledge <span className="text-primary">Vault</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Deep-dive technical documentation and solution frameworks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card/40 border-white/5 hover:border-primary/20 transition-all p-6 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                        <res.icon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{res.type}</p>
                        <h3 className="text-lg font-bold uppercase tracking-tight">{res.title}</h3>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                      <Download size={20} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 p-12 rounded-[40px] border border-white/5 bg-white/5 text-center">
            <h2 className="text-3xl font-black uppercase mb-6">Request Custom Documentation</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto italic">Looking for specific tender documents or RFP responses? Our technical team provides bespoke documentation packs.</p>
            <Button size="lg" className="h-16 px-12 bg-primary text-black font-black uppercase tracking-widest hover:shadow-primary/20 transition-all">
              Contact Documentation Hub
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}