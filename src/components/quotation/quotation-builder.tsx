'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { getProductData } from '@/ai/flows/get-product-data';
import { generateLetterBody } from '@/ai/flows/ai-quotation-letter-generation';
import { type Product, ProductSchema } from '@/lib/quotation-schemas';
import { Check, ChevronsUpDown, Plus, Trash2, Printer, Sparkles, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { LineLoader } from '../ui/line-loader';

const FormSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  companyName: z.string().min(1, 'Department name is required'),
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
    
    const numStr = num.toFixed(2);
    const [rupees, paisa] = numStr.split('.').map(Number);

    let rupeesInWords = '';
    if (rupees > 0) {
        let n = rupees;
        rupeesInWords += n >= 10000000 ? inWords(Math.floor(n / 10000000)) + 'crore ' : '';
        n %= 10000000;
        rupeesInWords += n >= 100000 ? inWords(Math.floor(n / 100000)) + 'lakh ' : '';
        n %= 100000;
        rupeesInWords += n >= 1000 ? inWords(Math.floor(n / 1000)) + 'thousand ' : '';
        n %= 1000;
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

const getShortLabel = (product: Product): string => {
  return `${product.model} | ${product.processor} | ${product.memory}`;
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

  const lineItems = form.watch('lineItems');
  const watchedSubject = form.watch('subject');
  const watchedCustomer = form.watch('customerName');
  const watchedCompany = form.watch('companyName');
  const watchedAddress = form.watch('address');

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
      p.processor.toLowerCase().includes(q) ||
      p.memory.toLowerCase().includes(q) ||
      p.gfx.toLowerCase().includes(q) ||
      p.os.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const handleAddProduct = () => {
    if (selectedProduct) {
      append({ product: selectedProduct, quantity: 1, unitPrice: selectedProduct.price });
      setSelectedProduct(null);
      setSearchQuery('');
    }
  };

  const handleAddManualProduct = () => {
      if (!manualModel) {
          toast({ variant: 'destructive', title: 'Error', description: 'Product name is required.' });
          return;
      }
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
          price: manualPrice,
          gstRate: 18,
      };
      append({ product: customProduct, quantity: manualQty, unitPrice: manualPrice });
      setManualModel('');
      setManualSpec('');
      setManualPrice(0);
      setManualQty(1);
      toast({ title: 'Success', description: 'Custom item added.' });
  };

  const handleGenerateBody = () => {
    if (!watchedSubject) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter a subject first.' });
        return;
    }
    startTransition(async () => {
        try {
            const result = await generateLetterBody({
                subject: watchedSubject,
                customerName: watchedCustomer,
                companyName: watchedCompany,
                address: watchedAddress,
            });
            form.setValue('letterBody', result.letterBody);
            toast({ title: 'Success', description: 'AI generated letter body.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'AI Generation Failed', description: error.message });
        }
    });
  };
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('quotation-content-root');
    if (!element) return;
    setIsDownloading(true);
    try {
        const html2pdf = (await import('html2pdf.js')).default;
        const opt = {
            margin: 0,
            filename: `Quotation_DeeQasa_${format(new Date(), 'dd-MM-yyyy')}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        await html2pdf().set(opt).from(element).save();
    } catch (error: any) {
        console.error('PDF Generation Error:', error);
    } finally {
        setIsDownloading(false);
    }
  };

  const totals = useMemo(() => {
    const subTotal = lineItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const totalGst = subTotal * 0.18;
    const grandTotal = subTotal + totalGst;
    return { subTotal, totalGst, grandTotal };
  }, [lineItems]);
  
  const grandTotalInWords = useMemo(() => numberToWords(totals.grandTotal), [totals.grandTotal]);

  const QuotationHeader = () => (
    <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-200">
        <img src="/hp-logo.png" alt="HP Logo" style={{ height: '16mm', width: 'auto' }} />
        <div className="text-right">
            <h2 className="text-[16pt] font-bold text-gray-900 uppercase leading-tight">M/s DeeQasa-Tech</h2>
            <p className="text-[9pt] text-gray-600 mt-1">Authorized HP Enterprise Partner</p>
            <p className="text-[9pt] text-gray-500">Mohali, Punjab | GSTIN: 03ABCDE1234F1Z5</p>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-8 p-4 sm:p-6 md:p-8 max-w-full mx-auto items-start min-h-screen bg-background font-body">
      <Card className="w-full xl:max-w-md flex-shrink-0 no-print z-30 shadow-2xl border-primary/20 bg-card/50 backdrop-blur-md">
          <div className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                  <Sparkles size={24} /> Quotation Studio
              </CardTitle>
              <CardDescription>Draft official IT proposals.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-2 border-b border-primary/20 pb-2 flex items-center gap-2">
                        <Check className="text-primary h-4 w-4" /> Customer Details
                    </h3>
                    <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem><FormLabel>Attention To*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                        <FormItem><FormLabel>Organization*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Address*</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                         <h3 className="font-semibold text-lg flex items-center gap-2"><Sparkles size={16} /> Letter Content</h3>
                         <Button type="button" variant="outline" size="sm" onClick={handleGenerateBody} disabled={isGenerating}>
                             {isGenerating ? <LineLoader className="w-12 h-0.5" /> : <Sparkles size={14} className="mr-1" />} AI Write
                         </Button>
                    </div>
                    <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem><FormLabel>Subject Line*</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="letterBody" render={({ field }) => (
                        <FormItem><FormLabel>Letter Body*</FormLabel><FormControl><Textarea rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                         <h3 className="font-semibold text-lg flex items-center gap-2"><Plus size={16} /> Item Master</h3>
                         <div className="flex items-center gap-2">
                             <Label htmlFor="manual-mode" className="text-xs">Manual</Label>
                             <Switch id="manual-mode" checked={isManualMode} onCheckedChange={setIsManualMode} />
                         </div>
                    </div>

                    {!isManualMode ? (
                        <div className="flex flex-col gap-3">
                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between font-normal h-12 bg-secondary/20">
                                        <span className="truncate">{selectedProduct ? getShortLabel(selectedProduct) : "Search HP Products..."}</span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command shouldFilter={false}>
                                        <CommandInput placeholder="Search SKU..." value={searchQuery} onValueChange={setSearchQuery} />
                                        <CommandList>
                                            {isLoadingProducts && <div className="p-4"><LineLoader /></div>}
                                            <CommandEmpty>No products found.</CommandEmpty>
                                            <CommandGroup>
                                                {filteredProducts.slice(0, 30).map((product) => (
                                                <CommandItem key={product.id} onSelect={() => { setSelectedProduct(product); setOpenCombobox(false); }}>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-xs">{product.model}</span>
                                                        <span className="text-[10px] truncate">{getLongDescription(product)}</span>
                                                    </div>
                                                </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Button type="button" className="w-full" onClick={handleAddProduct} disabled={!selectedProduct}>Add Product</Button>
                        </div>
                    ) : (
                        <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-primary/10">
                            <Input value={manualModel} onChange={(e) => setManualModel(e.target.value)} placeholder="Model Name*" />
                            <Textarea value={manualSpec} onChange={(e) => setManualSpec(e.target.value)} placeholder="Specifications*" />
                            <div className="grid grid-cols-2 gap-3">
                                <Input type="number" value={manualPrice} onChange={(e) => setManualPrice(Number(e.target.value))} placeholder="Price" />
                                <Input type="number" value={manualQty} onChange={(e) => setManualQty(Number(e.target.value))} placeholder="Qty" />
                            </div>
                            <Button type="button" className="w-full" onClick={handleAddManualProduct}>Add Manual Item</Button>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-3 bg-secondary/30">
                             <div className="flex justify-between">
                                <p className="font-bold text-[10px] uppercase text-primary truncate">{field.product.model}</p>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => remove(index)}><Trash2 size={12}/></Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[9px]">Qty</FormLabel><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name={`lineItems.${index}.unitPrice`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[9px]">Price (₹)</FormLabel><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                                )} />
                            </div>
                        </Card>
                    ))}
                </div>
              </div>
            </Form>
          </div>
      </Card>

      <div className="flex-1 w-full flex flex-col items-center">
        <div className="sticky top-20 right-0 p-4 no-print z-20 w-full flex justify-end gap-3 max-w-[210mm]">
            <Button onClick={handleDownloadPdf} size="lg" disabled={isDownloading} className="bg-accent text-white font-bold rounded-full shadow-lg">
                {isDownloading ? <LineLoader className="w-16 h-0.5" /> : <><Download size={20} className="mr-2" /> Download PDF</>}
            </Button>
            <Button onClick={handlePrint} size="lg" className="bg-primary text-black font-bold rounded-full shadow-lg">
                <Printer size={20} className="mr-2" /> Print
            </Button>
        </div>
        
        <div id="quotation-content-root" className="w-full flex flex-col items-center bg-muted/10 p-8 shadow-inner overflow-visible">
            {/* PAGE 1: COVERING LETTER */}
            <div className="quotation-page mb-8">
                <QuotationHeader />

                <div className="text-[11.5pt] leading-relaxed space-y-10 text-gray-800">
                    <div className="flex justify-between items-start">
                        <div className="left-aligned-text font-medium space-y-1">
                            <p className="font-bold text-gray-900">To,</p>
                            <p className="uppercase font-bold">{watchedCustomer}</p>
                            <p>{watchedCompany}</p>
                            <p>{watchedAddress}</p>
                        </div>
                        <div className="text-right font-bold space-y-1 text-gray-700">
                            <p>Ref: DQT/2024/{format(new Date(), 'MM/yy')}</p>
                            <p>Date: {format(new Date(), 'dd-MM-yyyy')}</p>
                        </div>
                    </div>

                    <div className="font-bold left-aligned-text py-2">
                        <p><span className="underline uppercase mr-2">Subject:</span> {watchedSubject}</p>
                    </div>

                    <div className="space-y-6">
                        <p className="font-bold text-gray-900">Respected Sir/Madam,</p>
                        <div className="justified-text whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {form.watch('letterBody')}
                        </div>
                    </div>

                    <div className="space-y-6 pt-10">
                        <p className="font-bold underline uppercase text-[10pt] text-gray-900">Commercial Terms & Conditions:</p>
                        <div className="justified-text space-y-3 text-[10.5pt] text-gray-700">
                          <p>• <strong>Taxes:</strong> GST at the rate of 18% extra over quoted prices.</p>
                          <p>• <strong>Delivery:</strong> 4 to 6 weeks from receipt of official Purchase Order.</p>
                          <p>• <strong>Validity:</strong> 7 days from the date of issuance of this quotation.</p>
                          <p>• <strong>Warranty:</strong> Comprehensive OEM onsite warranty and technical support.</p>
                        </div>
                    </div>

                    <div className="pt-20 flex justify-end">
                        <div className="text-right space-y-16">
                            <p className="font-bold uppercase text-gray-900">For M/s DeeQasa-Tech</p>
                            <div className="pt-2 font-bold px-4 uppercase text-[10pt] text-gray-800 border-t border-gray-300">Authorized Signatory</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAGE 2: TECHNICAL QUOTATION */}
            <div className="quotation-page">
                <QuotationHeader />
                
                <div className="mb-8 text-center py-2 font-bold uppercase text-[12pt] border-y border-gray-200 tracking-widest text-gray-900">
                  Technical & Commercial Quotation
                </div>

                <table className="locked-table">
                    <thead>
                        <tr className="uppercase">
                            <th className="col-sr">Sr.</th>
                            <th className="col-desc">Technical Specifications</th>
                            <th className="col-qty">Qty</th>
                            <th className="col-price">Unit Price (₹)</th>
                            <th className="col-total">Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineItems.map((item, index) => (
                            <tr key={index}>
                                <td className="col-sr font-bold text-gray-600">{index + 1}</td>
                                <td className="col-desc">
                                    <p className="font-bold mb-1 uppercase leading-tight text-gray-900">{item.product.model}</p>
                                    <div className="text-[9.5pt] justified-text text-gray-600 leading-normal">{getLongDescription(item.product)}</div>
                                </td>
                                <td className="col-qty font-bold text-center">{item.quantity}</td>
                                <td className="col-price text-right">{CURRENCY_FORMATTER.format(item.unitPrice)}</td>
                                <td className="col-total font-bold text-right">{CURRENCY_FORMATTER.format(item.unitPrice * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="keep-together mt-0">
                    <table className="locked-table border-t-0">
                        <TableBody>
                            <TableRow className="bg-gray-50/30">
                                <TableCell colSpan={4} className="text-right uppercase tracking-wider font-semibold border-r border-gray-200" style={{ width: '79%' }}>Sub Total (Excl. GST)</TableCell>
                                <TableCell className="text-right font-bold" style={{ width: '21%' }}>{CURRENCY_FORMATTER.format(totals.subTotal)}</TableCell>
                            </TableRow>
                            <TableRow className="bg-gray-50/30">
                                <TableCell colSpan={4} className="text-right uppercase tracking-wider font-semibold border-r border-gray-200" style={{ width: '79%' }}>GST @ 18% Extra</TableCell>
                                <TableCell className="text-right font-bold" style={{ width: '21%' }}>{CURRENCY_FORMATTER.format(totals.totalGst)}</TableCell>
                            </TableRow>
                            <TableRow className="font-bold text-[12pt] bg-gray-100">
                                <TableCell colSpan={4} className="text-right uppercase tracking-widest border-r border-gray-300" style={{ width: '79%' }}>Grand Total</TableCell>
                                <TableCell className="text-right font-bold text-gray-900" style={{ width: '21%' }}>{CURRENCY_FORMATTER.format(totals.grandTotal)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </table>

                    <div className="mt-8 p-4 border-l-4 border-gray-300 bg-gray-50 flex flex-col justify-center">
                        <p className="font-bold text-[8.5pt] uppercase tracking-widest text-gray-500 mb-1">Amount In Words:</p>
                        <p className="italic text-[11pt] font-bold text-gray-800">{grandTotalInWords}</p>
                    </div>

                    <div className="mt-12 flex justify-between items-end gap-10">
                        <div className="p-4 bg-gray-50 rounded-sm border-l-2 border-gray-200 max-w-md">
                            <p className="font-bold underline uppercase mb-3 text-[9pt] text-gray-700">Bank Account Details:</p>
                            <div className="space-y-1 font-bold text-[9pt] text-gray-600">
                              <p><span className="text-gray-400 mr-2">Beneficiary:</span> DeeQasa-Tech</p>
                              <p><span className="text-gray-400 mr-2">Bank:</span> HDFC Bank Ltd.</p>
                              <p><span className="text-gray-400 mr-2">Branch:</span> Sector 70, Mohali</p>
                              <p><span className="text-gray-400 mr-2">A/c No:</span> 50200067215432</p>
                              <p><span className="text-gray-400 mr-2">IFSC:</span> HDFC0000000</p>
                            </div>
                        </div>
                        <div className="text-right space-y-16 flex-shrink-0">
                             <p className="font-bold uppercase text-gray-900">For M/s DeeQasa-Tech</p>
                             <div className="pt-2 font-bold text-center uppercase text-[10pt] text-gray-800 border-t border-gray-300 px-6">Authorized Signatory</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
