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
  Target, 
  Activity, 
  Globe, 
  Loader2, 
  DollarSign, 
  Bot, 
  Cpu, 
  ShieldCheck, 
  Activity as PulseIcon 
} from "lucide-react";
import { FunnelAnalysisOutput, analyzeFunnelData } from "@/ai/flows/ai-funnel-analyzer";
import { getSheetData } from "@/ai/flows/get-sheet-data";
import { updateSheetData } from "@/ai/flows/update-sheet-data";
import { ScrollArea } from "../ui/scroll-area";
import { CenteredLoader } from "../ui/centered-loader";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const chartConfig = {
  revenue: { label: "Revenue", color: "#1A8CFF" },
  funnels: { label: "Funnels", color: "#1A8CFF" },
  won: { label: "Won", color: "#10B981" },
  lost: { label: "Lost", color: "#EF4444" },
  pipeline: { label: "Pipeline", color: "#1A8CFF" },
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
    pipelineCount, wonRevenue, pipelineRevenue, totalRevenue, revenueByMonthData,
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
    
    const winRatioBySegment = segments.filter(s => s !== 'all').reduce((acc, segment) => {
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
        <div className="container mx-auto py-8 px-4 font-[Outfit] text-white">
            <h2 className="text-xl font-black uppercase text-red-500 mb-4">Critical System Error</h2>
            <p className="text-white/60 mb-8">{error}</p>
            <Button onClick={handleRefresh} variant="outline" className="border-white/10 hover:bg-white/5">
                {isRefreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4" />}
                 Force Reconnect
            </Button>
        </div>
    );
  }

  const statusData = [
    { name: 'Won', value: wonCount, fill: '#10B981' },
    { name: 'Lost', value: lostCount, fill: '#EF4444' },
    { name: 'Pipeline', value: pipelineCount, fill: '#1A8CFF' },
  ];

  const MetricCard = ({ title, value, subValue, icon: Icon, isPrimary = false }: any) => (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} className="group">
      <Card className={cn(
        "relative overflow-hidden bg-white border border-slate-100 h-full transition-all duration-700 shadow-sm hover:shadow-2xl",
        isPrimary && "border-primary/20 bg-primary/5 shadow-primary/10"
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</CardDescription>
            <Icon className={cn("h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity", isPrimary ? "text-primary" : "text-slate-400")} />
          </div>
          <CardTitle className={cn("text-2xl font-black tracking-tighter mt-1", isPrimary ? "text-primary drop-shadow-[0_0_10px_rgba(26,140,255,0.2)]" : "text-slate-900")}>
            {value}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{subValue}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-12 pb-20 font-[Outfit] text-slate-900">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Central Intelligence Matrix</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Funnel <span className="text-primary italic">Hub</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-4 max-w-xl leading-relaxed">
            Real-time synchronization with primary enterprise data pipelines. 
            Calibrating success probabilities across global sectors.
          </p>
        </div>
        
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={isRefreshing}
          className="h-14 px-8 border-slate-100 bg-white hover:bg-slate-50 hover:border-primary/30 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm"
        >
          <RefreshCw className={cn("mr-3 h-4 w-4 text-primary", isRefreshing && "animate-spin")} />
          {isRefreshing ? "Calibrating..." : "Refresh Matrix"}
        </Button>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard 
            title="Validated Revenue" 
            value={usdCurrencyFormatter.format(wonRevenue)} 
            subValue={inrCurrencyFormatter.format(wonRevenue * EXCHANGE_RATE_USD_TO_INR)} 
            icon={DollarSign}
            isPrimary
        />
        <MetricCard 
            title="Pipeline Velocity" 
            value={usdCurrencyFormatter.format(pipelineRevenue)} 
            subValue={inrCurrencyFormatter.format(pipelineRevenue * EXCHANGE_RATE_USD_TO_INR)} 
            icon={PulseIcon}
        />
        <MetricCard 
            title="Conversion Logic" 
            value={(wonCount + lostCount) > 0 ? `${Math.round((wonCount / (wonCount + lostCount)) * 100)}%` : '0%'} 
            subValue="Historical Win Rate" 
            icon={Target}
        />
        <MetricCard 
            title="Network Load" 
            value={totalFunnels} 
            subValue="Active Data Points" 
            icon={Cpu}
        />
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
        <div className="space-y-2">
            <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 ml-4">Temporal Cycle</Label>
            <Select value={monthFilter} onValueChange={(v) => triggerReprocess(setMonthFilter, v)}>
                <SelectTrigger className="bg-slate-50 border-slate-100 h-14 rounded-xl focus:ring-primary/40 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                    <SelectValue placeholder="All Cycles" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-100 text-slate-900">
                    {months.map((m) => (
                        <SelectItem key={m} value={m} className="uppercase font-black text-[10px] tracking-widest py-3">{m}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 ml-4">Asset Controller</Label>
            <Select value={ownerFilter} onValueChange={(v) => triggerReprocess(setOwnerFilter, v)}>
                <SelectTrigger className="bg-slate-50 border-slate-100 h-14 rounded-xl focus:ring-primary/40 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                    <SelectValue placeholder="All Asset Controllers" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-100 text-slate-900">
                    {owners.map((o) => (
                        <SelectItem key={o} value={o} className="uppercase font-black text-[10px] tracking-widest py-3">{o}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 ml-4">Market Sector</Label>
            <Select value={segmentFilter} onValueChange={(v) => triggerReprocess(setSegmentFilter, v)}>
                <SelectTrigger className="bg-slate-50 border-slate-100 h-14 rounded-xl focus:ring-primary/40 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                    <SelectValue placeholder="All Market Sectors" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-100 text-slate-900">
                    {segments.map((s) => (
                        <SelectItem key={s} value={s} className="uppercase font-black text-[10px] tracking-widest py-3">{s}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* Visualization Grid */}
      {isMounted && (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card className="bg-white border border-slate-100 overflow-hidden rounded-[2rem] shadow-sm">
                    <CardHeader className="border-b border-slate-50 py-6 bg-slate-50/50">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Live Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px] p-4 text-slate-900">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <PieChart>
                                <Tooltip content={<ChartTooltipContent hideLabel className="bg-white border-slate-100 text-slate-900 rounded-xl font-bold shadow-xl" />} />
                                <Pie 
                                    data={statusData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    innerRadius={90} 
                                    outerRadius={120} 
                                    paddingAngle={10}
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900', paddingTop: '30px', textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8' }} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-slate-100 overflow-hidden rounded-[2rem] shadow-sm">
                    <CardHeader className="border-b border-slate-50 py-6 bg-slate-50/50">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Controller Performance Monitor</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px] p-8">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <BarChart data={funnelsByOwnerData} layout="vertical" margin={{ left: 20, right: 40 }}>
                                <CartesianGrid horizontal={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    type="category" 
                                    dataKey="name" 
                                    width={120} 
                                    tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: '900' }} 
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} content={<ChartTooltipContent className="bg-white border-slate-100 text-slate-900 rounded-xl shadow-xl" />} />
                                <Bar dataKey="funnels" fill="#1A8CFF" radius={[0, 8, 8, 0]} barSize={16} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white border border-slate-100 overflow-hidden rounded-[2rem] shadow-sm">
                <CardHeader className="border-b border-slate-50 py-6 bg-slate-50/50">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Temporal Revenue Projection</CardTitle>
                </CardHeader>
                <CardContent className="h-[450px] p-12">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <LineChart data={revenueByMonthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: '900' }} />
                            <YAxis 
                                tickFormatter={(v) => `$${(v as number / 1000).toFixed(0)}k`}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: '900' }}
                            />
                            <Tooltip content={<ChartTooltipContent formatter={(v) => usdCurrencyFormatter.format(v as number)} className="bg-white border-slate-100 text-slate-900 rounded-xl shadow-xl" />} />
                            <Line 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#1A8CFF" 
                                strokeWidth={6} 
                                dot={{ r: 6, fill: '#1A8CFF', strokeWidth: 3, stroke: '#fff' }} 
                                activeDot={{ r: 10, stroke: '#1A8CFF', strokeWidth: 4, fill: '#fff' }}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* AI Intelligence Hub */}
            <Card className="bg-white border border-primary/20 backdrop-blur-3xl overflow-hidden rounded-[3rem] p-1 shadow-2xl">
                <CardHeader className="bg-primary/5 p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10"><BrainCircuit size={120} className="text-primary"/></div>
                    <CardTitle className="flex items-center gap-4 text-3xl font-black uppercase tracking-tighter text-primary">
                      <PulseIcon className="animate-pulse" /> Neural Intelligence Matrix
                    </CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 mt-4 leading-relaxed max-w-lg">
                        Automated strategic synthesis utilizing multi-vector predictive analysis across global funnel pipelines.
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[500px] p-12 flex flex-col">
                    {isAnalyzing ? (
                        <div className="m-auto flex flex-col items-center gap-8">
                            <Bot size={64} className="text-primary animate-pulse" />
                            <span className="text-[10px] font-black text-primary tracking-[0.8em] uppercase animate-pulse">Synchronizing Neural Net...</span>
                        </div>
                    ) : aiInsights ? (
                        <ScrollArea className="h-[600px] pr-8">
                            <div className="space-y-12">
                                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Executive Summary</h4>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium italic">"{aiInsights.executiveSummary}"</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Card className="bg-white border border-slate-100 rounded-3xl shadow-sm">
                                        <CardHeader className="p-8 border-b border-slate-50">
                                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Projected Revenue Trajectory</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <p className="text-sm text-slate-500 leading-relaxed mb-8">"{aiInsights.revenueForecast.forecast}"</p>
                                            <div className="flex items-center justify-between border-t border-slate-50 pt-8">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Confidence Rating</span>
                                                <span className="text-3xl font-black text-primary">{aiInsights.revenueForecast.confidence}%</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="m-auto text-center p-20 border-2 border-dashed border-slate-200 rounded-[3rem] group hover:border-primary/20 transition-all cursor-pointer bg-slate-50/30" onClick={handleAnalyze}>
                            <Bot size={80} className="mx-auto text-slate-200 group-hover:text-primary/30 transition-all mb-8" />
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-[0.4em] mb-4">Awaiting Command</h3>
                            <p className="max-w-xs mx-auto text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
                                Executive uplink ready for neural synthesis. Execute protocol to generate intelligence readout.
                            </p>
                        </div>
                    )}
                    <div className="mt-12">
                        <Button 
                            onClick={handleAnalyze} 
                            disabled={isAnalyzing || isRefreshing} 
                            className="w-full h-20 text-xs font-black uppercase tracking-[0.5em] bg-slate-900 hover:bg-primary text-white shadow-2xl rounded-2xl transition-all"
                        >
                            {isAnalyzing ? "Processing Neural Matrix..." : "Execute Strategic Synthesis"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}

      {/* Registry Table */}
      <Card className="bg-white border border-slate-100 overflow-hidden rounded-[2rem] shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-50 py-8 px-10">
            <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Entity Registry Readout</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
                <Table>
                    <TableHeader className="sticky top-0 bg-white/95 backdrop-blur-xl z-20 border-b border-slate-100">
                        <TableRow className="border-slate-100 h-16">
                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-10">Account Identity</TableHead>
                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Controller</TableHead>
                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sector</TableHead>
                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                            <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400 pr-10">Impact (USD)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((item) => (
                            <TableRow 
                                key={item.id} 
                                onClick={() => setSelectedItem(item)} 
                                className="cursor-pointer border-slate-50 h-20 hover:bg-slate-50 transition-colors group"
                            >
                                <TableCell className="font-black text-slate-900 pl-10 group-hover:text-primary transition-colors">{item.accountName}</TableCell>
                                <TableCell className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.owner}</TableCell>
                                <TableCell className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.segment}</TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "px-4 py-1.5 text-[8px] font-black rounded-full border tracking-widest shadow-sm",
                                        item.status === 'Won' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                        item.status === 'Lost' ? 'bg-red-50 text-red-500 border-red-100' :
                                        'border-primary/10 text-primary bg-primary/5'
                                    )}>{item.status.toUpperCase()}</span>
                                </TableCell>
                                <TableCell className="text-right font-black text-[11px] text-slate-600 pr-10">{usdCurrencyFormatter.format(item.revenue)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}>
        <DialogContent className="max-w-2xl bg-white border-slate-100 p-0 overflow-hidden rounded-[3rem] text-slate-900 shadow-2xl">
            {selectedItem && (
                <>
                    <div className="bg-primary/5 border-b border-slate-50 p-12">
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.5em] mb-4 block">Entity Analysis Record</span>
                        <DialogTitle className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{selectedItem.accountName}</DialogTitle>
                    </div>
                    <div className="p-12 space-y-12">
                        <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valuation Impact</Label>
                                <p className="text-3xl font-black text-primary tracking-tighter">{usdCurrencyFormatter.format(selectedItem.revenue)}</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Success</Label>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{Math.round(selectedItem.probability * 100)}%</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-emerald-500" size={24} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Integrity Check Optimal</span>
                            </div>
                            <Button 
                                onClick={() => { setItemToEdit(selectedItem); setSelectedItem(null); }}
                                className="bg-slate-900 text-white hover:bg-primary font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl transition-all"
                            >
                                <Edit className="mr-2 h-4 w-4" /> Recalibrate
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={!!itemToEdit} onOpenChange={(isOpen) => !isOpen && setItemToEdit(null)}>
        <DialogContent className="max-w-xl bg-white border-slate-100 p-0 overflow-hidden rounded-[3rem] text-slate-900 shadow-2xl">
            <div className="bg-slate-50 border-b border-slate-100 p-10">
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">System Recalibration</DialogTitle>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)} className="p-10 space-y-8">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-50 border-slate-100 h-14 rounded-xl text-slate-900 font-black uppercase tracking-widest text-[10px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white border-slate-100 text-slate-900 font-black">
                                        <SelectItem value="Won" className="uppercase tracking-widest text-[10px] py-3">Won (Success)</SelectItem>
                                        <SelectItem value="Lost" className="uppercase tracking-widest text-[10px] py-3">Lost (Termination)</SelectItem>
                                        <SelectItem value="Pipeline" className="uppercase tracking-widest text-[10px] py-3">Pipeline (Active)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="revenue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue (USD)</FormLabel>
                                    <FormControl>
                                        <Input type="number" className="bg-slate-50 border-slate-100 h-14 rounded-xl font-black text-slate-900 shadow-inner" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="probability"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Probability (%)</FormLabel>
                                    <FormControl>
                                        <Input type="number" className="bg-slate-50 border-slate-100 h-14 rounded-xl font-black text-slate-900 shadow-inner" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <DialogFooter className="pt-8 gap-4">
                        <Button type="button" variant="ghost" onClick={() => setItemToEdit(null)} className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50">Abort</Button>
                        <Button type="submit" disabled={isEditing} className="flex-1 bg-primary text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-xl shadow-[0_10px_30px_rgba(26,140,255,0.2)] hover:bg-slate-900/90 transition-all">
                            {isEditing ? <Loader2 className="animate-spin mr-2"/> : <ShieldCheck className="mr-2 h-4 w-4" />}
                            Commit Data Stream
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
