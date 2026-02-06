'use server';
/**
 * @fileOverview Genkit flow for generating high-authority AI Deal Intelligence Reports.
 * 
 * - analyzeDealIntelligence - A function that evaluates a quotation and returns strategic sales insights.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ProductSchema } from '@/lib/quotation-schemas';

const DealIntelligenceInputSchema = z.object({
  customerName: z.string(),
  companyName: z.string(),
  products: z.array(z.object({
    model: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
  })),
  totalAmount: z.number(),
  subject: z.string(),
});
export type DealIntelligenceInput = z.infer<typeof DealIntelligenceInputSchema>;

const DealIntelligenceOutputSchema = z.object({
  dealHealth: z.object({
    score: z.number().min(0).max(100),
    status: z.enum(['CRITICAL', 'MODERATE', 'STRONG', 'HIGH-CONFIDENCE']),
    reason: z.string().describe('One-line executive reason for the health score.'),
  }),
  winProbability: z.number().min(0).max(100),
  riskFactors: z.array(z.string()).describe('Specific enterprise risk factors.'),
  salesAdvice: z.string().describe('Actionable next steps for the sales team.'),
  discountIntelligence: z.string().describe('Analysis of current pricing and margin safety.'),
  followUpStrategy: z.object({
    suggestedDate: z.string().describe('Format: DD-MM-YYYY'),
    message: z.string().describe('Formal enterprise-tone follow-up message.'),
  }),
  buyingSignals: z.string().describe('Analysis of client buying patterns based on organization type.'),
});
export type DealIntelligenceOutput = z.infer<typeof DealIntelligenceOutputSchema>;

const intelligencePrompt = ai.definePrompt({
  name: 'analyzeDealIntelligence',
  input: { schema: DealIntelligenceInputSchema },
  output: { schema: DealIntelligenceOutputSchema },
  prompt: `You are a Senior Enterprise Sales Intelligence System (JARVIS-class). 
  Analyze the following quotation data for an HP Authorized Reseller and produce a high-authority Deal Intelligence Report.

  Quotation Data:
  - Client: {{customerName}}
  - Organization: {{companyName}}
  - Subject: {{subject}}
  - Total Value: ₹{{totalAmount}}
  - Products:
  {{#each products}}
  • {{model}} (Qty: {{quantity}} @ ₹{{unitPrice}})
  {{/each}}

  Guidelines:
  - TONE: Confident, precise, executive. No emojis. No casual language.
  - HEALTH SCORE: Base this on typical enterprise deal sizes, product mix, and organization profile.
  - WIN PROBABILITY: Higher for education/govt if the spec is precise; sensitive for corporate if pricing is high.
  - BUYING SIGNALS: Government/Universities (like Panjab University) are typically "Slow Movers" with high approval delays. MNCs/Corporate are "Fast Movers" but price-sensitive.
  - RISK FACTORS: Mention pricing sensitivity, budget cycles, and technical over-spec if applicable.
  - DISCOUNT: Evaluate if the ₹{{totalAmount}} total is aggressive or safe for this volume.

  Provide a precise control-room style briefing.`,
});

export async function analyzeDealIntelligence(input: DealIntelligenceInput): Promise<DealIntelligenceOutput> {
  const { output } = await intelligencePrompt(input);
  if (!output) throw new Error('Failed to synthesize deal intelligence.');
  return output;
}
