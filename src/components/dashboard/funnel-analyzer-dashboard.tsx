"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { FunnelData } from "@/lib/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "../ui/chart";
import { Button } from "../ui/button";
import { 
  BrainCircuit, 
  Edit, 
  RefreshCw, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Award, 
  UserX, 
  DollarSign, 
  Bot,
  Terminal,
  Activity,
  ShieldCheck,
  Cpu,
  Globe,
  Loader2,
  Lock
} from "lucide-react";
import { FunnelAnalysisOutput, analyzeFunnelData } from "@/ai/flows/ai-funnel-analyzer";
import { getSheetData } from "@/ai/flows/get-sheet-data";
import { updateSheetData } from "@/ai/flows/update-sheet-data";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { CenteredLoader } from "../ui/centered-loader";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
  funnels: { label: "Funnels", color: "hsl(var(--primary))" },
  won: { label: "Won", color: "hsl(var(--chart-2))" },
  lost: { label: "Lost", color: "hsl(var(--chart-3))" },
  pipeline: { label: "Pipeline", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const EXCHANGE_RATE_USD_TO_INR = 80;

const usdCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const inrCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const SPREADSHEET_ID = "1gZWkQV-2TYIDZ_bFEQG6EHlHPImXjb6p-4oSiCFRKFk";

const funnelFormSchema = z.object({
  status: z.enum(['Won', 'Lost', 'Pipeline']),
  revenue: z.coerce.number().min(0, "Revenue must be positive."),
  probability: z.coerce.number().min(0).max(100, "Probability must be between 0 and 100."),
  owner: z.string().min(1, "Owner is required."),
  segment: z.string().min(1, "Segment is required."),
});

type FunnelFormValues = z.infer<typeof funnelFormSchema>;

export function FunnelAnalyzerDashboard() {
  const [data, setData] = useState<FunnelData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [isReprocessing, setIsReprocessing] = useState(false);

  const [aiInsights, setAiInsights] = useState<FunnelAnalysisOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FunnelData | null>(null);
  const [itemToEdit, setItemToEdit] = useState<FunnelData | null>(null);
  const [isEditing, startEditTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FunnelFormValues>({
    resolver: zodResolver(funnelFormSchema),
    defaultValues: {
      status: 'Pipeline',
      revenue: 0,
      probability: 0,
      owner: '',
      segment: '',
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (itemToEdit) {
      form.reset({
        status: itemToEdit.status,
        revenue: itemToEdit.revenue,
        probability: itemToEdit.probability * 100,
        owner: itemToEdit.owner,
        segment: itemToEdit.segment,
      });
    }
  }, [itemToEdit, form]);

  async function onFormSubmit(values: FunnelFormValues) {
    if (!itemToEdit) return;
    startEditTransition(async () => {
        const payload: FunnelData = { ...itemToEdit, ...values, revenue: values.revenue, probability: values.probability / 100 };
        try {
            const result = await updateSheetData(payload);
            if (result.success) {
                toast({ title: "Update Successful", description: "Database record synchronized." });
                setItemToEdit(null);
                fetchData();
            } else {
                throw new Error(result.message);
            }
        } catch (e: any) {
            toast({ variant: "destructive", title: "Sync Failed", description: e.message });
        }
    });
  }

  const [monthFilter, setMonthFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");

  const fetchData = () => {
    setError(null);
    startRefreshTransition(async () => {
      try {
        const sheetData = await getSheetData({ spreadsheetId: SPREADSHEET_ID });
        setData(sheetData);
      } catch (e: any) {
        setError(e.message || "Protocol link severed. Could not retrieve data.");
      } finally {
        if (isInitialLoading) setIsInitialLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerReprocess = (setter: (v: string) => void, val: string) => {
    setIsReprocessing(true);
    setter(val);
    setTimeout(() => setIsReprocessing(false), 600);
  };

  const {
    months, owners, segments, filteredData, totalFunnels, wonCount, lostCount,
    pipelineCount, totalRevenue, wonRevenue, pipelineRevenue, revenueByMonthData,
    funnelsByOwnerData, funnelsBySegment, winRatioBySegment
  } = useMemo(() => {
    const months = ["all", ...Array.from(new Set(data.map((d) => d.closureMonth)))];
    const owners = ["all", ...Array.from(new Set(data.map((d) => d.owner)))];
    const segments = ["all", ...Array.from(new Set(data.map((d) => d.segment)))];

    const filteredData = data.filter(item =>
        (monthFilter === "all" || item.closureMonth === monthFilter) &&
        (ownerFilter === "all" || item.owner === ownerFilter) &&
        (segmentFilter === "all" || item.segment === segmentFilter)
    );

    const wonCount = filteredData.filter((d) => d.status === "Won").length;
    const lostCount = filteredData.filter((d) => d.status === "Lost").length;
    const pipelineCount = filteredData.filter((d) => d.status === "Pipeline").length;

    const wonRevenue = filteredData.filter((d) => d.status === "Won").reduce((sum, d) => sum + d.revenue, 0);
    const pipelineRevenue = filteredData.filter((d) => d.status === "Pipeline").reduce((sum, d) => sum + d.revenue * d.probability, 0);
    const totalRevenue = wonRevenue + pipelineRevenue;

    const revenueByMonthMap = filteredData.reduce((acc, d) => {
        if (d.status === 'Won') {
            if (!acc[d.closureMonth]) acc[d.closureMonth] = 0;
            acc[d.closureMonth] += d.revenue;
        }
        return acc;
    }, {} as Record<string, number>);
    const revenueByMonthData = Object.entries(revenueByMonthMap).map(([name, value]) => ({ name, revenue: value }));
    
    const funnelsByOwnerMap = filteredData.reduce((acc, d) => {
        if (!acc[d.owner]) acc[d.owner] = 0;
        acc[d.owner]++;
        return acc;
    }, {} as Record<string, number>);
    const funnelsByOwnerData = Object.entries(funnelsByOwnerMap).map(([name, value]) => ({ name, funnels: value }));

    const funnelsBySegment = filteredData.reduce((acc, d) => {
        if (!acc[d.segment]) acc[d.segment] = 0;
        acc[d.segment]++;
        return acc;
    }, {} as Record<string, number>);
    
    const allSegments = segments.filter(s => s !== 'all');
    const winRatioBySegment = allSegments.reduce((acc, segment) => {
        const totalInSegment = data.filter(d => d.segment === segment && (d.status === 'Won' || d.status === 'Lost')).length;
        const wonInSegment = data.filter(d => d.segment === segment && d.status === 'Won').length;
        acc[segment] = totalInSegment > 0 ? Math.round((wonInSegment / totalInSegment) * 100) : 0;
        return acc;
    }, {} as Record<string, number>);

    return {
      months, owners, segments, filteredData, totalFunnels: filteredData.length,
      wonCount, lostCount, pipelineCount, totalRevenue, wonRevenue, pipelineRevenue,
      revenueByMonthData, funnelsByOwnerData, funnelsBySegment, winRatioBySegment
    };
  }, [data, monthFilter, ownerFilter, segmentFilter]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAiInsights(null);
    startRefreshTransition(async () => {
        try {
            const insights = await analyzeFunnelData({
                totalFunnels, wonCount, lostCount, pipelineCount, totalRevenue, wonRevenue, pipelineRevenue,
                wonRevenueInr: wonRevenue * EXCHANGE_RATE_USD_TO_INR,
                pipelineRevenueInr: pipelineRevenue * EXCHANGE_RATE_USD_TO_INR,
                totalRevenueInr: totalRevenue * EXCHANGE_RATE_USD_TO_INR,
                revenueByMonth: filteredData.reduce((acc, d) => {
                    if (d.status === 'Won') { if (!acc[d.closureMonth]) acc[d.closureMonth] = 0; acc[d.closureMonth] += d.revenue; }
                    return acc;
                }, {} as Record<string, number>),
                pipelineRevenueByMonth: filteredData.reduce((acc, d) => {
                    if (d.status === 'Pipeline') {
                        const month = d.closureMonth || d.oppCloseMonth || 'Unknown';
                        if (!acc[month]) acc[month] = 0; acc[month] += d.revenue * d.probability;
                    }
                    return acc;
                }, {} as Record<string, number>),
                funnelsByOwner: filteredData.reduce((acc, d) => { if (!acc[d.owner]) acc[d.owner] = 0; acc[d.owner]++; return acc; }, {} as Record<string, number>),
                funnelsBySegment, winRatioBySegment, fullFunnelData: filteredData,
            });
            setAiInsights(insights);
        } catch (error) {
            toast({ variant: "destructive", title: "Intelligence Failure", description: "AI uplink interrupted." });
        } finally {
            setIsAnalyzing(false);
        }
    });
  };
  
  const handleRefresh = () => {
    setMonthFilter("all");
    setOwnerFilter("all");
    setSegmentFilter("all");
    setAiInsights(null);
    fetchData();
  };
  
  if (isInitialLoading) return <CenteredLoader text="INITIALIZING MISSION CONTROL UPLINK..." />;
  
  if (error) {
    return (
        <div className="container mx-auto py-8 px-4 font-code">
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
              <Terminal className="h-4 w-4" />
              <AlertTitle className="font-bold uppercase">Critical System Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={handleRefresh} variant="outline" className="mt-4 border-primary/20 hover:bg-primary/5">
                {isRefreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4" />}
                 Force Reconnect
            </Button>
        </div>
    );
  }

  const statusData = [
    { name: 'Won', value: wonCount, fill: 'hsl(var(--chart-2))' },
    { name: 'Lost', value: lostCount, fill: 'hsl(var(--chart-3))' },
    { name: 'Pipeline', value: pipelineCount, fill: 'hsl(var(--chart-4))' },
  ];

  const HolographicCard = ({ title, value, subValue, icon: Icon, isPrimary = false }: any) => (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} className="group">
      <Card className={cn(
        "relative overflow-hidden bg-black/40 backdrop-blur-xl border-white/5 h-full transition-all duration-500 holographic-edge",
        isPrimary && "border-primary/20 bg-primary/5"
      )}>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{title}</CardDescription>
            <Icon className={cn("h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity", isPrimary ? "text-primary" : "text-white/60")} />
          </div>
          <CardTitle className={cn("text-2xl font-bold tracking-tighter mt-1", isPrimary ? "text-primary shadow-primary/20 drop-shadow-[0_0_8px_rgba(0,224,255,0.4)]" : "text-white")}>
            {value}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-code text-white/30 uppercase tracking-widest">{subValue}</p>
            <div className="text-[8px] font-bold text-primary/0 group-hover:text-primary/60 transition-all uppercase tracking-tighter">Analysis Mode</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen font-code bg-black selection:bg-primary/30">
      {/* Immersive Environment Layer */}
      <div className="fixed inset-0 command-grid pointer-events-none opacity-20" />
      <div className="scanline" />
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,224,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
          <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Mission Control Alpha</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
                Funnel Intelligence <span className="text-white/10">|</span> <span className="text-white/40 font-light">v4.0.1</span>
              </h1>
              <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500/50"/> Secure Terminal</div>
                <div className="flex items-center gap-1.5"><Activity size={12} className="text-primary/50"/> System Online</div>
                <div className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500/50"/> Data Synced</div>
              </div>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            disabled={isRefreshing}
            className="group relative h-14 px-8 border-white/10 bg-black/40 backdrop-blur-xl hover:bg-primary/5 hover:border-primary/30 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={cn("mr-3 h-5 w-5 flex items-center justify-center", isRefreshing && "radar-spin")}>
              <RefreshCw className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-xs uppercase tracking-[0.2em]">{isRefreshing ? "Calibrating..." : "Refresh Matrix"}</span>
          </Button>
        </div>

        {/* Command Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10"><Terminal size={40} /></div>
          <h3 className="text-[10px] font-black col-span-full uppercase tracking-[0.4em] text-primary/60 mb-2">Filter Parameters</h3>
          
          <Select value={monthFilter} onValueChange={(v) => triggerReprocess(setMonthFilter, v)}>
            <SelectTrigger className="bg-white/5 border-white/10 h-12 focus:ring-primary/30">
              <SelectValue placeholder="Closure Period" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
              {months.map((m) => (
                <SelectItem key={m} value={m} className="text-xs">{m === 'all' ? 'All Temporal Cycles' : m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ownerFilter} onValueChange={(v) => triggerReprocess(setOwnerFilter, v)}>
            <SelectTrigger className="bg-white/5 border-white/10 h-12 focus:ring-primary/30">
              <SelectValue placeholder="Asset Owner" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
              {owners.map((o) => (
                <SelectItem key={o} value={o} className="text-xs">{o === 'all' ? 'All Network Assets' : o}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={segmentFilter} onValueChange={(v) => triggerReprocess(setSegmentFilter, v)}>
            <SelectTrigger className="bg-white/5 border-white/10 h-12 focus:ring-primary/30">
              <SelectValue placeholder="Market Segment" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
              {segments.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">{s === 'all' ? 'All Market Sectors' : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-3 px-4 bg-white/5 rounded-md border border-white/5">
            <Cpu size={16} className="text-primary/40" />
            <div className="flex-1 overflow-hidden">
              <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Processing Node</div>
              <div className="text-[10px] font-bold text-primary truncate">DEEQASA-CORE-01</div>
            </div>
          </div>
        </div>

        {/* Reprocessing Overlay */}
        <AnimatePresence>
          {isReprocessing && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin opacity-40" />
                <span className="text-[10px] font-black text-primary tracking-[0.5em] uppercase">Recalibrating Charts...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* KPI Modules */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <HolographicCard 
            title="Validated Revenue" 
            value={usdCurrencyFormatter.format(wonRevenue)} 
            subValue={inrCurrencyFormatter.format(wonRevenue * EXCHANGE_RATE_USD_TO_INR)} 
            icon={DollarSign}
            isPrimary
          />
          <HolographicCard 
            title="Pipeline Velocity" 
            value={usdCurrencyFormatter.format(pipelineRevenue)} 
            subValue={inrCurrencyFormatter.format(pipelineRevenue * EXCHANGE_RATE_USD_TO_INR)} 
            icon={Activity}
          />
          <HolographicCard 
            title="Conversion Logic" 
            value={(wonCount + lostCount) > 0 ? `${Math.round((wonCount / (wonCount + lostCount)) * 100)}%` : '0%'} 
            subValue="Historical Win Rate" 
            icon={Target}
          />
          <HolographicCard 
            title="Network Load" 
            value={totalFunnels} 
            subValue="Active Data Points" 
            icon={Cpu}
          />
        </div>

        {isMounted && (
          <div className="space-y-12">
            <div className="grid gap-12 md:grid-cols-2">
                <Card className="bg-black/40 border-white/5 overflow-hidden holographic-edge group">
                  <CardHeader className="border-b border-white/5 py-4 bg-white/5">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                          <Activity size={14} className="text-primary"/> Live Status Ring
                        </CardTitle>
                        <span className="text-[8px] font-bold text-white/20 uppercase">Module: ORBIT-X</span>
                      </div>
                  </CardHeader>
                  <CardContent className="h-[350px] relative flex items-center justify-center p-0">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 rounded-full border border-primary/10 animate-spin-slow" style={{ animationDuration: '20s' }} />
                        <div className="w-64 h-64 rounded-full border border-white/5 animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
                        <div className="text-center">
                          <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Status</div>
                          <div className="text-[10px] font-bold text-primary uppercase">Stable</div>
                        </div>
                      </div>
                      <ChartContainer config={chartConfig} className="h-full w-full">
                        <PieChart>
                            <Tooltip content={<ChartTooltipContent hideLabel className="bg-black/90 border-primary/20 text-[10px]" />} />
                            <Pie 
                                data={statusData} 
                                dataKey="value" 
                                nameKey="name" 
                                innerRadius={85} 
                                outerRadius={105} 
                                paddingAngle={8}
                                stroke="none"
                            >
                              {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                              ))}
                            </Pie>
                            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px', textTransform: 'uppercase', letterSpacing: '1px' }} />
                        </PieChart>
                      </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/5 overflow-hidden holographic-edge">
                  <CardHeader className="border-b border-white/5 py-4 bg-white/5">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                          <Target size={14} className="text-primary"/> Asset Performance Scanner
                        </CardTitle>
                        <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase">Live Tracking</div>
                      </div>
                  </CardHeader>
                  <CardContent className="h-[350px] p-6 pt-10">
                      <ChartContainer config={chartConfig} className="h-full w-full">
                        <BarChart data={funnelsByOwnerData} layout="vertical" margin={{ left: 20, right: 40 }}>
                            <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                            <XAxis type="number" hide />
                            <YAxis 
                                type="category" 
                                dataKey="name" 
                                width={100} 
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeights: 'bold' }} 
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip cursor={{ fill: 'rgba(0,224,255,0.05)' }} content={<ChartTooltipContent />} />
                            <Bar 
                              dataKey="funnels" 
                              fill="hsl(var(--primary))" 
                              radius={[0, 4, 4, 0]} 
                              barSize={12}
                            >
                              {funnelsByOwnerData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fillOpacity={0.6} className="hover:fill-opacity-100 transition-all cursor-pointer" />
                              ))}
                            </Bar>
                        </BarChart>
                      </ChartContainer>
                  </CardContent>
                </Card>
            </div>

            <Card className="bg-black/40 border-white/5 overflow-hidden holographic-edge">
                <CardHeader className="border-b border-white/5 py-4 bg-white/5">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <TrendingUp size={14} className="text-primary"/> Temporal Revenue Trajectory
                      </CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Scanning cycle: 30D</div>
                        <Lock size={12} className="text-white/20"/>
                      </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[400px] p-8">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <LineChart data={revenueByMonthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={15}
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeights: 'bold' }}
                            />
                            <YAxis 
                                tickFormatter={(v) => `$${(v as number / 1000).toFixed(0)}k`}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeights: 'bold' }}
                            />
                            <Tooltip content={<ChartTooltipContent formatter={(v) => usdCurrencyFormatter.format(v as number)} />} />
                            <Line 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={4} 
                                dot={{ r: 5, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#000' }} 
                                activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: '#000' }}
                                animationDuration={2000}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* AI Intelligence Card */}
            <Card className="flex flex-col border-primary/20 bg-black/60 backdrop-blur-3xl overflow-hidden holographic-edge">
                <CardHeader className="bg-primary/5 border-b border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><BrainCircuit size={80}/></div>
                    <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-[0.2em] text-primary">
                      <BrainCircuit size={24} className="text-primary animate-pulse"/> AI Funnel Command Logic
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-white/40">Automated Strategic Intelligence Synthesis</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-[500px] p-8">
                    {isAnalyzing ? (
                        <div className="m-auto w-full max-w-lg space-y-8">
                            <div className="flex flex-col items-center gap-4">
                              <Bot size={48} className="text-primary animate-bounce" />
                              <p className="text-[10px] font-black text-primary tracking-[0.5em] uppercase">Synthesizing Intelligence Matrix...</p>
                            </div>
                            <div className="space-y-4">
                              <div className="h-[2px] bg-primary/20 overflow-hidden relative rounded-full">
                                <div className="absolute inset-0 w-full h-full bg-primary animate-line-loader" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)', backgroundSize: '200% 100%' }} />
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <Skeleton className="h-1 w-full bg-white/5" />
                                <Skeleton className="h-1 w-full bg-primary/20" />
                                <Skeleton className="h-1 w-full bg-white/5" />
                              </div>
                            </div>
                        </div>
                    ) : aiInsights ? (
                        <ScrollArea className="h-[600px] pr-6">
                            <div className="space-y-10">
                              <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
                                      <Terminal size={14}/> Executive Intelligence Summary
                                    </h4>
                                    <p className="text-sm text-white/70 leading-relaxed font-medium">{aiInsights.executiveSummary}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Card className="bg-black/40 border-primary/30 holographic-edge">
                                      <CardHeader className="p-5 border-b border-white/5">
                                          <CardTitle className="text-xs flex items-center gap-2 text-primary font-black uppercase tracking-widest"><DollarSign size={16} /> Projected Trajectory</CardTitle>
                                      </CardHeader>
                                      <CardContent className="p-5">
                                          <p className="text-sm text-white/60 leading-relaxed italic">"{aiInsights.revenueForecast.forecast}"</p>
                                          <div className="mt-6 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Confidence Index</span>
                                            <span className="text-xl font-black text-primary font-mono">{aiInsights.revenueForecast.confidence}%</span>
                                          </div>
                                          <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${aiInsights.revenueForecast.confidence}%` }} className="h-full bg-primary shadow-[0_0_10px_rgba(0,224,255,0.5)]" />
                                          </div>
                                      </CardContent>
                                  </Card>

                                  <div className="space-y-4">
                                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">Critical Alerts</h4>
                                      {aiInsights.smartAlerts.map((alert, i) => (
                                          <motion.div key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                                            <Alert variant={alert.priority === 'High' ? 'destructive' : 'default'} className={cn(
                                              "border-white/5 bg-black/40 backdrop-blur-xl",
                                              alert.priority === 'Medium' && 'border-amber-500/30 text-amber-400 [&>svg]:text-amber-400'
                                            )}>
                                                <AlertTriangle className="h-4 w-4" />
                                                <AlertTitle className="text-[10px] font-black uppercase tracking-widest">{alert.title}</AlertTitle>
                                                <AlertDescription className="text-xs text-white/50">{alert.description}</AlertDescription>
                                            </Alert>
                                          </motion.div>
                                      ))}
                                  </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/60 mb-4 px-2">High-Probability Targets</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {aiInsights.topOpportunities.map((opp, i) => (
                                            <Card key={i} className="bg-black/40 border-emerald-500/20 group hover:border-emerald-500/50 transition-all">
                                              <CardHeader className="p-4">
                                                <CardTitle className="text-[11px] font-black uppercase tracking-tight text-emerald-400 flex items-center gap-2"><Lightbulb size={14}/>{opp.title}</CardTitle>
                                                <CardDescription className="text-[10px] text-white/40 leading-tight mt-1">{opp.description}</CardDescription>
                                              </CardHeader>
                                              <CardFooter className="p-4 pt-0">
                                                  <div className="w-full flex items-center gap-2 px-3 py-2 bg-emerald-500/5 rounded-md border border-emerald-500/10">
                                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">CMD:</span>
                                                    <span className="text-[9px] font-bold text-emerald-200 truncate">{opp.nextAction}</span>
                                                  </div>
                                              </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                <Accordion type="single" collapsible className="w-full space-y-2">
                                    <AccordionItem value="leakage" className="border-white/5 bg-black/20 rounded-xl px-4">
                                        <AccordionTrigger className="text-xs font-black uppercase tracking-[0.2em] hover:text-primary no-underline py-4">
                                          <div className="flex items-center gap-3"><Target size={14} className="text-primary"/> Segment Leakage Analysis</div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6">
                                            <div className="p-4 border-l-2 border-destructive/40 bg-destructive/5 mb-4">
                                              <h5 className="text-[10px] font-black text-destructive uppercase tracking-widest mb-1">Critical Sector: {aiInsights.funnelLeakageAnalysis.primaryLeakagePoint}</h5>
                                              <p className="text-xs text-white/60 leading-relaxed italic">{aiInsights.funnelLeakageAnalysis.insight}</p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="performance" className="border-white/5 bg-black/20 rounded-xl px-4">
                                        <AccordionTrigger className="text-xs font-black uppercase tracking-[0.2em] hover:text-primary no-underline py-4">
                                          <div className="flex items-center gap-3"><Award size={14} className="text-primary"/> Tactical Performance Readout</div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                              <div className="flex items-center gap-2 mb-2">
                                                <Award size={14} className="text-emerald-400"/>
                                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Top Asset</span>
                                              </div>
                                              <h5 className="text-sm font-bold text-white mb-1">{aiInsights.ownerPerformance.topPerformer.name}</h5>
                                              <p className="text-[10px] text-white/40 leading-relaxed italic">{aiInsights.ownerPerformance.topPerformer.reason}</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
                                              <div className="flex items-center gap-2 mb-2">
                                                <UserX size={14} className="text-amber-400"/>
                                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Needs Calibration</span>
                                              </div>
                                              <h5 className="text-sm font-bold text-white mb-1">{aiInsights.ownerPerformance.needsAttention.name}</h5>
                                              <p className="text-[10px] text-white/40 leading-relaxed italic">{aiInsights.ownerPerformance.needsAttention.reason}</p>
                                            </div>
                                          </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="m-auto text-center p-12 border-2 border-dashed border-primary/10 rounded-3xl group hover:border-primary/30 transition-all">
                            <Bot className="mx-auto h-16 w-16 text-primary/20 group-hover:text-primary/40 transition-all mb-6" />
                            <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] mb-3">AI Engine Standby</h3>
                            <p className="max-w-xs mx-auto text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                              Uplink ready for funnel analysis. Requesting command authorization to synthesize live data points.
                            </p>
                        </div>
                    )}
                </CardContent>
                <div className="p-8 pt-0 mt-auto">
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing || isRefreshing} 
                      className="w-full h-16 text-xs font-black uppercase tracking-[0.4em] bg-primary hover:bg-primary/90 text-black shadow-[0_0_30px_rgba(0,224,255,0.2)] hover:shadow-primary/40 transition-all"
                    >
                        {isAnalyzing ? <Loader2 className="w-5 h-5 mr-3 animate-spin"/> : <BrainCircuit className="mr-3 h-5 w-5" />}
                        {isAnalyzing ? "Processing Logic Matrix..." : "Execute Intelligence Synthesis"}
                    </Button>
                </div>
            </Card>
          </div>
        )}

        {/* Detailed Data Table */}
        <Card className="mt-16 bg-black/40 border-white/5 overflow-hidden holographic-edge">
          <CardHeader className="bg-white/5 border-b border-white/5">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em]">Detailed Registry</CardTitle>
                <CardDescription className="text-[8px] font-bold uppercase tracking-widest text-white/20 mt-1">Full database telemetry readout</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="h-1 w-8 bg-primary/20 rounded-full" />
                <div className="h-1 w-4 bg-primary/40 rounded-full" />
                <div className="h-1 w-2 bg-primary rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
              <ScrollArea className="h-96">
                  <Table>
                      <TableHeader className="sticky top-0 bg-black/90 backdrop-blur-md z-10">
                      <TableRow className="border-white/5">
                          <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Entity Identity</TableHead>
                          <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Asset Controller</TableHead>
                          <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Market Sector</TableHead>
                          <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Protocol Status</TableHead>
                          <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-white/40">Value Impact (USD)</TableHead>
                      </TableRow>
                      </TableHeader>
                      <TableBody>
                      {filteredData.length > 0 ? filteredData.map((item) => (
                          <TableRow key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer border-white/5 hover:bg-primary/5 transition-colors group">
                          <TableCell className="font-black text-primary group-hover:text-white transition-colors">{item.accountName}</TableCell>
                          <TableCell className="text-[10px] text-white/40 font-bold uppercase">{item.owner}</TableCell>
                          <TableCell className="text-[10px] text-white/40 font-bold uppercase">{item.segment}</TableCell>
                          <TableCell>
                              <span className={cn(
                                  "px-3 py-1 text-[8px] font-black rounded-full border tracking-widest",
                                  item.status === 'Won' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  item.status === 'Lost' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                  'bg-primary/10 text-primary border-primary/20'
                              )}>{item.status.toUpperCase()}</span>
                          </TableCell>
                          <TableCell className="text-right font-mono text-[10px] font-bold text-white/60">{usdCurrencyFormatter.format(item.revenue)}</TableCell>
                          </TableRow>
                      )) : (
                          <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center text-white/20 font-bold uppercase text-[10px] tracking-widest">
                                No entities match current sector filters.
                              </TableCell>
                          </TableRow>
                      )}
                      </TableBody>
                  </Table>
              </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {/* Entity Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(isOpen) => { if (!isOpen) setSelectedItem(null); }}>
        <DialogContent className="sm:max-w-lg border-primary/30 bg-black/95 backdrop-blur-2xl p-0 overflow-hidden font-code selection:bg-primary/30">
            {selectedItem && (
                <>
                    <div className="bg-primary/10 border-b border-primary/20 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Target size={14} className="text-primary"/>
                              <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">Detailed Analysis</span>
                            </div>
                            <DialogTitle className="text-3xl font-black text-white tracking-tighter uppercase">{selectedItem.accountName}</DialogTitle>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Registry ID</p>
                            <p className="text-xs font-mono font-bold text-primary">{selectedItem.id.toString().padStart(6, '0')}</p>
                          </div>
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Impact Valuation</Label>
                              <p className="text-2xl font-black text-primary tracking-tighter">{usdCurrencyFormatter.format(selectedItem.revenue)}</p>
                              <p className="text-[9px] font-bold text-white/20 font-mono">{inrCurrencyFormatter.format(selectedItem.revenue * EXCHANGE_RATE_USD_TO_INR)}</p>
                            </div>
                            <div>
                              <Label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Protocol Status</Label>
                              <div className={cn(
                                "inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mt-1",
                                selectedItem.status === 'Won' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                selectedItem.status === 'Lost' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-primary/10 text-primary border-primary/20'
                              )}>{selectedItem.status}</div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Success Logic</Label>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xl font-black text-white font-mono">{Math.round(selectedItem.probability * 100)}%</span>
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${selectedItem.probability * 100}%` }} className="h-full bg-primary" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Temporal Cycle</Label>
                              <p className="text-sm font-black text-white uppercase tracking-widest mt-1">{selectedItem.closureMonth}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                          {[
                            { label: 'Controller', val: selectedItem.owner },
                            { label: 'Market Sector', val: selectedItem.segment },
                            { label: 'Assigned Region', val: selectedItem.region },
                            { label: 'Product Config', val: selectedItem.product },
                          ].map((spec, i) => (
                            <div key={i} className="space-y-1">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{spec.label}</span>
                              <p className="text-xs font-bold text-white/70 uppercase truncate">{spec.val}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={12} className="text-emerald-500/40"/>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Integrity Verified</span>
                          </div>
                          {selectedItem.lastModified && (
                            <span className="text-[8px] font-mono text-white/20 uppercase">Sync: {new Date(selectedItem.lastModified).toLocaleTimeString()}</span>
                          )}
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-white/5 border-t border-white/5 gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 h-12 border-primary/20 bg-transparent hover:bg-primary/5 text-[10px] font-black uppercase tracking-[0.2em] text-primary" 
                          onClick={() => { setItemToEdit(selectedItem); setSelectedItem(null); }}
                        >
                            <Edit className="mr-3 h-4 w-4" />
                            Recalibrate Record
                        </Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>

      {/* Calibration Dialog (Edit) */}
      <Dialog open={!!itemToEdit} onOpenChange={(isOpen) => { if(!isOpen) setItemToEdit(null)}}>
        <DialogContent className="border-primary/30 bg-black/95 backdrop-blur-2xl font-code selection:bg-primary/30 p-0 overflow-hidden">
          <div className="bg-primary/10 border-b border-primary/20 p-6">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={14} className="text-primary"/>
              <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">System Calibration</span>
            </div>
            <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">Recalibrate: {itemToEdit?.accountName}</DialogTitle>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="p-8 space-y-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30">Protocol Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 h-12 focus:ring-primary/30">
                          <SelectValue placeholder="Stage select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black/90 border-white/10">
                        <SelectItem value="Pipeline" className="text-xs">Active Pipeline Protocol</SelectItem>
                        <SelectItem value="Won" className="text-xs">Success Validation (Won)</SelectItem>
                        <SelectItem value="Lost" className="text-xs">Termination Cycle (Lost)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[8px] uppercase font-black" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30">Impact (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-white/5 border-white/10 h-12 font-mono font-bold" {...field} />
                      </FormControl>
                      <FormMessage className="text-[8px] uppercase font-black" />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="probability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30">Success Probability (%)</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-white/5 border-white/10 h-12 font-mono font-bold" {...field} />
                      </FormControl>
                      <FormMessage className="text-[8px] uppercase font-black" />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30">Controller Identity</FormLabel>
                      <FormControl>
                        <Input className="bg-white/5 border-white/10 h-12 text-xs font-bold uppercase" {...field} />
                      </FormControl>
                      <FormMessage className="text-[8px] uppercase font-black" />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="segment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30">Market Classification</FormLabel>
                      <FormControl>
                        <Input className="bg-white/5 border-white/10 h-12 text-xs font-bold uppercase" {...field} />
                      </FormControl>
                      <FormMessage className="text-[8px] uppercase font-black" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-6 gap-4 bg-white/5 -mx-8 -mb-8 p-8 border-t border-white/5">
                <Button type="button" variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white" onClick={() => setItemToEdit(null)}>Abort</Button>
                <Button type="submit" disabled={isEditing} className="flex-1 h-12 bg-primary text-black font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                  {isEditing ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <ShieldCheck className="h-4 w-4 mr-2" />}
                  Commit Calibration
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
