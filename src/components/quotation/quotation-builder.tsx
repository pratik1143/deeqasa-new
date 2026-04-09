'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { generateLetterBody } from '@/ai/flows/ai-quotation-letter-generation';
import { type BrochureOutput } from '@/ai/flows/ai-brochure-generation';
import { ProductSchema, type Product } from '@/lib/quotation-schemas';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  User,
  Layout,
  Package,
  CheckCircle2,
  Loader2,
  Save,
  BrainCircuit,
  Landmark,
  PencilLine,
  UserCheck,
  ShieldCheck,
  FileText,
  Gavel
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { BrochurePreview } from './brochure-preview';

const FormSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  companyName: z.string().min(1, 'Organization name is required'),
  address: z.string().min(1, 'Address is required'),
  subject: z.string().min(1, 'Subject is required.'),
  letterBody: z.string().min(1, 'Letter body is required.'),
  authorizedSignatory: z.string().min(1, 'Authorized signatory is required.'),
  termsAndConditions: z.string().min(1, 'Terms and conditions required.'),
  lineItems: z.array(z.object({
      product: ProductSchema,
      quantity: z.coerce.number().min(1),
      unitPrice: z.coerce.number().min(0),
  })).min(1, 'Please add at least one product.'),
});

type FormValues = z.infer<typeof FormSchema>;

function numberToWords(num: number): string {
    const roundedNum = Math.round(num * 100) / 100;
    if (roundedNum === 0) return 'Zero rupees only';
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const inWords = (n: number): string => {
        let str = '';
        if (n > 99) { str += a[Math.floor(n / 100)] + 'hundred '; n %= 100; }
        if (n > 19) { str += b[Math.floor(n / 10)] + ' ' + a[n % 10]; } else { str += a[n]; }
        return str;
    };
    const numStr = roundedNum.toFixed(2);
    const [rupees, paisa] = numStr.split('.').map(Number);
    let rupeesInWords = '';
    if (rupees > 0) {
        let n = rupees;
        if (n >= 10000000) { rupeesInWords += inWords(Math.floor(n / 10000000)) + 'crore '; n %= 10000000; }
        if (n >= 100000) { rupeesInWords += inWords(Math.floor(n / 100000)) + 'lakh '; n %= 100000; }
        if (n >= 1000) { rupeesInWords += inWords(Math.floor(n / 1000)) + 'thousand '; n %= 1000; }
        rupeesInWords += inWords(n);
    }
    let paisaInWords = '';
    if (paisa > 0) { paisaInWords = ' and ' + inWords(paisa) + 'paisa'; }
    const result = (rupeesInWords ? rupeesInWords.trim() + ' rupees' : '') + (paisaInWords ? paisaInWords.trim() : '');
    return result.charAt(0).toUpperCase() + result.slice(1) + ' only.';
};

const DEFAULT_TERMS = `• Validity: 7 Days from date of issue
• Payment: 100% Advance Payment
• Delivery: 4-6 Weeks from confirmed PO
• Warranty: OEM Onsite Warranty Support
• Taxes: GST 18% Exclusive as applicable
• Support: Direct OEM Technical Assistance`;

const STEPS = [
  { id: 'customer', title: 'Customer', icon: User },
  { id: 'letter', title: 'Letter Content', icon: Layout },
  { id: 'items', title: 'Products/SKUs', icon: Package },
  { id: 'terms', title: 'Legal Terms', icon: Gavel },
  { id: 'signatory', title: 'Authorization', icon: UserCheck },
  { id: 'summary', title: 'Summary & Export', icon: CheckCircle2 },
];

const SIGNATORIES = [
  { name: "Pratik Chaudhary", phone: "+91 8595270950" },
  { name: "Prabhjot kaur", phone: "+91 8950163119" }
];

const HP_LOGO_URL = "/hp-logo.png";

