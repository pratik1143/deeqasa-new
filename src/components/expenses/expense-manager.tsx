
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
  Building2
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
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteDoc(doc(firestore, 'expenses', id));
      toast({ title: "Deleted", description: "Record removed from database." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Expense Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Log and track employee site visit expenses and travel records.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 border border-border text-xs font-medium text-muted-foreground">
          <ShieldCheck size={14} className="text-primary"/>
          Admin: {user?.email}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <Card className="shadow-sm border-border sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">
                {editingId ? 'Edit Record' : 'Record New Expense'}
              </CardTitle>
              <CardDescription>
                Fill in the details of the site visit travel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-4">
                    <FormField control={form.control} name="employeeName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Name</FormLabel>
                        <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl><Input placeholder="Client Organization" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="fromLocation" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Starting From</FormLabel>
                          <FormControl><Input placeholder="Origin" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="toLocation" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <FormControl><Input placeholder="Target" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="goingAmount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Going Amount (₹)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="returnAmount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Return Amount (₹)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </div>

                    <div className="p-3 bg-secondary/30 rounded-md border border-border flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
                      <span className="text-lg font-bold text-foreground">₹ {totalAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="quotationStatus" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quotation Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sent">Sent</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="visitDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visit Date</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="quotationReference" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quotation Reference</FormLabel>
                        <FormControl><Input placeholder="Ref #" {...field} /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="remarks" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl><Textarea className="resize-none" rows={3} placeholder="Additional notes..." {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => { form.reset(); setSavedEditingId(null); }}
                      className="flex-1"
                    >
                      Reset Form
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : editingId ? <Save size={16} className="mr-2"/> : <Plus size={16} className="mr-2"/>}
                      {editingId ? 'Update' : 'Save Expense'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-semibold">Expense Records</CardTitle>
              <CardDescription>History of documented site visit expenses.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[750px] w-full">
                {isDataLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-sm">Loading records...</span>
                  </div>
                ) : (
                  <div className="min-w-[800px]">
                    <Table>
                      <TableHeader className="bg-secondary/20">
                        <TableRow>
                          <TableHead className="w-[120px]">Date</TableHead>
                          <TableHead>Employee & Company</TableHead>
                          <TableHead>Travel Route</TableHead>
                          <TableHead className="text-right">Total (₹)</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses && expenses.length > 0 ? expenses.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()).map((item) => (
                          <TableRow key={item.id} className="hover:bg-secondary/10 transition-colors">
                            <TableCell className="text-sm">
                              {item.visitDate ? format(item.visitDate.toDate(), 'dd MMM yyyy') : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">{item.employeeName}</span>
                                <span className="text-xs text-muted-foreground">{item.companyName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{item.fromLocation}</span>
                                <ChevronRight size={12} className="text-muted-foreground/50"/>
                                <span>{item.toLocation}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              <div className="flex flex-col items-end gap-1">
                                <span>{item.totalAmount?.toLocaleString('en-IN')}</span>
                                <Badge variant={item.quotationStatus === 'Approved' ? 'default' : 'outline'} className={cn(
                                  "text-[10px] h-5 px-2",
                                  item.quotationStatus === 'Sent' && "border-blue-500/30 text-blue-500",
                                  item.quotationStatus === 'Pending' && "border-yellow-500/30 text-yellow-500"
                                )}>
                                  {item.quotationStatus}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                  <Edit size={14} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                              No records found in the database.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
