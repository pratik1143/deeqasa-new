'use client';

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radio, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Terminal, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  Loader2,
  Zap,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const InfoBlock = ({ icon: Icon, label, value, subValue }: any) => (
    <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{label}</p>
            <p className="text-sm font-bold text-foreground uppercase">{value}</p>
            {subValue && <p className="text-[10px] font-medium text-white/20 uppercase tracking-tighter mt-0.5">{subValue}</p>}
        </div>
    </div>
);

export default function ContactPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "PROTOCOL: SUCCESS",
                description: "Communication packet transmitted to Command Center.",
            });
        }, 2000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background font-code selection:bg-primary/30">
            <Header />
            <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
                <div className="fixed inset-0 command-grid pointer-events-none opacity-20" />
                <div className="scanline" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
                    <div className="absolute top-[10%] left-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        <div className="lg:col-span-5 space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                    <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Uplink Module Alpha</span>
                                </div>
                                <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase leading-none mb-6">
                                    System <br /> <span className="text-primary">Uplink</span>
                                </h1>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-medium italic">
                                    "Direct communication protocols for enterprise infrastructure deployment. Establishing a secure bridge to our technical architects."
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 gap-4">
                                <InfoBlock 
                                    icon={MapPin} 
                                    label="Operational Coordinates" 
                                    value="Sector 14, Chandigarh" 
                                    subValue="Regional Command Center"
                                />
                                <InfoBlock 
                                    icon={Phone} 
                                    label="Signal Frequency" 
                                    value="+91 172 272 0000" 
                                    subValue="Available 0900 - 1800 IST"
                                />
                                <InfoBlock 
                                    icon={Mail} 
                                    label="Data Exchange" 
                                    value="hq@deeqasa.tech" 
                                    subValue="Encrypted SMTP Protocol"
                                />
                            </div>

                            <Card className="bg-card/40 border-white/5 backdrop-blur-xl p-6 border-l-2 border-l-primary/30">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                    <Activity size={12}/> Network Status
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-muted-foreground">System Load</span>
                                        <span className="text-emerald-400">Nominal (12%)</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: "12%" }}
                                            className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 text-muted-foreground text-[8px] font-black uppercase">
                                        <div className="flex items-center gap-1"><ShieldCheck size={10} className="text-emerald-500/50"/> AES-256 Enabled</div>
                                        <div className="flex items-center gap-1"><Lock size={10} className="text-primary/50"/> Secure Tunnel</div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Card className="bg-card/60 border-primary/20 backdrop-blur-3xl overflow-hidden holographic-edge">
                                    <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 relative">
                                        <div className="absolute top-0 right-0 p-4 opacity-10"><Terminal size={80}/></div>
                                        <CardTitle className="text-lg font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                                            <Radio className="animate-pulse" /> Secure Uplink Protocol
                                        </CardTitle>
                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                            Transmission Port: SEC-COM-01
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2 group">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Asset Identity</Label>
                                                <Input 
                                                    placeholder="Full Name" 
                                                    required
                                                    className="bg-white/5 border-white/10 h-12 focus:bg-white/10 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground/30 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2 group">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Corporate Node</Label>
                                                <Input 
                                                    type="email" 
                                                    placeholder="Email Address" 
                                                    required
                                                    className="bg-white/5 border-white/10 h-12 focus:bg-white/10 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground/30 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2 group md:col-span-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Mission Objective</Label>
                                                <Input 
                                                    placeholder="Subject of Consultation" 
                                                    required
                                                    className="bg-white/5 border-white/10 h-12 focus:bg-white/10 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground/30 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2 group md:col-span-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">Mission Parameters</Label>
                                                <Textarea 
                                                    placeholder="Describe your enterprise requirements..." 
                                                    rows={6}
                                                    required
                                                    className="bg-white/5 border-white/10 focus:bg-white/10 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground/30 font-bold resize-none"
                                                />
                                            </div>
                                            
                                            <div className="md:col-span-2 pt-4">
                                                <Button 
                                                    type="submit" 
                                                    disabled={isSubmitting}
                                                    className="w-full h-16 bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] text-xs shadow-[0_0_30px_rgba(0,224,255,0.2)] hover:shadow-primary/40 transition-all group overflow-hidden relative"
                                                >
                                                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                                    {isSubmitting ? (
                                                        <Loader2 className="animate-spin h-5 w-5" />
                                                    ) : (
                                                        <span className="flex items-center gap-3">
                                                            Initiate Uplink <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                    <div className="bg-white/5 border-t border-white/5 p-6 flex justify-between items-center text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
                                        <div className="flex items-center gap-2"><Globe size={10} className="text-primary/40"/> Universal Traffic Relay</div>
                                        <div className="flex items-center gap-2"><Zap size={10} className="text-primary/40"/> Instant Synthesis</div>
                                    </div>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}