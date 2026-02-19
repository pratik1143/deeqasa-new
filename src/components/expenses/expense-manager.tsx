
'use client';

import { useState, useMemo, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  Wallet, 
  Plus, 
  MapPin, 
  Building2, 
  User, 
  Calendar, 
  ArrowRight, 
  RefreshCw, 
  Save, 
  Trash2, 
  Eye, 
  Edit,
  ClipboardList,
  Terminal,
  Activity,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser, useMemoFirebase, useCollection } from "@/firebase";
import { collection, doc, deleteDoc, setDoc, query, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const ExpenseSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  companyName: z.string().min(1, "Company name is required"),
  fromLocation: z.string().min(1, "Starting location is required"),
  toLocation: z.string().min(1, "Destination is required"),
  goingAmount: z.coerce.number().min(0),
  returnAmount: z.coerce.number().min(0),
  quotationStatus: z.enum(['Sent', 'Pending', 'Approved']),
  quotationReferenceNumber: z.string().optional(),
  remarks: z.string().optional(),
  visitDate: z.date({ required_error: "Visit date is required" }),
  expenseApprovalStatus: z.enum(['Pending', 'Approved', 'Rejected']).default('Pending'),
});

type ExpenseFormValues = z.infer<typeof ExpenseSchema>;

export function ExpenseManager() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      employeeName: "",
      companyName: "",
      fromLocation: "",
      toLocation: "",
      goingAmount: 0,
      returnAmount: 0,
      quotationStatus: "Pending",
      quotationReferenceNumber: "",
      remarks: "",
      visitDate: new Date(),
      expenseApprovalStatus: "Pending",
    },
  });

  const watchedGoing = useWatch({ control: form.control, name: 'goingAmount' }) || 0;
  const watchedReturn = useWatch({ control: form.control, name: 'returnAmount' }) || 0;
  const totalAmount = Number(watchedGoing) + Number(watchedReturn);

  const expensesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'site_visit_expenses'), orderBy('visitDate', 'desc'));
  }, [firestore]);

  const { data: expenses, isLoading: isExpensesLoading } = useCollection(expensesQuery);

  const onSubmit = async (values: ExpenseFormValues) => {
    if (!firestore || !user) return;
    setIsSaving(true);
    const expenseId = editingId || `EXP-${Date.now()}`;
    
    try {
      const docRef = doc(firestore, 'site_visit_expenses', expenseId);
      await setDoc(docRef, {
        ...values,
        id: expenseId,
        totalAmount,
        visitDate: values.visitDate.toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid,
      }, { merge: true });

      toast({ title: editingId ? "Record Calibrated" : "Expense Logged", description: "Financial telemetry synchronized." });
      form.reset();
      setEditingId(null);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Error", description: e.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingId(expense.id);
    form.reset({
      ...expense,
      visitDate: new Date(expense.visitDate),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    if (confirm("Are you sure you want to terminate this record?")) {
      try {
        await deleteDoc(doc(firestore, 'site_visit_expenses', id));
        toast({ title: "Record Terminated", description: "Data point removed from registry." });
      } catch (e: any) {
        toast({ variant: "destructive", title: "Deletion Failed", description: e.message });
      }
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="h-3 w-3 text-emerald-400" />;
      case 'Rejected': return <XCircle className="h-3 w-3 text-red-400" />;
      default: return <Activity className="h-3 w-3 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Readout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Financial Subsystem</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
            Expense Manager <span className="text-white/10">|</span> <span className="text-white/40 font-light">System v2.1</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Active Pool</p>
              <p className="text-xl font-black text-white font-mono">₹{expenses?.reduce((sum, e) => sum + (e.totalAmount || 0), 0).toLocaleString('en-IN') || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Entry Form */}
        <div className="lg:col-span-5">
          <Card className="bg-black/40 border-primary/20 backdrop-blur-3xl overflow-hidden holographic-edge">
            <CardHeader className="bg-primary/5 border-b border-primary/10 p-8 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={80}/></div>
              <CardTitle className="text-lg font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                <Terminal className="animate-pulse" size={18}/> {editingId ? 'Recalibrate Record' : 'Initiate Expense Log'}
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Registry ID: {editingId || 'NEW-ENTRY'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="employeeName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40 tracking-widest">Asset Identity</FormLabel>
                        <FormControl><Input placeholder="Full Name" className="bg-white/5 border-white/10 focus:ring-primary/30 h-11" {...field} /></FormControl>
                        <FormMessage className="text-[8px] uppercase font-black" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40 tracking-widest">Client Entity</FormLabel>
                        <FormControl><Input placeholder="Company Name" className="bg-white/5 border-white/10 focus:ring-primary/30 h-11" {...field} /></FormControl>
                        <FormMessage className="text-[8px] uppercase font-black" />
                      </FormItem>
                    )} />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 border-b border-primary/10 pb-2">Route Matrix</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="fromLocation" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black uppercase text-white/40">From Location</FormLabel>
                          <FormControl><Input placeholder="Origin" className="bg-white/5 border-white/10 h-11" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="toLocation" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black uppercase text-white/40">To Location</FormLabel>
                          <FormControl><Input placeholder="Destination" className="bg-white/5 border-white/10 h-11" {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 border-b border-primary/10 pb-2">Financial Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField control={form.control} name="goingAmount" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black uppercase text-white/40">Going (₹)</FormLabel>
                          <FormControl><Input type="number" className="bg-white/5 border-white/10 h-11 font-mono font-bold" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="returnAmount" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-black uppercase text-white/40">Return (₹)</FormLabel>
                          <FormControl><Input type="number" className="bg-white/5 border-white/10 h-11 font-mono font-bold" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase text-primary/60">Total Valuation</Label>
                        <div className="h-11 flex items-center px-4 bg-primary/10 rounded-md border border-primary/20 text-primary font-mono font-black text-lg">
                          ₹{totalAmount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="quotationStatus" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">Quotation Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 h-11">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black/90 border-white/10">
                            <SelectItem value="Sent">Sent to Client</SelectItem>
                            <SelectItem value="Pending">Draft/Pending</SelectItem>
                            <SelectItem value="Approved">Client Approved</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="quotationReferenceNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">Reference Code</FormLabel>
                        <FormControl><Input placeholder="DQT-..." className="bg-white/5 border-white/10 h-11 font-mono" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="visitDate" render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-[9px] font-black uppercase text-white/40 mb-2">Operational Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("bg-white/5 border-white/10 h-11 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-black border-white/10" align="start">
                            <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="expenseApprovalStatus" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">Approval Protocol</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 h-11">
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black/90 border-white/10">
                            <SelectItem value="Pending">Pending Audit</SelectItem>
                            <SelectItem value="Approved">System Approved</SelectItem>
                            <SelectItem value="Rejected">Rejected/Flagged</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="remarks" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase text-white/40">Mission Remarks</FormLabel>
                      <FormControl><Textarea rows={4} placeholder="Additional context..." className="bg-white/5 border-white/10" {...field} /></FormControl>
                    </FormItem>
                  )} />

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" className="flex-1 h-14 border-white/10 uppercase font-black tracking-widest text-[10px]" onClick={() => { form.reset(); setEditingId(null); }}>Reset Form</Button>
                    <Button type="submit" disabled={isSaving} className="flex-[2] h-14 bg-primary text-black font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_0_20px_rgba(0,224,255,0.3)]">
                      {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      {editingId ? 'Update Record' : 'Commit to Registry'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Records Table */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-black/40 border-white/5 overflow-hidden holographic-edge">
            <CardHeader className="bg-white/5 border-b border-white/5 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <ClipboardList size={14} className="text-primary"/> Operational Logs
                  </CardTitle>
                  <CardDescription className="text-[8px] font-bold uppercase tracking-widest text-white/20 mt-1">Full financial history readout</CardDescription>
                </div>
                <Badge variant="outline" className="text-[8px] font-black tracking-[0.2em] border-primary/20 text-primary">LIVE UPLINK</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[800px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-black/90 backdrop-blur-md z-10">
                    <TableRow className="border-white/5">
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Date</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Asset/Entity</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Route Summary</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Valuation</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Protocol</TableHead>
                      <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-white/40">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isExpensesLoading ? (
                      <TableRow><TableCell colSpan={6} className="h-32 text-center text-[10px] font-bold uppercase tracking-widest text-white/20">Syncing with Central Core...</TableCell></TableRow>
                    ) : expenses?.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="h-32 text-center text-[10px] font-bold uppercase tracking-widest text-white/20">No data points in registry.</TableCell></TableRow>
                    ) : (
                      expenses?.map((expense) => (
                        <TableRow key={expense.id} className="border-white/5 hover:bg-primary/5 transition-colors group">
                          <TableCell className="text-[10px] font-mono text-white/60">
                            {format(new Date(expense.visitDate), "dd MMM yy")}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              <p className="text-[11px] font-black text-white uppercase truncate max-w-[120px]">{expense.employeeName}</p>
                              <p className="text-[9px] font-bold text-white/20 uppercase truncate max-w-[120px]">{expense.companyName}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase">
                              <span className="truncate max-w-[60px]">{expense.fromLocation}</span>
                              <ArrowRight size={8} className="text-primary/40" />
                              <span className="truncate max-w-[60px]">{expense.toLocation}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              <p className="text-[11px] font-black text-primary font-mono">₹{expense.totalAmount?.toLocaleString('en-IN')}</p>
                              <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">G: {expense.goingAmount} | R: {expense.returnAmount}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="outline" className={cn(
                                "text-[8px] font-black uppercase tracking-tighter border-none px-2 py-0 h-4 flex items-center gap-1.5",
                                expense.expenseApprovalStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                expense.expenseApprovalStatus === 'Rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                              )}>
                                <StatusIcon status={expense.expenseApprovalStatus} />
                                {expense.expenseApprovalStatus}
                              </Badge>
                              <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest pl-1">Quote: {expense.quotationStatus}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => handleEdit(expense)}><Edit size={14} /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400/40 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(expense.id)}><Trash2 size={14} /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
