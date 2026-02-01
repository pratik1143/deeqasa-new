import { z } from 'zod';
import { FunnelDataSchema } from './schemas';

export type FunnelData = z.infer<typeof FunnelDataSchema>;
