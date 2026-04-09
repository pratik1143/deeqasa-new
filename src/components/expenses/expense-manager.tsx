
'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Calendar, 
  MapPin, 
  User, 
  ChevronRight,
  ShieldCheck,
  DollarSign,
  FileText,
  Loader2,
  Edit,
  Save,
  Building2,
  ExternalLink,
  Image as ImageIcon,
  Receipt,
  CheckCircle2,
  Clock
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
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
  paymentLink: z.string().optional(),
  invoiceLink: z.string().optional(),
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
      paymentLink: '',
      invoiceLink: '',
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
        toast({ title: "Update Successful", description: "Expense record has been updated." });
      } else {
        await addDoc(collection(firestore, 'expenses'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Expense has been recorded." });
      }
      form.reset();
      setSavedEditingId(null);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Operation Failed", description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (!isAdmin || !firestore) return;
    const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
    try {
      await updateDoc(doc(firestore, 'expenses', id), {
        quotationStatus: newStatus,
        updatedAt: serverTimestamp(),
      });
      toast({ 
        title: "Status Synchronized", 
        description: `Expense status migrated to ${newStatus}.`,
      });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Update Refused", description: e.message });
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
      paymentLink: expense.paymentLink || '',
      invoiceLink: expense.invoiceLink || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin || !firestore) return;
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteDoc(doc(firestore, 'expenses', id));
      toast({ title: "Deleted", description: "Record removed from database." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

    return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase font-[Outfit]">
            Expense Management
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest italic leading-relaxed">
            Registry of site visits and travel disbursements.
          </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
          <ShieldCheck size={14} className="text-primary"/>
          Admin Authorized <span className="text-slate-200">|</span> {user?.email}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4">
          <Card className="shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border-slate-100 sticky top-28 bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-6 bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-black uppercase tracking-[0.3em] text-slate-900">
                {editingId ? 'Update Record' : 'Log New Mission'}
              </CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">
                Enter technical travel logistics.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-5">
                    <FormField control={form.control} name="employeeName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Field Agent Identity</FormLabel>
                        <FormControl><Input placeholder="Full Name" {...field} className="h-12 bg-slate-50/50 border-slate-100 font-bold uppercase tracking-tight text-xs" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Client Organization</FormLabel>
                        <FormControl><Input placeholder="Organization Name" {...field} className="h-12 bg-slate-50/50 border-slate-100 font-bold uppercase tracking-tight text-xs" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="fromLocation" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Origin</FormLabel>
                          <FormControl><Input placeholder="Location A" {...field} className="h-12 bg-slate-50/50 border-slate-100 font-bold uppercase tracking-tight text-xs" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="toLocation" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination</FormLabel>
                          <FormControl><Input placeholder="Location B" {...field} className="h-12 bg-slate-50/50 border-slate-100 font-bold uppercase tracking-tight text-xs" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="goingAmount" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transit In (₹)</FormLabel>
                          <FormControl><Input type="number" {...field} className="h-12 bg-slate-50/50 border-slate-100 font-bold text-xs" /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="returnAmount" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transit Out (₹)</FormLabel>
                          <FormControl><Input type="number" {...field} className="h-12 bg-slate-50/50 border-slate-100 font-bold text-xs" /></FormControl>
                        </FormItem>
                      )} />
                    </div>

                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex justify-between items-center shadow-inner">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Aggregate Valuation</span>
                      <span className="text-xl font-black text-primary font-mono tracking-tighter">₹ {totalAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="quotationStatus" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Protocol Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100 font-bold uppercase tracking-widest text-[9px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-slate-100 rounded-xl">
                              <SelectItem value="Sent" className="uppercase font-bold text-[10px] tracking-widest">Sent</SelectItem>
                              <SelectItem value="Pending" className="uppercase font-bold text-[10px] tracking-widest">Pending</SelectItem>
                              <SelectItem value="Approved" className="uppercase font-bold text-[10px] tracking-widest">Approved</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="visitDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stardate</FormLabel>
                          <FormControl><Input type="date" {...field} className="h-12 bg-slate-50/50 border-slate-100 font-bold text-xs" /></FormControl>
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="quotationReference" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference Identity</FormLabel>
                        <FormControl><Input placeholder="REF-ID" {...field} className="h-12 bg-slate-50/50 border-slate-100 font-bold uppercase tracking-widest text-[10px]" /></FormControl>
                      </FormItem>
                    )} />

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <FormField control={form.control} name="paymentLink" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary"><ImageIcon size={14}/> Evidence Trace (URL)</FormLabel>
                          <FormControl><Input placeholder="HTTPS://..." {...field} className="h-10 bg-slate-50/50 border-slate-100 text-[10px] font-mono" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="invoiceLink" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-600"><Receipt size={14}/> Fiscal Invoice (URL)</FormLabel>
                          <FormControl><Input placeholder="HTTPS://..." {...field} className="h-10 bg-slate-50/50 border-slate-100 text-[10px] font-mono" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="remarks" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mission Notes</FormLabel>
                        <FormControl><Textarea className="resize-none bg-slate-50/50 border-slate-100 rounded-xl text-xs font-bold leading-relaxed italic" rows={3} placeholder="Analysis summary..." {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => { form.reset(); setSavedEditingId(null); }}
                      className="flex-1 h-14 uppercase font-black tracking-widest text-[9px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl"
                    >
                      Purge Data
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 h-14 bg-primary text-white uppercase font-black tracking-widest text-[10px] rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : editingId ? <Save size={18} className="mr-3"/> : <Plus size={18} className="mr-3"/>}
                      {editingId ? 'Sync Trace' : 'Secure Entry'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-slate-100 bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4 bg-white border-b border-slate-50 px-10 pt-8">
              <CardTitle className="text-xl font-black uppercase tracking-tighter text-slate-900 font-[Outfit]">Mission Registry</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Historical archive of validated site deployments.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[800px] w-full">
                {isDataLoading ? (
                  <div className="flex flex-col items-center justify-center h-[500px] gap-6 text-slate-200">
                    <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Synchronizing Registry...</span>
                  </div>
                ) : (
                  <div className="min-w-[1000px]">
                    <Table>
                      <TableHeader className="bg-slate-50/50 h-16">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                          <TableHead className="w-[140px] pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Temporal Stamp</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Agent & Entity</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Deployment Zone</TableHead>
                          <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Valuation (₹)</TableHead>
                          <TableHead className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Validation</TableHead>
                          <TableHead className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trace Docs</TableHead>
                          <TableHead className="text-right pr-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Command</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses && expenses.length > 0 ? expenses.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()).map((item) => (
                          <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors h-20 group">
                            <TableCell className="pl-10">
                              <div className="flex flex-col">
                                <span className="text-[12px] font-black text-slate-900 lowercase">{item.visitDate ? format(item.visitDate.toDate(), 'dd/MM/yyyy') : 'Unsynced'}</span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Verified Logic</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-black text-slate-900 uppercase tracking-tighter">{item.employeeName}</span>
                                <span className="text-[10px] font-bold text-primary lowercase line-clamp-1">{item.companyName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-tight bg-slate-50 py-2 px-4 rounded-xl border border-slate-100">
                                <span>{item.fromLocation}</span>
                                <ChevronRight size={14} className="text-primary/40"/>
                                <span>{item.toLocation}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-[13px] font-mono font-black text-slate-900">₹{item.totalAmount?.toLocaleString('en-IN')}</span>
                                <Badge variant="outline" className={cn(
                                  "text-[8px] h-4 px-2 tracking-widest uppercase border-none font-black",
                                  item.quotationStatus === 'Approved' && "bg-emerald-50 text-emerald-600",
                                  item.quotationStatus === 'Sent' && "bg-blue-50 text-blue-600",
                                  item.quotationStatus === 'Pending' && "bg-amber-50 text-amber-600"
                                )}>
                                  {item.quotationStatus}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <Switch 
                                  checked={item.quotationStatus === 'Approved'} 
                                  onCheckedChange={() => handleToggleStatus(item.id, item.quotationStatus)}
                                  className="data-[state=checked]:bg-emerald-500 scale-90"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-4">
                                {item.paymentLink && (
                                  <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:bg-primary/10 rounded-xl" asChild>
                                    <a href={item.paymentLink} target="_blank" rel="noopener noreferrer" title="View Evidence Trace">
                                      <ImageIcon size={18} />
                                    </a>
                                  </Button>
                                )}
                                {item.invoiceLink && (
                                  <Button variant="ghost" size="icon" className="h-9 w-9 text-emerald-500 hover:bg-emerald-50 rounded-xl" asChild>
                                    <a href={item.invoiceLink} target="_blank" rel="noopener noreferrer" title="View Fiscal Invoice">
                                      <Receipt size={18} />
                                    </a>
                                  </Button>
                                )}
                                {!item.paymentLink && !item.invoiceLink && <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">No Trace</span>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-10">
                              <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl" onClick={() => handleEdit(item)}>
                                  <Edit size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl" onClick={() => handleDelete(item.id)}>
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-64 text-center">
                              <div className="flex flex-col items-center justify-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200"><Wallet size={24}/></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Historical Registry Offline</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </ScrollArea>
              <div className="h-12 bg-white border-t border-slate-50 flex items-center px-10">
                <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.5em]">De-Encrypted Enterprise Layer 04</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
