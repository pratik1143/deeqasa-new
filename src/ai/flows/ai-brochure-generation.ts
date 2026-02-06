'use server';
/**
 * @fileOverview Genkit flow for generating comprehensive 2-page professional HP product brochures.
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
  headline: z.string().describe('A high-impact enterprise headline (e.g., "Performance Without Compromise").'),
  executiveSummary: z.string().describe('A 2-3 sentence business-focused summary of the product value proposition.'),
  highlights: z.array(z.string()).describe('6-8 key technical or business highlights for Page 1.'),
  
  // Page 2 Content
  technicalOverview: z.string().describe('A detailed technical explanation of the architecture, cooling, and performance.'),
  useCases: z.array(z.string()).describe('Specific enterprise use cases (e.g., "Financial Modeling", "CAD Design", "Mission-Critical Apps").'),
  businessValue: z.object({
    reliability: z.string().describe('Statement on uptime and reliability.'),
    security: z.string().describe('Statement on HP Wolf Security and enterprise data protection.'),
    sustainability: z.string().describe('Statement on energy efficiency and eco-friendly materials.'),
  }),
  trustStatement: z.string().describe('A formal closing statement on HP Global Excellence and industry standards.'),
  
  // Image metadata
  imageSearchQueries: z.array(z.string()).describe('Exactly 3 specific Google search queries for official HP product images of this EXACT model.'),
});

const BrochureOutputSchema = z.object({
  brochureItems: z.array(ProductMarketingSchema),
});
export type BrochureOutput = z.infer<typeof BrochureOutputSchema>;

const brochurePrompt = ai.definePrompt({
  name: 'generateBrochureContent',
  input: { schema: BrochureInputSchema },
  output: { schema: BrochureOutputSchema },
  prompt: `You are a senior enterprise marketing strategist for HP Global.
  Your task is to generate professional, sales-ready content for a 2-PAGE brochure for each of the following HP products.
  
  Products:
  {{#each products}}
  - SKU: {{id}}, Model: {{model}}, Processor: {{processor}}, RAM: {{memory}}, Storage: {{hdd}}, OS: {{os}}, Warranty: {{warranty}}
  {{/each}}

  Guidelines for 2-Page Layout:
  Page 1:
  - Tone: Authoritative, visionary, and concise. Focus purely on HP's engineering.
  - Headline: Focus on "Innovation that powers your business" or "Strategic Computing".
  - Executive Summary: Address C-level pain points regarding security and scalability.
  - Highlights: Focus on the specific hardware build configuration.

  Page 2:
  - Technical Overview: Explain why this specific configuration (CPU/RAM/SSD) is optimal for high-stakes environments.
  - Use Cases: Detailed "Where to use" section. Tailor for Corporate, Education, Healthcare, or Government sectors.
  - Business Value: Emphasize HP Wolf Security, EPEAT certification, and 24/7 reliability.
  - Trust Statement: Focus on HP's industry-leading global standards. DO NOT mention local partners by name.

  No placeholders. Generate full, professional text for every field. Ensure the content is sufficient to fill two A4 pages.`,
});

export async function generateBrochureContent(input: BrochureInput): Promise<BrochureOutput> {
  const { output } = await brochurePrompt(input);
  if (!output) throw new Error('Failed to generate brochure content.');
  return output;
}
