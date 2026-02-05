"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { FunnelData } from "@/lib/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { BrainCircuit, Edit, RefreshCw, AlertTriangle, Lightbulb, TrendingUp, TrendingDown, Target, Award, UserX, DollarSign, Bot } from "lucide-react";
import { FunnelAnalysisOutput, analyzeFunnelData } from "@/ai/flows/ai-funnel-analyzer";
import { getSheetData } from "@/ai/flows/get-sheet-data";
import { updateSheetData } from "@/ai/flows/update-sheet-data";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { CenteredLoader } from "../ui/centered-loader";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LineLoader } from "../ui/line-loader";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";


const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  funnels: {
    label: "Funnels",
    color: "hsl(var(--primary))",
  },
  won: {
    label: "Won",
    color: "hsl(var(--chart-2))",
  },
  lost: {
    label: "Lost",
    color: "hsl(var(--chart-3))",
  },
  pipeline: {
    label: "Pipeline",
    color: "hsl(var(--chart-4))",
  },
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
        const payload: FunnelData = {
            ...itemToEdit,
            ...values,
            revenue: values.revenue,
            probability: values.probability / 100,
        };
        try {
            const result = await updateSheetData(payload);
            if (result.success) {
                toast({ title: "Success", description: "Account updated successfully." });
                setItemToEdit(null);
                fetchData(); // Refresh data from source
            } else {
                throw new Error(result.message);
            }
        } catch (e: any) {
            console.error("Update failed", e);
            toast({ variant: "destructive", title: "Update Failed", description: e.message });
        }
    });
  }


  // Filter states
  const [monthFilter, setMonthFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");

  const fetchData = () => {
    setError(null);
    startRefreshTransition(async () => {
      try {
        const sheetData = await getSheetData({
          spreadsheetId: SPREADSHEET_ID,
        });
        setData(sheetData);
      } catch (e: any) {
        console.error("Failed to fetch sheet data", e);
        setError(e.message || "An unknown error occurred while fetching data.");
      } finally {
        if (isInitialLoading) {
          setIsInitialLoading(false);
        }
      }
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    months,
    owners,
    segments,
    filteredData,
    totalFunnels,
    wonCount,
    lostCount,
    pipelineCount,
    totalRevenue,
    wonRevenue,
    pipelineRevenue,
    revenueByMonthData,
    funnelsByOwnerData,
    funnelsBySegment,
    winRatioBySegment
  } = useMemo(() => {
    const months = ["all", ...Array.from(new Set(data.map((d) => d.closureMonth)))];
    const owners = ["all", ...Array.from(new Set(data.map((d) => d.owner)))];
    const segments = ["all", ...Array.from(new Set(data.map((d) => d.segment)))];

    const filteredData = data.filter(
      (item) =>
        (monthFilter === "all" || item.closureMonth === monthFilter) &&
        (ownerFilter === "all" || item.owner === ownerFilter) &&
        (segmentFilter === "all" || item.segment === segmentFilter)
    );

    const wonCount = filteredData.filter((d) => d.status === "Won").length;
    const lostCount = filteredData.filter((d) => d.status === "Lost").length;
    const pipelineCount = filteredData.filter((d) => d.status === "Pipeline").length;

    const wonRevenue = filteredData
      .filter((d) => d.status === "Won")
      .reduce((sum, d) => sum + d.revenue, 0);
    const pipelineRevenue = filteredData
      .filter((d) => d.status === "Pipeline")
      .reduce((sum, d) => sum + d.revenue * d.probability, 0);
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
      months,
      owners,
      segments,
      filteredData,
      totalFunnels: filteredData.length,
      wonCount,
      lostCount,
      pipelineCount,
      totalRevenue,
      wonRevenue,
      pipelineRevenue,
      revenueByMonthData,
      funnelsByOwnerData,
      funnelsBySegment,
      winRatioBySegment
    };
  }, [data, monthFilter, ownerFilter, segmentFilter]);


  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAiInsights(null);
    startRefreshTransition(async () => {
        try {
            const insights = await analyzeFunnelData({
                totalFunnels,
                wonCount,
                lostCount,
                pipelineCount,
                totalRevenue,
                wonRevenue,
                pipelineRevenue,
                wonRevenueInr: wonRevenue * EXCHANGE_RATE_USD_TO_INR,
                pipelineRevenueInr: pipelineRevenue * EXCHANGE_RATE_USD_TO_INR,
                totalRevenueInr: totalRevenue * EXCHANGE_RATE_USD_TO_INR,
                revenueByMonth: filteredData.reduce((acc, d) => {
                    if (d.status === 'Won') {
                        if (!acc[d.closureMonth]) acc[d.closureMonth] = 0;
                        acc[d.closureMonth] += d.revenue;
                    }
                    return acc;
                }, {} as Record<string, number>),
                pipelineRevenueByMonth: filteredData.reduce((acc, d) => {
                    if (d.status === 'Pipeline') {
                        const month = d.closureMonth || d.oppCloseMonth || 'Unknown';
                        if (!acc[month]) acc[month] = 0;
                        acc[month] += d.revenue * d.probability;
                    }
                    return acc;
                }, {} as Record<string, number>),
                funnelsByOwner: filteredData.reduce((acc, d) => {
                    if (!acc[d.owner]) acc[d.owner] = 0;
                    acc[d.owner]++;
                    return acc;
                }, {} as Record<string, number>),
                funnelsBySegment,
                winRatioBySegment,
                fullFunnelData: filteredData,
            });
            setAiInsights(insights);
        } catch (error) {
            console.error("AI Analysis failed", error);
            toast({ variant: "destructive", title: "AI Analysis Failed", description: "Could not generate insights. Please try again." });

        } finally {
            setIsAnalyzing(false);
        }
    });
  }
  
  const handleRefresh = () => {
    setMonthFilter("all");
    setOwnerFilter("all");
    setSegmentFilter("all");
    setAiInsights(null);
    fetchData();
  };
  
  if (isInitialLoading) {
      return <CenteredLoader text="Connecting to Live Funnel Data..." />;
  }
  
  if (error) {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Fetching Data</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <Button onClick={handleRefresh} variant="outline" className="mt-4">
                {isRefreshing ? <div className="w-4 h-4 mr-2 flex items-center"><LineLoader className="h-0.5"/></div> : <RefreshCw className="mr-2 h-4 w-4" />}
                 Retry
            </Button>
        </div>
    );
  }

  const statusData = [
    { name: 'Won', value: wonCount, fill: 'hsl(var(--chart-2))' },
    { name: 'Lost', value: lostCount, fill: 'hsl(var(--chart-3))' },
    { name: 'Pipeline', value: pipelineCount, fill: 'hsl(var(--chart-4))' },
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
            Funnel Performance Analyzer
            </h1>
            <p className="text-muted-foreground mt-1">
            Real-time insights from your sales funnel.
            </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
          {isRefreshing ? <div className="w-4 h-4 mr-2 flex items-center"><LineLoader className="h-0.5"/></div> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh Data
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-card rounded-lg border border-border">
        <h3 className="text-lg font-semibold col-span-1 sm:col-span-4 font-headline">Filters</h3>
        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>{month === 'all' ? 'All Months' : month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Owner" />
          </SelectTrigger>
          <SelectContent>
            {owners.map((owner) => (
              <SelectItem key={owner} value={owner}>{owner === 'all' ? 'All Owners' : owner}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Segment" />
          </SelectTrigger>
          <SelectContent>
            {segments.map((segment) => (
              <SelectItem key={segment} value={segment}>{segment === 'all' ? 'All Segments' : segment}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardDescription>Total Revenue (Won)</CardDescription>
            <CardTitle className="text-primary">{usdCurrencyFormatter.format(wonRevenue)}</CardTitle>
            <p className="text-sm text-muted-foreground">{inrCurrencyFormatter.format(wonRevenue * EXCHANGE_RATE_USD_TO_INR)}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pipeline Value</CardDescription>
            <CardTitle>{usdCurrencyFormatter.format(pipelineRevenue)}</CardTitle>
            <p className="text-sm text-muted-foreground">{inrCurrencyFormatter.format(pipelineRevenue * EXCHANGE_RATE_USD_TO_INR)}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Win Rate</CardDescription>
            <CardTitle>{(wonCount + lostCount) > 0 ? `${Math.round((wonCount / (wonCount + lostCount)) * 100)}%` : 'N/A'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Funnels</CardDescription>
            <CardTitle>{totalFunnels}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {isMounted && (
        <div className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
              <Card>
              <CardHeader>
                  <CardTitle>Funnel Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                  {statusData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <PieChart>
                            <Tooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie 
                                data={statusData} 
                                dataKey="value" 
                                nameKey="name" 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5}
                            />
                            <Legend />
                        </PieChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                  )}
              </CardContent>
              </Card>
              <Card>
              <CardHeader>
                  <CardTitle>Funnels by Owner</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                  {funnelsByOwnerData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <BarChart data={funnelsByOwnerData} layout="vertical" margin={{ left: 40, right: 20 }}>
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                            <XAxis type="number" hide />
                            <YAxis 
                                type="category" 
                                dataKey="name" 
                                width={100} 
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                            />
                            <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.2)' }} content={<ChartTooltipContent />} />
                            <Bar dataKey="funnels" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                  )}
              </CardContent>
              </Card>
          </div>
          <Card>
              <CardHeader>
                  <CardTitle>Won Revenue by Month</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                {revenueByMonthData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <LineChart data={revenueByMonthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={10}
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis 
                                tickFormatter={(value) => `$${(value as number / 1000).toFixed(0)}k`}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <Tooltip content={<ChartTooltipContent formatter={(value) => usdCurrencyFormatter.format(value as number)} />} />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={3} 
                                dot={{ r: 4, fill: 'hsl(var(--primary))' }} 
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ChartContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">No revenue data for the selected period</div>
                )}
              </CardContent>
          </Card>

          {/* AI Analysis Card */}
          <Card className="flex flex-col mt-8">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BrainCircuit size={20} className="text-primary"/> AI Funnel Intelligence</CardTitle>
                  <CardDescription>Automatic analysis of your current funnel.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden min-h-[400px]">
                  {isAnalyzing ? (
                      <div className="space-y-4 m-auto w-full p-4">
                          <p className="text-sm text-center text-muted-foreground">Analyzing data...</p>
                          <LineLoader />
                          <div className="space-y-4 mt-4">
                              <Skeleton className="h-8 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-5/6" />
                          </div>
                      </div>
                  ) : aiInsights ? (
                      <ScrollArea className="h-[600px] -mr-6">
                          <div className="text-sm space-y-6 pr-6">
                            <div>
                                  <h4 className="font-semibold text-foreground mb-2">Executive Summary</h4>
                                  <p className="text-muted-foreground leading-relaxed">{aiInsights.executiveSummary}</p>
                              </div>
                              
                              <Card className="bg-secondary/50">
                                  <CardHeader className="p-4">
                                      <CardTitle className="text-base flex items-center gap-2 text-primary"><DollarSign size={18} /> Revenue Forecast</CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-4 pt-0">
                                      <p className="text-muted-foreground leading-relaxed">{aiInsights.revenueForecast.forecast}</p>
                                      <p className="text-xs text-primary font-bold mt-2 uppercase tracking-widest">Confidence: {aiInsights.revenueForecast.confidence}%</p>
                                  </CardContent>
                              </Card>

                              <div>
                                  <h4 className="font-semibold text-foreground mb-2">Smart Alerts</h4>
                                  <div className="space-y-3">
                                      {aiInsights.smartAlerts.map((alert, i) => (
                                          <Alert key={i} variant={alert.priority === 'High' ? 'destructive' : 'default'} className={cn(alert.priority === 'Medium' && 'border-amber-500/50 text-amber-400 [&>svg]:text-amber-400')}>
                                              <AlertTriangle className="h-4 w-4" />
                                              <AlertTitle className="font-bold">{alert.title}</AlertTitle>
                                              <AlertDescription>{alert.description}</AlertDescription>
                                          </Alert>
                                      ))}
                                  </div>
                              </div>
                              <div>
                                  <h4 className="font-semibold text-foreground mb-2">Top Opportunities</h4>
                                  <div className="space-y-3">
                                      {aiInsights.topOpportunities.map((opp, i) => (
                                          <Card key={i} className="bg-secondary/30 border-primary/10">
                                            <CardHeader className="p-4">
                                              <CardTitle className="text-base flex items-center gap-2 text-emerald-400"><Lightbulb size={16}/>{opp.title}</CardTitle>
                                              <CardDescription className="text-muted-foreground">{opp.description}</CardDescription>
                                            </CardHeader>
                                            <CardFooter className="p-4 pt-0">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Next Action:</span>
                                                  <span className="text-[11px] font-semibold text-emerald-300">{opp.nextAction}</span>
                                                </div>
                                            </CardFooter>
                                          </Card>
                                      ))}
                                  </div>
                              </div>

                              <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value="leakage" className="border-primary/10">
                                      <AccordionTrigger className="font-semibold text-base hover:text-primary"><Target size={16} className="mr-2"/>Funnel Leakage Analysis</AccordionTrigger>
                                      <AccordionContent className="pt-2">
                                          <h5 className="font-bold text-destructive mb-1">Critical Segment: {aiInsights.funnelLeakageAnalysis.primaryLeakagePoint}</h5>
                                          <p className="text-muted-foreground leading-relaxed">{aiInsights.funnelLeakageAnalysis.insight}</p>
                                      </AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value="performance" className="border-primary/10">
                                      <AccordionTrigger className="font-semibold text-base hover:text-primary"><TrendingUp size={16} className="mr-2"/>Strategic Performance Insights</AccordionTrigger>
                                      <AccordionContent className="pt-2 space-y-4">
                                        <div className="flex gap-4 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                                          <Award className="text-green-400 mt-1 shrink-0"/>
                                          <div>
                                            <h5 className="font-bold text-green-400">Top Performer: {aiInsights.ownerPerformance.topPerformer.name}</h5>
                                            <p className="text-muted-foreground text-xs leading-relaxed">{aiInsights.ownerPerformance.topPerformer.reason}</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                                          <UserX className="text-amber-400 mt-1 shrink-0"/>
                                          <div>
                                            <h5 className="font-bold text-amber-400">Action Required: {aiInsights.ownerPerformance.needsAttention.name}</h5>
                                            <p className="text-muted-foreground text-xs leading-relaxed">{aiInsights.ownerPerformance.needsAttention.reason}</p>
                                          </div>
                                        </div>
                                      </AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value="lost-deals" className="border-none">
                                      <AccordionTrigger className="font-semibold text-base hover:text-primary"><TrendingDown size={16} className="mr-2"/>Lost Deal Intelligence</AccordionTrigger>
                                      <AccordionContent className="pt-2">
                                          <p className="text-muted-foreground leading-relaxed">{aiInsights.lostDealIntelligence}</p>
                                      </AccordionContent>
                                  </AccordionItem>
                              </Accordion>
                          </div>
                      </ScrollArea>
                  ) : (
                      <div className="m-auto text-center text-muted-foreground p-8 border-2 border-dashed border-primary/10 rounded-xl">
                          <Bot className="mx-auto h-12 w-12 text-primary/40 mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">Ready for Analysis</h3>
                          <p className="max-w-xs mx-auto">Click the button below to generate AI-powered intelligence based on your current funnel data.</p>
                      </div>
                  )}
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                  <Button onClick={handleAnalyze} disabled={isAnalyzing || isRefreshing} className="w-full font-bold shadow-lg shadow-primary/20">
                      {isAnalyzing ? <div className="w-4 h-4 mr-2 flex items-center"><LineLoader className="h-0.5"/></div> : <BrainCircuit className="mr-2 h-4 w-4" />}
                      {isAnalyzing ? "Processing Funnel Intelligence..." : "Analyze Current Funnel"}
                  </Button>
              </div>
          </Card>
        </div>
      )}

      {/* Data Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Detailed Funnel Records</CardTitle>
          <CardDescription>Click any row to view full account details or perform updates.</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-96">
                <Table>
                    <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                    <TableRow>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Segment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Revenue (USD)</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredData.length > 0 ? filteredData.map((item) => (
                        <TableRow key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer hover:bg-primary/5 transition-colors">
                        <TableCell className="font-bold text-primary/90">{item.accountName}</TableCell>
                        <TableCell className="text-xs">{item.owner}</TableCell>
                        <TableCell className="text-xs">{item.segment}</TableCell>
                        <TableCell>
                            <span className={cn(
                                "px-2.5 py-0.5 text-[10px] font-bold rounded-full border",
                                item.status === 'Won' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                item.status === 'Lost' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            )}>{item.status.toUpperCase()}</span>
                        </TableCell>
                        <TableCell className="text-right font-code text-xs">{usdCurrencyFormatter.format(item.revenue)}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No records match the current filter criteria.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(isOpen) => { if (!isOpen) setSelectedItem(null); }}>
        <DialogContent className="sm:max-w-md border-primary/20 bg-card/95 backdrop-blur-xl">
            {selectedItem && (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-primary">{selectedItem.accountName}</DialogTitle>
                        <DialogDescription className="font-code text-xs">
                            ENTRY ID: {selectedItem.id} | ROW: {selectedItem.rowNumber}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 text-sm">
                        <div className="flex justify-between items-center border-b border-primary/5 pb-2">
                            <span className="text-muted-foreground flex items-center gap-2"><Target size={14}/> Product</span>
                            <span className="font-semibold text-right">{selectedItem.product}</span>
                        </div>
                        <div className="flex justify-between items-start border-b border-primary/5 pb-2">
                            <span className="text-muted-foreground">Revenue Impact</span>
                            <div className="text-right">
                                <p className="font-bold text-primary text-lg">{usdCurrencyFormatter.format(selectedItem.revenue)}</p>
                                <p className="text-[10px] text-muted-foreground font-code uppercase">{inrCurrencyFormatter.format(selectedItem.revenue * EXCHANGE_RATE_USD_TO_INR)}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-b border-primary/5 pb-2">
                            <span className="text-muted-foreground">Sales Funnel Status</span>
                            <span className={cn(
                                "font-bold px-3 py-1 text-xs rounded-full border",
                                selectedItem.status === 'Won' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                selectedItem.status === 'Lost' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            )}>{selectedItem.status}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-primary/5 pb-2">
                            <span className="text-muted-foreground">Deal Probability</span>
                            <div className="flex items-center gap-3">
                                <span className="font-bold">{Math.round(selectedItem.probability * 100)}%</span>
                                <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${selectedItem.probability * 100}%` }}
                                  />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-b border-primary/5 pb-2">
                            <span className="text-muted-foreground">Account Owner</span>
                            <span className="font-semibold">{selectedItem.owner}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-primary/5 pb-2">
                            <span className="text-muted-foreground">Market Segment</span>
                            <span className="font-semibold">{selectedItem.segment}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-primary/5 pb-2">
                            <span className="text-muted-foreground">Assigned Region</span>
                            <span className="font-semibold">{selectedItem.region}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-primary/5 pb-2">
                            <span className="text-muted-foreground">Target Closure</span>
                            <span className="font-bold text-primary">{selectedItem.closureMonth}</span>
                        </div>
                        {selectedItem.lastModified && (
                          <div className="flex justify-between items-center pt-2">
                              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Last Intelligence Update</span>
                              <span className="text-[10px] font-code opacity-60">{new Date(selectedItem.lastModified).toLocaleString()}</span>
                          </div>
                        )}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10" onClick={() => {
                            setItemToEdit(selectedItem);
                            setSelectedItem(null);
                        }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Update Record
                        </Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!itemToEdit} onOpenChange={(isOpen) => { if(!isOpen) setItemToEdit(null)}}>
        <DialogContent className="border-primary/20 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Record: {itemToEdit?.accountName}</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-widest opacity-60">
              Synchronizing updates with enterprise spreadsheet
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Current Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pipeline">Active Pipeline</SelectItem>
                        <SelectItem value="Won">Deal Won</SelectItem>
                        <SelectItem value="Lost">Deal Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Revenue (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-background/50 font-code" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="probability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Probability (%)</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-background/50 font-code" placeholder="50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Account Owner (BDM/ISR)</FormLabel>
                    <FormControl>
                      <Input className="bg-background/50" placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="segment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Business Segment</FormLabel>
                    <FormControl>
                      <Input className="bg-background/50" placeholder="e.g. Enterprise, SME" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4 gap-2">
                <Button type="button" variant="ghost" className="text-xs uppercase font-bold" onClick={() => setItemToEdit(null)}>Discard</Button>
                <Button type="submit" className="font-bold shadow-lg shadow-primary/20" disabled={isEditing}>
                  {isEditing && <LineLoader className="h-0.5 w-4 mr-2" />}
                  Commit Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
