import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(), // SKU
  model: z.string().default('-'),
  plant: z.string().default('-'),
  chassis: z.string().default('-'),
  processor: z.string().default('-'),
  memory: z.string().default('-'),
  hdd: z.string().default('-'),
  hdd2: z.string().default('-'),
  gfx: z.string().default('-'),
  os: z.string().default('-'),
  odd: z.string().default('-'),
  wlan: z.string().default('-'),
  warranty: z.string().default('-'),
  name: z.string(), // Full display name
  price: z.number(), // FTP
  gstRate: z.number().default(18),
});

export type Product = z.infer<typeof ProductSchema>;

export const LineItemSchema = z.object({
  product: ProductSchema,
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
});

export type LineItem = z.infer<typeof LineItemSchema>;

export const CustomerDetailsSchema = z.object({
  name: z.string().min(1, "Customer name is required."),
  companyName: z.string().optional(),
  address: z.string().optional(),
});

export type CustomerDetails = z.infer<typeof CustomerDetailsSchema>;
