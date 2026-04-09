import { z } from 'zod';
import { FunnelDataSchema, LeadSchema } from './schemas';

export type FunnelData = z.infer<typeof FunnelDataSchema>;
export type Lead = z.infer<typeof LeadSchema> & {
  score?: number;
  nextActionSuggestion?: string;
  notes?: string;
  activityLog: {
    id: string;
    type: string;
    action: string;
    note?: string;
    timestamp: any;
    performer?: string;
  }[];
  createdAt: any;
  updatedAt: any;
};