export function QuotationBuilder() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState('customer');
  const [savedId, setSavedId] = useState<string | null>(null);

  const [manualModel, setManualModel] = useState('');
  const [manualPrice, setManualPrice] = useState<number>(0);
  const [manualQuantity, setManualQuantity] = useState<number>(1);

  const [activeTab, setActiveTab] = useState("quotation");
  const [marketingData, setMarketingData] = useState<BrochureOutput | null>(null);
  const [isGeneratingBody, startGeneratingBody] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      customerName: 'The Head of Department',
      companyName: 'Department of Biotechnology, Panjab University',
      address: 'Sector 14, Chandigarh',
      subject: 'Submission of Quotation for HP Enterprise Servers and Storage Solution',
      letterBody: 'With reference to your requirement for high-performance computing infrastructure, we are pleased to submit our formal technical and commercial proposal. Our solution is engineered to deliver maximum reliability, scalability, and security, tailored specifically for mission-critical academic and research workloads. We ensure that all proposed components are fully backed by HP OEM onsite warranty and professional technical support services.',
      termsAndConditions: DEFAULT_TERMS,
      authorizedSignatory: `${SIGNATORIES[0].name} (${SIGNATORIES[0].phone})`,
      lineItems: [],
    },
  });

  const [isManualSignatory, setIsManualSignatory] = useState(false);
  const [manualSignatoryName, setManualSignatoryName] = useState('');
  const [manualSignatoryPhone, setManualSignatoryPhone] = useState('');

  // Synchronize manual inputs with form field
  useEffect(() => {
    if (isManualSignatory) {
      form.setValue('authorizedSignatory', `${manualSignatoryName} ${manualSignatoryPhone ? `(${manualSignatoryPhone})` : ''}`.trim());
    }
  }, [isManualSignatory, manualSignatoryName, manualSignatoryPhone, form]);

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lineItems' });
  const watchedLineItems = useWatch({ control: form.control, name: 'lineItems' });
  const watchedSubject = useWatch({ control: form.control, name: 'subject' });
  const watchedCustomer = useWatch({ control: form.control, name: 'customerName' });
  const watchedCompany = useWatch({ control: form.control, name: 'companyName' });
  const watchedAddress = useWatch({ control: form.control, name: 'address' });
  const watchedLetterBody = useWatch({ control: form.control, name: 'letterBody' });
  const watchedSignatory = useWatch({ control: form.control, name: 'authorizedSignatory' });
  const watchedTerms = useWatch({ control: form.control, name: 'termsAndConditions' });

  const totals = useMemo(() => {
    const items = watchedLineItems || [];
    const subTotal = items.reduce((acc, item) => {
      const qty = parseFloat(String(item?.quantity || 0));
      const price = parseFloat(String(item?.unitPrice || 0));
      return acc + (qty * price);
    }, 0);
    const totalGst = subTotal * 0.18;
    const grandTotal = subTotal + totalGst;
    return { subTotal, totalGst, grandTotal };
  }, [watchedLineItems]);

  const saveQuotationToFirestore = async () => {
    if (!user || !firestore || !watchedLineItems?.length) return null;
    
    setIsSaving(true);
    const quotationId = `DQT-${Date.now()}`;
    const batch = writeBatch(firestore);

    try {
      const q = query(collection(firestore, 'quotations'), where('status', '==', 'ACTIVE'));
      const snapshot = await getDocs(q);
      snapshot.forEach(docSnapshot => batch.update(docSnapshot.ref, { status: 'ARCHIVED' }));

      const newDocRef = doc(collection(firestore, 'quotations'), quotationId);
      batch.set(newDocRef, {
        quotationId,
        clientDetails: JSON.stringify({ name: watchedCustomer, companyName: watchedCompany, address: watchedAddress }),
        products: JSON.stringify(watchedLineItems.map(i => ({ model: i.product.model, sku: i.product.id, quantity: i.quantity }))),
        pricing: JSON.stringify(watchedLineItems.map(i => ({ unitPrice: i.unitPrice }))),
        totals: JSON.stringify(totals),
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
        status: 'ACTIVE',
        subject: watchedSubject,
        terms: watchedTerms
      });

      await batch.commit();
      setSavedId(quotationId);
      toast({ title: "Quotation Saved", description: "Document saved successfully." });
      return quotationId;
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Save Failed", description: e.message });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async (rootId: string, filename: string) => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById(rootId);
      
      if (!element) {
        throw new Error("Target element not found.");
      }
      
      const opt = { 
        margin: 0, 
        filename: `${filename}_${savedId || 'DRAFT'}.pdf`, 
        image: { type: 'jpeg', quality: 1.0 }, 
        html2canvas: { 
          scale: 3, 
          useCORS: true, 
          logging: false, 
          letterRendering: true,
          windowWidth: 794,
          scrollX: 0,
          scrollY: 0
        }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: false },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      await html2pdf().from(element).set(opt).save();
      toast({ title: "Export Complete", description: "PDF has been generated." });
    } catch (error: any) {
      console.error("PDF Export failed:", error);
      toast({ variant: "destructive", title: "Export Error", description: "Failed to render document." });
    } finally { 
      setIsDownloading(false); 
    }
  };

  const handleAddManualItem = () => {
    if (!manualModel || manualPrice <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Entry', description: 'Description and price are required.' });
      return;
    }

    const manualProduct: Product = {
      id: `MANUAL-${Date.now()}`,
      model: manualModel,
      name: manualModel,
      price: manualPrice,
      gstRate: 18,
      plant: '-',
      chassis: '-',
      processor: '-',
      memory: '-',
      hdd: '-',
      hdd2: '-',
      gfx: '-',
      os: '-',
      odd: '-',
      wlan: '-',
      warranty: '-',
    };

    append({ product: manualProduct, quantity: manualQuantity, unitPrice: manualPrice });
    setManualModel('');
    setManualPrice(0);
    setManualQuantity(1);
  };

  const LetterheadHeader = () => (
    <div className="flex justify-between items-start mb-10 border-b-2 border-slate-100 pb-6 shrink-0 w-full bg-white">
      <div className="flex flex-col gap-1">
        <img src={HP_LOGO_URL} alt="HP Logo" className="h-[14mm] w-auto mb-2" crossOrigin="anonymous" />
        <span className="text-[9pt] font-medium text-slate-500 tracking-[0.2em] uppercase font-sans">HP Authorized Partner</span>
      </div>
      <div className="text-right">
        <h2 className="text-[16pt] font-black uppercase tracking-tight text-slate-900 leading-none mb-1 font-sans">M/S DEEQASA TECH</h2>
        <p className="text-[8.5pt] font-medium text-slate-500 italic mb-1">Total IT Infrastructure & Solutions</p>
        <p className="text-[9pt] font-bold text-slate-400 uppercase tracking-widest font-mono">GSTIN: 03EPIPK0093E1Z7</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-80px)] bg-slate-50 overflow-hidden font-[Outfit] relative">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[420px] bg-white border-r border-slate-200 flex flex-col no-print shrink-0 relative z-20 shadow-xl">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
               <PencilLine size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-none uppercase tracking-tighter">Drafting <span className="text-primary italic">Panel</span></h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 italic">Enterprise Module v5.5</p>
            </div>
          </div>

          <div className="relative mb-12 pl-2">
            <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-slate-100" />
            <div className="space-y-8">
              {STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      "flex items-center gap-6 transition-all duration-300 relative group",
                      isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 z-10 bg-white transition-all duration-300 flex items-center justify-center",
                      isActive ? "border-slate-900 scale-125 shadow-lg" : "border-slate-200 group-hover:border-slate-400"
                    )}>
                       {isActive && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={cn("transition-colors", isActive ? "text-primary" : "text-slate-300")} />
                      <span className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", isActive ? "opacity-100" : "opacity-60")}>{step.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-8 pb-20">
          <Form {...form}>
            <AnimatePresence mode="wait">
              {currentStep === 'customer' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <FormField control={form.control} name="customerName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Contact Person</FormLabel>
                      <FormControl><Input className="bg-slate-50 border-slate-100 h-14 rounded-xl text-slate-900 font-bold uppercase tracking-wide text-[11px] focus:ring-primary shadow-inner" placeholder="e.g. The Head of Department" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Company/Organization</FormLabel>
                      <FormControl><Input className="bg-slate-50 border-slate-100 h-14 rounded-xl text-slate-900 font-bold uppercase tracking-wide text-[11px] focus:ring-primary shadow-inner" placeholder="e.g. Panjab University" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Full Address</FormLabel>
                      <FormControl><Textarea rows={4} className="bg-slate-50 border-slate-100 rounded-xl text-slate-900 font-bold tracking-wide text-[11px] focus:ring-primary shadow-inner" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </motion.div>
              )}

              {currentStep === 'letter' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Document Subject</FormLabel>
                      <FormControl><Input className="bg-slate-50 border-slate-100 h-14 rounded-xl text-slate-900 font-bold uppercase tracking-wide text-[11px] focus:ring-primary shadow-inner" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="letterBody" render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-2 px-1">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Content Body</FormLabel>
                        <Button type="button" variant="outline" size="sm" className="h-8 rounded-full text-[9px] bg-slate-900 text-white font-bold uppercase tracking-widest border-none hover:bg-primary transition-all shadow-sm" onClick={() => {
                          const subject = form.getValues('subject');
                          const customer = form.getValues('customerName');
                          const company = form.getValues('companyName');
                          const address = form.getValues('address');
                          startGeneratingBody(async () => {
                            try {
                              const res = await generateLetterBody({ subject, customerName: customer, companyName: company, address });
                              form.setValue('letterBody', res.letterBody);
                            } catch (e: any) {
                              toast({ variant: 'destructive', title: 'Generation Error', description: e.message });
                            }
                          });
                        }} disabled={isGeneratingBody}>
                          {isGeneratingBody ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles size={11} className="mr-2"/> AI Content</>}
                        </Button>
                      </div>
                      <FormControl><Textarea rows={14} className="bg-slate-50 border-slate-100 rounded-xl text-slate-700 font-medium text-[12px] leading-relaxed shadow-inner" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </motion.div>
              )}

              {currentStep === 'items' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="h-2 w-2 rounded-full bg-primary" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Manual Ingestion Matrix</span>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Product Description</Label>
                        <Input 
                          placeholder="e.g. HP Enterprise DL380 Server..." 
                          value={manualModel} 
                          onChange={e => setManualModel(e.target.value)} 
                          className="bg-slate-50 border-slate-100 h-14 rounded-xl font-bold uppercase tracking-wide text-[11px] shadow-inner"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Unit Price (₹)</Label>
                          <Input 
                            type="number" 
                            value={manualPrice} 
                            onChange={e => setManualPrice(Number(e.target.value))} 
                            className="bg-slate-50 border-slate-100 h-14 rounded-xl font-bold text-xs shadow-inner"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Quantity</Label>
                          <Input 
                            type="number" 
                            value={manualQuantity} 
                            onChange={e => setManualQuantity(Number(e.target.value))} 
                            className="bg-slate-50 border-slate-100 h-14 rounded-xl font-bold text-xs shadow-inner"
                          />
                        </div>
                      </div>
                      <Button 
                        className="w-full h-14 bg-slate-900 text-white hover:bg-slate-800 font-black uppercase tracking-[0.2em] text-[11px] rounded-xl shadow-xl transition-all" 
                        onClick={handleAddManualItem}
                      >
                        <Plus className="mr-3 h-4 w-4" /> Add Item to Schedule
                      </Button>
                    </div>

                  <div className="space-y-4 pt-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 mb-4 block">Added Products</Label>
                    {fields.map((field, index) => (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={field.id} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-primary/30 transition-all">
                        <div className="flex-1 truncate pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Package size={12} className="text-slate-300" />
                            <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight truncate">
                                {field.product.model}
                            </p>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Amount: ₹{(field.quantity * field.unitPrice).toLocaleString('en-IN')}</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-12 w-12 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl" onClick={() => remove(index)}><Trash2 size={18} /></Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 'terms' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <FormField control={form.control} name="termsAndConditions" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Legal Terms & Conditions</FormLabel>
                      <FormControl><Textarea rows={12} className="bg-slate-50 border-slate-100 rounded-2xl text-slate-700 font-bold text-[11px] leading-relaxed shadow-inner p-6" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </motion.div>
              )}

              {currentStep === 'signatory' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                    <Button 
                      type="button"
                      variant={!isManualSignatory ? "default" : "ghost"} 
                      onClick={() => setIsManualSignatory(false)}
                      className="flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest h-10"
                    >
                      Registry
                    </Button>
                    <Button 
                      type="button"
                      variant={isManualSignatory ? "default" : "ghost"} 
                      onClick={() => setIsManualSignatory(true)}
                      className="flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest h-10"
                    >
                      Manual Entry
                    </Button>
                  </div>

                  {!isManualSignatory ? (
                    <FormField control={form.control} name="authorizedSignatory" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Authorized Representative</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-slate-100 h-14 rounded-xl text-slate-900 font-bold uppercase tracking-wide text-[11px] shadow-sm">
                              <SelectValue placeholder="Select Signatory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-slate-100 text-slate-900 rounded-2xl shadow-2xl">
                            {SIGNATORIES.map((sig) => (
                              <SelectItem key={sig.name} value={`${sig.name} (${sig.phone})`} className="uppercase font-bold text-[11px] tracking-wide py-4">
                                {sig.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Signatory Name</Label>
                         <Input 
                            placeholder="e.g. Rahul Sharma" 
                            value={manualSignatoryName}
                            onChange={(e) => setManualSignatoryName(e.target.value)}
                            className="bg-white border-slate-100 h-14 rounded-xl text-slate-900 font-bold uppercase tracking-wide text-[11px] shadow-sm"
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Phone / Title</Label>
                         <Input 
                            placeholder="e.g. +91 98765 43210" 
                            value={manualSignatoryPhone}
                            onChange={(e) => setManualSignatoryPhone(e.target.value)}
                            className="bg-white border-slate-100 h-14 rounded-xl text-slate-900 font-bold uppercase tracking-wide text-[11px] shadow-sm"
                         />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 'summary' && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 text-white"><ShieldCheck size={80}/></div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>Sub Total</span>
                          <span className="text-white">₹{totals.subTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>Total GST (18%)</span>
                          <span className="text-white">₹{totals.totalGst.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                        <span className="text-[12px] font-black text-slate-300 uppercase tracking-widest">Grand Total</span>
                        <div className="text-right">
                           <span className="text-4xl font-black text-white tracking-tighter">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                        onClick={saveQuotationToFirestore} 
                        disabled={isSaving || !watchedLineItems?.length}
                        className="w-full h-16 rounded-2xl bg-slate-900 text-white hover:bg-primary font-black uppercase tracking-[0.2em] text-[12px] shadow-xl hover:scale-[1.01] transition-all" 
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="mr-3 h-5 w-5"/> Commit to Registry</>}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Form>
        </ScrollArea>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 flex flex-col relative z-10 overflow-hidden">
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-10 shrink-0 no-print relative z-20 bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-slate-50 border border-slate-100 rounded-full p-1 h-12 w-fit">
            <TabsList className="bg-transparent h-full gap-2">
              <TabsTrigger value="quotation" className="rounded-full px-8 h-full text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all h-full">The Proposal</TabsTrigger>
              <TabsTrigger value="brochure" disabled={!marketingData} className="rounded-full px-8 h-full text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all h-full">The Brochure</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => handleDownloadPdf(activeTab === 'quotation' ? 'quotation-export-root' : 'brochure-export-root', 'Quotation')} 
              size="sm" 
              className="rounded-xl h-12 bg-slate-900 hover:bg-primary text-white font-black px-8 shadow-2xl text-[11px] uppercase tracking-widest transition-all" 
              disabled={isDownloading || !watchedLineItems?.length}
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Download size={14} className="mr-3"/>}
              {isDownloading ? "Generating..." : "Download Official PDF"}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 relative z-10">
          <div className="py-20 flex flex-col items-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                {activeTab === 'quotation' ? (
                  <div id="quotation-export-root" className="relative z-10 shadow-2xl rounded-sm overflow-hidden select-text border border-slate-200">
                    <style dangerouslySetInnerHTML={{ __html: `
                      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                      .a4-container { 
                        font-family: 'Inter', sans-serif !important; 
                        width: 210mm;
                        background: white;
                        color: #0f172a;
                      }
                      .a4-page { 
                        min-height: 297mm; 
                        padding: 30mm 20mm;
                        display: flex;
                        flex-direction: column;
                        box-sizing: border-box;
                        position: relative;
                      }
                      .page-break { page-break-after: always; }
                      .no-break { page-break-inside: avoid; }
                      .quotation-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        font-size: 9.5pt !important;
                      }
                      .quotation-table th { 
                        background: #f8fafc; 
                        padding: 12px 16px; 
                        font-weight: 800; 
                        text-transform: uppercase;
                        font-size: 8.5pt;
                        letter-spacing: 0.05em;
                      }
                      .quotation-table td { 
                        padding: 10px 16px; 
                        border-bottom: 1px solid #f1f5f9;
                        vertical-align: top;
                      }
                    `}} />
                    <div className="a4-container">
                      {/* PAGE 1: COVER LETTER */}
                      <div className="a4-page page-break">
                        <LetterheadHeader />
                        
                        <div className="flex-1 flex flex-col">
                          <div className="mb-12 text-[11pt] space-y-1 text-slate-800">
                            <p className="text-[14pt] font-black uppercase text-slate-900 tracking-tight mb-2">TO,</p>
                            <p className="text-[16pt] font-black uppercase text-slate-900 tracking-tighter leading-none">{watchedCustomer}</p>
                            <p className="font-bold text-slate-800 uppercase tracking-tight text-[12pt]">{watchedCompany}</p>
                            <p className="text-slate-500 italic text-[10pt] font-medium max-w-[80%]">{watchedAddress}</p>
                          </div>

                          <div className="bg-slate-50 border-y border-slate-100 p-8 mb-12">
                            <div className="flex gap-4 items-start">
                               <span className="text-[10pt] font-black text-slate-900 uppercase tracking-widest mt-1">Subject:</span>
                               <span className="text-[12pt] font-bold text-slate-800 leading-tight flex-1 uppercase tracking-tight">{watchedSubject}</span>
                            </div>
                          </div>

                          <div className="space-y-8 text-[11pt] text-slate-800">
                            <p className="font-black text-[12pt] text-slate-900">Dear Sir/Madam,</p>
                            <div className="whitespace-pre-wrap leading-[1.6] font-medium text-slate-700 text-justify tracking-tight">{watchedLetterBody}</div>
                          </div>

                          <div className="mt-auto pt-16">
                            <h4 className="text-[10pt] font-black text-slate-900 uppercase tracking-widest mb-6 border-b-2 border-slate-900 pb-3 flex items-center gap-2">
                               <ShieldCheck size={14} className="text-slate-400" /> Terms and Conditions
                            </h4>
                            <div className="whitespace-pre-wrap text-[10pt] text-slate-900 font-bold uppercase tracking-tight leading-loose pl-2 border-l-2 border-slate-100">
                               {watchedTerms}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* TECHNICAL & COMMERCIAL SCHEDULE (Natural Flow) */}
                      <div className="a4-page">
                        <LetterheadHeader />
                        
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-center font-black text-[16pt] mb-8 uppercase tracking-tight text-white bg-slate-900 py-5">Technical Specifications & Pricing</h3>
                          
                          <table className="quotation-table">
                            <thead>
                              <tr>
                                <th style={{width: '50px'}}>#</th>
                                <th style={{textAlign: 'left'}}>Item Description & Specifications</th>
                                <th style={{width: '60px'}}>Qty</th>
                                <th style={{width: '110px', textAlign: 'right'}}>Rate (₹)</th>
                                <th style={{width: '130px', textAlign: 'right'}}>Total (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {watchedLineItems?.map((item, idx) => (
                                <tr key={idx}>
                                  <td className="text-center font-bold text-slate-300">{idx + 1}</td>
                                  <td className="p-4">
                                    <span className="text-[11pt] font-black text-slate-900 uppercase leading-none block mb-1">{item.product.model}</span>
                                    {!item.product.id.startsWith('MANUAL-') && (
                                      <p className="text-[9pt] text-slate-500 font-medium leading-relaxed">
                                        {item.product.processor} | {item.product.memory} | {item.product.warranty}
                                      </p>
                                    )}
                                  </td>
                                  <td className="text-center font-bold text-slate-900">{item.quantity}</td>
                                  <td className="text-right font-bold text-slate-600 font-mono">{(item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                  <td className="text-right font-black text-slate-900 font-mono">{(item.quantity * item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <div className="no-break mt-10">
                            <div className="grid grid-cols-2 gap-10">
                              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center shadow-inner">
                                <h4 className="text-[9pt] font-black text-slate-900 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                                  <Landmark size={12} className="text-slate-400"/> BANKING DETAILS
                                </h4>
                                <div className="space-y-2 text-[9pt] text-slate-900 font-bold uppercase tracking-tight">
                                  <p className="flex justify-between"><span className="text-slate-400">BENEFICIARY:</span> DEE QASA</p>
                                  <p className="flex justify-between"><span className="text-slate-400">BANK:</span> STATE BANK OF INDIA</p>
                                  <p className="flex justify-between"><span className="text-slate-400">A/C NO:</span> 44562745640</p>
                                  <p className="flex justify-between"><span className="text-slate-400">IFSC:</span> SBIN0001443</p>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <div className="w-full space-y-3 pt-2">
                                  <div className="flex justify-between text-[10pt] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Sub Total</span>
                                    <span className="text-slate-900">₹{totals.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between text-[10pt] font-bold text-slate-400 uppercase tracking-widest pb-4 border-b-2 border-slate-900">
                                    <span>GST (18%)</span>
                                    <span className="text-slate-900">₹{totals.totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between items-end pt-3">
                                    <span className="text-[12pt] font-black text-slate-900 uppercase tracking-tight mb-1">Grand Total</span>
                                    <span className="text-[20pt] font-black text-slate-900 tracking-tighter">₹{totals.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
  
                            <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl shadow-lg">
                              <p className="text-[8pt] font-black text-white/50 uppercase tracking-[0.4em] mb-1">Total Mission Value (In Words)</p>
                              <p className="text-[13pt] font-black tracking-tighter italic uppercase underline decoration-primary/40 underline-offset-4 decoration-2">{numberToWords(totals.grandTotal)}</p>
                            </div>
                          </div>

                          <div className="no-break mt-auto pt-12 flex justify-between items-end">
                            <div className="space-y-2">
                              <p className="text-[9pt] text-slate-400 font-black uppercase tracking-widest mb-3">Authorized Representative</p>
                              <div className="pt-6 relative">
                                <div className="absolute top-0 left-0 w-20 h-[1px] bg-slate-900" />
                                <p className="text-slate-900 font-black text-[12pt] tracking-tighter uppercase leading-none">{watchedSignatory}</p>
                                <p className="text-slate-400 font-black text-[10pt] tracking-widest uppercase mt-1">FOR DEEQASA TECH</p>
                              </div>
                            </div>
                            <div className="text-right text-[8pt] text-slate-300 font-bold uppercase tracking-[0.2em] font-mono">
                              <p>REF: {savedId || 'DRAFT-MATRIX'}</p>
                              <p>DATE: {new Date().toLocaleDateString('en-IN')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div id="brochure-export-root" className="relative z-10 shadow-2xl rounded-sm overflow-hidden bg-white select-text border border-slate-200">
                    <BrochurePreview 
                      products={Array.from(new Set(watchedLineItems.map(i => i.product.id))).map(id => watchedLineItems.find(i => i.product.id === id)!.product)} 
                      marketingData={marketingData!} 
                    />
                  </div>
                )}
            </motion.div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
