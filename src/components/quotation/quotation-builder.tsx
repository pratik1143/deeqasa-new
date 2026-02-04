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
            toast({ title: 'Success', description: 'AI has generated a formal letter body.' });
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
    if (!element) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find quotation content for PDF generation.' });
        return;
    }

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
        toast({ title: 'Success', description: 'PDF has been downloaded successfully.' });
    } catch (error: any) {
        console.error('PDF Generation Error:', error);
        toast({ variant: 'destructive', title: 'PDF Generation Failed', description: 'An unexpected error occurred during download.' });
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

  return (
    <div className="flex flex-col xl:flex-row gap-8 p-4 sm:p-6 md:p-8 max-w-full mx-auto items-start min-h-screen bg-background">
      {/* ===== CONTROLS PANEL (NON-PRINTABLE) ===== */}
      <Card className="w-full xl:max-w-md flex-shrink-0 no-print z-30 shadow-2xl">
          <div className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-headline text-2xl text-primary">Quotation Studio</CardTitle>
              <CardDescription>Draft official IT proposals with AI assistance.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-2 border-b border-primary/20 pb-2 flex items-center gap-2">
                        <Check className="text-primary h-4 w-4" /> Customer Details
                    </h3>
                    <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem><FormLabel>Attention To*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                        <FormItem><FormLabel>Department / Organization*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Location / Address*</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                         <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Sparkles className="text-primary h-4 w-4" /> AI Covering Letter
                         </h3>
                         <Button type="button" variant="outline" size="sm" onClick={handleGenerateBody} disabled={isGenerating} className="rounded-full border-primary/30 hover:bg-primary/10">
                             {isGenerating ? <LineLoader className="w-12 h-0.5" /> : <><Sparkles size={14} className="mr-1" /> AI Write</>}
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
                    <h3 className="font-semibold text-lg border-b border-primary/20 pb-2 flex items-center gap-2">
                        <Plus className="text-primary h-4 w-4" /> Item Master
                    </h3>
                    <div className="flex flex-col gap-3">
                        <Label>Search & Add HP Products</Label>
                        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between font-normal h-12 bg-secondary/20">
                                    <span className="truncate">
                                        {selectedProduct ? getShortLabel(selectedProduct) : "Search HP Products..."}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 shadow-2xl" align="start">
                                <Command shouldFilter={false}>
                                    <CommandInput placeholder="Search SKU, Model, Processor..." value={searchQuery} onValueChange={setSearchQuery} />
                                    <CommandList>
                                        {isLoadingProducts && <div className="p-4 text-center text-sm"><LineLoader /></div>}
                                        <CommandEmpty>No products found.</CommandEmpty>
                                        <CommandGroup>
                                            {filteredProducts.slice(0, 50).map((product) => (
                                            <CommandItem key={product.id} onSelect={() => { setSelectedProduct(product); setOpenCombobox(false); }}>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-xs">{product.model}</span>
                                                    <span className="text-[10px] text-muted-foreground truncate">{getLongDescription(product)}</span>
                                                </div>
                                            </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <Button type="button" className="w-full bg-primary text-black hover:bg-primary/90 font-bold" onClick={handleAddProduct} disabled={!selectedProduct}>
                            <Plus className="h-4 w-4 mr-2" /> Add to Quote
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-3 bg-secondary/30 border-primary/10">
                             <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pr-4">
                                    <p className="font-bold text-[10px] uppercase text-primary tracking-wider">{field.product.model}</p>
                                    <p className="text-[9px] text-muted-foreground truncate mt-1">{getLongDescription(field.product)}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                                    <Trash2 className="h-3 w-3"/>
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[9px] uppercase">Qty</FormLabel><FormControl><Input type="number" {...field} className="h-8 text-xs bg-background" /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name={`lineItems.${index}.unitPrice`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[9px] uppercase">Unit Price (₹)</FormLabel><FormControl><Input type="number" {...field} className="h-8 text-xs bg-background" /></FormControl></FormItem>
                                )} />
                            </div>
                        </Card>
                    ))}
                </div>
              </form>
            </Form>
          </div>
      </Card>

      {/* ===== PREVIEW PANEL (A4 Portrait 210mm x 297mm) ===== */}
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="sticky top-20 right-0 p-4 no-print z-20 w-full flex justify-end gap-3 max-w-[210mm]">
            <Button onClick={handleDownloadPdf} size="lg" disabled={isDownloading} className="bg-accent text-white font-bold rounded-full shadow-lg shadow-accent/20">
                {isDownloading ? <LineLoader className="w-16 h-0.5" /> : <><Download className="mr-2 h-5 w-5" /> Download PDF</>}
            </Button>
            <Button onClick={handlePrint} size="lg" className="bg-primary text-black font-bold rounded-full shadow-lg shadow-primary/20">
                <Printer className="mr-2 h-5 w-5" /> Print Quotation
            </Button>
        </div>
        
        <div id="quotation-content-root" className="w-full flex flex-col items-center bg-muted/30 p-8">
            {/* PAGE 1: COVERING LETTER */}
            <div className="quotation-page">
                <div className="flex items-center gap-6 mb-12 border-b-2 border-black pb-6">
                    <img src="/hp-logo.png" alt="HP Logo" className="company-logo" style={{ height: '18mm', width: 'auto' }} />
                    <div className="pl-6 border-l-2 border-black">
                        <h2 className="text-[18pt] font-bold uppercase text-gray-900 tracking-tight leading-none">M/s DeeQasa-Tech</h2>
                        <p className="text-[9pt] text-gray-700 mt-2 font-medium">SCO 105–106, 1st Floor, Jubilee Walk, Sector 70, Mohali, Punjab</p>
                    </div>
                </div>

                <div className="text-[11.5pt] leading-relaxed text-gray-900 space-y-10">
                    <div className="flex justify-between items-start">
                        <div className="left-aligned-text font-medium space-y-1">
                            <p className="font-bold">To,</p>
                            <p className="uppercase">{watchedCustomer}</p>
                            <p>{watchedCompany}</p>
                            <p>{watchedAddress}</p>
                        </div>
                        <div className="text-right font-bold space-y-1">
                            <p>Ref: DQT/2024/{format(new Date(), 'MM/yy')}</p>
                            <p>Date: {format(new Date(), 'dd-MM-yyyy')}</p>
                        </div>
                    </div>

                    <div className="font-bold border-y border-black/10 py-3 left-aligned-text bg-gray-50/50 px-4">
                        <p><span className="underline uppercase tracking-wide mr-2">Subject:</span> {watchedSubject}</p>
                    </div>

                    <div className="space-y-4">
                        <p className="font-bold">Respected Sir/Madam,</p>
                        <div className="justified-text whitespace-pre-wrap leading-relaxed">
                            {form.watch('letterBody')}
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-black/5">
                        <p className="font-bold underline uppercase tracking-tight text-[10pt] bg-black text-white px-2 inline-block">Commercial Terms & Conditions:</p>
                        <div className="justified-text space-y-3 text-[10.5pt]">
                          <p>• <strong>Taxes:</strong> Goods & Services Tax (GST) at the rate of 18% shall be applicable extra over and above the quoted prices as per prevailing government norms.</p>
                          <p>• <strong>Delivery:</strong> The specified equipment shall be delivered, commissioned, and installed within a period of 4 to 6 weeks from the receipt of an official confirmed purchase order.</p>
                          <p>• <strong>Validity:</strong> This commercial proposal remains firm and valid for a period of 7 days from the date of issuance for your kind consideration.</p>
                          <p>• <strong>Warranty:</strong> All products supplied are backed by comprehensive OEM onsite warranty and professional technical support services.</p>
                        </div>
                    </div>

                    <div className="pt-20 flex justify-end">
                        <div className="text-right space-y-20">
                            <p className="font-bold uppercase tracking-widest text-gray-800">For M/s DeeQasa-Tech</p>
                            <div className="border-t-2 border-black pt-2 font-bold px-10 inline-block uppercase text-[10pt]">
                                Authorized Signatory
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAGE 2+: TECHNICAL QUOTATION */}
            <div className="quotation-page">
                <div className="flex items-center gap-6 mb-10 border-b-2 border-black pb-6">
                    <img src="/hp-logo.png" alt="HP Logo" className="company-logo" style={{ height: '18mm', width: 'auto' }} />
                    <div className="pl-6 border-l-2 border-black">
                        <h2 className="text-[18pt] font-bold uppercase text-gray-900 tracking-tight leading-none">M/s DeeQasa-Tech</h2>
                    </div>
                </div>
                
                <div className="mb-6 bg-black text-white text-center py-2 font-bold tracking-widest uppercase text-[12pt]">
                    Technical & Commercial Quotation
                </div>

                <table className="locked-table">
                    <thead>
                        <tr className="bg-gray-100 font-bold uppercase text-[9pt]">
                            <th className="col-sr">Sr.</th>
                            <th className="col-desc">Detailed Technical Specifications</th>
                            <th className="col-qty">Qty</th>
                            <th className="col-price">Unit Price (₹)</th>
                            <th className="col-total">Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineItems.map((item, index) => (
                            <tr key={index}>
                                <td className="col-sr font-bold">{index + 1}</td>
                                <td className="col-desc">
                                    <p className="font-bold mb-2 text-black text-[10.5pt] uppercase leading-tight">{item.product.model}</p>
                                    <div className="text-[9.5pt] text-gray-800 leading-relaxed font-medium justified-text">
                                        {getLongDescription(item.product)}
                                    </div>
                                </td>
                                <td className="col-qty font-bold text-[10.5pt]">{item.quantity}</td>
                                <td className="col-price font-medium">{CURRENCY_FORMATTER.format(item.unitPrice)}</td>
                                <td className="col-total font-bold">{CURRENCY_FORMATTER.format(item.unitPrice * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* TOTALS & FOOTER SECTION - LOCKED TOGETHER */}
                <div className="keep-together mt-0">
                    <table className="locked-table border-t-0">
                        <TableBody>
                            <TableRow className="font-bold border-t-0 bg-gray-50/50">
                                <TableCell colSpan={4} className="border-r border-black text-right py-3 px-4 uppercase tracking-wider" style={{ width: '79%' }}>Sub Total (Excl. GST)</TableCell>
                                <TableCell className="text-right py-3 px-4 font-bold" style={{ width: '21%' }}>{CURRENCY_FORMATTER.format(totals.subTotal)}</TableCell>
                            </TableRow>
                            <TableRow className="font-bold bg-gray-50/50">
                                <TableCell colSpan={4} className="border-r border-black text-right py-3 px-4 uppercase tracking-wider" style={{ width: '79%' }}>GST @ 18% Extra</TableCell>
                                <TableCell className="text-right py-3 px-4 font-bold" style={{ width: '21%' }}>{CURRENCY_FORMATTER.format(totals.totalGst)}</TableCell>
                            </TableRow>
                            <TableRow className="bg-gray-200 font-bold text-[12pt] border-t-2 border-black">
                                <TableCell colSpan={4} className="border-r border-black text-right py-4 px-4 uppercase tracking-widest" style={{ width: '79%' }}>Grand Total (All Incl.)</TableCell>
                                <TableCell className="text-right py-4 px-4 font-bold" style={{ width: '21%' }}>{CURRENCY_FORMATTER.format(totals.grandTotal)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </table>

                    <div className="mt-8 p-6 border-2 border-black bg-gray-50 flex items-center shadow-inner">
                        <p className="font-bold text-[9pt] uppercase shrink-0 mr-6 tracking-widest text-gray-600">Amount In Words:</p>
                        <p className="italic text-gray-900 text-[11pt] font-bold">{grandTotalInWords}</p>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-10 text-[9.5pt]">
                        <div className="space-y-4 border-2 border-black p-6 bg-gray-50/30">
                            <p className="font-bold underline uppercase tracking-widest mb-2 text-primary">Our Bank Account Details:</p>
                            <div className="space-y-2 font-bold text-gray-800">
                              <p><span className="text-gray-500 font-medium">Beneficiary Name:</span> DeeQasa-Tech</p>
                              <p><span className="text-gray-500 font-medium">Bank Name:</span> HDFC Bank Ltd.</p>
                              <p><span className="text-gray-500 font-medium">Branch:</span> Sector 70, Mohali, PB</p>
                              <p><span className="text-gray-500 font-medium">Current A/c No:</span> 50200067215432</p>
                              <p><span className="text-gray-500 font-medium">IFSC Code:</span> HDFC0000000</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end items-end pr-4">
                            <div className="text-right space-y-20">
                                 <p className="font-bold uppercase tracking-widest text-gray-800">For M/s DeeQasa-Tech</p>
                                 <div className="border-t-2 border-black w-60 inline-block pt-2 font-bold text-center uppercase tracking-tighter text-[10pt]">
                                    Authorized Signatory
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}