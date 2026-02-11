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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

import { getProductData } from '@/ai/flows/get-product-data';
import { generateLetterBody } from '@/ai/flows/ai-quotation-letter-generation';
import { type BrochureOutput } from '@/ai/flows/ai-brochure-generation';
import { ProductSchema, type Product } from '@/lib/quotation-schemas';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import { 
  ChevronsUpDown, 
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
  Eye,
  Landmark,
  PencilLine
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

const STEPS = [
  { id: 'customer', title: 'Customer', icon: User },
  { id: 'letter', title: 'Cover Letter', icon: Layout },
  { id: 'items', title: 'Line Items', icon: Package },
  { id: 'summary', title: 'Export', icon: CheckCircle2 },
];

const HP_LOGO_URL = "/hp-logo.png";

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
  const [savedId, setSavedId] = useState<string | null>(null);

  // Manual Entry States
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualModel, setManualModel] = useState('');
  const [manualPrice, setManualPrice] = useState<number>(0);
  const [manualQuantity, setManualQuantity] = useState<number>(1);

  const [pendingPrice, setPendingPrice] = useState<number>(0);
  const [pendingQuantity, setPendingQuantity] = useState<number>(1);

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
      const q = query(collection(firestore, 'quotations'), where('status', '==', 'ACTIVE'));
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => batch.update(doc.ref, { status: 'ARCHIVED' }));

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
      setSavedId(quotationId);
      toast({ title: "Quotation Saved", description: "Record synchronized with Mission Control." });
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
        image: { type: 'jpeg', quality: 0.98 }, 
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false, 
          letterRendering: true,
          windowWidth: 794 // Strict A4 width
        }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().from(element).set(opt).save();
      toast({ title: "Export Complete", description: "Technical proposal generated successfully." });
    } catch (error: any) {
      console.error("PDF Export failed:", error);
      toast({ variant: "destructive", title: "Export Error", description: error.message || "Failed to render document." });
    } finally { 
      setIsDownloading(false); 
    }
  };

  const handleAddManualItem = () => {
    if (!manualModel || manualPrice <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Entry', description: 'Model name and price are required.' });
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
    toast({ title: 'Manual Item Added', description: `${manualModel} added to list.` });
  };

  const LetterheadHeader = () => (
    <div className="flex justify-between items-start mb-10 border-b border-gray-100 pb-6 shrink-0 w-full">
      <div className="flex flex-col gap-2">
        <img src={HP_LOGO_URL} alt="HP CONNECT" className="h-[12mm] w-auto mb-2" crossOrigin="anonymous" />
        <span className="text-[10pt] font-black text-gray-900 tracking-widest uppercase">HP CONNECT PARTNER</span>
      </div>
      <div className="text-right flex flex-col">
        <h2 className="text-[14pt] font-black uppercase tracking-tighter text-gray-900 leading-tight">M/S DEEQASA-TECH</h2>
        <p className="text-[8pt] font-medium text-gray-500 italic">Smart. Secure. Sustainable. IT Solutions.</p>
        <p className="text-[8pt] font-bold text-gray-400 mt-1 uppercase tracking-widest">GSTIN: 03EPIPK0093E1Z7</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-80px)] bg-background overflow-hidden font-body relative">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[420px] bg-card border-r border-border flex flex-col no-print shrink-0 relative z-20 overflow-y-auto max-h-screen">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,224,255,0.2)]">
               <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-foreground leading-tight">Quotation Studio</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Enterprise Documentation Hub</p>
            </div>
          </div>

          <div className="relative mb-10 pl-2">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
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
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 z-10 bg-card transition-all duration-300",
                      isActive ? "border-primary scale-125 shadow-[0_0_10px_rgba(0,224,255,0.5)]" : "border-border group-hover:border-primary/40"
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
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attention To</FormLabel>
                      <FormControl><Input className="bg-background border-border h-11 focus:ring-primary/30" placeholder="The Head of Department" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Organization</FormLabel>
                      <FormControl><Input className="bg-background border-border h-11 focus:ring-primary/30" placeholder="Panjab University" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Address</FormLabel>
                      <FormControl><Textarea rows={3} className="bg-background border-border focus:ring-primary/30 text-xs" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </motion.div>
              )}

              {currentStep === 'letter' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subject Line</FormLabel>
                      <FormControl><Input className="bg-background border-border h-11 focus:ring-primary/30" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="letterBody" render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-1">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Body Text</FormLabel>
                        <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] bg-primary/5 hover:bg-primary/10 border-primary/20" onClick={() => {
                          const subject = form.getValues('subject');
                          const customer = form.getValues('customerName');
                          const company = form.getValues('companyName');
                          const address = form.getValues('address');
                          startGeneratingBody(async () => {
                            try {
                              const res = await generateLetterBody({ subject, customerName: customer, companyName: company, address });
                              form.setValue('letterBody', res.letterBody);
                            } catch (e: any) {
                              toast({ variant: 'destructive', title: 'Generation Failed', description: e.message });
                            }
                          });
                        }} disabled={isGeneratingBody}>
                          {isGeneratingBody ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles size={10} className="mr-1"/> Magic Refine</>}
                        </Button>
                      </div>
                      <FormControl><Textarea rows={10} className="bg-background border-border text-[11px]" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </motion.div>
              )}

              {currentStep === 'items' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex items-center gap-2">
                      <PencilLine size={14} className="text-primary"/>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Manual Entry Mode</span>
                    </div>
                    <Switch checked={isManualMode} onCheckedChange={setIsManualMode} />
                  </div>

                  {!isManualMode ? (
                    <>
                      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between h-12 bg-background border-border text-foreground">
                            <span>{selectedProduct?.model || "Search Product Master..."}</span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-popover border-border">
                          <Command shouldFilter={false}>
                            <CommandInput placeholder="Type SKU or model..." value={searchQuery} onValueChange={setSearchQuery} />
                            <CommandList>
                              <CommandEmpty>No SKUs found.</CommandEmpty>
                              <CommandGroup>
                                {products.filter(p => p.model.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10).map((p) => (
                                  <CommandItem key={p.id} onSelect={() => { setSelectedProduct(p); setOpenCombobox(false); }} className="p-3">
                                    <div><p className="font-bold text-sm text-foreground">{p.model}</p></div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {selectedProduct && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-4">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground">Unit Price (₹)</Label>
                          <Input type="number" value={pendingPrice} onChange={e => setPendingPrice(Number(e.target.value))} className="bg-background h-10 font-bold font-mono" />
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground">Quantity</Label>
                          <Input type="number" value={pendingQuantity} onChange={e => setPendingQuantity(Number(e.target.value))} className="bg-background h-10 font-bold" />
                          <Button className="w-full h-11 bg-primary text-primary-foreground font-bold" onClick={() => {
                            append({ product: selectedProduct, quantity: pendingQuantity, unitPrice: pendingPrice });
                            setSelectedProduct(null);
                            setSearchQuery('');
                            toast({ title: 'Item Added', description: `${selectedProduct.model} added.` });
                          }}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Item Model/Description</Label>
                        <Input 
                          placeholder="e.g. Custom Server Configuration" 
                          value={manualModel} 
                          onChange={e => setManualModel(e.target.value)} 
                          className="bg-background h-10 font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground">Unit Price (₹)</Label>
                          <Input 
                            type="number" 
                            value={manualPrice} 
                            onChange={e => setManualPrice(Number(e.target.value))} 
                            className="bg-background h-10 font-bold font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground">Quantity</Label>
                          <Input 
                            type="number" 
                            value={manualQuantity} 
                            onChange={e => setManualQuantity(Number(e.target.value))} 
                            className="bg-background h-10 font-bold"
                          />
                        </div>
                      </div>
                      <Button 
                        className="w-full h-11 bg-primary text-primary-foreground font-bold" 
                        onClick={handleAddManualItem}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Custom Item
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                        <div className="flex-1 truncate">
                          <p className="text-[11px] font-bold text-foreground truncate">
                            {field.product.id.startsWith('MANUAL-') && <span className="text-primary mr-2 font-black">[M]</span>}
                            {field.product.model}
                          </p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive/40" onClick={() => remove(index)}><Trash2 size={14} /></Button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 'summary' && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground"><span>Sub-Total</span><span>₹{totals.subTotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between text-lg font-bold text-primary font-mono tracking-tighter pt-2 border-t border-border"><span>Grand Total</span><span>₹{totals.grandTotal.toLocaleString('en-IN')}</span></div>
                  </div>
                  <Button variant="outline" className="w-full h-12 gap-2 border-primary/30 text-primary" onClick={saveQuotationToFirestore} disabled={isSaving || !watchedLineItems?.length}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save size={16}/> Save & Sync Deal</>}
                  </Button>
                  <Button variant="outline" className="w-full h-12 text-[10px] font-bold uppercase" onClick={() => router.push('/deal-intelligence')} disabled={!watchedLineItems?.length}>
                    <BrainCircuit size={14} className="mr-2"/> Open AI Analysis Matrix
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Form>
        </ScrollArea>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-background flex flex-col relative z-10 overflow-hidden">
        <div className="h-20 bg-card border-b border-border flex items-center justify-between px-8 shrink-0 no-print">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-muted rounded-full p-1">
            <TabsList className="bg-transparent">
              <TabsTrigger value="quotation" className="rounded-full px-4 h-8 text-[10px] font-bold uppercase data-[state=active]:bg-primary">Proposal Pack</TabsTrigger>
              <TabsTrigger value="brochure" disabled={!marketingData} className="rounded-full px-4 h-8 text-[10px] font-bold uppercase data-[state=active]:bg-primary">AI Brochure</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => handleDownloadPdf(activeTab === 'quotation' ? 'quotation-export-root' : 'brochure-export-root', 'Enterprise_Proposal')} 
              size="sm" 
              className="rounded-full h-9 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 shadow-lg shadow-primary/20" 
              disabled={isDownloading || !watchedLineItems?.length}
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download size={14} className="mr-2"/>}
              {isDownloading ? "Synthesizing PDF..." : "Export Tender PDF"}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-12 md:py-20 flex flex-col items-center">
            {activeTab === 'quotation' ? (
              <div id="quotation-export-root" className="document-canvas">
                <div className="a4-container holographic-edge">
                  {/* PAGE 1: COVER LETTER */}
                  <div className="a4-page page-break">
                    <LetterheadHeader />
                    
                    <div className="flex-1 flex flex-col">
                      <div className="mb-10 text-[12pt] space-y-1.5 text-gray-800">
                        <p className="font-bold text-gray-400 text-[10pt] uppercase tracking-widest mb-2">To,</p>
                        <p className="text-[13pt] font-black uppercase text-gray-900">{watchedCustomer}</p>
                        <p className="font-bold text-gray-700">{watchedCompany}</p>
                        <p className="text-gray-500 italic text-[10pt]">{watchedAddress}</p>
                      </div>

                      <div className="highlight-bar mb-10">
                        <p className="text-[11pt] font-bold text-gray-900">
                          <span className="uppercase text-[8pt] font-black text-gray-400 mr-4 tracking-tighter">Subject:</span>
                          {watchedSubject}
                        </p>
                      </div>

                      <div className="space-y-8 text-[12pt] justified-text text-gray-800">
                        <p className="font-bold">Respected Sir/Madam,</p>
                        <div className="whitespace-pre-wrap leading-[1.8] font-medium">{watchedLetterBody}</div>
                      </div>

                      <div className="mt-auto pt-10">
                        <h4 className="text-[9pt] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b border-gray-100 pb-2">Commercial Terms & Conditions</h4>
                        <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-[9pt] text-gray-600 font-medium italic">
                          <li className="flex gap-2"><span>•</span> Validity: 30 Days from date of issue</li>
                          <li className="flex gap-2"><span>•</span> Delivery: Within 4-6 weeks of PO</li>
                          <li className="flex gap-2"><span>•</span> Warranty: As per OEM Standards</li>
                          <li className="flex gap-2"><span>•</span> Taxes: GST @ 18% as applicable</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* PAGE 2: TECHNICAL & COMMERCIAL SCHEDULE */}
                  <div className="a4-page">
                    <LetterheadHeader />
                    
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-center font-black text-[14pt] mb-10 uppercase tracking-[0.2em] border-y border-gray-900 py-3">Technical & Commercial Quotation</h3>
                      
                      <table className="quotation-table">
                        <thead>
                          <tr>
                            <th className="w-[8%]">SR</th>
                            <th className="w-[52%] text-left">Specifications</th>
                            <th className="w-[10%] text-center">QTY</th>
                            <th className="w-[15%] text-right">Unit (₹)</th>
                            <th className="w-[15%] text-right">Total (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {watchedLineItems?.map((item, idx) => (
                            <tr key={idx} className="zebra-row">
                              <td className="text-center font-bold text-gray-400">{String(idx + 1).padStart(2, '0')}</td>
                              <td className="font-bold text-gray-900">
                                <span className="text-[11pt] uppercase">{item.product.model}</span>
                                {item.product.id.startsWith('MANUAL-') ? (
                                  <p className="text-[8pt] text-gray-400 font-medium mt-1 italic">Custom Entry Specification</p>
                                ) : (
                                  <p className="text-[8pt] text-gray-500 font-medium mt-1 uppercase tracking-tight leading-relaxed">{item.product.processor} | {item.product.memory} | {item.product.warranty}</p>
                                )}
                              </td>
                              <td className="text-center font-bold text-gray-900">{item.quantity}</td>
                              <td className="text-right font-medium text-gray-700">{item.unitPrice.toLocaleString('en-IN')}</td>
                              <td className="text-right font-black text-gray-900">{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="mt-8 grid grid-cols-2 gap-10">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <h4 className="text-[8pt] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1 flex items-center gap-2">
                            <Landmark size={12}/> Banking Coordinates
                          </h4>
                          <div className="space-y-1 text-[8pt] text-gray-700 font-medium">
                            <p><span className="text-gray-400 uppercase text-[7pt] w-20 inline-block">Beneficiary:</span> DEE QASA</p>
                            <p><span className="text-gray-400 uppercase text-[7pt] w-20 inline-block">Bank:</span> State Bank of India - CC Limit</p>
                            <p><span className="text-gray-400 uppercase text-[7pt] w-20 inline-block">Account:</span> 44562745640</p>
                            <p><span className="text-gray-400 uppercase text-[7pt] w-20 inline-block">IFS Code:</span> SBIN0001443</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="w-[90mm] space-y-2 border-t-2 border-gray-900 pt-4">
                            <div className="flex justify-between text-[9pt] font-black text-gray-400 uppercase tracking-widest">
                              <span>Sub-Total Impact</span>
                              <span>₹{totals.subTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-[9pt] font-black text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100">
                              <span>GST Components (18%)</span>
                              <span>₹{totals.totalGst.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-[14pt] font-black text-gray-900 pt-2 uppercase tracking-tight">
                              <span>Grand Total</span>
                              <span>₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 highlight-bar">
                        <p className="text-[8pt] font-black text-gray-400 uppercase tracking-widest mb-1">Amount in Words</p>
                        <p className="text-[11pt] text-gray-900 italic font-serif font-bold">{numberToWords(totals.grandTotal)}</p>
                      </div>

                      <div className="mt-auto flex justify-between items-end border-t border-gray-100 pt-10">
                        <div className="text-[8pt] text-gray-400 font-bold uppercase tracking-widest">
                          <p>Authorized Signature</p>
                          <p className="mt-10 text-gray-900">For Deeqasa-Tech</p>
                        </div>
                        <div className="text-right text-[7pt] text-gray-300 font-black uppercase">
                          <p>Document Ref: {savedId || 'DQT-PENDING'}</p>
                          <p>Generated: {new Date().toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
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
