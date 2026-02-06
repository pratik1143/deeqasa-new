'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserWithRole, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { Header } from "@/components/layout/header";
import { CenteredLoader } from "@/components/ui/centered-loader";
import AccessDenied from "@/components/auth/access-denied";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MessageSquare, 
  Phone, 
  Mail, 
  AlertCircle, 
  Zap, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Terminal,
  Activity,
  ArrowRight,
  RefreshCw,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { query, collection, where, orderBy, limit } from "firebase/firestore";
import { generateFollowUpPlan, type FollowUpOutput } from "@/ai/flows/ai-follow-up-generation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function FollowUpPage() {
    const { user, profile, isUserLoading, isProfileLoading } = useUserWithRole();
    const firestore = useFirestore();
    const router = useRouter();
    const [plan, setPlan] = useState<FollowUpOutput | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const activeQuotationQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'quotations'),
            where('status', '==', 'ACTIVE'),
            where('createdBy', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(1)
        );
    }, [firestore, user]);

    const { data: quotations, isLoading: isQuotationLoading } = useCollection(activeQuotationQuery);
    const activeQuotation = quotations?.[0] || null;

    const runAnalysis = async () => {
        if (!activeQuotation) return;
        setIsGenerating(true);
        try {
            const totals = JSON.parse(activeQuotation.totals);
            const result = await generateFollowUpPlan({
                customerName: JSON.parse(activeQuotation.clientDetails).name || 'Client',
                companyName: JSON.parse(activeQuotation.clientDetails).companyName || 'Organization',
                totalAmount: totals.grandTotal || 0,
                createdAt: activeQuotation.createdAt,
            });
            setPlan(result);
        } catch (error) {
            console.error("Follow-up synthesis failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (activeQuotation && !plan && !isGenerating) {
            runAnalysis();
        }
    }, [activeQuotation]);

    const isLoading = isUserLoading || isProfileLoading || isQuotationLoading;

    if (isLoading) return <CenteredLoader text="Syncing Follow-Up Matrix..." />;
    if (!user) { router.push('/login'); return null; }
    if (!profile || profile.role !== 'admin') return <AccessDenied />;

    return (
        <div className="flex flex-col min-h-screen bg-black font-code selection:bg-primary/30">
            <Header />
            <main className="flex-1 pt-24 pb-12 relative overflow-hidden">
                <div className="fixed inset-0 command-grid pointer-events-none opacity-20" />
                <div className="scanline" />
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Follow-Up Protocol Alpha</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
                                Execution Plan <span className="text-white/10">|</span> <span className="text-white/40 font-light">Tactical v4.0.1</span>
                            </h1>
                        </div>
                        {activeQuotation && (
                            <Button 
                                variant="outline" 
                                onClick={runAnalysis}
                                disabled={isGenerating}
                                className="h-12 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary uppercase font-bold text-xs tracking-widest px-8"
                            >
                                {isGenerating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                                Recalibrate Execution
                            </Button>
                        )}
                    </div>

                    {!activeQuotation ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                            <AlertCircle size={64} className="text-white/10 mb-6" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">No Active Deal Record</h2>
                            <p className="text-white/30 text-sm mt-2 max-w-sm">Please save a quotation in the Studio to generate a follow-up execution plan.</p>
                            <Button className="mt-8 bg-primary text-black font-bold uppercase tracking-widest px-8" onClick={() => router.push('/quotation-builder')}>
                                Open Studio
                            </Button>
                        </div>
                    ) : isGenerating ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Activity className="text-primary animate-pulse" size={32} />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-primary tracking-[0.5em] uppercase">Calculating Engagement Velocity...</p>
                        </div>
                    ) : plan && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* LEFT: Timeline & Strategy */}
                            <div className="lg:col-span-1 space-y-8">
                                <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 holographic-edge">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                                        <Clock size={14} /> Tactical Timeline
                                    </h3>
                                    <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                                        {plan.timeline.map((step, i) => (
                                            <div key={i} className="relative pl-8 group">
                                                <div className={cn(
                                                    "absolute left-0 top-1 w-4 h-4 rounded-full border-2 bg-black z-10 transition-all",
                                                    step.status === 'HIGH-PRIORITY' ? "border-primary shadow-[0_0_10px_rgba(0,224,255,0.5)]" : "border-white/20 group-hover:border-white/40"
                                                )} />
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-white/40 uppercase">{step.day}</span>
                                                        <Badge variant="outline" className={cn(
                                                            "text-[8px] font-black tracking-widest border-none px-2",
                                                            step.status === 'HIGH-PRIORITY' ? "text-primary bg-primary/5" : "text-white/20"
                                                        )}>{step.status}</Badge>
                                                    </div>
                                                    <p className="text-xs font-bold text-white/80 leading-relaxed">{step.purpose}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><Terminal size={60} /></div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Urgency Intelligence</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                            <span className="text-sm font-black text-white uppercase tracking-tighter">{plan.urgencyIntelligence.verdict}</span>
                                        </div>
                                        <p className="text-[11px] text-white/60 leading-relaxed italic border-l-2 border-primary/20 pl-4">
                                            "{plan.urgencyIntelligence.reason}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Messages & Alerts */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 holographic-edge group">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 flex items-center gap-2">
                                            <Mail size={14} className="text-primary"/> Executive Email
                                        </h3>
                                        <div className="bg-white/5 rounded-xl p-4 min-h-[200px] relative">
                                            <ScrollArea className="h-40">
                                                <p className="text-[11px] text-white/70 leading-relaxed whitespace-pre-wrap font-serif">
                                                    {plan.messages.email}
                                                </p>
                                            </ScrollArea>
                                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                                    <Send size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 holographic-edge">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 flex items-center gap-2">
                                                <MessageSquare size={14} className="text-emerald-500"/> WhatsApp Protocol
                                            </h3>
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                                                <p className="text-[11px] text-emerald-100/70 leading-relaxed italic">
                                                    "{plan.messages.whatsapp}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 holographic-edge">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 flex items-center gap-2">
                                                <Phone size={14} className="text-blue-500"/> Call Talking Points
                                            </h3>
                                            <ul className="space-y-3">
                                                {plan.messages.callPoints.map((point, i) => (
                                                    <li key={i} className="flex gap-3 items-start">
                                                        <ChevronRight size={12} className="text-primary mt-0.5 shrink-0" />
                                                        <span className="text-[11px] text-white/60 font-medium">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 holographic-edge">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-6 flex items-center gap-2">
                                            <AlertCircle size={14} /> Escalation Alerts
                                        </h3>
                                        <div className="space-y-4">
                                            {plan.escalationAlerts.map((alert, i) => (
                                                <div key={i} className="flex gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
                                                    <span className="text-[10px] text-red-200/70 font-bold uppercase tracking-tight">{alert}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-primary border border-primary/20 rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-[0_0_40px_rgba(0,224,255,0.2)]">
                                        <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center mb-4">
                                            <Terminal size={24} className="text-black" />
                                        </div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 mb-2">Daily Command</h3>
                                        <p className="text-lg font-black text-black leading-tight">
                                            {plan.dailyCommand}
                                        </p>
                                        <div className="mt-6 flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-black/40" />
                                            <span className="text-[8px] font-bold text-black/40 uppercase tracking-widest">Logic Verified by JARVIS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
