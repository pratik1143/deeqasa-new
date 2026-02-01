'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

import { getProductData } from '@/ai/flows/get-product-data';
import type { Product } from '@/lib/quotation-schemas';
import { ProductSchema } from '@/lib/quotation-schemas';
import { Check, ChevronsUpDown, Plus, Trash2, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineLoader } from '../ui/line-loader';
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

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

export function QuotationBuilder() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const quotationRef = useRef(null);

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
    window.print();
  };

  const totals = useMemo(() => {
    let subTotal = 0;
    let totalDiscount = 0;
    const gstAmounts: { [rate: number]: number } = {};

    lineItems.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        const itemDiscount = (item.discount || 0) * item.quantity;
        subTotal += itemTotal;
        totalDiscount += itemDiscount;
        const taxableAmount = itemTotal - itemDiscount;
        const gstRate = item.product.gstRate;
        if (!gstAmounts[gstRate]) {
            gstAmounts[gstRate] = 0;
        }
        gstAmounts[gstRate] += taxableAmount * (gstRate / 100);
    });

    const taxableValue = subTotal - totalDiscount;
    const totalGst = Object.values(gstAmounts).reduce((acc, val) => acc + val, 0);
    const grandTotal = taxableValue + totalGst;

    return { subTotal, totalDiscount, taxableValue, gstAmounts, totalGst, grandTotal };
  }, [lineItems]);

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
              <form className="space-y-8">
                {/* Customer Details */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Customer Details</h3>
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
                <Separator />
                {/* Product Selection */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Products</h3>
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

                {/* Line Items Table (in controls) */}
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
                            <div className="flex gap-2 mt-2">
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
            <Button onClick={handlePrint} disabled={!form.formState.isValid}>
                <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
            </Button>
        </div>
        <ScrollArea className="h-full bg-background rounded-lg shadow-lg">
            <div ref={quotationRef} id="quotation-preview" className="p-8 md:p-12 text-sm">
                <header className="flex justify-between items-start mb-12 border-b pb-6 border-border">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground font-headline">DEEQASA TECH</h1>
                        <p className="text-muted-foreground">Plot No. 7, 3rd Floor, Local Shopping Center, Masjid Moth, Greater Kailash-II, New Delhi, Delhi 110048</p>
                        <p className="text-muted-foreground">GSTIN: XXXXXXXXXXXXXXX</p>
                    </div>
                    <h2 className="text-4xl font-bold text-muted-foreground font-headline tracking-widest">QUOTATION</h2>
                </header>

                <section className="grid grid-cols-2 gap-8 mb-12">
                    <div>
                        <p className="text-muted-foreground font-bold mb-2">BILL TO:</p>
                        <p className="font-semibold text-lg">{form.watch('companyName') || form.watch('customerName')}</p>
                        <p>{form.watch('customerName')}</p>
                        <p>{form.watch('address')}</p>
                        {form.watch('gstNumber') && <p>GST: {form.watch('gstNumber')}</p>}
                    </div>
                    <div className="text-right">
                        <div className="grid grid-cols-2">
                            <span className="font-bold">Quotation #:</span><span>Q-{format(new Date(), 'yyMMdd')}-001</span>
                            <span className="font-bold">Date:</span><span>{format(new Date(), 'PPP')}</span>
                            <span className="font-bold">Valid Until:</span><span>{format(new Date(new Date().setDate(new Date().getDate() + 30)), 'PPP')}</span>
                        </div>
                    </div>
                </section>
                
                <section>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Item Description</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Rate</TableHead>
                                <TableHead className="text-right">Discount</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-muted-foreground text-xs">{item.product.model}</p>
                                    </TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{CURRENCY_FORMATTER.format(item.product.price)}</TableCell>
                                    <TableCell className="text-right">{CURRENCY_FORMATTER.format(item.discount || 0)}</TableCell>
                                    <TableCell className="text-right font-semibold">{CURRENCY_FORMATTER.format(item.product.price * item.quantity - (item.discount || 0) * item.quantity)}</TableCell>
                                </TableRow>
                            ))}
                             {fields.length === 0 && (
                                <TableRow><TableCell colSpan={6} className="text-center h-24">No items added.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </section>
                
                <section className="flex justify-end mt-8">
                    <div className="w-full max-w-sm space-y-2">
                        <div className="flex justify-between"><span>Subtotal</span><span>{CURRENCY_FORMATTER.format(totals.subTotal)}</span></div>
                        <div className="flex justify-between"><span>Discount</span><span>- {CURRENCY_FORMATTER.format(totals.totalDiscount)}</span></div>
                        <Separator />
                        <div className="flex justify-between font-semibold"><span>Taxable Value</span><span>{CURRENCY_FORMATTER.format(totals.taxableValue)}</span></div>
                         {Object.entries(totals.gstAmounts).map(([rate, amount]) => (
                            <div key={rate} className="flex justify-between"><span className="pl-4">GST @{rate}%</span><span>{CURRENCY_FORMATTER.format(amount)}</span></div>
                         ))}
                         <Separator />
                         <div className="flex justify-between text-xl font-bold text-primary"><span>Grand Total</span><span>{CURRENCY_FORMATTER.format(totals.grandTotal)}</span></div>
                    </div>
                </section>

                <footer className="mt-24 pt-8 border-t">
                    <div>
                        <h4 className="font-bold mb-2">Terms & Conditions</h4>
                        <ul className="text-muted-foreground text-xs list-disc list-inside space-y-1">
                            <li>50% advance payment, 50% on delivery.</li>
                            <li>Delivery within 2 weeks of advance payment.</li>
                            <li>Warranty: 1 year standard manufacturer warranty.</li>
                        </ul>
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
