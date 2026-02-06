'use client';

import { useState, useEffect, useMemo, useTransition, useRef } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

import { getProductData } from '@/ai/flows/get-product-data';
import { generateLetterBody } from '@/ai/flows/ai-quotation-letter-generation';
import { generateBrochureContent, type BrochureOutput } from '@/ai/flows/ai-brochure-generation';
import { storeBrochureLog } from '@/ai/flows/store-brochure-data';
import { type Product, ProductSchema } from '@/lib/quotation-schemas';
import { 
  ChevronsUpDown, 
  Plus, 
  Trash2, 
  Sparkles, 
  Download, 
  Image as ImageIcon, 
  FileText, 
  Wand2, 
  BookOpen,
  User,
  Layout,
  Package,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Loader2
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

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

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
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState("quotation");
  const [currentStep, setCurrentStep] = useState('customer');
  const [activeField, setActiveField] = useState<string | null>(null);

  const [isManualMode, setIsManualMode] = useState(false);
  const [manualModel, setManualModel] = useState('');
  const [manualSpec, setManualSpec] = useState('');
  const [manualPrice, setManualPrice] = useState<number>(0);
  const [manualQty, setManualQty] = useState<number>(1);

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

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p => p.id.toLowerCase().includes(q) || p.model.toLowerCase().includes(q) || p.processor.toLowerCase().includes(q));
  }, [products, searchQuery]);

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

  const handleAddProduct = () => {
    if (selectedProduct) {
      append({ product: selectedProduct, quantity: 1, unitPrice: selectedProduct.price });
      setSelectedProduct(null);
      setSearchQuery('');
      toast({ title: 'Item Added', description: `${selectedProduct.model} added to quotation.` });
    }
  };

  const handleAddManualProduct = () => {
      if (!manualModel) return;
      const customProduct: Product = {
          id: `MAN-${Date.now()}`,
          model: manualModel, plant: '-', chassis: '-', processor: manualSpec || '-', memory: '-', hdd: '-', hdd2: '-', gfx: '-', os: '-', odd: '-', wlan: '-', warranty: '-', name: manualModel, price: Number(manualPrice) || 0, gstRate: 18,
      };
      append({ product: customProduct, quantity: Number(manualQty) || 1, unitPrice: Number(manualPrice) || 0 });
      setManualModel(''); setManualSpec(''); setManualPrice(0); setManualQty(1);
      toast({ title: 'Custom Item Added', description: manualModel });
  };

  const handleAiGenerateBody = () => {
    if (!watchedSubject) {
      toast({ variant: 'destructive', title: 'Subject Required', description: 'Please enter a subject line first.' });
      return;
    }
    startGeneratingBody(async () => {
      try {
        const result = await generateLetterBody({ subject: watchedSubject, customerName: watchedCustomer, companyName: watchedCompany, address: watchedAddress });
        form.setValue('letterBody', result.letterBody);
        toast({ title: 'Content Refined', description: 'Professional letter body generated using AI Intelligence.' });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'AI Generation Failed', description: error.message });
      }
    });
  };

  const handleGenerateBrochure = async () => {
    if (!watchedLineItems?.length) {
      toast({ variant: 'destructive', title: 'No Products', description: 'Add products to the quotation first.' });
      return;
    }
    setIsGeneratingBrochure(true);
    try {
      const distinctProducts = Array.from(new Set(watchedLineItems.map(item => item.product.id)))
        .map(id => watchedLineItems.find(item => item.product.id === id)!.product);

      const brochureData = await generateBrochureContent({ products: distinctProducts });
      setMarketingData(brochureData);
      
      await storeBrochureLog({
        customerName: watchedCustomer,
        companyName: watchedCompany,
        products: distinctProducts.map(p => p.model),
        quotationRef: `DQT/2024/${format(new Date(), 'MM/yy')}`
      });

      setActiveTab("brochure");
      toast({ title: 'Brochure Generated', description: 'Enterprise marketing materials are ready for export.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Generation Failed', description: e.message });
    } finally {
      setIsGeneratingBrochure(false);
    }
  };

  const handleDownloadPdf = async (rootId: string, filename: string) => {
    setIsDownloading(true);
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById(rootId);
    if (!element) return;
    
    const opt = { 
      margin: 0, 
      filename, 
      image: { type: 'jpeg', quality: 1.0 }, 
      html2canvas: { scale: 3, useCORS: true, letterRendering: true, logging: false }, 
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf().from(element).set(opt).save();
      toast({ title: 'Export Complete', description: 'A4 Document saved successfully.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Export Failed', description: e.message });
    } finally { setIsDownloading(false); }
  };

  const handleDownloadPng = async (rootId: string, filename: string) => {
    setIsDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const element = document.getElementById(rootId);
      if (!element) return;
      
      const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: 'Export Complete', description: 'HD PNG Image saved successfully.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Export Failed', description: e.message });
    } finally { setIsDownloading(false); }
  };

  const QuotationHeader = () => (
    <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-100">
      <div className="flex items-center">
        <img src="/hp-logo.png" alt="HP Partner" className="h-[18mm] w-auto object-contain" />
      </div>
      <div className="text-right">
        <h2 className="text-[14pt] font-bold text-gray-900 uppercase tracking-tighter">DEEQASA</h2>
        <p className="text-[8pt] text-gray-400 font-bold uppercase tracking-widest mt-1">Authorized HP Solutions Partner</p>
        <p className="text-[7pt] text-gray-300 font-mono mt-0.5">EST. 2024 | SECURE INFRASTRUCTURE</p>
      </div>
    </div>
  );

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

          {/* Stepper */}
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
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <FormField control={form.control} name="customerName" render={({ field }) => (
                    <FormItem onFocus={() => setActiveField('customerName')} onBlur={() => setActiveField(null)}>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/50">Attention To</FormLabel>
                      <FormControl><Input className="bg-white/5 border-white/10 h-11 focus:ring-primary/30" placeholder="e.g. The Head of Department" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem onFocus={() => setActiveField('companyName')} onBlur={() => setActiveField(null)}>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/50">Organization</FormLabel>
                      <FormControl><Input className="bg-white/5 border-white/10 h-11 focus:ring-primary/30" placeholder="e.g. Panjab University" {...field} /></FormControl>
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
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
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
                        <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] bg-primary/5 hover:bg-primary/10 border-primary/20 transition-all group" onClick={handleAiGenerateBody} disabled={isGeneratingBody}>
                          {isGeneratingBody ? <Loader2 className="w-3 h-3 animate-spin text-primary" /> : <><Sparkles size={10} className="mr-1 text-primary group-hover:scale-110 transition-transform"/> Magic Refine</>}
                        </Button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Textarea rows={10} className="bg-white/5 border-white/10 focus:ring-primary/30 text-[11px] leading-relaxed" {...field} />
                          {isGeneratingBody && <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-md" />}
                        </div>
                      </FormControl>
                    </FormItem>
                  )} />
                </motion.div>
              )}

              {currentStep === 'items' && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 mb-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Manual Mode</Label>
                    <Switch checked={isManualMode} onCheckedChange={setIsManualMode} />
                  </div>

                  {!isManualMode ? (
                    <div className="space-y-4">
                      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between h-12 bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10">
                            <span className="truncate">{selectedProduct?.model || "Search Product Master..."}</span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-card border-white/10 shadow-2xl" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput placeholder="Type SKU or model..." value={searchQuery} onValueChange={setSearchQuery} className="h-11 border-none bg-transparent" />
                            <CommandList>
                              <CommandEmpty className="py-6 text-[11px] text-muted-foreground text-center">No enterprise SKU found.</CommandEmpty>
                              <CommandGroup>
                                {filteredProducts.slice(0, 15).map((p) => (
                                  <CommandItem key={p.id} onSelect={() => { setSelectedProduct(p); setOpenCombobox(false); }} className="p-3 cursor-pointer hover:bg-primary/10">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-bold text-[13px] text-white">{p.model}</span>
                                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">{p.processor}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Button type="button" className="w-full h-11 font-bold text-xs shadow-lg shadow-primary/20" onClick={handleAddProduct} disabled={!selectedProduct}>
                        <Plus className="mr-2 h-4 w-4" /> Commit Item to List
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <Input value={manualModel} onChange={e => setManualModel(e.target.value)} placeholder="Product/Service Model" className="bg-transparent" />
                      <Textarea value={manualSpec} onChange={e => setManualSpec(e.target.value)} placeholder="Full Technical Description" className="bg-transparent text-[11px]" />
                      <div className="grid grid-cols-2 gap-3">
                        <Input type="number" value={manualPrice} onChange={e => setManualPrice(Number(e.target.value))} placeholder="Unit Price (₹)" className="bg-transparent" />
                        <Input type="number" value={manualQty} onChange={e => setManualQty(Number(e.target.value))} placeholder="Quantity" className="bg-transparent" />
                      </div>
                      <Button type="button" variant="secondary" className="w-full h-11 font-bold text-xs" onClick={handleAddManualProduct}>Add Custom Entry</Button>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 group animate-in fade-in slide-in-from-left-2">
                        <div className="flex-1 truncate pr-4">
                          <p className="text-[11px] font-bold text-white truncate">{field.product.model}</p>
                          <p className="text-[9px] text-muted-foreground uppercase">{field.quantity} Units @ ₹{field.unitPrice.toLocaleString('en-IN')}</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 'summary' && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                     <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Quotation Total</h4>
                        <ShieldCheck className="h-4 w-4 text-emerald-500/50" />
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-xs text-white/60"><span>Sub-Total</span><span>₹{totals.subTotal.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between text-xs text-white/60"><span>GST (18%)</span><span>₹{totals.totalGst.toLocaleString('en-IN')}</span></div>
                        <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase text-white">Grand Total</span>
                          <span className="text-lg font-bold text-primary font-mono tracking-tighter">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center px-4">Marketing Intelligence</p>
                     <Button variant="outline" className="w-full h-12 gap-2 border-primary/30 text-primary hover:bg-primary/10 font-bold text-xs group" onClick={handleGenerateBrochure} disabled={isGeneratingBrochure || !watchedLineItems?.length}>
                        {isGeneratingBrochure ? <Loader2 className="w-4 h-4 animate-spin" /> : <><BookOpen size={16} className="group-hover:scale-110 transition-transform"/> Compile 3-Page Product Brochure</>}
                     </Button>
                     <p className="text-[8px] text-muted-foreground/60 text-center italic">Requires high-speed connection for AI processing.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Form>
        </ScrollArea>

        {/* Footer Brand */}
        <div className="p-6 border-t border-white/5 bg-black/40">
           <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Infrastructure Engine v4.0.1
           </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 bg-black flex flex-col relative z-10 overflow-hidden">
        {/* Document Action Bar */}
        <div className="h-20 bg-card/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 shrink-0 no-print">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white/5 rounded-full p-1 border border-white/10">
            <TabsList className="bg-transparent">
              <TabsTrigger value="quotation" className="rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                <FileText size={12} className="mr-2" /> Quotation
              </TabsTrigger>
              <TabsTrigger value="brochure" disabled={!marketingData} className="rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                <BookOpen size={12} className="mr-2" /> AI Brochure
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handleDownloadPdf(activeTab === 'quotation' ? 'quotation-export-root' : 'brochure-export-root', activeTab === 'quotation' ? 'Quotation_DEEQASA.pdf' : 'Brochure_DEEQASA.pdf')} size="sm" className="rounded-full h-9 px-5 bg-white text-black hover:bg-white/90 font-bold transition-all hover:scale-105 active:scale-95" disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download size={14} className="mr-2"/> Export A4 PDF</>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-card border-white/10 text-white text-[10px] uppercase font-bold">Print-Ready Vector Document</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handleDownloadPng(activeTab === 'quotation' ? 'quotation-export-root' : 'brochure-export-root', activeTab === 'quotation' ? 'Quotation' : 'Brochure')} size="sm" variant="outline" className="rounded-full h-9 px-5 border-white/10 text-white/70 hover:text-white hover:bg-white/5 font-bold transition-all hover:scale-105 active:scale-95" disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ImageIcon size={14} className="mr-2"/> Export HD PNG</>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-card border-white/10 text-white text-[10px] uppercase font-bold">High-Resolution Image Sequence</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Canvas Area */}
        <ScrollArea className="flex-1 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]">
          <div className="py-20 px-4 min-w-[210mm] flex flex-col items-center">
            <AnimatePresence mode="wait">
              {activeTab === 'quotation' ? (
                <motion.div 
                  key="quotation"
                  initial={{ opacity: 0, y: 40, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  id="quotation-export-root" 
                  className="document-canvas"
                >
                  {/* Page 1: Cover Letter */}
                  <div className="quotation-page">
                    <QuotationHeader />
                    <div className="flex justify-between items-start mb-10 text-[11pt]">
                      <div className={cn("font-bold space-y-0.5 transition-all duration-300", (activeField === 'customerName' || activeField === 'companyName' || activeField === 'address') && "highlight-sync")}>
                        <p>To,</p>
                        <p className="text-[12pt] uppercase tracking-tight">{watchedCustomer}</p>
                        <p className="font-medium text-gray-800">{watchedCompany}</p>
                        <p className="text-gray-500 italic font-normal">{watchedAddress}</p>
                      </div>
                      <div className="text-right text-gray-500 font-bold text-[9pt] uppercase tracking-widest border-t-2 border-gray-100 pt-2">
                        <p>REF: DQT/2024/{format(new Date(), 'MM/yy')}</p>
                        <p>DATE: {format(new Date(), 'dd-MM-yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className={cn("font-bold bg-gray-50 p-4 border-l-4 border-gray-900 mb-8 transition-all duration-500", activeField === 'subject' && "highlight-sync")}>
                      <p className="leading-tight"><span className="underline uppercase mr-3 text-gray-400 font-medium tracking-[0.2em] text-[8pt]">Subject:</span> {watchedSubject}</p>
                    </div>

                    <div className="space-y-6 text-[11.5pt] justified-text text-gray-800">
                      <p className="font-bold">Respected Sir/Madam,</p>
                      <div className={cn("whitespace-pre-wrap leading-[1.7] transition-all duration-500", activeField === 'letterBody' && "highlight-sync")}>
                        {watchedLetterBody}
                      </div>
                      
                      <div className="pt-8 space-y-4">
                        <h4 className="font-bold uppercase text-[8.5pt] tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-2">Technical & Commercial Terms:</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10pt] text-gray-700 italic">
                          <p>• <strong className="not-italic text-gray-900 uppercase text-[8pt]">Taxes:</strong> GST @ 18% as per statutory norms.</p>
                          <p>• <strong className="not-italic text-gray-900 uppercase text-[8pt]">Logistics:</strong> 4-6 Weeks turnaround time.</p>
                          <p>• <strong className="not-italic text-gray-900 uppercase text-[8pt]">Validity:</strong> Active for 7 business days.</p>
                          <p>• <strong className="not-italic text-gray-900 uppercase text-[8pt]">Service:</strong> On-site professional support.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-10 flex justify-between items-end border-t border-gray-50">
                       <div className="opacity-20 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center font-bold text-[10px]">1</div>
                          <span className="text-[7pt] font-bold uppercase tracking-widest">Formal Proposal</span>
                       </div>
                       <div className="text-right">
                          <div className="h-10 w-40 border-b border-gray-300 mb-2"></div>
                          <p className="text-[8pt] font-black uppercase">Authorized Signature</p>
                       </div>
                    </div>
                  </div>

                  {/* Page 2: Commercial Schedule */}
                  <div className="quotation-page">
                    <QuotationHeader />
                    <div className="text-center mb-8">
                       <h3 className="inline-block px-8 py-2 border-2 border-gray-900 font-black text-[11pt] uppercase tracking-[0.4em]">Commercial Schedule</h3>
                    </div>

                    <table className="quotation-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>Sr.</th>
                          <th style={{ textAlign: 'left', paddingLeft: '15px' }}>Technical Configuration / SKU Details</th>
                          <th style={{ width: '60px' }}>Qty</th>
                          <th style={{ width: '100px' }}>Unit (₹)</th>
                          <th style={{ width: '120px' }}>Total Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {watchedLineItems?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center font-bold text-gray-300">{idx + 1}</td>
                            <td style={{ padding: '10px 15px' }}>
                              <p className="font-black uppercase text-gray-900 text-[10pt] mb-1 tracking-tight">{item.product.model}</p>
                              <p className="text-[8.5pt] text-gray-500 leading-relaxed font-serif italic">{getLongDescription(item.product)}</p>
                            </td>
                            <td className="text-center font-bold text-[11pt]">{item.quantity}</td>
                            <td className="text-right text-[10pt] font-mono">{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="text-right font-black text-gray-900 text-[11pt] font-mono">{ (item.quantity * item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 }) }</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-10 flex justify-end">
                      <div className="w-[85mm] space-y-2.5 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <div className="flex justify-between text-[8.5pt] font-bold text-gray-400 uppercase tracking-widest"><span>Net Base Amount</span><span>{totals.subTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                        <div className="flex justify-between text-[8.5pt] font-bold text-gray-400 uppercase tracking-widest"><span>Applied GST (18%)</span><span>{totals.totalGst.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                        <div className="flex justify-between text-[14pt] font-black text-gray-900 border-t-2 border-gray-200 pt-4 mt-2 uppercase tracking-tighter"><span>Grand Total</span><span>{totals.grandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></div>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gray-900 text-white rounded-2xl flex items-center gap-6">
                      <div className="shrink-0 p-3 bg-white/10 rounded-xl">
                        <CheckCircle2 size={32} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[7pt] font-bold uppercase tracking-[0.3em] text-white/50 mb-1">Total Valuation In Words:</p>
                        <p className="italic text-[12pt] font-serif leading-tight">{numberToWords(totals.grandTotal)}</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-8 flex justify-between items-center opacity-30">
                       <p className="text-[7pt] font-black uppercase tracking-[0.3em]">Smart. Secure. Sustainable.</p>
                       <p className="text-[7pt] font-black uppercase">Document Reference: DQT/2024/SEC-01</p>
                       <p className="text-[7pt] font-black uppercase">Page 02 of 02</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="brochure"
                  initial={{ opacity: 0, y: 40, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <BrochurePreview 
                    products={Array.from(new Set(watchedLineItems.map(i => i.product.id))).map(id => watchedLineItems.find(i => i.product.id === id)!.product)} 
                    marketingData={marketingData!} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      {/* Floating Action Hint */}
      <AnimatePresence>
        {!watchedLineItems?.length && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-[calc(420px+((100vw-420px)/2))] -translate-x-1/2 z-50 pointer-events-none no-print"
          >
            <div className="bg-primary/20 backdrop-blur-xl border border-primary/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(0,224,255,0.3)]">
               <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Add products to begin proposal generation</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
