
'use client';

import { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Search, 
  Calendar, 
  MapPin, 
  User, 
  Building2, 
  Activity, 
  ChevronRight,
  ShieldCheck,
  Terminal,
  DollarSign,
  FileText,
  Loader2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ADMIN_EMAILS = ['deeqasa@admin.in'];

const ExpenseSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  companyName: z.string().min(1, "Company name is required"),
  fromLocation: z.string().min(1, "Starting location is required"),
  toLocation: z.string().min(1, "Destination is required"),
  goingAmount: z.coerce.number().min(0),
  returnAmount: z.coerce.number().min(0),
  quotationStatus: z.enum(['Sent', 'Pending', 'Approved']),
  quotationReference: z.string().optional(),
  remarks: z.string().optional(),
  visitDate: z.string().min(1, "Visit date is required"),
});

type ExpenseFormValues = z.infer<typeof ExpenseSchema>;

export function ExpenseManager() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setSavedEditingId] = useState<string | null>(null);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

  const expensesQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return collection(firestore, 'expenses');
  }, [firestore, isAdmin]);

  const { data: expenses, isLoading: isDataLoading } = useCollection(expensesQuery);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      employeeName: '',
      companyName: '',
      fromLocation: '',
      toLocation: '',
      goingAmount: 0,
      returnAmount: 0,
      quotationStatus: 'Pending',
      quotationReference: '',
      remarks: '',
      visitDate: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const watchedGoing = useWatch({ control: form.control, name: 'goingAmount' }) || 0;
  const watchedReturn = useWatch({ control: form.control, name: 'returnAmount' }) || 0;
  const totalAmount = Number(watchedGoing) + Number(watchedReturn);

  const onSubmit = async (values: ExpenseFormValues) => {
    if (!isAdmin || !firestore) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        totalAmount,
        createdBy: user.email,
        updatedAt: serverTimestamp(),
        visitDate: Timestamp.fromDate(new Date(values.visitDate))
      };

      if (editingId) {
        await updateDoc(doc(firestore, 'expenses', editingId), payload);
        toast({ title: "Protocol: Updated", description: "Record recalibrated in registry." });
      } else {
        await addDoc(collection(firestore, 'expenses'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Protocol: Saved", description: "Expense transmission complete." });
      }
      form.reset();
      setSavedEditingId(null);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Transmission Failed", description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense: any) => {
    setSavedEditingId(expense.id);
    form.reset({
      employeeName: expense.employeeName,
      companyName: expense.companyName,
      fromLocation: expense.fromLocation,
      toLocation: expense.toLocation,
      goingAmount: expense.goingAmount,
      returnAmount: expense.returnAmount,
      quotationStatus: expense.quotationStatus,
      quotationReference: expense.quotationReference || '',
      remarks: expense.remarks || '',
      visitDate: expense.visitDate ? format(expense.visitDate.toDate(), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin || !firestore) return;
    if (!confirm("Are you sure you want to purge this record?")) return;
    try {
      await deleteDoc(doc(firestore, 'expenses', id));
      toast({ title: "Protocol: Purged", description: "Record removed from system." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Purge Failed", description: e.message });
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Financial Node Alpha</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
            Expense Management <span className="text-white/10">|</span> <span className="text-white/40 font-light">Secure Registry</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <ShieldCheck size={12} className="text-emerald-500/50"/> Admin: {user?.email}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <Card className="bg-black/40 border-primary/20 backdrop-blur-3xl overflow-hidden holographic-edge sticky top-24">
            <CardHeader className="bg-primary/5 border-b border-primary/10 p-6 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={60}/></div>
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                <Activity className="animate-pulse" size={16} /> {editingId ? 'Recalibrate Entry' : 'New Expense Entry'}
              </CardTitle>
              <CardDescription className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Data Integrity Port: SEC-EXP-99
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="employeeName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">Asset Name</FormLabel>
                        <FormControl><Input className="bg-white/5 border-white/10 h-10 text-xs font-bold" placeholder="Employee Name" {...field} /></FormControl>
                        <FormMessage className="text-[8px] uppercase" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">Client Entity</FormLabel>
                        <FormControl><Input className="bg-white/5 border-white/10 h-10 text-xs font-bold" placeholder="Company Name" {...field} /></FormControl>
                        <FormMessage className="text-[8px] uppercase" />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="fromLocation" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">From Vector</FormLabel>
                        <FormControl><Input className="bg-white/5 border-white/10 h-10 text-xs font-bold" placeholder="Source" {...field} /></FormControl>
                        <FormMessage className="text-[8px] uppercase" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="toLocation" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">To Vector</FormLabel>
                        <FormControl><Input className="bg-white/5 border-white/10 h-10 text-xs font-bold" placeholder="Destination" {...field} /></FormControl>
                        <FormMessage className="text-[8px] uppercase" />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField control={form.control} name="goingAmount" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">Going (₹)</FormLabel>
                        <FormControl><Input type="number" className="bg-white/5 border-white/10 h-10 text-xs font-bold font-mono" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="returnAmount" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">Return (₹)</FormLabel>
                        <FormControl><Input type="number" className="bg-white/5 border-white/10 h-10 text-xs font-bold font-mono" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase text-primary">Aggregate (₹)</Label>
                      <div className="h-10 bg-primary/10 border border-primary/20 rounded-md flex items-center px-3 font-mono font-black text-primary text-xs">
                        {totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="quotationStatus" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">Proposal State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 h-10 text-[10px] font-bold uppercase">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black/90 border-white/10">
                            <SelectItem value="Sent" className="text-xs uppercase font-bold">Sent</SelectItem>
                            <SelectItem value="Pending" className="text-xs uppercase font-bold">Pending</SelectItem>
                            <SelectItem value="Approved" className="text-xs uppercase font-bold">Approved</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="visitDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase text-white/40">Visit Date</FormLabel>
                        <FormControl><Input type="date" className="bg-white/5 border-white/10 h-10 text-xs font-bold invert dark:invert-0" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="quotationReference" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase text-white/40">Quotation ID / Reference</FormLabel>
                      <FormControl><Input className="bg-white/5 border-white/10 h-10 text-xs font-bold uppercase" placeholder="DQT-..." {...field} /></FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="remarks" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[9px] font-black uppercase text-white/40">Mission Remarks</FormLabel>
                      <FormControl><Textarea className="bg-white/5 border-white/10 text-xs resize-none" rows={3} placeholder="Enter details..." {...field} /></FormControl>
                    </FormItem>
                  )} />

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => { form.reset(); setSavedEditingId(null); }}
                      className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white"
                    >
                      Clear Terminal
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 h-12 bg-primary text-black font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,224,255,0.2)] hover:shadow-primary/40 transition-all"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : editingId ? <Save size={16}/> : <Plus size={16}/>}
                      <span className="ml-2">{editingId ? 'Recalibrate' : 'Commit Entry'}</span>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-black/40 border-white/5 overflow-hidden holographic-edge h-full">
            <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <Terminal size={14} className="text-primary"/> Operational Logs
                </CardTitle>
                <CardDescription className="text-[8px] font-bold uppercase tracking-widest text-white/20 mt-1">Registry Telemetry Readout</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-primary/20 rounded-full" />
                <div className="h-1 w-4 bg-primary/40 rounded-full" />
                <div className="h-1 w-2 bg-primary rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[750px]">
                {isDataLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin opacity-40" />
                    <span className="text-[10px] font-black text-primary tracking-[0.5em] uppercase">Syncing Registry...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="sticky top-0 bg-black/90 backdrop-blur-md z-10 border-b border-white/10">
                      <TableRow className="border-white/5">
                        <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Temporal Mark</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Entity & Asset</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40">Route Vector</TableHead>
                        <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-white/40">Aggregate (₹)</TableHead>
                        <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-white/40">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses && expenses.length > 0 ? expenses.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()).map((item) => (
                        <TableRow key={item.id} className="border-white/5 hover:bg-primary/5 transition-colors group">
                          <TableCell className="text-[10px] font-mono text-white/40">
                            {item.visitDate ? format(item.visitDate.toDate(), 'dd MMM yy') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-[11px] font-black text-primary uppercase group-hover:text-white transition-colors">{item.companyName}</p>
                              <div className="flex items-center gap-2 text-[9px] text-white/30 font-bold uppercase">
                                <User size={8} /> {item.employeeName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-[9px] text-white/40 font-bold uppercase">
                              <span className="truncate max-w-[60px]">{item.fromLocation}</span>
                              <ChevronRight size={8} className="text-primary/40"/>
                              <span className="truncate max-w-[60px]">{item.toLocation}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="space-y-1">
                              <p className="text-[11px] font-mono font-black text-white">{item.totalAmount?.toLocaleString('en-IN')}</p>
                              <Badge variant="outline" className={cn(
                                "text-[7px] h-4 px-1.5 font-black uppercase border-none",
                                item.quotationStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                item.quotationStatus === 'Sent' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-white/20'
                              )}>
                                {item.quotationStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/10" onClick={() => handleEdit(item)}>
                                <Edit size={12} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/40 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(item.id)}>
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-white/20 font-bold uppercase text-[10px] tracking-widest italic">
                            Mission logs are currently empty.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
