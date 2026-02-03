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
  return `${product.model} | ${product.processor} | ${product.memory}`;
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
                            <FormItem><FormLabel>Subject*</FormLabel><FormControl><Input {...field} placeholder="e.g., Quotation for HP Workstation" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>
                
                <div>
                    <h3 className="font-semibold text-lg mb-4 border-b pb-2">Products</h3>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3">
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
                                                    <span className="truncate text-xs" title={getShortLabel(product)}>
                                                        {getShortLabel(product)}
                                                    </span>
                                                </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Button type="button" className="w-full mt-2" onClick={handleAddProduct} disabled={!selectedProduct}>
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

      {/* ===== PREVIEW PANEL (WYSIWYG) ===== */}
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="sticky top-20 right-0 p-4 no-print z-10 w-full flex justify-end">
            <Button onClick={handlePrint} size="lg" className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full">
                <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
            </Button>
        </div>
        
        <div className="quotation-page">
            <header className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                    <img src="/hp-logo.png" alt="HP Logo" style={{ height: '18mm', width: 'auto' }} className="object-contain" />
                    <div className="company-details">
                        <h2 className="text-[14pt] font-bold uppercase tracking-tight text-gray-900">M/s DeeQasa-Tech</h2>
                        <div className="text-[9pt] leading-snug text-gray-700">
                            <p>SCO 105–106, 1st Floor, Jubilee Walk, Sector 70, SAS Nagar, Mohali, Punjab</p>
                            <p className="font-semibold">Phone: 8595270950 | GST No: 03EPIPK0093E1Z7</p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-[11pt] font-bold text-gray-900 uppercase">QUOTATION (VALID TILL 7 DAYS)</h1>
                    <p className="text-[9pt] mt-1 text-gray-600">No: {quotationNumber}</p>
                    <p className="text-[9pt] text-gray-600">Date: {format(new Date(), 'dd-MM-yyyy')}</p>
                </div>
            </header>
            
            <div className="border-b-2 border-black mb-6" />

            {/* Customer Details */}
            <section className="grid grid-cols-2 gap-8 mb-6 text-[10pt]">
                <div className="p-3 border border-gray-200 rounded">
                    <p className="font-bold text-gray-500 text-[8pt] uppercase mb-1">Attention To:</p>
                    <p className="font-bold text-[12pt] text-gray-900">{form.watch('customerName') || 'Client Name'}</p>
                    {form.watch('companyName') && <p className="font-semibold text-gray-800">{form.watch('companyName')}</p>}
                    <p className="whitespace-pre-line text-gray-700 mt-2">{form.watch('address') || 'Client Address'}</p>
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-gray-900"><span className="font-bold underline">Subject:</span> {form.watch('subject') || 'IT Solutions Quotation'}</p>
                </div>
            </section>
            
            {/* Products Table */}
            <section className="mb-6">
                <Table className="w-full text-[9pt]">
                    <TableHeader>
                        <TableRow className="bg-gray-100 hover:bg-gray-100">
                            <TableHead className="border border-black text-center w-10 text-black font-bold h-8">Sr.</TableHead>
                            <TableHead className="border border-black text-black font-bold h-8 px-2">Description</TableHead>
                            <TableHead className="border border-black text-center text-black font-bold w-32 h-8">Make/Model</TableHead>
                            <TableHead className="border border-black text-right text-black font-bold w-12 h-8 px-2">Qty</TableHead>
                            <TableHead className="border border-black text-right text-black font-bold w-32 h-8 px-2">Unit Price (₹)</TableHead>
                            <TableHead className="border border-black text-right text-black font-bold w-32 h-8 px-2">Total (₹)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lineItems.map((item, index) => (
                            <TableRow key={index} className="hover:bg-transparent">
                                <TableCell className="border border-black text-center py-2">{index + 1}</TableCell>
                                <TableCell className="border border-black py-2 px-2">
                                    <p className="font-bold mb-1 text-gray-900">{item.product.model}</p>
                                    <p className="leading-tight text-gray-600 text-[8.5pt]">{getLongDescription(item.product)}</p>
                                </TableCell>
                                <TableCell className="border border-black text-center py-2 font-semibold">{item.product.model}</TableCell>
                                <TableCell className="border border-black text-right py-2 px-2">{item.quantity}</TableCell>
                                <TableCell className="border border-black text-right py-2 px-2">{CURRENCY_FORMATTER.format(item.unitPrice)}</TableCell>
                                <TableCell className="border border-black text-right py-2 px-2 font-bold text-gray-900">{CURRENCY_FORMATTER.format(item.unitPrice * item.quantity)}</TableCell>
                            </TableRow>
                        ))}
                         {lineItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 border border-black italic text-gray-400">Add products to see preview.</TableCell>
                            </TableRow>
                        )}
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="border border-black text-right font-bold py-1 px-2">Sub Total</TableCell>
                            <TableCell className="border border-black text-right font-bold py-1 px-2">{CURRENCY_FORMATTER.format(totals.subTotal)}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="border border-black text-right font-bold py-1 px-2">GST @18%</TableCell>
                            <TableCell className="border border-black text-right font-bold py-1 px-2">{CURRENCY_FORMATTER.format(totals.totalGst)}</TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-100 hover:bg-gray-100">
                            <TableCell colSpan={5} className="border border-black text-right font-bold py-2 px-2 text-[10pt] uppercase">Grand Total</TableCell>
                            <TableCell className="border border-black text-right font-bold py-2 px-2 text-[10pt]">{CURRENCY_FORMATTER.format(totals.grandTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </section>

            <div className="totals-section">
                <div className="mb-6 p-3 border border-black bg-gray-50">
                    <p className="font-bold text-[9pt] text-gray-900">Amount in Words: <span className="font-normal italic ml-3 text-gray-700">{grandTotalInWords}</span></p>
                </div>
                
                <footer className="footer-section text-[9pt]">
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold underline mb-2">Terms & Conditions:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Delivery: Within 4–6 weeks after order.</li>
                                <li>Warranty: As per manufacturer’s policy.</li>
                                <li>Price Validity: 7 days from quotation date.</li>
                            </ul>
                        </div>
                        <div className="p-3 border border-black">
                            <h4 className="font-bold underline mb-2">Bank Details:</h4>
                            <div className="space-y-0.5 text-[8.5pt]">
                                <p><span className="font-bold w-24 inline-block">Bank:</span> ICICI Bank</p>
                                <p><span className="font-bold w-24 inline-block">Account:</span> 103205001866</p>
                                <p><span className="font-bold w-24 inline-block">IFSC:</span> ICIC0001032</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <div className="text-[8pt] text-gray-400 italic">
                            Computer generated. No signature required.
                        </div>
                        <div className="text-right">
                            <p className="font-bold mb-1">For M/s DeeQasa-Tech</p>
                            <p className="font-semibold text-gray-600 mb-8">Official Business Partner</p>
                            <p className="font-bold border-t border-gray-300 pt-1">Authorized Signatory: Pratik Chaudhary</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
      </div>
    </div>
  );
}