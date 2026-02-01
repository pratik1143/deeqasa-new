import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  model: z.string().optional(),
  price: z.number(),
  gstRate: z.number().min(0).max(100), // GST as a percentage, e.g., 18 for 18%
});

export type Product = z.infer<typeof ProductSchema>;

export const LineItemSchema = z.object({
  product: ProductSchema,
  quantity: z.number().min(1),
  discount: z.number().min(0).optional(), // Discount as a fixed value per unit
});

export type LineItem = z.infer<typeof LineItemSchema>;

export const CustomerDetailsSchema = z.object({
  name: z.string().min(1, "Customer name is required."),
  companyName: z.string().optional(),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
});

export type CustomerDetails = z.infer<typeof CustomerDetailsSchema>;

export const QuotationSchema = z.object({
  id: z.string(),
  customer: CustomerDetailsSchema,
  lineItems: z.array(LineItemSchema).min(1, "Quotation must have at least one item."),
  quotationDate: z.date(),
  validityDays: z.number().min(1),
  termsAndConditions: z.string(),
});

export type Quotation = z.infer<typeof QuotationSchema>;
