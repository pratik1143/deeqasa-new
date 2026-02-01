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
  ResponsiveContainer,
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
import { BrainCircuit, Edit, RefreshCw, AlertTriangle, Lightbulb, TrendingUp, TrendingDown, Target, Award, UserX, DollarSign } from "lucide-react";
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
    color: "hsl(var(--chart-1))",
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
    revenueByMonth,
    pipelineRevenueByMonth,
    funnelsByOwner,
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

    const revenueByMonth = filteredData.reduce((acc, d) => {
        if (d.status === 'Won') {
            if (!acc[d.closureMonth]) acc[d.closureMonth] = 0;
            acc[d.closureMonth] += d.revenue;
        }
        return acc;
    }, {} as Record<string, number>);
    
    const pipelineRevenueByMonth = filteredData.reduce((acc, d) => {
        if (d.status === 'Pipeline') {
            const month = d.closureMonth || d.oppCloseMonth || 'Unknown';
            if (!acc[month]) acc[month] = 0;
            acc[month] += d.revenue * d.probability;
        }
        return acc;
    }, {} as Record<string, number>);

    const funnelsByOwner = filteredData.reduce((acc, d) => {
        if (!acc[d.owner]) acc[d.owner] = 0;
        acc[d.owner]++;
        return acc;
    }, {} as Record<string, number>);

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
      revenueByMonth,
      pipelineRevenueByMonth,
      funnelsByOwner,
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
                revenueByMonth,
                pipelineRevenueByMonth,
                funnelsByOwner,
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

  const ownerChartData = Object.entries(funnelsByOwner).map(([name, value]) => ({ name, funnels: value }));

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

      <div className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Funnel Status</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-52 w-full">
                    <ResponsiveContainer>
                        <PieChart>
                            <Tooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Funnels by Owner</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-52 w-full">
                   <ResponsiveContainer>
                        <BarChart data={ownerChartData} layout="vertical" margin={{ left: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                            <Bar dataKey="funnels" fill="hsl(var(--chart-1))" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Won Revenue by Month</CardTitle>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
                    <ResponsiveContainer>
                        <LineChart data={Object.entries(revenueByMonth).map(([name, value]) => ({ name, revenue: value }))}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickFormatter={(value) => `$${(value as number / 1000).toFixed(0)}k`}/>
                            <Tooltip content={<ChartTooltipContent formatter={(value) => usdCurrencyFormatter.format(value as number)} />} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>

        {/* AI Analysis Card */}
        <Card className="flex flex-col mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BrainCircuit size={20} className="text-primary"/> AI Funnel Intelligence</CardTitle>
                <CardDescription>Automatic analysis of your current funnel.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
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
                    <ScrollArea className="h-full -mr-6">
                        <div className="text-sm space-y-6 pr-6">
                           <div>
                                <h4 className="font-semibold text-foreground mb-2">Executive Summary</h4>
                                <p className="text-muted-foreground">{aiInsights.executiveSummary}</p>
                            </div>
                            
                            <Card className="bg-secondary/50">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base flex items-center gap-2"><DollarSign /> Revenue Forecast</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-muted-foreground">{aiInsights.revenueForecast.forecast}</p>
                                    <p className="text-xs text-primary font-bold mt-2">CONFIDENCE: {aiInsights.revenueForecast.confidence}%</p>
                                </CardContent>
                            </Card>

                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Smart Alerts</h4>
                                <div className="space-y-2">
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
                                <div className="space-y-2">
                                    {aiInsights.topOpportunities.map((opp, i) => (
                                        <Card key={i} className="bg-secondary/50">
                                          <CardHeader className="p-4">
                                            <CardTitle className="text-base flex items-center gap-2"><Lightbulb size={16}/>{opp.title}</CardTitle>
                                            <CardDescription>{opp.description}</CardDescription>
                                          </CardHeader>
                                          <CardFooter className="p-4 pt-0">
                                              <p className="text-xs font-semibold text-primary">NEXT ACTION: {opp.nextAction}</p>
                                          </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="leakage">
                                    <AccordionTrigger className="font-semibold text-base"><Target size={16} className="mr-2"/>Funnel Leakage</AccordionTrigger>
                                    <AccordionContent className="pt-2">
                                        <h5 className="font-bold">{aiInsights.funnelLeakageAnalysis.primaryLeakagePoint}</h5>
                                        <p className="text-muted-foreground">{aiInsights.funnelLeakageAnalysis.insight}</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="performance">
                                    <AccordionTrigger className="font-semibold text-base"><TrendingUp size={16} className="mr-2"/>Owner Performance</AccordionTrigger>
                                    <AccordionContent className="pt-2 space-y-4">
                                      <div className="flex gap-4">
                                        <Award className="text-green-400 mt-1"/>
                                        <div>
                                          <h5 className="font-bold text-green-400">Top Performer: {aiInsights.ownerPerformance.topPerformer.name}</h5>
                                          <p className="text-muted-foreground">{aiInsights.ownerPerformance.topPerformer.reason}</p>
                                        </div>
                                      </div>
                                      <div className="flex gap-4">
                                        <UserX className="text-amber-400 mt-1"/>
                                        <div>
                                          <h5 className="font-bold text-amber-400">Needs Attention: {aiInsights.ownerPerformance.needsAttention.name}</h5>
                                          <p className="text-muted-foreground">{aiInsights.ownerPerformance.needsAttention.reason}</p>
                                        </div>
                                      </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="lost-deals">
                                    <AccordionTrigger className="font-semibold text-base"><TrendingDown size={16} className="mr-2"/>Lost Deal Intelligence</AccordionTrigger>
                                    <AccordionContent className="pt-2">
                                        <p className="text-muted-foreground">{aiInsights.lostDealIntelligence}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="m-auto text-center text-muted-foreground p-4">
                        <p>Click the button to generate AI-powered intelligence for the current data view.</p>
                    </div>
                )}
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
                <Button onClick={handleAnalyze} disabled={isAnalyzing || isRefreshing} className="w-full">
                    {isAnalyzing ? <div className="w-4 h-4 mr-2 flex items-center"><LineLoader className="h-0.5"/></div> : <BrainCircuit className="mr-2 h-4 w-4" />}
                    {isAnalyzing ? "Analyzing..." : "Generate AI Intelligence"}
                </Button>
            </div>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Funnel Details</CardTitle>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-96">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Segment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Revenue (USD)</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredData.length > 0 ? filteredData.map((item) => (
                        <TableRow key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
                        <TableCell className="font-medium">{item.accountName}</TableCell>
                        <TableCell>{item.owner}</TableCell>
                        <TableCell>{item.segment}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                item.status === 'Won' ? 'bg-green-500/20 text-green-400' :
                                item.status === 'Lost' ? 'bg-red-500/20 text-red-400' :
                                'bg-blue-500/20 text-blue-400'
                            }`}>{item.status}</span>
                        </TableCell>
                        <TableCell className="text-right">{usdCurrencyFormatter.format(item.revenue)}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No results found.
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
        <DialogContent className="sm:max-w-md">
            {selectedItem && (
                <>
                    <DialogHeader>
                        <DialogTitle>{selectedItem.accountName}</DialogTitle>
                        <DialogDescription>
                            Details for funnel entry #{selectedItem.id}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Product</span>
                            <span className="font-semibold text-right">{selectedItem.product}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Product Line</span>
                            <span className="font-semibold text-right">{selectedItem.productLine || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-muted-foreground">Revenue</span>
                            <div className="text-right">
                                <p className="font-semibold">{usdCurrencyFormatter.format(selectedItem.revenue)}</p>
                                <p className="text-xs text-muted-foreground">{inrCurrencyFormatter.format(selectedItem.revenue * EXCHANGE_RATE_USD_TO_INR)}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status</span>
                            <span className={`font-semibold px-2 py-1 text-xs rounded-full ${
                                selectedItem.status === 'Won' ? 'bg-green-500/20 text-green-400' :
                                selectedItem.status === 'Lost' ? 'bg-red-500/20 text-red-400' :
                                'bg-blue-500/20 text-blue-400'
                            }`}>{selectedItem.status}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Probability</span>
                            <span className="font-semibold">{Math.round(selectedItem.probability * 100)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Owner (BDM)</span>
                            <span className="font-semibold">{selectedItem.owner}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Segment</span>
                            <span className="font-semibold">{selectedItem.segment}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Region</span>
                            <span className="font-semibold">{selectedItem.region}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Closure Month</span>
                            <span className="font-semibold">{selectedItem.closureMonth}</span>
                        </div>
                        {selectedItem.lastModified && (
                          <div className="flex justify-between items-center border-t border-border pt-4 mt-2">
                              <span className="text-muted-foreground">Last Updated</span>
                              <span className="font-semibold text-right">{new Date(selectedItem.lastModified).toLocaleString()}</span>
                          </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setItemToEdit(selectedItem);
                            setSelectedItem(null);
                        }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Account
                        </Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!itemToEdit} onOpenChange={(isOpen) => { if(!isOpen) setItemToEdit(null)}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit: {itemToEdit?.accountName}</DialogTitle>
            <DialogDescription>
              Update the details for this funnel entry. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pipeline">Pipeline</SelectItem>
                        <SelectItem value="Won">Won</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenue (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
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
                    <FormLabel>Probability (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Segment</FormLabel>
                    <FormControl>
                      <Input placeholder="Enterprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setItemToEdit(null)}>Cancel</Button>
                <Button type="submit" disabled={isEditing}>
                  {isEditing && <LineLoader className="h-0.5 w-4 mr-2" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
