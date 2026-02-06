'use server';
/**
 * @fileOverview Genkit flow for generating professional IT product brochures.
 * 
 * - generateBrochureContent - Generates marketing copy for products.
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
  headline: z.string().describe('A short, professional headline for the product (e.g., "The Pinnacle of Mobile Performance").'),
  highlights: z.array(z.string()).describe('5-6 key technical or business highlights.'),
  useCases: z.array(z.string()).describe('Ideal business or enterprise use cases.'),
  trustStatement: z.string().describe('A statement about reliability, security, and HP support.'),
});

const BrochureOutputSchema = z.object({
  brochureItems: z.array(ProductMarketingSchema),
});
export type BrochureOutput = z.infer<typeof BrochureOutputSchema>;

const brochurePrompt = ai.definePrompt({
  name: 'generateBrochureContent',
  input: { schema: BrochureInputSchema },
  output: { schema: BrochureOutputSchema },
  prompt: `You are an expert enterprise marketing specialist for HP Commercial products.
  Your task is to generate professional, sales-ready brochure content for the following products.
  
  Products:
  {{#each products}}
  - SKU: {{id}}, Model: {{model}}, Processor: {{processor}}, RAM: {{memory}}, Storage: {{hdd}}, OS: {{os}}
  {{/each}}

  Guidelines:
  - Tone: Enterprise, professional, authoritative, and concise.
  - No marketing fluff; focus on performance, security, and reliability.
  - Highlights should focus on the specific configuration provided.
  - Use cases should be relevant to corporate, education, or government sectors.
  - Trust statements should emphasize HP's industry-leading standards.`,
});

export async function generateBrochureContent(input: BrochureInput): Promise<BrochureOutput> {
  const { output } = await brochurePrompt(input);
  if (!output) throw new Error('Failed to generate brochure content.');
  return output;
}
