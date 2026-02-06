'use server';
/**
 * @fileOverview Genkit flow for generating comprehensive 3-page professional HP enterprise product brochures.
 * 
 * - generateBrochureContent - Generates detailed 3-page marketing, technical, and deployment copy.
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
  // Page 1: Executive Overview
  headline: z.string().describe('A high-impact enterprise headline.'),
  tagline: z.string().describe('A short, catchy tagline (e.g., "Performance that Powers Innovation").'),
  executiveSummary: z.string().describe('A 2-3 sentence business-focused summary.'),
  keyHighlights: z.array(z.string()).describe('4-5 key value propositions for Page 1.'),
  
  // Page 2: Technical & Business Depth
  technicalNarrative: z.string().describe('Detailed technical explanation of the architecture and performance.'),
  businessValue: z.object({
    performance: z.string().describe('Statement on processing power and efficiency.'),
    security: z.string().describe('Focus on HP Wolf Security and data protection.'),
    sustainability: z.string().describe('Focus on energy efficiency and eco-materials.'),
    scalability: z.string().describe('Focus on future-proofing and expansion.'),
  }),
  reliabilityStatement: z.string().describe('Formal statement on HP enterprise-grade reliability testing.'),

  // Page 3: Use Cases & Deployment
  sectors: z.object({
    government: z.string().describe('How this product fits Govt/PSU requirements.'),
    education: z.string().describe('How this product fits University/Research requirements.'),
    corporate: z.string().describe('How this product fits Enterprise/MNC requirements.'),
    specialized: z.string().describe('Workload-specific uses (e.g., CAD, Data Science, High-Volume Print).'),
  }),
  professionalVsConsumer: z.string().describe('Explanation of why this pro-system beats consumer models.'),
  lifecycleAssurance: z.string().describe('Statement on long-term availability and support.'),
  
  // Image metadata
  imageSearchQueries: z.array(z.string()).describe('3 specific search queries for official HP product images of this EXACT model.'),
});

const BrochureOutputSchema = z.object({
  brochureItems: z.array(ProductMarketingSchema),
});
export type BrochureOutput = z.infer<typeof BrochureOutputSchema>;

const brochurePrompt = ai.definePrompt({
  name: 'generateBrochureContent',
  input: { schema: BrochureInputSchema },
  output: { schema: BrochureOutputSchema },
  prompt: `You are a Senior Strategic Marketing Architect for HP Global Enterprise.
  Your task is to generate premium, 3-PAGE sales-ready content for each of the following products.
  
  Products:
  {{#each products}}
  - SKU: {{id}}, Model: {{model}}, Processor: {{processor}}, RAM: {{memory}}, Storage: {{hdd}}, GPU: {{gfx}}, OS: {{os}}, Warranty: {{warranty}}
  {{/each}}

  Guidelines for 3-Page Layout:
  Page 1: Executive Overview
  - Headline: Visionary and authoritative.
  - Tagline: Short and punchy.
  - Summary: Address C-level pain points.
  - Key Highlights: High-level hardware strengths.

  Page 2: Technical & Business Depth
  - Technical Narrative: Deep dive into the configuration.
  - Business Value: Focus on the "Four Pillars": Performance, Security (Wolf Security), Sustainability, and Scalability.
  - Reliability: Mention rigorous MIL-STD testing if applicable.

  Page 3: Use Cases & Deployment
  - Sector Analysis: Specifically detail how it serves Government/PSU, Education, and Corporate sectors.
  - Professional Edge: Explain the enterprise-grade build quality vs consumer systems.
  - Lifecycle: Emphasize stability and long-term support.

  Tone: Enterprise-grade, respectful, and authoritative. NO marketing fluff. Write full, production-ready text.`,
});

export async function generateBrochureContent(input: BrochureInput): Promise<BrochureOutput> {
  const { output } = await brochurePrompt(input);
  if (!output) throw new Error('Failed to generate brochure content.');
  return output;
}
