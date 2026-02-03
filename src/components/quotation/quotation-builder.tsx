'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { type Product, ProductSchema } from '@/lib/quotation-schemas';
import { Check, ChevronsUpDown, Plus, Trash2, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  companyName: z.string().optional(),
  address: z.string().optional(),
  subject: z.string().min(1, 'Subject is required.'),
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
  return `${product.id} | ${product.processor} | ${product.memory}`;
};

export function QuotationBuilder() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      customerName: '',
      companyName: '',
      address: '',
      subject: '',
      lineItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const lineItems = form.watch('lineItems');

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
  
  const handlePrint = () => {
    if(!form.formState.isValid) {
        form.trigger();
        toast({ variant: 'destructive', title: 'Form is invalid', description: 'Please fill all required fields and add at least one product.'});
        return;
    }
    window.print();
  };

  const totals = useMemo(() => {
    const subTotal = lineItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const totalGst = subTotal * 0.18;
    const grandTotal = subTotal + totalGst;

    return { subTotal, totalGst, grandTotal };
  }, [lineItems]);
  
  const grandTotalInWords = useMemo(() => numberToWords(totals.grandTotal), [totals.grandTotal]);
  const quotationNumber = useMemo(() => `DQT/HPC-001 / ${format(new Date(), 'dd-MM-yyyy')}`, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto items-start">
      {/* ===== CONTROLS PANEL ===== */}
      <Card className="w-full md:max-w-md lg:max-w-lg flex-shrink-0 no-print sticky top-24">
          <div className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle>Quotation Builder</CardTitle>
              <CardDescription>Configure your quotation using the live Product Master.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-4 border-b pb-2">Customer Details</h3>
                    <div className="space-y-4">
                        <FormField control={form.control} name="customerName" render={({ field }) => (
                            <FormItem><FormLabel>Attention To*</FormLabel><FormControl><Input {...field} placeholder="e.g., Mr. John Doe" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="companyName" render={({ field }) => (
                            <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Acme Corporation" /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea rows={3} {...field} placeholder="Company Address" /></FormControl></FormItem>
                        )} />
                         <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem><FormLabel>Subject*</FormLabel><FormControl><Input {...field} placeholder="e.g., Quotation for HP Workstation & Display" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>
                
                <div>
                    <h3 className="font-semibold text-lg mb-4 border-b pb-2">Products</h3>
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Label>Select Product</Label>
                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between font-normal">
                                        <span className="truncate">
                                            {selectedProduct ? getShortLabel(selectedProduct) : "Search products..."}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command shouldFilter={false}>
                                        <CommandInput 
                                          placeholder="Type model, SKU, or specs..." 
                                          value={searchQuery}
                                          onValueChange={setSearchQuery}
                                        />
                                        <CommandList>
                                            {isLoadingProducts && <div className="p-4 text-center text-sm">Loading Product Master...</div>}
                                            <CommandEmpty>No products found for "{searchQuery}"</CommandEmpty>
                                            <CommandGroup>
                                                {filteredProducts.slice(0, 50).map((product) => (
                                                <CommandItem
                                                    key={product.id}
                                                    value={product.name}
                                                    onSelect={() => {
                                                        setSelectedProduct(product);
                                                        setOpenCombobox(false);
                                                    }}>
                                                    <Check className={cn("mr-2 h-4 w-4", selectedProduct?.id === product.id ? "opacity-100" : "opacity-0")}/>
                                                    <span className="truncate" title={product.name}>
                                                        {getShortLabel(product)}
                                                    </span>
                                                </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Button type="button" className="w-full" onClick={handleAddProduct} disabled={!selectedProduct}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add to Quotation
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-3 bg-secondary/50 border-primary/20">
                             <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pr-4">
                                    <p className="font-semibold text-sm truncate">{field.product.model}</p>
                                    <p className="text-[10px] text-muted-foreground line-clamp-2">{getLongDescription(field.product)}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-xs">Qty</FormLabel><FormControl><Input type="number" {...field} className="h-8" /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name={`lineItems.${index}.unitPrice`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-xs">Unit Price (₹)</FormLabel><FormControl><Input type="number" {...field} className="h-8" /></FormControl></FormItem>
                                )} />
                            </div>
                        </Card>
                    ))}
                </div>
              </form>
            </Form>
          </div>
      </Card>

      {/* ===== PREVIEW PANEL (A4 Sized) ===== */}
      <div className="flex-1 relative">
        <div className="sticky top-20 right-0 p-4 no-print z-10 flex justify-end">
            <Button onClick={handlePrint} size="lg" className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
            </Button>
        </div>
        <div id="quotation-preview" className="bg-white rounded-sm shadow-2xl p-12 text-black mx-auto" style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '11pt', minHeight: '1123px', width: '800px' }}>
            
            {/* HEADER SECTION */}
            <header className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-[70px] w-auto">
                        <img src="/hp-logo.png" alt="HP Partner Logo" className="h-full w-auto object-contain" />
                    </div>
                    <div className="text-right flex-1 ml-4">
                        <h1 className="text-[12pt] font-bold tracking-tight text-gray-900 uppercase">QUOTATION (THESE PRICES ARE VALID TILL 7 DAYS)</h1>
                    </div>
                </div>
                <div className="border-b-[1.5px] border-black" />
            </header>

            {/* COMPANY DETAILS SECTION */}
            <section className="mb-8 flex justify-between">
                <div className="max-w-[60%]">
                    <h2 className="text-[14pt] font-bold mb-1 leading-tight">M/s DeeQasa-Tech</h2>
                    <div className="text-[10pt] leading-snug text-gray-800">
                        <p>SCO 105–106, 1st Floor, Jubilee Walk, Sector 70</p>
                        <p>SAS Nagar, Mohali, Punjab</p>
                        <p>Phone: 8595270950</p>
                        <p className="font-bold mt-1">GST No: 03EPIPK0093E1Z7</p>
                    </div>
                </div>
                <div className="text-right text-[9pt] text-gray-500 italic mt-auto">
                    HP Authorized Business Partner
                </div>
            </section>

            {/* INFO BOXES SECTION */}
            <section className="grid grid-cols-2 gap-0 mb-6 border-t border-l border-black">
                <div className="border-r border-b border-black p-4 flex flex-col min-h-[130px]">
                    <p className="font-bold text-[9pt] uppercase mb-2 text-gray-600">To,</p>
                    <p className="font-bold text-[11pt] mb-1 leading-tight">{form.watch('companyName') || form.watch('customerName') || 'Client Name'}</p>
                    <p className="whitespace-pre-line text-[10pt] mb-3 leading-snug">{form.watch('address') || 'Client Address'}</p>
                    <div className="mt-auto">
                        <p className="text-[10pt]"><span className="font-bold">Kind Attn:</span> {form.watch('customerName') || 'N/A'}</p>
                    </div>
                </div>
                <div className="border-r border-b border-black p-4 flex flex-col justify-center bg-gray-50/30">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10pt]">
                            <span className="font-bold">Quotation No:</span>
                            <span>{quotationNumber}</span>
                        </div>
                        <div className="flex justify-between text-[10pt]">
                            <span className="font-bold">Date:</span>
                            <span>{format(new Date(), 'dd-MM-yyyy')}</span>
                        </div>
                        <div className="flex justify-between text-[10pt]">
                            <span className="font-bold">Validity:</span>
                            <span>7 Days</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SUBJECT SECTION */}
            <section className="mb-6 py-1">
                <p className="text-[11pt] leading-tight"><span className="font-bold">Subject:</span> {form.watch('subject') || 'Quotation for IT Hardware'}</p>
            </section>
            
            {/* PRODUCT TABLE SECTION */}
            <section className="mb-8">
                <Table className="border-collapse border border-black w-full text-[10pt]">
                    <TableHeader>
                        <TableRow className="bg-gray-100 hover:bg-gray-100 border-none">
                            <TableHead className="border border-black text-center w-12 text-black font-bold h-10 py-2">Sr. No.</TableHead>
                            <TableHead className="border border-black text-black font-bold h-10 py-2">Description</TableHead>
                            <TableHead className="border border-black text-center text-black font-bold w-32 h-10 py-2">Make/Model</TableHead>
                            <TableHead className="border border-black text-right text-black font-bold w-12 h-10 py-2">Qty</TableHead>
                            <TableHead className="border border-black text-right text-black font-bold w-32 h-10 py-2">Unit Price (₹)</TableHead>
                            <TableHead className="border border-black text-right text-black font-bold w-32 h-10 py-2">Total (₹)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lineItems.map((item, index) => (
                            <TableRow key={index} className="hover:bg-transparent border-none">
                                <TableCell className="border border-black text-center py-4">{index + 1}</TableCell>
                                <TableCell className="border border-black py-4 px-3">
                                    <p className="font-bold mb-1 text-[10.5pt]">{item.product.model}</p>
                                    <p className="leading-snug text-gray-700 text-[9.5pt]">{getLongDescription(item.product)}</p>
                                </TableCell>
                                <TableCell className="border border-black text-center py-4 font-bold text-[10pt]">{item.product.model}</TableCell>
                                <TableCell className="border border-black text-right py-4">{item.quantity}</TableCell>
                                <TableCell className="border border-black text-right py-4">{CURRENCY_FORMATTER.format(item.unitPrice)}</TableCell>
                                <TableCell className="border border-black text-right py-4 font-bold">{CURRENCY_FORMATTER.format(item.unitPrice * item.quantity)}</TableCell>
                            </TableRow>
                        ))}
                         {lineItems.length === 0 && (
                            <TableRow className="border-none">
                                <TableCell colSpan={6} className="text-center h-48 border border-black italic text-gray-400">Please add products to generate preview.</TableCell>
                            </TableRow>
                        )}
                        <TableRow className="hover:bg-transparent border-none">
                            <TableCell colSpan={5} className="border border-black text-right font-bold py-2 px-3">Sub Total</TableCell>
                            <TableCell className="border border-black text-right font-bold py-2 px-3">{CURRENCY_FORMATTER.format(totals.subTotal)}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-transparent border-none">
                            <TableCell colSpan={5} className="border border-black text-right font-bold py-2 px-3">GST @18%</TableCell>
                            <TableCell className="border border-black text-right font-bold py-2 px-3">{CURRENCY_FORMATTER.format(totals.totalGst)}</TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-100 hover:bg-gray-100 border-none">
                            <TableCell colSpan={5} className="border border-black text-right font-bold py-3 px-3 text-[12pt] uppercase tracking-wide">Grand Total</TableCell>
                            <TableCell className="border border-black text-right font-bold py-3 px-3 text-[12pt]">{CURRENCY_FORMATTER.format(totals.grandTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </section>

            {/* AMOUNT IN WORDS SECTION */}
            <div className="mb-8 p-4 border border-black bg-gray-50/50">
                <p className="font-bold text-[10pt]">Amount in Words: <span className="font-normal italic ml-2 text-gray-800">{grandTotalInWords}</span></p>
            </div>
            
            {/* FOOTER SECTION (TERMS & BANK) */}
            <footer className="text-[10pt]">
                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div>
                        <h4 className="font-bold underline mb-3 text-[10.5pt]">Terms & Conditions:</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-800 leading-snug">
                            <li>Delivery Period: Within 4–6 weeks after confirmation of order.</li>
                            <li>Warranty: As per manufacturer’s standard warranty.</li>
                            <li>Prices are valid for 7 days from the date of quotation.</li>
                        </ul>
                    </div>
                    <div className="bg-gray-50/50 p-5 border border-black rounded-sm">
                        <h4 className="font-bold underline mb-4 text-center text-[10.5pt]">Our Bank Details:</h4>
                        <div className="space-y-2 text-[9.5pt] leading-tight">
                          <p><span className="font-bold w-28 inline-block">Bank Name:</span> ICICI Bank</p>
                          <p><span className="font-bold w-28 inline-block">Account No:</span> 103205001866</p>
                          <p><span className="font-bold w-28 inline-block">IFSC Code:</span> ICIC0001032</p>
                          <p><span className="font-bold w-28 inline-block">Account Type:</span> Corporate Current</p>
                          <p><span className="font-bold w-28 inline-block">Website:</span> www.hpconnect.in</p>
                        </div>
                    </div>
                </div>
                
                {/* SIGNATURE SECTION */}
                <div className="mt-16 flex justify-between items-end">
                  <div className="text-[8pt] text-gray-400 italic max-w-[250px] leading-tight">
                    Note: This is a computer-generated quotation and does not require a physical signature for validity.
                  </div>
                  <div className="text-right">
                      <p className="font-bold text-[11pt] mb-1">For M/s DeeQasa-Tech</p>
                      <p className="font-bold text-gray-600 text-[9pt] mb-4">HPI Official Business Partner</p>
                      <div className="h-20 flex items-center justify-end">
                        <div className="border border-dashed border-gray-300 px-8 py-3 text-gray-300 italic rounded-sm text-[9pt]">
                          Seal & Signature
                        </div>
                      </div>
                      <p className="font-bold text-[10.5pt] mt-3">Authorized Signatory: Pratik Chaudhary</p>
                  </div>
                </div>
            </footer>
        </div>
      </div>
    </div>
  );
}
