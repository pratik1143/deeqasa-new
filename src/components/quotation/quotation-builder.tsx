'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getProductData } from '@/ai/flows/get-product-data';
import { generateLetterBody } from '@/ai/flows/ai-quotation-letter-generation';
import { generateBrochureContent, type BrochureOutput } from '@/ai/flows/ai-brochure-generation';
import { storeBrochureLog } from '@/ai/flows/store-brochure-data';
import { type Product, ProductSchema } from '@/lib/quotation-schemas';
import { ChevronsUpDown, Plus, Trash2, Sparkles, Download, Image as ImageIcon, FileText, Wand2, BookOpen } from 'lucide-react';
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

export function QuotationBuilder() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState("quotation");

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
        toast({ title: 'Magic Applied', description: 'Professional letter body generated using AI.' });
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
      
      // Log to Sheet
      await storeBrochureLog({
        customerName: watchedCustomer,
        companyName: watchedCompany,
        products: distinctProducts.map(p => p.model),
        quotationRef: `DQT/2024/${format(new Date(), 'MM/yy')}`
      });

      setActiveTab("brochure");
      toast({ title: 'AI Brochure Ready', description: 'Enterprise marketing materials generated and logged.' });
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
    
    // PRECISION SETTINGS FOR A4 PORTRAIT
    const opt = { 
      margin: 0, 
      filename, 
      image: { type: 'jpeg', quality: 1.0 }, 
      html2canvas: { 
        scale: 3, 
        useCORS: true, 
        letterRendering: true,
        logging: false,
        windowWidth: 794 // 210mm at 96 DPI
      }, 
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf().from(element).set(opt).save();
      toast({ title: 'Success', description: 'A4 Portrait PDF exported.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Export Failed', description: e.message });
    } finally { setIsDownloading(false); }
  };

  const handleDownloadPng = async (className: string, filenamePrefix: string) => {
    setIsDownloading(true);
    try {
        const { toPng } = await import('html-to-image');
        const pages = document.querySelectorAll(`.${className}`);
        for (let i = 0; i < pages.length; i++) {
            const dataUrl = await toPng(pages[i] as HTMLElement, { 
              quality: 1.0, 
              pixelRatio: 3, 
              backgroundColor: '#ffffff',
              width: 794,
              height: 1123
            });
            const link = document.createElement('a');
            link.download = `${filenamePrefix}_Page_${i + 1}.png`;
            link.href = dataUrl;
            link.click();
        }
        toast({ title: 'Success', description: 'HD PNG pages exported.' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'PNG Export Failed', description: e.message });
    } finally { setIsDownloading(false); }
  };

  const QuotationHeader = () => (
    <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-100">
      <div className="flex flex-col items-start">
        <span className="text-[28pt] font-black tracking-[0.2em] text-gray-900 uppercase leading-none">
          DEEQASA
        </span>
        <span className="text-[7pt] font-bold text-gray-400 tracking-widest uppercase mt-2">HP Connect Partner</span>
      </div>
      <div className="text-right">
        <h2 className="text-[14pt] font-bold text-gray-900 uppercase">DEEQASA</h2>
        <p className="text-[8pt] text-gray-500 italic">Smart. Secure. Sustainable. IT Solutions.</p>
        <p className="text-[7pt] text-gray-400 uppercase mt-1">GSTIN: 03ABCDE1234F1Z5</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-8 p-6 max-w-[1600px] mx-auto items-start bg-background">
      {/* Editor Panel */}
      <Card className="w-full xl:max-w-md no-print sticky top-20 z-30 shadow-xl border-primary/20">
        <div className="p-6">
          <CardHeader className="p-0 mb-6 border-b border-primary/10 pb-4">
            <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
              <Sparkles size={24} /> Quotation Studio
            </CardTitle>
            <CardDescription>Enterprise IT Proposals & AI Brochures</CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <FileText size={16} /> Customer Details
                </h3>
                <FormField control={form.control} name="customerName" render={({ field }) => (
                  <FormItem><FormLabel>Attention To</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="companyName" render={({ field }) => (
                  <FormItem><FormLabel>Organization</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Full Address</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl></FormItem>
                )} />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Wand2 size={16} /> Cover Letter Body
                </h3>
                <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem><FormLabel>Subject Line</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="letterBody" render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-1">
                      <FormLabel>Body Text</FormLabel>
                      <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] bg-primary/5 hover:bg-primary/10 border-primary/20" onClick={handleAiGenerateBody} disabled={isGeneratingBody}>
                        {isGeneratingBody ? <LineLoader className="w-8 h-0.5" /> : <><Sparkles size={10} className="mr-1 text-primary"/> Magic Write</>}
                      </Button>
                    </div>
                    <FormControl><Textarea rows={6} className="text-xs" {...field} /></FormControl>
                  </FormItem>
                )} />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Plus size={16} /> Item Master
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <Switch checked={isManualMode} onCheckedChange={setIsManualMode} />
                  <Label>Manual Entry Mode</Label>
                </div>
                {!isManualMode ? (
                  <div className="space-y-3">
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-11 bg-secondary/20">
                          <span className="truncate">{selectedProduct?.model || "Search HP Products..."}</span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput placeholder="Search SKU/Model..." value={searchQuery} onValueChange={setSearchQuery} />
                          <CommandList>
                            <CommandEmpty>No products found.</CommandEmpty>
                            <CommandGroup>
                              {filteredProducts.slice(0, 20).map((p) => (
                                <CommandItem key={p.id} onSelect={() => { setSelectedProduct(p); setOpenCombobox(false); }}>
                                  <div className="flex flex-col"><span className="font-bold">{p.model}</span><span className="text-[10px] opacity-60">{p.processor}</span></div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Button type="button" className="w-full" onClick={handleAddProduct} disabled={!selectedProduct}>Add Selected</Button>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 bg-secondary/20 rounded-lg border border-primary/10">
                    <Input value={manualModel} onChange={e => setManualModel(e.target.value)} placeholder="Product Name" />
                    <Textarea value={manualSpec} onChange={e => setManualSpec(e.target.value)} placeholder="Full Specifications" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" value={manualPrice} onChange={e => setManualPrice(Number(e.target.value))} placeholder="Unit Price" />
                      <Input type="number" value={manualQty} onChange={e => setManualQty(Number(e.target.value))} placeholder="Quantity" />
                    </div>
                    <Button type="button" className="w-full" onClick={handleAddManualProduct}>Add Manual Item</Button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-primary/10">
                <Button variant="outline" className="w-full gap-2 border-primary/50 text-primary hover:bg-primary/10" onClick={handleGenerateBrochure} disabled={isGeneratingBrochure || !watchedLineItems?.length}>
                  {isGeneratingBrochure ? <LineLoader className="w-12 h-0.5" /> : <><BookOpen size={18}/> Generate AI Product Brochure</>}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Card>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col items-center">
          <div className="sticky top-20 right-0 no-print z-20 w-full flex justify-between items-center mb-6 max-w-[210mm] bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-primary/10 shadow-2xl">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="quotation" className="gap-2"><FileText size={16}/> Quotation</TabsTrigger>
              <TabsTrigger value="brochure" className="gap-2" disabled={!marketingData}><BookOpen size={16}/> AI Brochure</TabsTrigger>
            </TabsList>
            <div className="flex gap-3">
              <Button onClick={() => handleDownloadPdf(activeTab === 'quotation' ? 'quotation-export-root' : 'brochure-export-root', activeTab === 'quotation' ? 'Quotation.pdf' : 'Product_Brochure.pdf')} size="sm" disabled={isDownloading} className="rounded-full">
                {isDownloading ? <LineLoader className="w-8 h-0.5" /> : <><Download size={14} className="mr-2"/> PDF</>}
              </Button>
              <Button onClick={() => handleDownloadPng(activeTab === 'quotation' ? 'quotation-page' : 'brochure-page', activeTab === 'quotation' ? 'Quotation' : 'Brochure')} size="sm" variant="outline" disabled={isDownloading} className="rounded-full border-primary text-primary">
                {isDownloading ? <LineLoader className="w-8 h-0.5" /> : <><ImageIcon size={14} className="mr-2"/> PNG</>}
              </Button>
            </div>
          </div>

          <TabsContent value="quotation" className="w-full">
            <div id="quotation-export-root" className="w-full flex flex-col items-center">
              {/* Page 1: Cover Letter */}
              <div className="quotation-page">
                <QuotationHeader />
                <div className="flex justify-between items-start mb-10 text-[11pt]">
                  <div className="font-bold space-y-1">
                    <p>To,</p>
                    <p className="text-[12pt] uppercase">{watchedCustomer}</p>
                    <p>{watchedCompany}</p>
                    <p className="text-gray-500 italic">{watchedAddress}</p>
                  </div>
                  <div className="text-right text-gray-500 font-bold text-[9pt]">
                    <p>Ref: DQT/2024/{format(new Date(), 'MM/yy')}</p>
                    <p>Date: {format(new Date(), 'dd-MM-yyyy')}</p>
                  </div>
                </div>
                <div className="font-bold bg-gray-50 p-4 border-l-4 border-gray-900 mb-8">
                  <p className="leading-tight"><span className="underline uppercase mr-2 text-gray-400 font-medium">Subject:</span> {watchedSubject}</p>
                </div>
                <div className="space-y-6 text-[11.5pt] justified-text text-gray-800">
                  <p className="font-bold">Respected Sir/Madam,</p>
                  <div className="whitespace-pre-wrap">{form.watch('letterBody')}</div>
                  <div className="pt-4 space-y-4">
                    <h4 className="font-bold uppercase text-[8pt] tracking-widest text-gray-400 border-b border-gray-100 pb-2">Commercial Terms & Conditions:</h4>
                    <div className="grid grid-cols-1 gap-2 text-[10pt] text-gray-700">
                      <p>• <strong>Taxes:</strong> GST at 18% extra over quoted prices.</p>
                      <p>• <strong>Delivery:</strong> 4-6 weeks from official PO receipt.</p>
                      <p>• <strong>Validity:</strong> 7 days from date of issuance.</p>
                      <p>• <strong>Warranty:</strong> Comprehensive OEM onsite warranty and technical support.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page 2: Table & Summary */}
              <div className="quotation-page">
                <QuotationHeader />
                <h3 className="text-center font-bold text-[12pt] uppercase tracking-widest mb-6 border-y border-gray-900 py-2">Technical & Commercial Quotation</h3>
                <table className="quotation-table">
                  <thead>
                    <tr><th className="col-sr">Sr.</th><th>Specifications</th><th className="col-qty">Qty</th><th className="col-price">Unit Price (₹)</th><th className="col-total">Total (₹)</th></tr>
                  </thead>
                  <tbody>
                    {watchedLineItems?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-center font-bold text-gray-400">{idx + 1}</td>
                        <td><p className="font-bold uppercase text-gray-900 text-[10pt] mb-1">{item.product.model}</p><p className="text-[9pt] text-gray-500 leading-relaxed">{getLongDescription(item.product)}</p></td>
                        <td className="text-center font-bold">{item.quantity}</td>
                        <td className="text-right">{CURRENCY_FORMATTER.format(item.unitPrice)}</td>
                        <td className="text-right font-bold text-gray-900">{CURRENCY_FORMATTER.format(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-8 flex justify-end">
                  <div className="w-[80mm] space-y-2 border-t-2 border-gray-900 pt-4">
                    <div className="flex justify-between text-[8pt] font-bold text-gray-400 uppercase tracking-widest"><span>Sub Total</span><span>{CURRENCY_FORMATTER.format(totals.subTotal)}</span></div>
                    <div className="flex justify-between text-[8pt] font-bold text-gray-400 uppercase tracking-widest"><span>GST @ 18%</span><span>{CURRENCY_FORMATTER.format(totals.totalGst)}</span></div>
                    <div className="flex justify-between text-[13pt] font-bold text-gray-900 border-t border-gray-100 pt-3"><span className="tracking-tighter uppercase">Grand Total</span><span>{CURRENCY_FORMATTER.format(totals.grandTotal)}</span></div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-900">
                  <p className="font-bold text-[7pt] uppercase tracking-widest text-gray-400 mb-1">Amount In Words:</p>
                  <p className="italic text-[11pt] font-bold text-gray-900">{numberToWords(totals.grandTotal)}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="brochure" className="w-full">
            {marketingData && watchedLineItems && (
              <BrochurePreview 
                products={Array.from(new Set(watchedLineItems.map(i => i.product.id))).map(id => watchedLineItems.find(i => i.product.id === id)!.product)} 
                marketingData={marketingData} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
