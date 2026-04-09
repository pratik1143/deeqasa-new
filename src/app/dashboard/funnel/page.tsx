"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  RefreshCw, 
  Download, 
  Filter, 
  Search, 
  LayoutGrid, 
  List,
  Building2,
  DollarSign,
  User,
  Zap,
  Target,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getSheetData } from "@/ai/flows/get-sheet-data";
import { FunnelData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/layout/admin-layout";
import { CenteredLoader } from "@/components/ui/centered-loader";

const SPREADSHEET_ID = "1gZWkQV-2TYIDZ_bFEQG6EHlHPImXjb6p-4oSiCFRKFk";

export default function FunnelPage() {
  const [data, setData] = React.useState<FunnelData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { toast } = useToast();

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getSheetData({ spreadsheetId: SPREADSHEET_ID });
      setData(response);
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to establish uplink with Google Sheet matrix.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter(item => 
    item.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = data.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const avgProbability = data.length > 0 
    ? (data.reduce((acc, curr) => acc + (curr.probability || 0), 0) / data.length) * 100 
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20 font-[Outfit]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Intelligence Matrix</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  Sales <span className="text-primary">Funnel</span>
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mt-4 max-w-lg">
                  Direct mission-critical synchronization with Google Sheets terminal. Real-time pipeline intelligence and revenue forecasting.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={fetchData} 
                  disabled={isLoading}
                  variant="outline" 
                  className="h-12 px-6 border-slate-100 bg-white hover:bg-slate-50 rounded-xl shadow-sm text-slate-400 font-black text-[10px] uppercase tracking-widest gap-2"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                  Refresh
                </Button>
                <Button className="h-12 px-8 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-xl transition-all gap-2">
                  <Download size={14} /> Export Intel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* High-Impact Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
          { label: "Pipeline Liquidity", value: `₹${((totalRevenue * 85) / 100000).toFixed(1)}L`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Operations", value: data.length.toString(), icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Strategic Win Rate", value: `${avgProbability.toFixed(1)}%`, icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Card className="bg-white border-slate-100 shadow-sm rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 border-b-4 border-b-transparent hover:border-b-primary/40">
                <CardContent className="p-10 flex items-center gap-8">
                  <div className={cn("h-16 w-16 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12", stat.bg)}>
                    <stat.icon size={28} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                    <div className="flex items-end gap-3">
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                      <div className="flex items-center text-[10px] font-black text-emerald-500 mb-1">
                        <ArrowUpRight size={12} className="mr-0.5" />
                        8%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search & Intelligence Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="SEARCH MATRIX ENTITIES..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-14 bg-slate-50/50 border-none rounded-2xl text-[11px] font-black tracking-widest uppercase placeholder:text-slate-300 focus-visible:ring-primary h-[60px]"
            />
          </div>
          <div className="flex items-center gap-3 pr-2">
            <Button variant="ghost" className="h-12 w-12 rounded-xl p-0 hover:bg-slate-50">
              <Filter size={18} className="text-slate-400" />
            </Button>
            <div className="h-8 w-[1px] bg-slate-100 mx-2" />
            <div className="flex bg-slate-100/50 p-1.5 rounded-xl">
              <Button size="icon" variant="ghost" className="h-9 w-9 bg-white shadow-sm rounded-lg text-primary">
                <List size={16} />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg text-slate-300">
                <LayoutGrid size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Data Stream Matrix */}
        <div className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Entity Intelligence</th>
                  <th className="px-8 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Revenue Momentum</th>
                  <th className="px-8 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Mission Phase</th>
                  <th className="px-8 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Deployment Zone</th>
                  <th className="px-10 py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Tactical Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                       <CenteredLoader text="Synchronizing Intelligence Matrix..." />
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      key={item.id} 
                      className="group hover:bg-slate-50/50 transition-colors h-24"
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                          <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
                            {item.accountName[0]}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors uppercase">
                              {item.accountName}
                            </h4>
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                              <Building2 size={10} /> {item.productLine} // <span className="text-slate-300">{item.product}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2 max-w-[160px]">
                          <p className="text-lg font-black text-slate-900 tracking-tighter">
                            ₹{((item.revenue * 85) / 100000).toFixed(2)}L
                          </p>
                          <div className="flex items-center gap-3">
                             <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${item.probability * 100}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="h-full bg-primary" 
                                />
                             </div>
                             <span className="text-[10px] font-black text-slate-400 tracking-tighter">{(item.probability * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={cn(
                          "rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none shrink-0",
                          item.status === 'Won' ? "bg-emerald-600 text-white shadow-[0_5px_15px_rgba(16,185,129,0.3)]" : 
                          item.status === 'Lost' ? "bg-slate-400 text-white" : 
                          "bg-slate-900 text-white"
                        )}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.region}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.state} // <span className="italic opacity-60 font-medium lowercase italic">{item.segment}</span></span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-right">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{item.owner}</p>
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">{item.closureMonth}</p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors shadow-inner">
                             <User size={16} />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                       <div className="flex flex-col items-center gap-4 text-slate-300">
                          <Zap size={48} className="opacity-20" />
                          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Zero Matrix Entities Detected in Current Stream.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
