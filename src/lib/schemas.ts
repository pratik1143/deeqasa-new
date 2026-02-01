import { z } from 'zod';

export const FunnelDataSchema = z.object({
  id: z.number(),
  rowNumber: z.number(),
  status: z.enum(['Won', 'Lost', 'Pipeline']),
  revenue: z.number(),
  closureMonth: z.string(),
  region: z.string(),
  segment: z.string(),
  product: z.string(),
  accountName: z.string(),
  owner: z.string(),
  probability: z.number(),
  state: z.string().optional(),
  oppCloseMonth: z.string().optional(),
  productLine: z.string().optional(),
  lastModified: z.string().optional(),
});
