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
import { ScrollArea } from '@/components/ui/scroll-area';
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

// Simple number to words converter for INR
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

const formatShortProductName = (product: Product): string => {
    if (!product) return '';
    const parts = [
        product.id, // SKU
        product.processor,
        product.memory,
    ];
    return parts.filter(Boolean).join(' | ');
};


export function QuotationBuilder() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
        const uniqueData = Array.from(
          productData.reduce((map, product) => {
            if (!map.has(product.id)) {
              map.set(product.id, product);
            }
            return map;
          }, new Map<string, (typeof productData)[0]>()).values()
        );
        setProducts(uniqueData);
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Failed to load products', description: error.message });
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchProducts();
  }, [toast]);

  const handleAddProduct = () => {
    if (selectedProduct) {
      append({ product: selectedProduct, quantity: 1, unitPrice: selectedProduct.price });
      setSelectedProduct(null);
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
    const gstRate = 18; // 18%
    const totalGst = subTotal * (gstRate / 100);
    const grandTotal = subTotal + totalGst;

    return { subTotal, totalGst, grandTotal };
  }, [lineItems]);
  
  const grandTotalInWords = useMemo(() => numberToWords(totals.grandTotal), [totals.grandTotal]);
  const quotationNumber = useMemo(() => `DQT/HPC-001 / ${format(new Date(), 'dd-MM-yyyy')}`, []);

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 p-4 sm:p-6 md:p-8">
      {/* ===== CONTROLS PANEL ===== */}
      <Card className="w-full md:max-w-md lg:max-w-lg flex-shrink-0 no-print">
        <ScrollArea className="h-full">
          <div className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle>Quotation Builder</CardTitle>
              <CardDescription>Fill in the details to generate a new quotation.</CardDescription>
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
                        <div className="space-y-2">
                            <div>
                                <Label>Select Product</Label>
                                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between font-normal truncate">
                                            {selectedProduct ? formatShortProductName(selectedProduct) : "Select product..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search product..." />
                                            <CommandList>
                                                {isLoadingProducts && <div className="p-4 text-center text-sm">Loading...</div>}
                                                <CommandEmpty>No product found.</CommandEmpty>
                                                <CommandGroup>
                                                    {products.map((product) => (
                                                    <CommandItem
                                                        key={product.id}
                                                        value={product.name}
                                                        onSelect={() => {
                                                            setSelectedProduct(product);
                                                            setOpenCombobox(false);
                                                        }}>
                                                        <Check className={cn("mr-2 h-4 w-4", selectedProduct?.id === product.id ? "opacity-100" : "opacity-0")}/>
                                                        <span className="truncate" title={product.name}>
                                                            {formatShortProductName(product)}
                                                        </span>
                                                    </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Button type="button" className="w-full" onClick={handleAddProduct} disabled={!selectedProduct}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Product
                            </Button>
                        </div>
                        {form.formState.errors.lineItems && <p className="text-sm font-medium text-destructive">{form.formState.errors.lineItems.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-3 bg-secondary/50">
                             <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{field.product.name}</p>
                                    <p className="text-xs text-muted-foreground">{CURRENCY_FORMATTER.format(field.product.price)} @ {field.product.gstRate}% GST</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field }) => (
                                    <FormItem><FormLabel>Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name={`lineItems.${index}.unitPrice`} render={({ field }) => (
                                    <FormItem><FormLabel>Unit Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )} />
                            </div>
                        </Card>
                    ))}
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </Card>

      {/* ===== PREVIEW PANEL ===== */}
      <div className="flex-1 overflow-auto relative">
        <div className="absolute top-0 right-0 p-4 no-print z-10">
            <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
            </Button>
        </div>
        <ScrollArea className="h-full bg-white rounded-lg shadow-lg">
            <div id="quotation-preview" className="p-8 text-black" style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '12pt'}}>
                <header className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
                    <div>
                        <h1 className="text-2xl font-bold">M/s DeeQasa-Tech</h1>
                        <p>SCO 105-106, 1st Floor, Jubilee Walk, Sector 70,</p>
                        <p>SAS Nagar, Mohali, Punjab</p>
                        <p>Phone: 8595270950</p>
                        <p className="font-bold">GST No: 03EPIPK0093E1Z7</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <h2 className="text-xl font-bold text-gray-700 tracking-wide">QUOTATION ( THESE PRICES ARE VALID TILL 7 DAYS )</h2>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 mb-4">
                    <div className="border border-black p-2">
                        <p className="font-bold">To,</p>
                        <p className="font-bold">{form.watch('companyName') || form.watch('customerName')}</p>
                        <p>{form.watch('address')}</p>
                        <p>Kind Attn: {form.watch('customerName')}</p>
                    </div>
                    <div className="text-left border border-black p-2">
                         <p><span className="font-bold inline-block w-32">Quotation No:</span> {quotationNumber}</p>
                         <p><span className="font-bold inline-block w-32">Date:</span> {format(new Date(), 'dd-MM-yyyy')}</p>
                    </div>
                </section>

                <section className="mb-4">
                    <p><span className="font-bold">Subject:</span> {form.watch('subject') || 'Quotation for IT Hardware'}</p>
                </section>
                
                <section>
                    <Table className="border-collapse border border-black">
                        <TableHeader>
                            <TableRow className="bg-gray-200">
                                <TableHead className="border border-black text-center w-12">Sr. No.</TableHead>
                                <TableHead className="border border-black">Description</TableHead>
                                <TableHead className="border border-black text-center">Make/Model</TableHead>
                                <TableHead className="border border-black text-right">Qty</TableHead>
                                <TableHead className="border border-black text-right">Unit Price (₹)</TableHead>
                                <TableHead className="border border-black text-right">Total (₹)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell className="border border-black text-center">{index + 1}</TableCell>
                                    <TableCell className="border border-black">
                                        <p className="font-bold">{item.product.name}</p>
                                    </TableCell>
                                    <TableCell className="border border-black text-center">{item.product.id}</TableCell>
                                    <TableCell className="border border-black text-right">{item.quantity}</TableCell>
                                    <TableCell className="border border-black text-right">{CURRENCY_FORMATTER.format(item.unitPrice)}</TableCell>
                                    <TableCell className="border border-black text-right font-bold">{CURRENCY_FORMATTER.format(item.unitPrice * item.quantity)}</TableCell>
                                </TableRow>
                            ))}
                             {fields.length === 0 && (
                                <TableRow><TableCell colSpan={6} className="text-center h-48 border border-black">No items added.</TableCell></TableRow>
                            )}
                            <TableRow>
                                <TableCell colSpan={5} className="border border-black text-right font-bold">Sub Total</TableCell>
                                <TableCell className="border border-black text-right font-bold">{CURRENCY_FORMATTER.format(totals.subTotal)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={5} className="border border-black text-right font-bold">GST @18%</TableCell>
                                <TableCell className="border border-black text-right font-bold">{CURRENCY_FORMATTER.format(totals.totalGst)}</TableCell>
                            </TableRow>
                            <TableRow className="bg-gray-200">
                                <TableCell colSpan={5} className="border border-black text-right font-bold">Grand Total</TableCell>
                                <TableCell className="border border-black text-right font-bold">{CURRENCY_FORMATTER.format(totals.grandTotal)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </section>
                
                <footer className="mt-8 text-xs">
                    <p className="font-bold">Amount in Words: <span className="font-normal">{grandTotalInWords}</span></p>
                    
                    <div className="mt-4 border-t-2 border-black pt-4 grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-bold underline mb-2">Terms & Conditions:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Delivery Period: Within 4–6 weeks after confirmation of order.</li>
                                <li>Warranty: As per manufacturer’s standard warranty.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold underline mb-2">Bank Details:</h4>
                            <p>Bank: ICICI Bank</p>
                            <p>Account Number: 103205001866</p>
                            <p>IFSC Code: ICIC0001032</p>
                            <p>Account Type: Corporate Current</p>
                            <p>Website: https://www.hpconnect.in</p>
                        </div>
                    </div>
                    <div className="mt-16 text-right">
                        <p className="font-bold">For M/s DeeQasa-Tech</p>
                        <p className="font-bold">HPI Official Business Partner</p>
                        <div className="h-16"></div>
                        <p>Authorized Signatory: Pratik Chaudhary</p>
                    </div>
                </footer>
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}
