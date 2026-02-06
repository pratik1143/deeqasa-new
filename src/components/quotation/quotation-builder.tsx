'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

import { getProductData } from '@/ai/flows/get-product-data';
import { generateLetterBody } from '@/ai/flows/ai-quotation-letter-generation';
import { generateBrochureContent, type BrochureOutput } from '@/ai/flows/ai-brochure-generation';
import { storeBrochureLog } from '@/ai/flows/store-brochure-data';
import { type Product, ProductSchema } from '@/lib/quotation-schemas';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import { 
  ChevronsUpDown, 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  Image as ImageIcon, 
  FileText, 
  BookOpen,
  User,
  Layout,
  Package,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Building2,
  ArrowRight,
  BrainCircuit,
  Award,
  History,
  Globe,
  Leaf,
  Wrench,
  Save,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { LineLoader } from '../ui/line-loader';
import { BrochurePreview } from './brochure-preview';

const FormSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  companyName: z.string().min(1, 'Organization name is required'),
  address: z.string().min(1, 'Address is required'),
  subject: z.string().min(1, 'Subject is required.'),
  letterBody: z.string().min(1, 'Letter body is required.'),
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

const getLongDescription = (product: Product): string => {
  if (product.id.startsWith('MAN-')) return product.processor;
  return [product.processor, product.memory, product.hdd !== '-' ? product.hdd : null, product.hdd2 !== '-' ? product.hdd2 : null, product.gfx !== '-' ? product.gfx : null, product.os !== '-' ? product.os : null, product.warranty !== '-' ? product.warranty : null].filter(Boolean).join(' | ');
};

const STEPS = [
  { id: 'customer', title: 'Customer', icon: User },
  { id: 'letter', title: 'Cover Letter', icon: Layout },
  { id: 'items', title: 'Line Items', icon: Package },
  { id: 'summary', title: 'Export', icon: CheckCircle2 },
];

export function QuotationBuilder() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState("quotation");
  const [currentStep, setCurrentStep] = useState('customer');
  const [activeField, setActiveField] = useState<string | null>(null);

  const [pendingPrice, setPendingPrice] = useState<number>(0);
  const [pendingQuantity, setPendingQuantity] = useState<number>(1);
  const [isPriceOverridden, setIsPriceOverridden] = useState(false);

  const [isManualMode, setIsManualMode] = useState(false);
  const [marketingData, setMarketingData] = useState<BrochureOutput | null>(null);
  const [isGeneratingBrochure, setIsGeneratingBrochure] = useState(false);
  const [isGeneratingBody, startGeneratingBody] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      customerName: 'The Head of Department',
      companyName: 'Department of Biotechnology, Panjab University',
      address: 'Sector 14, Chandigarh',
      subject: 'Submission of Quotation for Server, Network, Storage, Firewall & Video Conferencing Solution',
      letterBody: 'With reference to the requirements for advanced computing and networking infrastructure, we are pleased to submit our formal quotation for the supply and installation of HP Enterprise Servers, Storage, Networking, and Video Conferencing solutions. Our proposed solutions are engineered to provide maximum reliability, scalability, and high-performance computing required for your departmental needs. We ensure that all components are fully compatible and backed by professional OEM onsite warranty and technical support services.',
      lineItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lineItems' });
  const watchedLineItems = useWatch({ control: form.control, name: 'lineItems' });
  const watchedSubject = useWatch({ control: form.control, name: 'subject' });
  const watchedCustomer = useWatch({ control: form.control, name: 'customerName' });
  const watchedCompany = useWatch({ control: form.control, name: 'companyName' });
  const watchedAddress = useWatch({ control: form.control, name: 'address' });
  const watchedLetterBody = useWatch({ control: form.control, name: 'letterBody' });

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoadingProducts(true);
        const productData = await getProductData();
        setProducts(productData);
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Failed to load products', description: error.message });
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchProducts();
  }, [toast]);

  useEffect(() => {
    if (selectedProduct) {
      setPendingPrice(selectedProduct.price);
      setPendingQuantity(1);
      setIsPriceOverridden(false);
    }
  }, [selectedProduct]);

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
      // 1. Mark previous ACTIVE deals as ARCHIVED
      const q = query(
        collection(firestore, 'quotations'),
        where('createdBy', '==', user.uid),
        where('status', '==', 'ACTIVE')
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        batch.update(doc.ref, { status: 'ARCHIVED' });
      });

      // 2. Save new quotation
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
        subject: watchedSubject
      });

      await batch.commit();
      toast({ title: "Quotation Saved", description: "Ready for Intelligence synthesis." });
      return quotationId;
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Save Failed", description: e.message });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = () => {
    if (selectedProduct) {
      append({ product: selectedProduct, quantity: pendingQuantity, unitPrice: pendingPrice });
      setSelectedProduct(null);
      setSearchQuery('');
      toast({ title: 'Item Added', description: `${selectedProduct.model} added.` });
    }
  };

  const handleAiGenerateBody = () => {
    if (!watchedSubject) return;
    startGeneratingBody(async () => {
      try {
        const result = await generateLetterBody({ subject: watchedSubject, customerName: watchedCustomer, companyName: watchedCompany, address: watchedAddress });
        form.setValue('letterBody', result.letterBody);
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Generation Failed', description: error.message });
      }
    });
  };

  const handleDownloadPdf = async (rootId: string, filename: string) => {
    const savedId = await saveQuotationToFirestore();
    if (!savedId) return;

    setIsDownloading(true);
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById(rootId);
    if (!element) return;
    
    const opt = { 
      margin: 0, 
      filename, 
      image: { type: 'jpeg', quality: 1.0 }, 
      html2canvas: { scale: 3, useCORS: true }, 
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().from(element).set(opt).save();
    } finally { setIsDownloading(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-80px)] bg-black overflow-hidden font-body">
      {/* Editor Panel */}
      <div className="w-full lg:w-[420px] bg-card border-r border-white/5 flex flex-col no-print shrink-0 relative z-20 overflow-y-auto">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,224,255,0.2)]">
               <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-white leading-tight">Quotation Studio</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Enterprise Documentation Hub</p>
            </div>
          </div>

          <div className="relative mb-10 pl-2">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />
            <div className="space-y-6">
              {STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      "flex items-center gap-4 transition-all duration-300 relative group",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 z-10 bg-card transition-all duration-300",
                      isActive ? "border-primary scale-125 shadow-[0_0_10px_rgba(0,224,255,0.5)]" : "border-white/10 group-hover:border-white/30"
                    )} />
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={cn("transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-[11px] font-bold uppercase tracking-widest">{step.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 pb-20">
          <Form {...form}>
            <AnimatePresence mode="wait">
              {currentStep === 'customer' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <FormField control={form.control} name="customerName" render={({ field }) => (
                    <FormItem onFocus={() => setActiveField('customerName')} onBlur={() => setActiveField(null)}>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/50">Attention To</FormLabel>
                      <FormControl><Input className="bg-white/5 border-white/10 h-11 focus:ring-primary/30" placeholder="The Head of Department" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem onFocus={() => setActiveField('companyName')} onBlur={() => setActiveField(null)}>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/50">Organization</FormLabel>
                      <FormControl><Input className="bg-white/5 border-white/10 h-11 focus:ring-primary/30" placeholder="Panjab University" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem onFocus={() => setActiveField('address')} onBlur={() => setActiveField(null)}>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/50">Address</FormLabel>
                      <FormControl><Textarea rows={3} className="bg-white/5 border-white/10 focus:ring-primary/30 text-xs" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </motion.div>
              )}

              {currentStep === 'letter' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem onFocus={() => setActiveField('subject')} onBlur={() => setActiveField(null)}>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/50">Subject Line</FormLabel>
                      <FormControl><Input className="bg-white/5 border-white/10 h-11 focus:ring-primary/30" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="letterBody" render={({ field }) => (
                    <FormItem onFocus={() => setActiveField('letterBody')} onBlur={() => setActiveField(null)}>
                      <div className="flex justify-between items-center mb-1">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/50">Body Text</FormLabel>
                        <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] bg-primary/5 hover:bg-primary/10 border-primary/20" onClick={handleAiGenerateBody} disabled={isGeneratingBody}>
                          {isGeneratingBody ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles size={10} className="mr-1"/> Magic Refine</>}
                        </Button>
                      </div>
                      <FormControl><Textarea rows={10} className="bg-white/5 border-white/10 text-[11px]" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </motion.div>
              )}

              {currentStep === 'items' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between h-12 bg-white/5 border-white/10 text-white/60">
                        <span>{selectedProduct?.model || "Search Product Master..."}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-card border-white/10">
                      <Command shouldFilter={false}>
                        <CommandInput placeholder="Type SKU or model..." value={searchQuery} onValueChange={setSearchQuery} />
                        <CommandList>
                          <CommandEmpty>No SKUs found.</CommandEmpty>
                          <CommandGroup>
                            {products.filter(p => p.model.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10).map((p) => (
                              <CommandItem key={p.id} onSelect={() => { setSelectedProduct(p); setOpenCombobox(false); }} className="p-3">
                                <div><p className="font-bold text-sm text-white">{p.model}</p></div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {selectedProduct && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-4">
                      <Label className="text-[10px] font-bold uppercase text-white/50">Unit Price (₹)</Label>
                      <Input type="number" value={pendingPrice} onChange={e => setPendingPrice(Number(e.target.value))} className="bg-black/40 h-10 font-bold font-mono" />
                      <Label className="text-[10px] font-bold uppercase text-white/50">Quantity</Label>
                      <Input type="number" value={pendingQuantity} onChange={e => setPendingQuantity(Number(e.target.value))} className="bg-black/40 h-10 font-bold" />
                      <Button className="w-full h-11 bg-primary text-black font-bold" onClick={handleAddProduct}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex-1 truncate"><p className="text-[11px] font-bold text-white truncate">{field.product.model}</p></div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive/40" onClick={() => remove(index)}><Trash2 size={14} /></Button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 'summary' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-2">
                    <div className="flex justify-between text-xs text-white/60"><span>Sub-Total</span><span>₹{totals.subTotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between text-lg font-bold text-primary font-mono tracking-tighter pt-2 border-t border-white/10"><span>Grand Total</span><span>₹{totals.grandTotal.toLocaleString('en-IN')}</span></div>
                  </div>
                  <Button variant="outline" className="w-full h-12 gap-2 border-primary/30 text-primary" onClick={saveQuotationToFirestore} disabled={isSaving || !watchedLineItems?.length}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save size={16}/> Save & Sync Deal</>}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12 text-[10px] font-bold uppercase" onClick={() => router.push('/deal-intelligence')} disabled={!watchedLineItems?.length}><BrainCircuit size={14} className="mr-2"/> AI Logic</Button>
                    <Button variant="outline" className="h-12 text-[10px] font-bold uppercase" onClick={() => router.push('/follow-up')} disabled={!watchedLineItems?.length}><Calendar size={14} className="mr-2"/> Follow-Up</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Form>
        </ScrollArea>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 bg-black flex flex-col relative z-10 overflow-hidden">
        <div className="h-20 bg-card/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 shrink-0 no-print">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white/5 rounded-full p-1">
            <TabsList className="bg-transparent">
              <TabsTrigger value="quotation" className="rounded-full px-4 h-8 text-[10px] font-bold uppercase data-[state=active]:bg-primary">Proposal</TabsTrigger>
              <TabsTrigger value="brochure" disabled={!marketingData} className="rounded-full px-4 h-8 text-[10px] font-bold uppercase data-[state=active]:bg-primary">AI Brochure</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => handleDownloadPdf(activeTab === 'quotation' ? 'quotation-export-root' : 'brochure-export-root', 'Proposal.pdf')} size="sm" className="rounded-full h-9 bg-white text-black hover:bg-white/90 font-bold" disabled={isDownloading}>
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download size={14} className="mr-2"/> Export A4 PDF</>}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-20 flex flex-col items-center">
            {activeTab === 'quotation' ? (
              <div id="quotation-export-root" className="document-canvas">
                <div className="quotation-page">
                  <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-100">
                    <img src="/hp-logo.png" alt="HP" className="h-[18mm] w-auto" />
                    <div className="text-right">
                      <h2 className="text-[14pt] font-bold uppercase">DEEQASA</h2>
                      <p className="text-[8pt] text-gray-400 font-bold uppercase">Authorized Partner</p>
                    </div>
                  </div>
                  <div className="mb-10 text-[11pt] space-y-1">
                    <p className="font-bold">To,</p>
                    <p className="text-[12pt] uppercase">{watchedCustomer}</p>
                    <p className="font-medium text-gray-600">{watchedCompany}</p>
                    <p className="text-gray-500 italic">{watchedAddress}</p>
                  </div>
                  <div className="font-bold bg-gray-50 p-4 border-l-4 border-gray-900 mb-8">
                    <p className="text-[#111827]"><span className="underline uppercase mr-3 text-gray-400 text-[8pt]">Subject:</span> {watchedSubject}</p>
                  </div>
                  <div className="space-y-6 text-[11.5pt] justified-text">
                    <p className="font-bold">Respected Sir/Madam,</p>
                    <div className="whitespace-pre-wrap leading-[1.7]">{watchedLetterBody}</div>
                  </div>
                  <div className="mt-auto pt-10 flex justify-between items-end border-t border-gray-50">
                    <p className="text-[7pt] font-bold uppercase tracking-widest text-gray-300">Proposal Page 01</p>
                    <div className="text-right">
                      <div className="h-10 w-40 border-b border-gray-300 mb-2"></div>
                      <p className="text-[8pt] font-black uppercase">Authorized Signature</p>
                    </div>
                  </div>
                </div>
                {/* Simplified dynamic pages for pack */}
                <div className="quotation-page">
                  <h3 className="text-center font-black text-xl mb-10 uppercase tracking-widest">Commercial Schedule</h3>
                  <table className="quotation-table">
                    <thead><tr><th>Sr.</th><th>Configuration</th><th>Qty</th><th>Unit (₹)</th><th>Total (₹)</th></tr></thead>
                    <tbody>
                      {watchedLineItems?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="text-center">{idx + 1}</td>
                          <td className="p-2"><strong>{item.product.model}</strong><br/><span className="text-[8pt] italic text-gray-500">{item.product.processor}</span></td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-right">{item.unitPrice.toLocaleString('en-IN')}</td>
                          <td className="text-right font-bold">{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-10 flex justify-end">
                    <div className="w-[85mm] bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex justify-between text-[8pt] font-bold text-gray-400 uppercase"><span>Sub-Total</span><span>₹{totals.subTotal.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between text-lg font-black pt-4 border-t-2 border-gray-200 uppercase"><span>Grand Total</span><span>₹{totals.grandTotal.toLocaleString('en-IN')}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <BrochurePreview 
                products={Array.from(new Set(watchedLineItems.map(i => i.product.id))).map(id => watchedLineItems.find(i => i.product.id === id)!.product)} 
                marketingData={marketingData!} 
              />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
