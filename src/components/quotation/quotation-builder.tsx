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
import { Product, ProductSchema } from '@/lib/quotation-schemas';
import { Check, ChevronsUpDown, Plus, Trash2, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  companyName: z.string().optional(),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  lineItems: z.array(z.object({
      product: ProductSchema,
      quantity: z.coerce.number().min(1),
      discount: z.coerce.number().min(0).optional().default(0),
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
      gstNumber: '',
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

  const handleAddProduct = () => {
    if (selectedProduct) {
      append({ product: selectedProduct, quantity: 1, discount: 0 });
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
    let subTotal = 0;
    let totalDiscount = 0;
    const gstAmounts: { [rate: number]: { taxable: number, amount: number } } = {};

    lineItems.forEach(item => {
        const itemSubTotal = item.product.price * item.quantity;
        const itemDiscount = (item.discount || 0) * item.quantity;
        subTotal += itemSubTotal;
        totalDiscount += itemDiscount;
        const taxableAmount = itemSubTotal - itemDiscount;
        const gstRate = item.product.gstRate;
        if (!gstAmounts[gstRate]) {
            gstAmounts[gstRate] = { taxable: 0, amount: 0 };
        }
        gstAmounts[gstRate].taxable += taxableAmount;
        gstAmounts[gstRate].amount += taxableAmount * (gstRate / 100);
    });

    const taxableValue = subTotal - totalDiscount;
    const totalGst = Object.values(gstAmounts).reduce((acc, val) => acc + val.amount, 0);
    const grandTotal = taxableValue + totalGst;

    return { subTotal, totalDiscount, taxableValue, gstAmounts, totalGst, grandTotal };
  }, [lineItems]);
  
  const grandTotalInWords = useMemo(() => numberToWords(totals.grandTotal), [totals.grandTotal]);

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
                            <FormItem><FormLabel>Customer Name*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="companyName" render={({ field }) => (
                            <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="gstNumber" render={({ field }) => (
                            <FormItem><FormLabel>GST Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                    </div>
                </div>
                
                <div>
                    <h3 className="font-semibold text-lg mb-4 border-b pb-2">Products</h3>
                    <div className="space-y-4">
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <Label>Select Product</Label>
                                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between font-normal">
                                            {selectedProduct ? selectedProduct.name : "Select product..."}
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
                                                        {product.name}
                                                    </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Button type="button" onClick={handleAddProduct} disabled={!selectedProduct}><Plus className="h-4 w-4" /></Button>
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
                                <FormField control={form.control} name={`lineItems.${index}.discount`} render={({ field }) => (
                                    <FormItem><FormLabel>Discount/unit</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
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
                        <h1 className="text-3xl font-bold">DEEQASA TECH</h1>
                        <p>Plot No. 7, 3rd Floor, Local Shopping Center, Masjid Moth,</p>
                        <p>Greater Kailash-II, New Delhi, Delhi 110048</p>
                        <p>Email: sales@deeqasa.tech</p>
                        <p className="font-bold">GSTIN: XXXXXXXXXXXXXXX</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-700 tracking-widest">QUOTATION</h2>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 mb-4">
                    <div className="border border-black p-2">
                        <p className="font-bold">To,</p>
                        <p className="font-bold">{form.watch('companyName') || form.watch('customerName')}</p>
                        <p>{form.watch('address')}</p>
                        <p>GSTIN: {form.watch('gstNumber')}</p>
                        <p>Kind Attn: {form.watch('customerName')}</p>
                    </div>
                    <div className="text-left border border-black p-2">
                         <p><span className="font-bold inline-block w-32">Quotation No:</span> Q-{format(new Date(), 'yyMMdd')}-001</p>
                         <p><span className="font-bold inline-block w-32">Date:</span> {format(new Date(), 'dd-MMM-yyyy')}</p>
                         <p><span className="font-bold inline-block w-32">Validity:</span> 30 Days</p>
                    </div>
                </section>
                
                <section>
                    <Table className="border-collapse border border-black">
                        <TableHeader>
                            <TableRow className="bg-gray-200">
                                <TableHead className="border border-black text-center w-12">Sr. No.</TableHead>
                                <TableHead className="border border-black">Description of Goods</TableHead>
                                <TableHead className="border border-black text-center">HSN Code</TableHead>
                                <TableHead className="border border-black text-right">Qty</TableHead>
                                <TableHead className="border border-black text-right">Rate</TableHead>
                                <TableHead className="border border-black text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell className="border border-black text-center">{index + 1}</TableCell>
                                    <TableCell className="border border-black">
                                        <p className="font-bold">{item.product.name}</p>
                                        <div className="text-gray-700 text-xs space-y-0.5 mt-1">
                                            {item.product.processor && <p>Processor: {item.product.processor}</p>}
                                            {item.product.memory && <p>Memory: {item.product.memory}</p>}
                                            {item.product.storage && <p>Storage: {item.product.storage}</p>}
                                            {item.product.gpu && <p>GPU: {item.product.gpu}</p>}
                                            {item.product.os && <p>OS: {item.product.os}</p>}
                                            {item.product.warranty && <p>Warranty: {item.product.warranty}</p>}
                                            {item.product.id && <p>SKU: {item.product.id}</p>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="border border-black text-center">8471</TableCell>
                                    <TableCell className="border border-black text-right">{item.quantity}</TableCell>
                                    <TableCell className="border border-black text-right">{CURRENCY_FORMATTER.format(item.product.price)}</TableCell>
                                    <TableCell className="border border-black text-right font-bold">{CURRENCY_FORMATTER.format(item.product.price * item.quantity)}</TableCell>
                                </TableRow>
                            ))}
                             {fields.length === 0 && (
                                <TableRow><TableCell colSpan={6} className="text-center h-48 border border-black">No items added.</TableCell></TableRow>
                            )}
                            <TableRow>
                                <TableCell colSpan={5} className="border border-black text-right font-bold">Sub Total</TableCell>
                                <TableCell className="border border-black text-right font-bold">{CURRENCY_FORMATTER.format(totals.subTotal)}</TableCell>
                            </TableRow>
                            {totals.totalDiscount > 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="border border-black text-right font-bold">Discount</TableCell>
                                    <TableCell className="border border-black text-right font-bold">{CURRENCY_FORMATTER.format(totals.totalDiscount)}</TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell colSpan={5} className="border border-black text-right font-bold">Taxable Value</TableCell>
                                <TableCell className="border border-black text-right font-bold">{CURRENCY_FORMATTER.format(totals.taxableValue)}</TableCell>
                            </TableRow>
                            {Object.entries(totals.gstAmounts).map(([rate, {taxable, amount}]) => (
                                <TableRow key={rate}>
                                    <TableCell colSpan={5} className="border border-black text-right font-bold">Output GST @{rate}%</TableCell>
                                    <TableCell className="border border-black text-right font-bold">{CURRENCY_FORMATTER.format(amount)}</TableCell>
                                </TableRow>
                            ))}
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
                                <li>50% advance payment, 50% on delivery.</li>
                                <li>Delivery within 2 weeks of advance payment.</li>
                                <li>Warranty: 1 year standard manufacturer warranty as per OEM.</li>
                                <li>This is a computer generated quotation and does not require a signature.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold underline mb-2">Bank Details:</h4>
                            <p>Bank Name: HDFC BANK</p>
                            <p>Account Name: DEEQASA TECH</p>
                            <p>Account No: XXXXXXXXXXXXX</p>
                            <p>IFSC Code: HDFC0000XXX</p>
                        </div>
                    </div>
                    <div className="mt-16 text-right">
                        <p className="font-bold">For Deeqasa Tech</p>
                        <div className="h-16"></div>
                        <p>Authorized Signatory</p>
                    </div>
                </footer>
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}
