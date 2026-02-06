'use client';

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUserWithRole } from "@/firebase";
import { Header } from "@/components/layout/header";
import { CenteredLoader } from "@/components/ui/centered-loader";
import AccessDenied from "@/components/auth/access-denied";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  Target, 
  ShieldAlert, 
  TrendingUp, 
  Zap, 
  Calendar, 
  MessageSquare, 
  Activity, 
  Cpu, 
  Terminal,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeDealIntelligence, type DealIntelligenceOutput } from "@/ai/flows/ai-deal-intelligence";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DealIntelligencePage() {
    const { user, profile, isUserLoading, isProfileLoading } = useUserWithRole();
    const router = useRouter();
    const [report, setReport] = useState<DealIntelligenceOutput | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [dealData, setDealData] = useState<any>(null);

    useEffect(() => {
        const storedData = typeof window !== 'undefined' ? localStorage.getItem('current_quotation_analysis') : null;
        if (storedData) {
            try {
                setDealData(JSON.parse(storedData));
            } catch (e) {
                console.error("Failed to parse deal data", e);
            }
        }
    }, []);

    const runAnalysis = async () => {
        if (!dealData || !dealData.lineItems) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeDealIntelligence({
                customerName: dealData.customerName || 'Unknown',
                companyName: dealData.companyName || 'Unknown',
                totalAmount: dealData.totalAmount || 0,
                subject: dealData.subject || 'Enterprise Quotation',
                products: dealData.lineItems.map((item: any) => ({
                    model: item.product?.model || 'Item',
                    quantity: item.quantity || 1,
                    unitPrice: item.unitPrice || 0
                }))
            });
            setReport(result);
        } catch (error) {
            console.error("Analysis synthesis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        if (dealData && !report && !isAnalyzing) {
            runAnalysis();
        }
    }, [dealData]);

    const isLoading = isUserLoading || isProfileLoading;

    if (isLoading) return <CenteredLoader text="Authenticating Uplink..." />;
    if (!user) { router.push('/login'); return null; }
    if (!profile || profile.role !== 'admin') return <AccessDenied />;

    const IntelligenceModule = ({ title, icon: Icon, children, className }: any) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden holographic-edge group", className)}
        >
            <div className="bg-white/5 border-b border-white/5 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Icon size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{title}</span>
                </div>
                <div className="h-1 w-8 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors" />
            </div>
            <div className="p-6">
                {children}
            </div>
        </motion.div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-black font-code selection:bg-primary/30">
            <Header />
            <main className="flex-1 pt-24 pb-12 relative overflow-hidden">
                <div className="fixed inset-0 command-grid pointer-events-none opacity-20" />
                <div className="scanline" />
                <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,224,255,0.02)_0%,transparent_70%)] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Intelligence Briefing Alpha</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
                                Deal Intelligence <span className="text-white/10">|</span> <span className="text-white/40 font-light">Report v4.0.1</span>
                            </h1>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={runAnalysis}
                            disabled={isAnalyzing}
                            className="h-12 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary uppercase font-bold text-xs tracking-widest px-8"
                        >
                            {isAnalyzing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                            Recalibrate Analysis
                        </Button>
                    </div>

                    {!dealData ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                            <ShieldAlert size={64} className="text-white/10 mb-6" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">No Active Quotation Data</h2>
                            <p className="text-white/30 text-sm mt-2 max-w-sm">Please generate a quotation in the Quotation Studio first to run a deal intelligence report.</p>
                            <Button className="mt-8 bg-primary text-black font-bold uppercase tracking-widest px-8" onClick={() => router.push('/quotation-builder')}>
                                Return to Studio
                            </Button>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Cpu className="text-primary animate-pulse" size={32} />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-primary tracking-[0.5em] uppercase">Synthesizing Logic Matrix...</p>
                        </div>
                    ) : report && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-8">
                                <IntelligenceModule title="Deal Health Matrix" icon={Activity}>
                                    <div className="text-center py-6">
                                        <div className="relative inline-block">
                                            <svg className="w-40 h-40 transform -rotate-90">
                                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                                <motion.circle 
                                                    initial={{ strokeDashoffset: 440 }}
                                                    animate={{ strokeDashoffset: 440 - (440 * (report.dealHealth?.score || 0)) / 100 }}
                                                    transition={{ duration: 2, ease: "easeOut" }}
                                                    cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                                    strokeDasharray="440"
                                                    className="text-primary drop-shadow-[0_0_8px_rgba(0,224,255,0.5)]" 
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black text-white">{report.dealHealth?.score || 0}</span>
                                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Index</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 space-y-2">
                                            <div className={cn(
                                                "inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] border",
                                                report.dealHealth?.status === 'HIGH-CONFIDENCE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                report.dealHealth?.status === 'STRONG' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            )}>
                                                {report.dealHealth?.status || 'MODERATE'}
                                            </div>
                                            <p className="text-[11px] text-white/60 italic leading-relaxed px-4">"{report.dealHealth?.reason || 'Awaiting full telemetry data.'}"</p>
                                        </div>
                                    </div>
                                </IntelligenceModule>

                                <IntelligenceModule title="Probability Scanner" icon={Target}>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Success Logic</span>
                                            <span className="text-2xl font-black text-primary">{report.winProbability || 0}%</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${report.winProbability || 0}%` }}
                                                className="h-full bg-primary shadow-[0_0_15px_rgba(0,224,255,0.5)]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                                <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Target Org</div>
                                                <div className="text-[10px] font-bold text-white truncate uppercase">{dealData.companyName || 'N/A'}</div>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                                <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Valuation</div>
                                                <div className="text-[10px] font-bold text-white truncate uppercase">₹{((dealData.totalAmount || 0) / 100000).toFixed(2)}L</div>
                                            </div>
                                        </div>
                                    </div>
                                </IntelligenceModule>
                            </div>

                            <div className="lg:col-span-2 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <IntelligenceModule title="Risk Factors Detected" icon={ShieldAlert}>
                                        <div className="space-y-4">
                                            {report.riskFactors?.map((risk, i) => (
                                                <div key={i} className="flex gap-3 items-start group">
                                                    <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                                    <span className="text-[11px] text-white/70 font-medium leading-relaxed group-hover:text-white transition-colors">{risk}</span>
                                                </div>
                                            )) || <span className="text-[11px] text-white/30 italic">No critical risks identified.</span>}
                                        </div>
                                    </IntelligenceModule>

                                    <IntelligenceModule title="Discount Intelligence" icon={TrendingUp}>
                                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10"><Lock size={40} /></div>
                                            <p className="text-[11px] text-primary leading-relaxed font-bold italic">
                                                {report.discountIntelligence || "Pricing parameters within safe margins."}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-widest">
                                            <Zap size={10} className="text-primary"/> Margin Protection Active
                                        </div>
                                    </IntelligenceModule>
                                </div>

                                <IntelligenceModule title="Actionable Sales Command" icon={Terminal} className="border-primary/20">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <BrainCircuit size={24} />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Next Phase Protocol:</h3>
                                            <p className="text-[12px] text-white/70 leading-relaxed font-medium border-l-2 border-primary/30 pl-4 py-1 italic">
                                                {report.salesAdvice || "Awaiting strategic synthesis."}
                                            </p>
                                        </div>
                                    </div>
                                </IntelligenceModule>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <IntelligenceModule title="Follow-Up Strategy" icon={Calendar}>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Target Engagement</span>
                                                <span className="text-xs font-bold text-primary font-mono">{report.followUpStrategy?.suggestedDate || 'TBD'}</span>
                                            </div>
                                            <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageSquare size={12} className="text-primary/60"/>
                                                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Script Draft</span>
                                                </div>
                                                <p className="text-[10px] text-white/60 leading-relaxed font-serif italic">
                                                    "{report.followUpStrategy?.message || 'Ready for client dispatch.'}"
                                                </p>
                                            </div>
                                        </div>
                                    </IntelligenceModule>

                                    <IntelligenceModule title="Client Buying Signals" icon={Zap}>
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                                                <p className="text-[11px] text-white/70 leading-relaxed font-medium italic">
                                                    {report.buyingSignals || "Analyzing historical organizational patterns."}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary/40 w-2/3" />
                                                </div>
                                                <span className="text-[8px] font-bold text-white/20 uppercase whitespace-nowrap">Velocity Index</span>
                                            </div>
                                        </div>
                                    </IntelligenceModule>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
