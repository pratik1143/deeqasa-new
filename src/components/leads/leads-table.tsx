"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowUpDown, 
  MoreHorizontal,
  Phone,
  MessageSquare,
  Zap,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Lead } from "@/lib/types";
import { cn } from "@/lib/utils";
import { calculateLeadScore, getLeadUrgency } from "@/lib/crm-logic";
import { formatDate } from "@/lib/date-utils";

interface LeadsTableProps {
  data: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export function LeadsTable({ data, onLeadClick }: LeadsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const urgency = getLeadUrgency(row.original.followUpDate);
        
        return (
          <div className="flex items-center gap-2">
            <Badge className={cn(
              "rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none shrink-0",
              status === "New" ? "bg-blue-600 text-white" :
              status === "Won" ? "bg-emerald-600 text-white shadow-[0_5px_15px_rgba(16,185,129,0.3)]" : 
              status === "Lost" ? "bg-slate-400 text-white" : 
              "bg-slate-900 text-white"
            )}>
              {status}
            </Badge>
            {urgency === 'overdue' && (
              <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-pulse">
                 <AlertCircle size={12} />
              </div>
            )}
            {urgency === 'today' && (
              <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                 <Clock size={12} />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-[10px] font-black uppercase tracking-widest h-auto p-0 hover:bg-transparent text-slate-400"
        >
          Entity Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{row.getValue("name")}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.original.company}</div>
        </div>
      ),
    },
    {
      accessorKey: "score",
      header: "Engage Score",
      cell: ({ row }) => {
        const score = calculateLeadScore(row.original);
        return (
          <div className="flex items-center gap-3">
            <div className="text-[11px] font-black text-slate-900">{score}</div>
            <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
               <div 
                 className={cn(
                   "h-full transition-all",
                   score > 70 ? "bg-red-500" : score > 40 ? "bg-blue-500" : "bg-slate-300"
                 )} 
                 style={{ width: `${score}%` }} 
               />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "revenue",
      header: "Revenue",
      cell: ({ row }) => (
        <div className="text-[11px] font-black text-slate-900">
          <p className="text-lg font-black text-slate-900 tracking-tighter">
            ₹{(((row.original.revenue || 0) * 85) / 100000).toFixed(2)}L
          </p>
        </div>
      ),
    },
    {
      accessorKey: "followUpDate",
      header: "Tactical Deadline",
      cell: ({ row }) => {
        const date = row.original.followUpDate;
        if (!date) return <span className="text-[10px] text-slate-300">-- --</span>;
        const urgency = getLeadUrgency(date);
        
        return (
          <div className={cn(
            "text-[10px] font-bold px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest",
            urgency === 'overdue' ? "bg-red-50 text-red-600 border border-red-100" :
            urgency === 'today' ? "bg-amber-50 text-amber-600 border border-amber-100" :
            "text-slate-500"
          )}>
            {formatDate(date, "MMM dd, yyyy")}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLeadClick(lead)}
              className="h-8 border-slate-100 bg-white hover:bg-slate-50 text-[9px] font-black uppercase tracking-widest rounded-lg px-3"
            >
              Analyze
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400"
            >
              <MoreHorizontal size={14} />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            placeholder="FILTER ENTITIES..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-12 bg-white border-slate-200 h-12 rounded-2xl text-[11px] font-bold tracking-widest placeholder:text-slate-300 focus-visible:ring-primary shadow-sm"
          />
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-16 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onLeadClick(row.original)}
                  className={cn(
                    "cursor-pointer hover:bg-slate-50 transition-colors border-slate-50 h-20",
                    getLeadUrgency(row.original.followUpDate) === 'overdue' && "bg-red-50/10",
                    getLeadUrgency(row.original.followUpDate) === 'today' && "bg-amber-50/10"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                  Zero entities found in the currently filtered mission parameters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Showing {table.getRowModel().rows.length} of {data.length} synchronized entities
         </p>
         <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-10 w-10 border-slate-100 rounded-xl"
            >
                <ChevronLeft size={16} />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-10 w-10 border-slate-100 rounded-xl"
            >
                <ChevronRight size={16} />
            </Button>
         </div>
      </div>
    </div>
  );
}
