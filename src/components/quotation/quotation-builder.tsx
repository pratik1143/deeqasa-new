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

import { getProductData } from '@/ai/flows/get-product-data';
import { generateLetterBody } from '@/ai/flows/ai-quotation-letter-generation';
import { type Product, ProductSchema } from '@/lib/quotation-schemas';
import { Check, ChevronsUpDown, Plus, Trash2, Sparkles, Download, Image as ImageIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { LineLoader } from '../ui/line-loader';

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
        if (n > 99) {
            str += a[Math.floor(n / 100)] + 'hundred ';
            n %= 100;
        }
        if (n > 19) {
            str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
        } else {
            str += a[n];
        }
        return str;
    };
    
    const numStr = roundedNum.toFixed(2);
    const [rupees, paisa] = numStr.split('.').map(Number);

    let rupeesInWords = '';
    if (rupees > 0) {
        let n = rupees;
        if (n >= 10000000) {
            rupeesInWords += inWords(Math.floor(n / 10000000)) + 'crore ';
            n %= 10000000;
        }
        if (n >= 100000) {
            rupeesInWords += inWords(Math.floor(n / 100000)) + 'lakh ';
            n %= 100000;
        }
        if (n >= 1000) {
            rupeesInWords += inWords(Math.floor(n / 1000)) + 'thousand ';
            n %= 1000;
        }
        rupeesInWords += inWords(n);
    }
    
    let paisaInWords = '';
    if (paisa > 0) {
        paisaInWords = ' and ' + inWords(paisa) + 'paisa';
    }

    const result = (rupeesInWords ? rupeesInWords.trim() + ' rupees' : '') + (paisaInWords ? paisaInWords.trim() : '');
    return result.charAt(0).toUpperCase() + result.slice(1) + ' only.';
};

const getLongDescription = (product: Product): string => {
  if (product.id.startsWith('MAN-')) {
    return product.processor;
  }
  const parts = [
    product.processor,
    product.memory,
    product.hdd !== '-' ? product.hdd : null,
    product.hdd2 !== '-' ? product.hdd2 : null,
    product.gfx !== '-' ? product.gfx : null,
    product.os !== '-' ? product.os : null,
    product.warranty !== '-' ? product.warranty : null,
  ];
  return parts.filter(Boolean).join(' | ');
};

