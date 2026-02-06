'use server';
/**
 * @fileOverview Genkit flow for generating comprehensive 2-page professional IT product brochures.
 * 
 * - generateBrochureContent - Generates detailed 2-page marketing and technical copy for products.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ProductSchema } from '@/lib/quotation-schemas';

const BrochureInputSchema = z.object({
  products: z.array(ProductSchema),
});
export type BrochureInput = z.infer<typeof BrochureInputSchema>;

const ProductMarketingSchema = z.object({
  sku: z.string(),
  // Page 1 Content
  headline: z.string().describe('A short, professional headline (e.g., "Empowering the Modern Hybrid Workforce").'),
  executiveSummary: z.string().describe('A 2-3 sentence business-focused summary of the product value.'),
  highlights: z.array(z.string()).describe('6-8 key technical or business highlights for Page 1.'),
  
  // Page 2 Content
  technicalOverview: z.string().describe('A deeper technical explanation of the architecture and performance.'),
  useCases: z.array(z.string()).describe('Detailed business or enterprise use cases.'),
  businessValue: z.object({
    reliability: z.string().describe('Statement on uptime and reliability.'),
    security: z.string().describe('Statement on HP Wolf Security and data protection.'),
    sustainability: z.string().describe('Statement on energy efficiency and eco-friendly materials.'),
  }),
  trustStatement: z.string().describe('A formal closing statement on HP Partner excellence.'),
});

const BrochureOutputSchema = z.object({
  brochureItems: z.array(ProductMarketingSchema),
});
export type BrochureOutput = z.infer<typeof BrochureOutputSchema>;

const brochurePrompt = ai.definePrompt({
  name: 'generateBrochureContent',
  input: { schema: BrochureInputSchema },
  output: { schema: BrochureOutputSchema },
  prompt: `You are an expert enterprise marketing strategist for HP Commercial and Enterprise products.
  Your task is to generate professional, sales-ready content for a 2-PAGE brochure for each of the following products.
  
  Products:
  {{#each products}}
  - SKU: {{id}}, Model: {{model}}, Processor: {{processor}}, RAM: {{memory}}, Storage: {{hdd}}, OS: {{os}}, Warranty: {{warranty}}
  {{/each}}

  Guidelines for 2-Page Layout:
  Page 1:
  - Tone: Visionary, authoritative, and concise.
  - Headline: Focus on the "Future of Work" or "Enterprise Excellence".
  - Executive Summary: Address the C-level executive's pain points.
  - Highlights: Focus on the high-level configuration specs.

  Page 2:
  - Technical Overview: Explain the performance benefits of this specific build.
  - Use Cases: Tailor for Corporate, Education, or Government sectors.
  - Business Value: Emphasize HP Wolf Security, EPEAT certification, and 24/7 reliability.
  - Trust Statement: Focus on HP's industry-leading standards and partner support.

  No placeholders. Generate full, professional text for every field.`,
});

export async function generateBrochureContent(input: BrochureInput): Promise<BrochureOutput> {
  const { output } = await brochurePrompt(input);
  if (!output) throw new Error('Failed to generate brochure content.');
  return output;
}
