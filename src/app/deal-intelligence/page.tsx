'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserWithRole, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { CenteredLoader } from "@/components/ui/centered-loader";
import AccessDenied from "@/components/auth/access-denied";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  Target, 
  ShieldAlert, 
  TrendingUp, 
  Zap, 
  Activity, 
  Cpu, 
  Terminal,
  RefreshCw,
  AlertTriangle,
  Lock,
  History,
  DollarSign,
  ChevronRight,
  Eye,
  Package,
  Calendar,
  Building2,
  MapPin,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { collection } from "firebase/firestore";
import { analyzeDealIntelligence, type DealIntelligenceOutput } from "@/ai/flows/ai-deal-intelligence";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminLayout } from "@/components/layout/admin-layout";

export default function DealIntelligencePage() {
    const { user, profile, isUserLoading, isProfileLoading } = useUserWithRole();
    const firestore = useFirestore();
    const router = useRouter();
    const [report, setReport] = useState<DealIntelligenceOutput | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
    const [viewingQuotation, setViewingQuotation] = useState<any | null>(null);

    const isLoading = isUserLoading || isProfileLoading;

    const quotationsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'quotations');
    }, [firestore, user]);

    const { data: rawQuotations, isLoading: isQuotationLoading } = useCollection(quotationsQuery);

    const processedData = useMemo(() => {
        if (!rawQuotations || rawQuotations.length === 0) return null;
        const sorted = [...rawQuotations].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const activeQuotation = selectedQuotationId 
            ? sorted.find(q => q.quotationId === selectedQuotationId) 
            : (sorted.find(q => q.status === 'ACTIVE') || sorted[0]);
        
        let totalImpact = 0;
        let activeCount = 0;
        let archivedCount = 0;

        sorted.forEach(q => {
            try {
                const totals = JSON.parse(q.totals || '{}');
                totalImpact += (totals.grandTotal || 0);
                if (q.status === 'ACTIVE') activeCount++;
                else archivedCount++;
            } catch (e) {}
        });

        return { activeQuotation, totalImpact, activeCount, archivedCount, allQuotations: sorted };
    }, [rawQuotations, selectedQuotationId]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        setReport(null);
    }, [selectedQuotationId]);

    const runAnalysis = async () => {
        if (!processedData?.activeQuotation) return;
        setIsAnalyzing(true);
        try {
            const active = processedData.activeQuotation;
            const client = JSON.parse(active.clientDetails || '{}');
            const products = JSON.parse(active.products || '[]');
            const pricing = JSON.parse(active.pricing || '[]');
            const totals = JSON.parse(active.totals || '{}');

            const result = await analyzeDealIntelligence({
                customerName: client.name || 'Unknown',
                companyName: client.companyName || 'Unknown',
                totalAmount: totals.grandTotal || 0,
                subject: active.subject || 'Enterprise Quotation',
                products: products.map((item: any, idx: number) => ({
                    model: item.model || 'Item',
                    quantity: item.quantity || 1,
                    unitPrice: pricing[idx]?.unitPrice || 0
                }))
            });
            setReport(result);
        } catch (error) {
            console.error("Analysis synthesis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isLoading || isQuotationLoading) return (
        <div className="flex flex-col min-h-screen bg-white items-center justify-center">
            <CenteredLoader text="Syncing Intelligence Matrix..." />
        </div>
    );
    if (!user) return null;
    if (!profile || profile.role !== 'admin') return <AccessDenied />;

    const StatCard = ({ label, value, icon: Icon, colorClass }: any) => (
        <Card className="bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_8px_30px_rgba(26,140,255,0.1)] transition-all duration-500">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
                        <p className={cn("text-2xl font-black tracking-tighter text-slate-900", colorClass)}>{value}</p>
                    </div>
                    <div className={cn("p-3 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform duration-500", colorClass)}>
                        <Icon size={20} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AdminLayout>
            <div className="container mx-auto px-0 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Intelligence Command Alpha</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-4 font-[Outfit]">
                            Deal Intelligence <span className="text-slate-100">|</span> <span className="text-slate-300 font-light">System v4.5</span>
                        </h1>
                    </div>
                    {processedData?.activeQuotation && (
                        <div className="flex gap-4">
                            <Button 
                                variant="outline"
                                onClick={() => setSelectedQuotationId(null)}
                                className="h-14 border-slate-200 bg-white text-slate-900 font-bold uppercase tracking-widest px-6 hover:bg-slate-50 transition-all"
                            >
                                Reset to Latest
                            </Button>
                            <Button 
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                className="h-14 bg-primary text-white font-black uppercase tracking-widest px-10 hover:shadow-[0_20px_50px_-15px_rgba(26,140,255,0.4)] transition-all"
                            >
                                {isAnalyzing ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <BrainCircuit className="mr-2 h-5 w-5" />}
                                Run AI Analysis
                            </Button>
                        </div>
                    )}
                </div>

                {!processedData ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                        <ShieldAlert size={64} className="text-slate-100 mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">Database Offline</h2>
                        <p className="text-slate-400 text-sm mt-2 max-w-sm">No quotation records found in the mission registry. Generate a proposal in the Studio first.</p>
                        <Button className="mt-8 bg-primary text-white font-bold uppercase tracking-widest px-8" onClick={() => router.push('/quotation-builder')}>
                            Return to Studio
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <StatCard label="Global Valuation" value={`₹${(processedData.totalImpact / 100000).toFixed(1)}L`} icon={DollarSign} colorClass="text-primary" />
                                <StatCard label="Active Deals" value={processedData.activeCount} icon={Activity} colorClass="text-emerald-600" />
                                <StatCard label="Historical Log" value={processedData.archivedCount} icon={History} colorClass="text-slate-400" />

                                <Card className="bg-white border-slate-100 p-6 border-l-4 border-l-primary shadow-sm">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                        <Target size={12}/> Analysis Target
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-slate-900 uppercase truncate">{processedData.activeQuotation.quotationId}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                                            {new Date(processedData.activeQuotation.createdAt).toLocaleDateString()}
                                        </p>
                                        <Badge variant="outline" className="text-[8px] font-black tracking-widest border-primary/20 text-primary uppercase">
                                            {processedData.activeQuotation.status}
                                        </Badge>
                                    </div>
                                </Card>
                            </div>

                            <div className="lg:col-span-3">
                                <AnimatePresence mode="wait">
                                    {isAnalyzing ? (
                                        <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[500px] flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-[2rem]">
                                            <div className="relative mb-8">
                                                <div className="w-24 h-24 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
                                                <div className="absolute inset-0 flex items-center justify-center"><Cpu className="text-primary animate-pulse" size={32} /></div>
                                            </div>
                                            <p className="text-[10px] font-black text-primary tracking-[0.5em] uppercase">Synthesizing Logic Matrix...</p>
                                        </motion.div>
                                    ) : report ? (
                                        <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <Card className="bg-white border-slate-100 overflow-hidden shadow-sm">
                                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                                                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-900"><Activity size={14} className="text-primary"/> Deal Health</CardTitle>
                                                        <span className="text-[10px] font-bold text-primary">{report.winProbability}% Win Probability</span>
                                                    </CardHeader>
                                                    <CardContent className="p-8 flex flex-col items-center">
                                                        <div className="relative w-40 h-40 mb-6">
                                                            <svg className="w-full h-full transform -rotate-90">
                                                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                                                <motion.circle initial={{ strokeDashoffset: 440 }} animate={{ strokeDashoffset: 440 - (440 * (report.winProbability || 0)) / 100 }} cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="440" className="text-primary" />
                                                            </svg>
                                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                                <span className="text-3xl font-black text-slate-900">{report.winProbability}%</span>
                                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Confidence</span>
                                                            </div>
                                                        </div>
                                                        <div className={cn("px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mb-4 shadow-sm", report.dealHealth?.status === 'HIGH-CONFIDENCE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100')}>
                                                            {report.dealHealth?.status}
                                                        </div>
                                                        <p className="text-xs text-slate-500 text-center italic leading-relaxed px-4 font-medium">"{report.dealHealth?.reason}"</p>
                                                    </CardContent>
                                                </Card>

                                                <Card className="bg-white border-slate-100 overflow-hidden shadow-sm">
                                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-900"><ShieldAlert size={14} className="text-rose-500"/> Risk Telemetry</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-6">
                                                        <div className="space-y-4">
                                                            {report.riskFactors?.map((risk, i) => (
                                                                <div key={i} className="flex gap-4 items-start border-l-2 border-slate-100 hover:border-rose-500/30 transition-colors pl-6 py-2">
                                                                    <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                                                    <span className="text-[11px] text-slate-600 font-bold leading-relaxed uppercase tracking-tight">{risk}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <Card className="bg-primary border-none shadow-[0_20px_50px_-15px_rgba(26,140,255,0.4)] overflow-hidden">
                                                <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
                                                    <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner backdrop-blur-md"><Terminal size={36} /></div>
                                                    <div className="text-center md:text-left">
                                                        <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] mb-3">Primary Sales Command</h3>
                                                        <p className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">{report.salesAdvice}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <Card className="bg-white border-slate-100 p-8 shadow-sm group hover:border-primary/20 transition-all duration-500">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3"><Zap size={14} className="animate-pulse"/> Client Buying Signals</h4>
                                                    <p className="text-xs text-slate-600 leading-relaxed font-bold italic border-l-2 border-primary/20 pl-6">{report.buyingSignals}</p>
                                                </Card>
                                                <Card className="bg-white border-slate-100 p-8 shadow-sm group hover:border-slate-300 transition-all duration-500">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3"><Lock size={14}/> Margin Integrity</h4>
                                                    <p className="text-xs text-slate-600 leading-relaxed font-bold italic border-l-2 border-slate-100 pl-6">{report.discountIntelligence}</p>
                                                </Card>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="standby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] group hover:border-primary/30 transition-all bg-slate-50/30">
                                            <BrainCircuit className="h-20 w-20 text-slate-100 group-hover:text-primary transition-all duration-700 mb-8" />
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-[0.4em] mb-3">System Standby</h3>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Ready to analyze target: {processedData.activeQuotation.quotationId}</p>
                                            <Button onClick={runAnalysis} className="mt-10 bg-primary text-white hover:shadow-lg px-12 h-14 uppercase font-black tracking-widest text-xs rounded-full">Execute Logic Trace</Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="h-px flex-1 bg-slate-100" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 flex items-center gap-4 whitespace-nowrap font-[Outfit]"><History size={16} /> Mission Registry Full History</h2>
                                <div className="h-px flex-1 bg-slate-100" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {processedData.allQuotations.map((q) => {
                                    const client = JSON.parse(q.clientDetails || '{}');
                                    const totals = JSON.parse(q.totals || '{}');
                                    const isSelected = selectedQuotationId === q.quotationId || (!selectedQuotationId && q.quotationId === processedData.activeQuotation.quotationId);

                                    return (
                                        <motion.div key={q.quotationId} whileHover={{ y: -8 }} className={cn("group cursor-pointer bg-white border rounded-[2rem] p-8 transition-all duration-500", isSelected ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" : "border-slate-100 hover:border-primary/30 shadow-sm hover:shadow-xl")} onClick={() => setSelectedQuotationId(q.quotationId)}>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2"><span className={cn("text-[10px] font-black uppercase tracking-widest", isSelected ? "text-primary" : "text-slate-400")}>{q.quotationId}</span>{q.status === 'ACTIVE' && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}</div>
                                                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter truncate max-w-[220px] font-[Outfit]">{client.companyName || 'Unknown Entity'}</h4>
                                                </div>
                                                <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-tighter px-3 py-1 border-none rounded-full", q.status === 'ACTIVE' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}>{q.status}</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-50 mb-6">
                                                <div className="space-y-1"><span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Impact</span><p className="text-sm font-mono font-black text-slate-900">₹{(totals.grandTotal / 100000).toFixed(1)}L</p></div>
                                                <div className="space-y-1"><span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Date</span><p className="text-sm font-black text-slate-500 uppercase tracking-tight">{new Date(q.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p></div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Button variant="ghost" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 hover:text-primary px-4 rounded-full" onClick={(e) => { e.stopPropagation(); setViewingQuotation(q); }}><Eye size={14} className="mr-3" /> View Trace</Button>
                                                <div className="flex items-center gap-3 group-hover:translate-x-2 transition-transform duration-500"><span className={cn("text-[9px] font-black uppercase tracking-widest", isSelected ? "text-primary" : "text-slate-300")}>{isSelected ? "Focused" : "Analyze"}</span><ChevronRight size={16} className={isSelected ? "text-primary" : "text-slate-300"} /></div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={!!viewingQuotation} onOpenChange={(open) => !open && setViewingQuotation(null)}>
                <DialogContent className="max-w-5xl bg-white border-none p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
                    {viewingQuotation && (() => {
                        const client = JSON.parse(viewingQuotation.clientDetails || '{}');
                        const products = JSON.parse(viewingQuotation.products || '[]');
                        const pricing = JSON.parse(viewingQuotation.pricing || '[]');
                        const totals = JSON.parse(viewingQuotation.totals || '{}');

                        return (
                            <div className="flex flex-col h-[90vh]">
                                <div className="bg-slate-50 border-b border-slate-100 p-12 shrink-0 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12"><ClipboardList size={240} /></div>
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3"><Terminal size={18} className="text-primary" /><span className="text-[11px] font-black tracking-[0.5em] text-primary uppercase">Mission Telemetry Trace</span></div>
                                            <DialogTitle className="text-4xl font-black uppercase tracking-tighter mb-3 text-slate-900 font-[Outfit]">{viewingQuotation.quotationId}</DialogTitle>
                                            <DialogDescription className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-2xl line-clamp-1 italic">Identity: {viewingQuotation.subject}</DialogDescription>
                                        </div>
                                        <Badge className="bg-primary text-white font-black uppercase tracking-widest px-6 py-2 rounded-full text-xs shadow-lg shadow-primary/20">{viewingQuotation.status}</Badge>
                                    </div>
                                </div>
                                <ScrollArea className="flex-1 p-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
                                        <div className="space-y-8">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 border-b border-slate-50 pb-4 flex items-center gap-3"><Building2 size={14}/> Entity Identity Matrix</h4>
                                            <div className="space-y-6">
                                                <div><p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Organization</p><p className="text-lg font-black text-slate-900 uppercase tracking-tight">{client.companyName || 'N/A'}</p></div>
                                                <div><p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Primary Contact</p><p className="text-lg font-black text-slate-900 uppercase tracking-tight">{client.name || 'N/A'}</p></div>
                                                <div><p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Deployment Zone</p><div className="flex items-start gap-3 text-slate-600"><MapPin size={16} className="mt-1 shrink-0 text-primary/40" /><p className="text-xs font-bold leading-relaxed italic uppercase tracking-tight">{client.address || 'N/A'}</p></div></div>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 border-b border-slate-50 pb-4 flex items-center gap-3"><Calendar size={14}/> Temporal Coordinates</h4>
                                            <div className="grid grid-cols-2 gap-10">
                                                <div><p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Execution Date</p><p className="text-lg font-mono font-black text-slate-900">{new Date(viewingQuotation.createdAt).toLocaleDateString('en-IN')}</p></div>
                                                <div><p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Execution Time</p><p className="text-lg font-mono font-black text-slate-900">{new Date(viewingQuotation.createdAt).toLocaleTimeString('en-IN')}</p></div>
                                                <div><p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Origin Agency</p><p className="text-xs font-black text-slate-300 uppercase tracking-widest">DEEQASA TECH HUB</p></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 border-b border-slate-50 pb-4 flex items-center gap-3"><Package size={14}/> Technical Bill of Materials</h4>
                                        <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                            <Table>
                                                <TableHeader className="bg-slate-50">
                                                    <TableRow className="border-slate-100 hover:bg-slate-50">
                                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase h-14 pl-8">Material Description</TableHead>
                                                        <TableHead className="text-[10px] font-black text-slate-400 uppercase h-14">Identity SKU</TableHead>
                                                        <TableHead className="text-center text-[10px] font-black text-slate-400 uppercase h-14">Qty</TableHead>
                                                        <TableHead className="text-right text-[10px] font-black text-slate-400 uppercase h-14">Unit (₹)</TableHead>
                                                        <TableHead className="text-right text-[10px] font-black text-slate-400 uppercase h-14 pr-8">Valuation (₹)</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {products.map((p: any, i: number) => (
                                                        <TableRow key={i} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                            <TableCell className="text-[12px] font-black text-slate-900 uppercase pl-8 h-16">{p.model}</TableCell>
                                                            <TableCell className="text-xs font-mono text-slate-400">{p.sku}</TableCell>
                                                            <TableCell className="text-center text-[12px] font-black text-slate-900">{p.quantity}</TableCell>
                                                            <TableCell className="text-right text-xs font-mono text-slate-500">{pricing[i]?.unitPrice?.toLocaleString('en-IN')}</TableCell>
                                                            <TableCell className="text-right text-[12px] font-mono font-black text-primary pr-8">{(p.quantity * (pricing[i]?.unitPrice || 0)).toLocaleString('en-IN')}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </ScrollArea>
                                <div className="bg-slate-50 border-t border-slate-100 p-12 shrink-0">
                                    <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-emerald-600/60"><Activity size={14}/><span className="text-[9px] font-black uppercase tracking-[0.3em]">Integrity Protocol Verified</span></div>
                                            <p className="text-[11px] text-slate-400 italic max-w-sm font-medium leading-relaxed uppercase tracking-tight">"All technical specifications and pricing matrices have been synchronized with global hardware standards."</p>
                                        </div>
                                        <div className="w-full md:w-96 bg-white p-8 rounded-[2rem] border border-slate-100 space-y-4 shadow-xl">
                                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest"><span>Sub-Total Impact</span><span>₹{totals.subTotal?.toLocaleString('en-IN')}</span></div>
                                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-4"><span>Tax Component (18%)</span><span>₹{totals.totalGst?.toLocaleString('en-IN')}</span></div>
                                            <div className="flex justify-between items-end pt-2"><span className="text-[11px] font-black uppercase text-primary tracking-[0.4em] mb-1">Final Valuation</span><span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">₹{totals.grandTotal?.toLocaleString('en-IN')}</span></div>
                                        </div>
                                    </div>
                                    <div className="mt-12 flex justify-end gap-6">
                                        <Button variant="outline" className="border-slate-200 hover:bg-white text-slate-500 rounded-full uppercase font-black tracking-widest text-[10px] h-14 px-10" onClick={() => setViewingQuotation(null)}>Close Terminal</Button>
                                        <Button className="bg-primary text-white font-black rounded-full uppercase tracking-widest text-[10px] h-14 px-12 shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => { setSelectedQuotationId(viewingQuotation.quotationId); setViewingQuotation(null); }}>Initialize Analysis</Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
