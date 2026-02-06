'use server';
/**
 * @fileOverview Genkit flow for generating tactical enterprise follow-up execution plans.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FollowUpInputSchema = z.object({
  customerName: z.string(),
  companyName: z.string(),
  totalAmount: z.number(),
  createdAt: z.string(),
  dealHealthScore: z.number().optional(),
});
export type FollowUpInput = z.infer<typeof FollowUpInputSchema>;

const FollowUpOutputSchema = z.object({
  timeline: z.array(z.object({
    day: z.string(),
    purpose: z.string(),
    status: z.enum(['WAITING', 'ACTION-REQUIRED', 'HIGH-PRIORITY']),
  })),
  messages: z.object({
    email: z.string().describe('Formal enterprise email body.'),
    whatsapp: z.string().describe('Short, professional WhatsApp message.'),
    callPoints: z.array(z.string()).describe('Bullet points for a follow-up call.'),
  }),
  urgencyIntelligence: z.object({
    verdict: z.string().describe('Push urgency, wait, or revise?'),
    reason: z.string(),
  }),
  escalationAlerts: z.array(z.string()),
  dailyCommand: z.string().describe('One-line command for the sales person TODAY.'),
});
export type FollowUpOutput = z.infer<typeof FollowUpOutputSchema>;

const followUpPrompt = ai.definePrompt({
  name: 'generateFollowUpPlan',
  input: { schema: FollowUpInputSchema },
  output: { schema: FollowUpOutputSchema },
  prompt: `You are an AI Follow-Up Command System for an HP Authorized Reseller. 
  Generate a tactical follow-up execution plan for the following deal:

  - Client: {{customerName}}
  - Organization: {{companyName}}
  - Total Value: ₹{{totalAmount}}
  - Date Generated: {{createdAt}}
  - Health Score: {{#if dealHealthScore}}{{dealHealthScore}}{{else}}N/A{{/if}}

  Output a professional, boardroom-ready plan.
  The timeline should cover Day 3, Day 7, and Day 14.
  The tone must be precise, authoritative, and enterprise-grade.`,
});

export async function generateFollowUpPlan(input: FollowUpInput): Promise<FollowUpOutput> {
  const { output } = await followUpPrompt(input);
  if (!output) throw new Error('Failed to generate follow-up plan.');
  return output;
}
