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

export const LeadSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Matrix entity name required"),
  company: z.string().min(1, "Organization parameter missing"),
  email: z.string().email("Invalid communication uplink (Email)"),
  phone: z.string().min(10, "Invalid uplink sequence (Phone)"),
  status: z.enum([
    "New", 
    "Contacted", 
    "Not Picked", 
    "Follow-up Scheduled", 
    "Meeting Fixed", 
    "Proposal Sent", 
    "Negotiation", 
    "Won", 
    "Lost"
  ]).default("New"),
  source: z.string().optional().default("Manual Ingestion"),
  assignedTo: z.string().optional(),
  assignedToName: z.string().optional(),
  revenue: z.number().optional().default(0),
  priority: z.enum(["Hot", "Cold", "Warm", "High Budget"]).optional().default("Warm"),
  score: z.number().min(0).max(100).optional().default(0),
  tags: z.array(z.string()).optional().default([]),
  followUpDate: z.string().optional(),
  lastCallStatus: z.enum(["Picked", "Not Picked", "Busy", "Switched Off"]).optional(),
  nextActionSuggestion: z.string().optional(),
  notes: z.string().optional(),
  activityLog: z.array(z.object({
    id: z.string(),
    type: z.string(), // 'call', 'status_change', 'note', 'document', 'whatsapp', 'email'
    action: z.string(),
    note: z.string().optional(),
    timestamp: z.any(),
    performer: z.string().optional()
  })).optional().default([]),
  createdAt: z.any(),
  updatedAt: z.any(),
});
