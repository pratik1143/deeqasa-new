"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { FunnelData } from "@/lib/types";
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
import { BrainCircuit, Loader2, RefreshCw } from "lucide-react";
import { FunnelAnalysisOutput, analyzeFunnelData } from "@/ai/flows/ai-funnel-analyzer";
import { getSheetData } from "@/ai/flows/get-sheet-data";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { CenteredLoader } from "../ui/centered-loader";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";


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

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const SPREADSHEET_ID = "1gZWkQV-2TYIDZ_bFEQG6EHlHPImXjb6p-4oSiCFRKFk";
const SHEET_RANGE = "Sheet1!A:I"; // Assumes headers in row 1, data starts in row 2

export function FunnelAnalyzerDashboard() {
  const [data, setData] = useState<FunnelData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const [aiInsights, setAiInsights] = useState<FunnelAnalysisOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
          range: SHEET_RANGE,
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
      funnelsByOwner,
      funnelsBySegment,
      winRatioBySegment
    };
  }, [data, monthFilter, ownerFilter, segmentFilter]);


  const handleAnalyze = () => {
    setIsAnalyzing(true);
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
                revenueByMonth,
                funnelsByOwner,
                funnelsBySegment,
                winRatioBySegment
            });
            setAiInsights(insights);
        } catch (error) {
            console.error("AI Analysis failed", error);
            // Optionally, set an error state to show in the UI
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
                <br /><br />
                Please ensure the service account has viewer permissions on the Google Sheet and try again.
              </AlertDescription>
            </Alert>
            <Button onClick={handleRefresh} variant="outline" className="mt-4">
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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
            <CardTitle className="text-primary">{currencyFormatter.format(wonRevenue)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pipeline Value</CardDescription>
            <CardTitle>{currencyFormatter.format(pipelineRevenue)}</CardTitle>
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

       {/* Charts & AI Insights */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            {/* Charts Grid */}
            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                <CardHeader>
                    <CardTitle>Funnel Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-52 w-full">
                        <PieChart>
                            <Tooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle>Funnels by Owner</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-52 w-full">
                        <BarChart data={ownerChartData} layout="vertical" margin={{ left: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                            <Bar dataKey="funnels" fill="hsl(var(--chart-1))" radius={4} />
                        </BarChart>
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
                        <LineChart data={Object.entries(revenueByMonth).map(([name, value]) => ({ name, revenue: value }))}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickFormatter={(value) => currencyFormatter.format(value as number).slice(0,-3)+'k'}/>
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>

        {/* AI Analysis Card */}
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BrainCircuit size={20} className="text-primary"/> AI Insights</CardTitle>
                <CardDescription>Automatic analysis of your current funnel.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                {isAnalyzing ? (
                    <div className="space-y-4 m-auto">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ) : aiInsights ? (
                    <div className="text-sm space-y-4">
                        <div>
                            <h4 className="font-semibold text-foreground">Performance Summary</h4>
                            <p className="text-muted-foreground">{aiInsights.performanceSummary}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-foreground">Bottlenecks</h4>
                            <p className="text-muted-foreground">{aiInsights.stuckDealsInsight}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-foreground">Top Performers</h4>
                            <p className="text-muted-foreground">{aiInsights.topPerformerInsight}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-foreground">Segment Focus</h4>
                            <p className="text-muted-foreground">{aiInsights.segmentInsight}</p>
                        </div>
                    </div>
                ) : (
                    <div className="m-auto text-center text-muted-foreground">
                        <p>Click the button to generate AI-powered insights for the current data view.</p>
                    </div>
                )}
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
                <Button onClick={handleAnalyze} disabled={isAnalyzing || isRefreshing} className="w-full">
                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                    {isAnalyzing ? "Analyzing..." : "Generate AI Insights"}
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
                        <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredData.length > 0 ? filteredData.map((item) => (
                        <TableRow key={item.id}>
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
                        <TableCell className="text-right">{currencyFormatter.format(item.revenue)}</TableCell>
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
    </div>
  );
}
