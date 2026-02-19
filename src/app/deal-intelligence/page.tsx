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
        <div className="flex flex-col min-h-screen bg-background items-center justify-center">
            <CenteredLoader text="Syncing Intelligence Matrix..." />
        </div>
    );
    if (!user) return null;
    if (!profile || profile.role !== 'admin') return <AccessDenied />;

    const StatCard = ({ label, value, icon: Icon, colorClass }: any) => (
        <Card className="bg-card/40 border-white/5 holographic-edge overflow-hidden group">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
                        <p className={cn("text-2xl font-black tracking-tighter", colorClass)}>{value}</p>
                    </div>
                    <div className={cn("p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform", colorClass)}>
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
                            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Intelligence Center Alpha</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
                            Deal Intelligence <span className="text-white/10">|</span> <span className="text-white/40 font-light">System v4.5</span>
                        </h1>
                    </div>
                    {processedData?.activeQuotation && (
                        <div className="flex gap-4">
                            <Button 
                                variant="outline"
                                onClick={() => setSelectedQuotationId(null)}
                                className="h-14 border-white/10 bg-white/5 text-white font-bold uppercase tracking-widest px-6"
                            >
                                Reset to Latest
                            </Button>
                            <Button 
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                className="h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest px-10 hover:shadow-[0_0_20px_rgba(0,224,255,0.4)] transition-all"
                            >
                                {isAnalyzing ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <BrainCircuit className="mr-2 h-5 w-5" />}
                                Run AI Analysis
                            </Button>
                        </div>
                    )}
                </div>

                {!processedData ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-card/40 border border-white/5 rounded-3xl backdrop-blur-xl">
                        <ShieldAlert size={64} className="text-muted-foreground/10 mb-6" />
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest">Database Offline or Empty</h2>
                        <p className="text-muted-foreground/30 text-sm mt-2 max-w-sm">No quotation records found in the mission registry. Generate a proposal in the Studio first.</p>
                        <Button className="mt-8 bg-primary text-primary-foreground font-bold uppercase tracking-widest px-8" onClick={() => router.push('/quotation-builder')}>
                            Return to Studio
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <StatCard label="Global Valuation" value={`₹${(processedData.totalImpact / 100000).toFixed(1)}L`} icon={DollarSign} colorClass="text-primary" />
                                <StatCard label="Active Deals" value={processedData.activeCount} icon={Activity} colorClass="text-emerald-400" />
                                <StatCard label="Historical Log" value={processedData.archivedCount} icon={History} colorClass="text-white/20" />

                                <Card className="bg-card/40 border-white/5 backdrop-blur-xl p-6 border-l-2 border-l-primary/30">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                        <Target size={12}/> Analysis Target
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-white uppercase truncate">{processedData.activeQuotation.quotationId}</p>
                                        <p className="text-[10px] font-bold text-white/40 uppercase">
                                            {new Date(processedData.activeQuotation.createdAt).toLocaleDateString()}
                                        </p>
                                        <Badge variant="outline" className="text-[8px] font-black tracking-widest border-primary/20 text-primary">
                                            {processedData.activeQuotation.status}
                                        </Badge>
                                    </div>
                                </Card>
                            </div>

                            <div className="lg:col-span-3">
                                <AnimatePresence mode="wait">
                                    {isAnalyzing ? (
                                        <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[500px] flex flex-col items-center justify-center bg-card/40 border border-primary/20 rounded-3xl backdrop-blur-xl">
                                            <div className="relative mb-8">
                                                <div className="w-24 h-24 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                                                <div className="absolute inset-0 flex items-center justify-center"><Cpu className="text-primary animate-pulse" size={32} /></div>
                                            </div>
                                            <p className="text-[10px] font-black text-primary tracking-[0.5em] uppercase">Synthesizing Logic Matrix...</p>
                                        </motion.div>
                                    ) : report ? (
                                        <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <Card className="bg-card/40 border-white/5 overflow-hidden holographic-edge">
                                                    <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between">
                                                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><Activity size={14} className="text-primary"/> Deal Health</CardTitle>
                                                        <span className="text-[10px] font-bold text-primary">{report.winProbability}% Score</span>
                                                    </CardHeader>
                                                    <CardContent className="p-8 flex flex-col items-center">
                                                        <div className="relative w-32 h-32 mb-6">
                                                            <svg className="w-full h-full transform -rotate-90">
                                                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                                                <motion.circle initial={{ strokeDashoffset: 377 }} animate={{ strokeDashoffset: 377 - (377 * (report.dealHealth?.score || 0)) / 100 }} cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="377" className="text-primary" />
                                                            </svg>
                                                            <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-black text-white">{report.dealHealth?.score}</span></div>
                                                        </div>
                                                        <div className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-4", report.dealHealth?.status === 'HIGH-CONFIDENCE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20')}>
                                                            {report.dealHealth?.status}
                                                        </div>
                                                        <p className="text-xs text-white/40 text-center italic leading-relaxed px-4">"{report.dealHealth?.reason}"</p>
                                                    </CardContent>
                                                </Card>

                                                <Card className="bg-card/40 border-white/5 overflow-hidden holographic-edge">
                                                    <CardHeader className="bg-white/5 border-b border-white/5">
                                                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={14} className="text-red-500"/> Risk Telemetry</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-6">
                                                        <div className="space-y-4">
                                                            {report.riskFactors?.map((risk, i) => (
                                                                <div key={i} className="flex gap-3 items-start border-l-2 border-red-500/30 pl-4 py-1">
                                                                    <AlertTriangle size={12} className="text-red-500 mt-0.5 shrink-0" />
                                                                    <span className="text-[11px] text-white/60 font-medium leading-relaxed uppercase">{risk}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <Card className="bg-primary border-none shadow-[0_0_40px_rgba(0,224,255,0.2)] overflow-hidden">
                                                <CardContent className="p-8 flex items-center gap-8">
                                                    <div className="w-16 h-16 rounded-2xl bg-black/10 flex items-center justify-center text-black shrink-0"><Terminal size={32} /></div>
                                                    <div>
                                                        <h3 className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] mb-2">Primary Sales Command</h3>
                                                        <p className="text-xl font-black text-black leading-tight uppercase">{report.salesAdvice}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <Card className="bg-card/40 border-white/5 p-6">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2"><Zap size={12}/> Client Buying Signals</h4>
                                                    <p className="text-xs text-white/40 leading-relaxed font-medium italic border-l border-primary/30 pl-4">{report.buyingSignals}</p>
                                                </Card>
                                                <Card className="bg-card/40 border-white/5 p-6">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4 flex items-center gap-2"><Lock size={12}/> Margin Integrity</h4>
                                                    <p className="text-xs text-white/40 leading-relaxed font-medium italic border-l border-white/10 pl-4">{report.discountIntelligence}</p>
                                                </Card>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="standby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl group hover:border-primary/20 transition-all">
                                            <BrainCircuit className="h-16 w-16 text-white/10 group-hover:text-primary/40 transition-all mb-6" />
                                            <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] mb-2">Logic Standby</h3>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Ready to analyze target: {processedData.activeQuotation.quotationId}</p>
                                            <Button onClick={runAnalysis} className="mt-8 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-8 h-12 uppercase font-black tracking-widest text-xs">Execute Analysis</Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/5" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 flex items-center gap-3 whitespace-nowrap"><History size={14} /> Mission Registry Full History</h2>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {processedData.allQuotations.map((q) => {
                                    const client = JSON.parse(q.clientDetails || '{}');
                                    const totals = JSON.parse(q.totals || '{}');
                                    const isSelected = selectedQuotationId === q.quotationId || (!selectedQuotationId && q.quotationId === processedData.activeQuotation.quotationId);

                                    return (
                                        <motion.div key={q.quotationId} whileHover={{ y: -4 }} className={cn("group cursor-pointer bg-card/40 border rounded-2xl p-6 transition-all duration-300", isSelected ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(0,224,255,0.1)]" : "border-white/5 hover:border-white/20")} onClick={() => setSelectedQuotationId(q.quotationId)}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2"><span className={cn("text-[9px] font-black uppercase tracking-widest", isSelected ? "text-primary" : "text-white/20")}>{q.quotationId}</span>{q.status === 'ACTIVE' && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}</div>
                                                    <h4 className="text-sm font-bold text-white uppercase truncate max-w-[200px]">{client.companyName || 'Unknown Entity'}</h4>
                                                </div>
                                                <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-tighter px-2 border-none", q.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/20")}>{q.status}</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-4">
                                                <div className="space-y-1"><span className="text-[8px] font-black text-white/10 uppercase tracking-widest">Impact</span><p className="text-xs font-mono font-bold text-white/80">₹{(totals.grandTotal / 100000).toFixed(1)}L</p></div>
                                                <div className="space-y-1"><span className="text-[8px] font-black text-white/10 uppercase tracking-widest">Date</span><p className="text-xs font-bold text-white/40 uppercase">{new Date(q.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p></div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 hover:text-primary p-0 px-2" onClick={(e) => { e.stopPropagation(); setViewingQuotation(q); }}><Eye size={12} className="mr-2" /> View Specs</Button>
                                                <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform"><span className={cn("text-[9px] font-black uppercase tracking-widest", isSelected ? "text-primary" : "text-white/20")}>{isSelected ? "Focused" : "Load Matrix"}</span><ChevronRight size={14} className={isSelected ? "text-primary" : "text-white/20"} /></div>
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
                <DialogContent className="max-w-4xl bg-card border-primary/20 p-0 overflow-hidden font-code text-white">
                    {viewingQuotation && (() => {
                        const client = JSON.parse(viewingQuotation.clientDetails || '{}');
                        const products = JSON.parse(viewingQuotation.products || '[]');
                        const pricing = JSON.parse(viewingQuotation.pricing || '[]');
                        const totals = JSON.parse(viewingQuotation.totals || '{}');

                        return (
                            <div className="flex flex-col h-[85vh]">
                                <div className="bg-primary/10 border-b border-primary/20 p-8 shrink-0 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><ClipboardList size={120} /></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2"><Terminal size={16} className="text-primary" /><span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Deal Telemetry Data</span></div>
                                            <DialogTitle className="text-3xl font-black uppercase tracking-tighter mb-2">{viewingQuotation.quotationId}</DialogTitle>
                                            <DialogDescription className="text-white/20 text-xs font-bold uppercase tracking-widest max-w-xl line-clamp-1">Subject: {viewingQuotation.subject}</DialogDescription>
                                        </div>
                                        <Badge className="bg-primary text-primary-foreground font-black uppercase tracking-widest px-4 py-1">{viewingQuotation.status}</Badge>
                                    </div>
                                </div>
                                <ScrollArea className="flex-1 p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2 flex items-center gap-2"><Building2 size={12}/> Client Entity Details</h4>
                                            <div className="space-y-4">
                                                <div><p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Organization</p><p className="text-sm font-bold uppercase">{client.companyName || 'N/A'}</p></div>
                                                <div><p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Attention To</p><p className="text-sm font-bold uppercase">{client.name || 'N/A'}</p></div>
                                                <div><p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Address Matrix</p><div className="flex items-start gap-2 text-white/40"><MapPin size={14} className="mt-0.5 shrink-0" /><p className="text-xs font-medium leading-relaxed italic">{client.address || 'N/A'}</p></div></div>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2 flex items-center gap-2"><Calendar size={12}/> Temporal Stamps</h4>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div><p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Generation Date</p><p className="text-sm font-mono font-bold">{new Date(viewingQuotation.createdAt).toLocaleDateString('en-IN')}</p></div>
                                                <div><p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Generation Time</p><p className="text-sm font-mono font-bold">{new Date(viewingQuotation.createdAt).toLocaleTimeString('en-IN')}</p></div>
                                                <div><p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Agent Controller</p><p className="text-xs font-bold text-white/20 uppercase">DEEQASA ADMIN</p></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2 flex items-center gap-2"><Package size={12}/> Technical Bill of Materials</h4>
                                        <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/5">
                                            <Table>
                                                <TableHeader className="bg-white/5">
                                                    <TableRow className="border-white/10">
                                                        <TableHead className="text-[9px] font-black text-white/20 uppercase">Item Description</TableHead>
                                                        <TableHead className="text-[9px] font-black text-white/20 uppercase">SKU Identity</TableHead>
                                                        <TableHead className="text-center text-[9px] font-black text-white/20 uppercase">Qty</TableHead>
                                                        <TableHead className="text-right text-[9px] font-black text-white/20 uppercase">Unit (₹)</TableHead>
                                                        <TableHead className="text-right text-[9px] font-black text-white/20 uppercase">Impact (₹)</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {products.map((p: any, i: number) => (
                                                        <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors">
                                                            <TableCell className="text-[11px] font-bold text-white uppercase">{p.model}</TableCell>
                                                            <TableCell className="text-[10px] font-mono text-white/20">{p.sku}</TableCell>
                                                            <TableCell className="text-center text-[11px] font-bold">{p.quantity}</TableCell>
                                                            <TableCell className="text-right text-[11px] font-mono">{pricing[i]?.unitPrice?.toLocaleString('en-IN')}</TableCell>
                                                            <TableCell className="text-right text-[11px] font-mono font-black text-primary">{(p.quantity * (pricing[i]?.unitPrice || 0)).toLocaleString('en-IN')}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </ScrollArea>
                                <div className="bg-white/5 border-t border-white/10 p-8 shrink-0">
                                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-emerald-500/50"><Activity size={12}/><span className="text-[8px] font-black uppercase tracking-widest">Pricing Matrix Verified</span></div>
                                            <p className="text-[10px] text-white/10 italic max-w-sm">"Financial integrity locked. All pricing values converted to INR standard for local compliance."</p>
                                        </div>
                                        <div className="w-full md:w-80 bg-black/40 p-6 rounded-2xl border border-white/10 space-y-3 shadow-2xl">
                                            <div className="flex justify-between text-[10px] font-bold uppercase text-white/20"><span>Sub-Total Impact</span><span>₹{totals.subTotal?.toLocaleString('en-IN')}</span></div>
                                            <div className="flex justify-between text-[10px] font-bold uppercase text-white/20 border-b border-white/10 pb-3"><span>Tax Component (18%)</span><span>₹{totals.totalGst?.toLocaleString('en-IN')}</span></div>
                                            <div className="flex justify-between items-end pt-2"><span className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Grand Valuation</span><span className="text-2xl font-black text-white font-mono tracking-tighter">₹{totals.grandTotal?.toLocaleString('en-IN')}</span></div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end gap-4">
                                        <Button variant="outline" className="border-white/10 hover:bg-white/5 uppercase font-black tracking-widest text-[10px] h-12 px-8" onClick={() => setViewingQuotation(null)}>Close Terminal</Button>
                                        <Button className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] h-12 px-10 shadow-[0_0_20px_rgba(0,224,255,0.3)]" onClick={() => { setSelectedQuotationId(viewingQuotation.quotationId); setViewingQuotation(null); }}>Focus AI Analysis</Button>
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