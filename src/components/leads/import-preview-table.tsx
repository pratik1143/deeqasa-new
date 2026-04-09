"use client";

import * as React from "react";
import { CleanedLead } from "@/lib/lead-import-logic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ImportPreviewTableProps {
  data: CleanedLead[];
}

export function ImportPreviewTable({ data }: ImportPreviewTableProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Name</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Company</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Email</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((lead, index) => (
            <TableRow 
              key={index} 
              className={cn(
                "h-14 transition-colors",
                !lead.isValid ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50/50"
              )}
            >
              <TableCell>
                {lead.isValid ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 text-white border-none rounded-xl p-3 shadow-xl max-w-xs">
                        <p className="text-[10px] font-black uppercase mb-1 text-red-400">Validation Errors</p>
                        <ul className="text-[11px] list-disc pl-4 space-y-1">
                          {lead.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell>
                <span className={cn("text-xs font-bold", !lead.isValid && !lead.name && "text-red-400 italic")}>
                  {lead.name || "Missing Name"}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn("text-xs font-medium text-slate-600", !lead.isValid && !lead.company && "text-red-400 italic")}>
                  {lead.company || "Missing Company"}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn("text-xs text-slate-500", !lead.isValid && lead.errors.some(e => e.includes('email')) && "text-red-400")}>
                  {lead.email}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn("text-xs font-mono text-slate-500", !lead.isValid && lead.errors.some(e => e.includes('phone')) && "text-red-400")}>
                  {lead.phone}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
