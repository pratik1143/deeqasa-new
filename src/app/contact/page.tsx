'use client';

import { useState, useRef } from "react";
import { CorporatePageLayout } from "@/components/layout/corporate-page-layout";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Lock,
  UserCheck,
  Zap,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const InfoBlock = ({ icon: Icon, label, value, subValue, i }: any) => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.1, duration: 0.8 }}
      className="flex gap-8 p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary/40 transition-all duration-500 group shadow-sm hover:shadow-xl group"
    >
        <div className="h-20 w-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
            <Icon size={32} />
        </div>
        <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-hover:text-primary transition-colors">{label}</p>
            <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{value}</p>
            {subValue && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subValue}</p>}
        </div>
    </motion.div>
);

export default function ContactPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "TRANSMISSION SUCCESS",
                description: "Your communication packet has been routed to our technical architects.",
            });
        }, 2000);
    };

    return (
        <CorporatePageLayout 
          title="Direct Link" 
          subtitle="Establishing a secure bridge to our global technical architects. Multi-channel response protocols active."
        >
            <div className="container-enterprise pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                    
                    <div className="lg:col-span-12 xl:col-span-5 space-y-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-px w-12 bg-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[1em] text-primary">UPLINK MODULE</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <InfoBlock 
                                i={1}
                                icon={UserCheck} 
                                label="Mission Director" 
                                value="Pratik Chaudhary" 
                                subValue="Executive Lead // HP Connect"
                            />
                            <InfoBlock 
                                i={2}
                                icon={Mail} 
                                label="Direct Exchange" 
                                value="sales@deeqasa.com" 
                                subValue="Encrypted SMTP Protocol"
                            />
                            <InfoBlock 
                                i={3}
                                icon={Phone} 
                                label="Signal Frequencies" 
                                value="+91 85952 70950" 
                                subValue="+91 89755 06300"
                            />
                            <InfoBlock 
                                i={4}
                                icon={Building} 
                                label="HQ Coordinates" 
                                value="Sahibzada Ajit Singh Nagar" 
                                subValue="SCO 105 & 106, Punjab 160071"
                            />
                        </div>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          className="p-12 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-primary pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
                               <ShieldCheck size={180} />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[1em] text-primary mb-10 flex items-center gap-4">
                                <Activity size={16} className="animate-pulse" /> NETWORK STATUS
                            </h3>
                            <div className="space-y-8">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Load Balanced Traffic</span>
                                    <span className="text-emerald-500">Nominal // 0.04ms</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "24%" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                                <div className="flex items-center gap-10 text-slate-200 text-[9px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-3 text-emerald-400/50"><ShieldCheck size={14}/> AES-256 ACTIVE</div>
                                    <div className="flex items-center gap-3 text-primary/50"><Lock size={14}/> SECURE TUNNEL</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-12 xl:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <Card className="bg-white border border-slate-100 overflow-hidden rounded-[4rem] shadow-2xl relative">
                                <CardHeader className="p-16 border-b border-slate-50 relative overflow-hidden bg-slate-50/50">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.015] -rotate-12 pointer-events-none transition-transform group-hover:rotate-0 duration-1000">
                                        <Terminal size={350}/>
                                    </div>
                                    <CardTitle className="text-5xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-6">
                                        <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
                                        Transmit Packet
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 pt-4">
                                        Secure Channel Configuration: ALPHA-7G
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-16 md:p-24 bg-white">
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4 group">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-focus-within:text-primary transition-colors">Identity Node</Label>
                                            <Input 
                                                placeholder="Asset Name" 
                                                required
                                                className="bg-slate-50 border-slate-100 h-20 rounded-3xl focus:bg-white focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-200 font-bold text-xl px-10"
                                            />
                                        </div>
                                        <div className="space-y-4 group">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-focus-within:text-primary transition-colors">Digital Gateway</Label>
                                            <Input 
                                                type="email" 
                                                placeholder="Email Exchange" 
                                                required
                                                className="bg-slate-50 border-slate-100 h-20 rounded-3xl focus:bg-white focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-200 font-bold text-xl px-10"
                                            />
                                        </div>
                                        <div className="space-y-4 group md:col-span-2">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-focus-within:text-primary transition-colors">Mission Objective</Label>
                                            <Input 
                                                placeholder="Strategic Consultation Subject" 
                                                required
                                                className="bg-slate-50 border-slate-100 h-20 rounded-3xl focus:bg-white focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-200 font-bold text-xl px-10"
                                            />
                                        </div>
                                        <div className="space-y-4 group md:col-span-2">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-focus-within:text-primary transition-colors">Transmission Details</Label>
                                            <Textarea 
                                                placeholder="Describe your enterprise requirements in detail..." 
                                                rows={6}
                                                required
                                                className="bg-slate-50 border-slate-100 rounded-[2.5rem] focus:bg-white focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-200 font-bold text-xl p-10 resize-none min-h-[250px]"
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2 pt-10">
                                            <Button 
                                                type="submit" 
                                                disabled={isSubmitting}
                                                className="w-full h-24 bg-slate-900 text-white font-black uppercase tracking-[0.5em] text-xs shadow-2xl hover:bg-primary hover:scale-[1.01] transition-all group overflow-hidden relative rounded-[2rem]"
                                            >
                                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                                {isSubmitting ? (
                                                    <Loader2 className="animate-spin h-8 w-8" />
                                                ) : (
                                                    <span className="flex items-center gap-6">
                                                        Establish Direct Link <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                                <div className="bg-slate-50 p-12 flex flex-wrap gap-12 justify-center items-center text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] border-t border-slate-100">
                                    <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-default"><Globe size={14}/> High-Frequency Traffic</div>
                                    <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-default"><Zap size={14}/> Sub-Millisecond Response</div>
                                    <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-default"><Lock size={14}/> Encryption Matrix Validated</div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </CorporatePageLayout>
    );
}
