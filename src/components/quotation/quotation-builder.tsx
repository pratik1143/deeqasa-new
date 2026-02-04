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
      letterBody: 'With reference to the requirements for advanced computing and networking infrastructure, we are pleased to submit our formal quotation for the supply and installation of HP Enterprise Servers, Storage, Networking, and Video Conferencing solutions.',
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
    <div className="flex flex-col xl:flex-row gap-8 p-4 sm:p-6 md:p-8 max-w-full mx-auto items-start min-h-screen">
      {/* ===== CONTROLS PANEL (NON-PRINTABLE) ===== */}
      <Card className="w-full xl:max-w-md flex-shrink-0 no-print">
          <div className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle>Quotation Builder</CardTitle>
              <CardDescription>Configure your quotation using the live Product Master.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-2 border-b pb-2">Customer Details</h3>
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
                    <div className="flex justify-between items-center border-b pb-2">
                         <h3 className="font-semibold text-lg">Covering Letter</h3>
                         <Button type="button" variant="outline" size="sm" onClick={handleGenerateBody} disabled={isGenerating}>
                             {isGenerating ? <LineLoader className="w-12 h-0.5" /> : <><Sparkles size={14} /> AI Generate</>}
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
                    <h3 className="font-semibold text-lg border-b pb-2">Items Selector</h3>
                    <div className="flex flex-col gap-3">
                        <Label>Select Product</Label>
                        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between font-normal h-12">
                                    <span className="truncate">
                                        {selectedProduct ? getShortLabel(selectedProduct) : "Search HP Products..."}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                <Command shouldFilter={false}>
                                    <CommandInput placeholder="Search..." value={searchQuery} onValueChange={setSearchQuery} />
                                    <CommandList>
                                        {isLoadingProducts && <div className="p-4 text-center text-sm">Loading...</div>}
                                        <CommandEmpty>No products found.</CommandEmpty>
                                        <CommandGroup>
                                            {filteredProducts.slice(0, 50).map((product) => (
                                            <CommandItem key={product.id} onSelect={() => { setSelectedProduct(product); setOpenCombobox(false); }}>
                                                <span className="truncate text-xs">{getShortLabel(product)}</span>
                                            </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <Button type="button" className="w-full" onClick={handleAddProduct} disabled={!selectedProduct}>
                            <Plus className="h-4 w-4 mr-2" /> Add Item
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-3 bg-secondary/30">
                             <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pr-4">
                                    <p className="font-bold text-xs truncate">{field.product.model}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px]">Qty</FormLabel><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name={`lineItems.${index}.unitPrice`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px]">Price</FormLabel><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                                )} />
                            </div>
                        </Card>
                    ))}
                </div>
              </form>
            </Form>
          </div>
      </Card>

      {/* ===== PREVIEW PANEL (A4 Portrait 210mm Fixed Width) ===== */}
      <div className="flex-1 w-full flex flex-col items-center overflow-x-auto">
        <div className="sticky top-20 right-0 p-4 no-print z-20 w-full flex justify-end gap-3 max-w-[210mm]">
            <Button onClick={handleDownloadPdf} size="lg" disabled={isDownloading} className="bg-accent font-bold rounded-full">
                {isDownloading ? <LineLoader className="w-16 h-0.5" /> : <><Download className="mr-2 h-5 w-5" /> Download PDF</>}
            </Button>
            <Button onClick={handlePrint} size="lg" className="bg-primary font-bold rounded-full">
                <Printer className="mr-2 h-5 w-5" /> Print
            </Button>
        </div>
        
        <div id="quotation-content-root" className="w-full flex flex-col items-center">
            {/* Page 1: Covering Letter */}
            <div className="quotation-page">
                <div className="flex items-center gap-4 mb-10">
                    <img src="/hp-logo.png" alt="HP Logo" className="company-logo" style={{ height: '70px', width: 'auto' }} />
                    <div>
                        <h2 className="text-[16pt] font-bold uppercase text-gray-900">M/s DeeQasa-Tech</h2>
                        <p className="text-[10pt] text-gray-700">SCO 105–106, 1st Floor, Jubilee Walk, Sector 70, Mohali, Punjab</p>
                    </div>
                </div>
                
                <div className="border-b-2 border-black mb-10" />

                <div className="text-[11.5pt] leading-relaxed text-gray-900 space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">To,</p>
                            <p>{watchedCustomer}</p>
                            <p>{watchedCompany}</p>
                            <p>{watchedAddress}</p>
                        </div>
                        <div className="text-right">
                            <p><strong>Ref:</strong> DQT/2024/{format(new Date(), 'MM/yy')}</p>
                            <p><strong>Date:</strong> {format(new Date(), 'dd-MM-yyyy')}</p>
                        </div>
                    </div>

                    <div className="font-bold">
                        <p><span className="underline">Subject:</span> {watchedSubject}</p>
                    </div>

                    <div>
                        <p>Dear Sir/Madam,</p>
                        <div className="mt-4 whitespace-pre-wrap">
                            {form.watch('letterBody')}
                        </div>
                    </div>

                    <div>
                        <p className="font-bold underline mb-2">Commercial Terms & Conditions:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                            <li><strong>Taxes:</strong> GST at 18% is applicable extra as per actuals.</li>
                            <li><strong>Delivery:</strong> Within 4-6 weeks from official purchase order.</li>
                            <li><strong>Validity:</strong> Quotation remains valid for 7 days.</li>
                            <li><strong>Warranty:</strong> Comprehensive OEM onsite warranty as specified.</li>
                        </ul>
                    </div>

                    <div className="pt-20 flex justify-end">
                        <div className="text-right">
                            <p className="font-bold uppercase">For M/s DeeQasa-Tech</p>
                            <div className="mt-24 border-t-2 border-black pt-2 font-bold px-10">
                                Authorized Signatory
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page 2: Technical Table */}
            <div className="quotation-page mt-8">
                <div className="flex items-center gap-4 mb-10">
                    <img src="/hp-logo.png" alt="HP Logo" className="company-logo" style={{ height: '70px', width: 'auto' }} />
                    <div>
                        <h2 className="text-[16pt] font-bold uppercase text-gray-900">M/s DeeQasa-Tech</h2>
                    </div>
                </div>
                
                <div className="border-b-2 border-black mb-8" />

                <Table className="w-full text-[10pt] border border-black">
                    <TableHeader>
                        <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-black">
                            <TableHead className="border-r border-black text-center w-12 font-bold text-black">Sr.</TableHead>
                            <TableHead className="border-r border-black font-bold text-black">Technical Description</TableHead>
                            <TableHead className="border-r border-black text-center w-16 font-bold text-black">Qty</TableHead>
                            <TableHead className="border-r border-black text-right w-32 font-bold text-black">Unit Price (₹)</TableHead>
                            <TableHead className="text-right w-36 font-bold text-black">Total (₹)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lineItems.map((item, index) => (
                            <TableRow key={index} className="border-b border-black">
                                <TableCell className="border-r border-black text-center py-4">{index + 1}</TableCell>
                                <TableCell className="border-r border-black py-4 px-4 align-top">
                                    <p className="font-bold mb-1">{item.product.model}</p>
                                    <p className="text-[9pt] text-gray-700">{getLongDescription(item.product)}</p>
                                </TableCell>
                                <TableCell className="border-r border-black text-center py-4 font-bold">{item.quantity}</TableCell>
                                <TableCell className="border-r border-black text-right py-4 px-4">{CURRENCY_FORMATTER.format(item.unitPrice)}</TableCell>
                                <TableCell className="text-right py-4 px-4 font-bold">{CURRENCY_FORMATTER.format(item.unitPrice * item.quantity)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-black font-bold">
                            <TableCell colSpan={4} className="border-r border-black text-right py-2 px-4 uppercase">Sub Total</TableCell>
                            <TableCell className="text-right py-2 px-4">{CURRENCY_FORMATTER.format(totals.subTotal)}</TableCell>
                        </TableRow>
                        <TableRow className="border-t border-black font-bold">
                            <TableCell colSpan={4} className="border-r border-black text-right py-2 px-4 uppercase">GST @18%</TableCell>
                            <TableCell className="text-right py-2 px-4">{CURRENCY_FORMATTER.format(totals.totalGst)}</TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-100 border-t border-black font-bold text-[11pt]">
                            <TableCell colSpan={4} className="border-r border-black text-right py-3 px-4 uppercase">Grand Total</TableCell>
                            <TableCell className="text-right py-3 px-4">{CURRENCY_FORMATTER.format(totals.grandTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="mt-8 p-4 border border-black bg-gray-50 flex items-center">
                    <p className="font-bold text-[10pt] uppercase shrink-0 mr-4">In Words:</p>
                    <p className="italic text-gray-800 text-[10pt]">{grandTotalInWords}</p>
                </div>

                {/* Bank Details Section */}
                <div className="mt-12 grid grid-cols-2 gap-8 text-[10pt] page-break-inside-avoid">
                    <div className="space-y-2 border border-black p-4">
                        <p className="font-bold underline uppercase">Bank Account Details:</p>
                        <p><strong>Account Name:</strong> DeeQasa-Tech</p>
                        <p><strong>Bank Name:</strong> HDFC Bank Ltd.</p>
                        <p><strong>Branch:</strong> Sector 70, Mohali</p>
                        <p><strong>A/c No:</strong> 50200067215432</p>
                        <p><strong>IFSC Code:</strong> HDFC0000000</p>
                    </div>
                    <div className="flex flex-col justify-end items-end pr-4">
                        <div className="text-right">
                             <p className="font-bold uppercase mb-16">For M/s DeeQasa-Tech</p>
                             <div className="border-t border-black w-48 inline-block pt-1 font-bold text-center">
                                Authorized Signatory
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