export function QuotationBuilder() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isGenerating, startTransition] = useTransition();
  const [isDownloading, setIsDownloading] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isManualMode, setIsManualMode] = useState(false);
  const [manualModel, setManualModel] = useState('');
  const [manualSpec, setManualSpec] = useState('');
  const [manualPrice, setManualPrice] = useState<number>(0);
  const [manualQty, setManualQty] = useState<number>(1);

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const watchedLineItems = useWatch({
    control: form.control,
    name: 'lineItems',
  });
  
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
    return products.filter(p => 
      p.id.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.processor.toLowerCase().includes(q)
    );
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
          model: manualModel,
          plant: '-',
          chassis: '-',
          processor: manualSpec || '-',
          memory: '-',
          hdd: '-',
          hdd2: '-',
          gfx: '-',
          os: '-',
          odd: '-',
          wlan: '-',
          warranty: '-',
          name: manualModel,
          price: Number(manualPrice) || 0,
          gstRate: 18,
      };
      append({ product: customProduct, quantity: Number(manualQty) || 1, unitPrice: Number(manualPrice) || 0 });
      setManualModel(''); setManualSpec(''); setManualPrice(0); setManualQty(1);
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('quotation-export-root');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `Quotation_${watchedCompany.replace(/[^a-z0-9]/gi, '_')}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().from(element).set(opt).save();
      toast({ title: 'Success', description: 'PDF generated successfully.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Export Failed', description: e.message });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPng = async () => {
    setIsDownloading(true);
    try {
        const { toPng } = await import('html-to-image');
        const pages = document.querySelectorAll('.quotation-page');
        
        for (let i = 0; i < pages.length; i++) {
            const dataUrl = await toPng(pages[i] as HTMLElement, { quality: 1.0, pixelRatio: 3, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.download = `Quotation_${watchedCompany.replace(/[^a-z0-9]/gi, '_')}_Page_${i + 1}.png`;
            link.href = dataUrl;
            link.click();
        }
        toast({ title: 'Success', description: 'All pages exported as PNG.' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'PNG Export Failed', description: e.message });
    } finally {
        setIsDownloading(false);
    }
  };

  const QuotationHeader = () => (
    <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-100">
      <div className="flex flex-col items-start">
        <img src="/hp-logo.png" alt="HP" className="h-[28mm] w-auto object-contain bg-white" />
        <span className="text-[7pt] font-bold text-gray-400 tracking-widest uppercase mt-2">HP Connect Partner</span>
      </div>
      <div className="text-right">
        <h2 className="text-[14pt] font-bold text-gray-900 uppercase">M/s DeeQasa-Tech</h2>
        <p className="text-[8pt] text-gray-500 italic">Smart. Secure. Sustainable. IT Solutions.</p>
        <p className="text-[7pt] text-gray-400 uppercase mt-1">GSTIN: 03ABCDE1234F1Z5</p>
      </div>
    </div>
  );

  const BankDetails = () => (
    <div className="space-y-3 mt-8 pt-6 border-t border-gray-100">
      <h4 className="font-bold uppercase text-[7.5pt] tracking-widest text-gray-400">Company Bank Details:</h4>
      <div className="grid grid-cols-2 gap-4 text-[9.5pt] text-gray-700 font-bold">
        <p><span className="text-gray-400 font-medium mr-2">A/c Name:</span> DEE QASA</p>
        <p><span className="text-gray-400 font-medium mr-2">Bank:</span> State Bank of India</p>
        <p><span className="text-gray-400 font-medium mr-2">A/c No:</span> 44562745640</p>
        <p><span className="text-gray-400 font-medium mr-2">IFSC:</span> SBIN0001443</p>
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
            <CardDescription>Enterprise IT Proposals (A4 Portrait)</CardDescription>
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

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-3 bg-secondary/40 rounded border border-border flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-[10px] uppercase text-primary truncate max-w-[200px]">{field.product.model}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove(index)}><Trash2 size={12}/></Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field }) => (
                        <FormItem><FormLabel className="text-[9px]">Qty</FormLabel><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name={`lineItems.${index}.unitPrice`} render={({ field }) => (
                        <FormItem><FormLabel className="text-[9px]">Price (₹)</FormLabel><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Form>
        </div>
      </Card>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col items-center">
        <div className="sticky top-20 right-0 no-print z-20 w-full flex justify-end gap-3 mb-6 max-w-[210mm]">
          <Button onClick={handleDownloadPdf} size="lg" disabled={isDownloading} className="rounded-full shadow-lg">
            {isDownloading ? <LineLoader className="w-12 h-0.5"/> : <><Download size={18} className="mr-2"/> Download PDF</>}
          </Button>
          <Button onClick={handleDownloadPng} size="lg" variant="outline" disabled={isDownloading} className="rounded-full shadow-lg border-primary text-primary">
            {isDownloading ? <LineLoader className="w-12 h-0.5"/> : <><ImageIcon size={18} className="mr-2"/> Download PNGs</>}
          </Button>
        </div>

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
            
            <div className="absolute bottom-[20mm] left-[18mm] right-[18mm] flex justify-between items-end border-t border-gray-100 pt-4 no-print">
               <p className="text-[8pt] text-gray-400 uppercase tracking-widest font-bold">Page 1 of 2</p>
               <p className="text-[7pt] text-gray-300 italic">Computer generated - No signature required</p>
            </div>
          </div>

          {/* Page 2: Table & Summary */}
          <div className="quotation-page">
            <QuotationHeader />
            <h3 className="text-center font-bold text-[12pt] uppercase tracking-widest mb-6 border-y border-gray-900 py-2">Technical & Commercial Quotation</h3>
            
            <table className="quotation-table">
              <thead>
                <tr>
                  <th className="col-sr">Sr.</th>
                  <th>Specifications</th>
                  <th className="col-qty">Qty</th>
                  <th className="col-price">Unit Price (₹)</th>
                  <th className="col-total">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {watchedLineItems?.map((item, idx) => {
                  const qty = parseFloat(String(item.quantity || 0));
                  const price = parseFloat(String(item.unitPrice || 0));
                  return (
                    <tr key={idx}>
                      <td className="text-center font-bold text-gray-400">{idx + 1}</td>
                      <td>
                        <p className="font-bold uppercase text-gray-900 text-[10pt] mb-1">{item.product.model}</p>
                        <p className="text-[9pt] text-gray-500 leading-relaxed">{getLongDescription(item.product)}</p>
                      </td>
                      <td className="text-center font-bold">{qty}</td>
                      <td className="text-right">{CURRENCY_FORMATTER.format(price)}</td>
                      <td className="text-right font-bold text-gray-900">{CURRENCY_FORMATTER.format(qty * price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-8 flex justify-end">
              <div className="w-[80mm] space-y-2 border-t-2 border-gray-900 pt-4">
                <div className="flex justify-between text-[8pt] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Sub Total</span>
                  <span>{CURRENCY_FORMATTER.format(totals.subTotal)}</span>
                </div>
                <div className="flex justify-between text-[8pt] font-bold text-gray-400 uppercase tracking-widest">
                  <span>GST @ 18%</span>
                  <span>{CURRENCY_FORMATTER.format(totals.totalGst)}</span>
                </div>
                <div className="flex justify-between text-[13pt] font-bold text-gray-900 border-t border-gray-100 pt-3">
                  <span className="tracking-tighter uppercase">Grand Total</span>
                  <span>{CURRENCY_FORMATTER.format(totals.grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-900">
              <p className="font-bold text-[7pt] uppercase tracking-widest text-gray-400 mb-1">Amount In Words:</p>
              <p className="italic text-[11pt] font-bold text-gray-900">{numberToWords(totals.grandTotal)}</p>
            </div>

            <BankDetails />

            <div className="mt-16 flex justify-between items-end">
               <div className="text-[8pt] text-gray-400 font-bold uppercase tracking-widest">Authorized Partner: HP Enterprise</div>
               <div className="text-right space-y-12">
                 <p className="font-bold uppercase tracking-widest text-[9.5pt]">For M/s DeeQasa-Tech</p>
                 <div className="pt-2 font-bold uppercase text-[8.5pt] border-t border-gray-200 px-8 text-gray-400">Authorized Signatory</div>
               </div>
            </div>
            
            <div className="absolute bottom-[20mm] left-[18mm] right-[18mm] flex justify-between items-end border-t border-gray-100 pt-4 no-print">
               <p className="text-[8pt] text-gray-400 uppercase tracking-widest font-bold">Page 2 of 2</p>
               <p className="text-[7pt] text-gray-300 italic">This is a system generated document</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}