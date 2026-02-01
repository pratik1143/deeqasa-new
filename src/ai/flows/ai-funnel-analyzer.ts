'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing sales funnel data and generating insights.
 *
 * - analyzeFunnelData - A function that takes funnel metrics and returns AI-driven insights.
 * - FunnelAnalysisInput - The input type for the analyzeFunnelData function.
 * - FunnelAnalysisOutput - The return type for the analyzeFunnelData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FunnelAnalysisInputSchema = z.object({
  totalFunnels: z.number(),
  wonCount: z.number(),
  lostCount: z.number(),
  pipelineCount: z.number(),
  totalRevenue: z.number().describe('Total revenue in USD'),
  wonRevenue: z.number().describe('Won revenue in USD'),
  pipelineRevenue: z.number().describe('Pipeline revenue in USD'),
  wonRevenueInr: z.number().describe('Won revenue in INR'),
  pipelineRevenueInr: z.number().describe('Pipeline revenue in INR'),
  totalRevenueInr: z.number().describe('Total revenue in INR'),
  revenueByMonth: z.record(z.string(), z.number()),
  funnelsByOwner: z.record(z.string(), z.number()),
  funnelsBySegment: z.record(z.string(), z.number()),
  winRatioBySegment: z.record(z.string(), z.number()),
});

export type FunnelAnalysisInput = z.infer<typeof FunnelAnalysisInputSchema>;

const FunnelAnalysisOutputSchema = z.object({
  performanceSummary: z.string().describe('A high-level summary of the overall funnel performance.'),
  stuckDealsInsight: z.string().describe('An insight into where deals are getting stuck or what is causing losses.'),
  topPerformerInsight: z.string().describe('An insight identifying the BDM with the strongest pipeline or best performance.'),
  segmentInsight: z.string().describe('An insight into which business segment requires the most attention, including risks and opportunities.'),
});

export type FunnelAnalysisOutput = z.infer<typeof FunnelAnalysisOutputSchema>;

const analysisPrompt = ai.definePrompt({
  name: 'funnelAnalysisPrompt',
  input: { schema: FunnelAnalysisInputSchema },
  output: { schema: FunnelAnalysisOutputSchema },
  prompt: `You are a senior data analyst for an enterprise IT company. Your task is to analyze the following sales funnel data and provide actionable business insights for a CXO-level audience. The exchange rate is 1 USD = 80 INR.

  **Data Snapshot:**
  - Total Funnels: {{{totalFunnels}}}
  - Won: {{{wonCount}}}
  - Lost: {{{lostCount}}}
  - Active Pipeline: {{{pipelineCount}}}
  - Total Revenue (Won + Pipeline): \${{{totalRevenue}}} USD (approx. ₹{{{totalRevenueInr}}} INR)
  - Won Revenue: \${{{wonRevenue}}} USD (approx. ₹{{{wonRevenueInr}}} INR)
  - Pipeline Revenue: \${{{pipelineRevenue}}} USD (approx. ₹{{{pipelineRevenueInr}}} INR)

  **Breakdowns:**
  - Revenue by Month (in USD): {{{json revenueByMonth}}}
  - Funnels by Owner (BDM/ISR): {{{json funnelsByOwner}}}
  - Funnels by Segment: {{{json funnelsBySegment}}}
  - Win Ratio by Segment (%): {{{json winRatioBySegment}}}

  **Your Analysis:**
  Based on this data, provide concise, clear, and actionable insights. Do not just repeat the numbers. Explain what they mean for the business. When mentioning revenue figures, please include both USD and approximate INR values (e.g., "$100K USD / ₹80 Lakhs INR").
  1.  **Performance Summary:** Give a high-level overview. Is performance strong? What are the key takeaways?
  2.  **Stuck Deals:** Where are we losing deals or where is the pipeline getting stuck? Identify potential bottlenecks.
  3.  **Top Performer:** Which BDM or ISR is showing the strongest performance or has the most promising pipeline?
  4.  **Segment Focus:** Which segment presents the biggest opportunity or the greatest risk? Where should the sales leadership focus their attention?`,
});


export async function analyzeFunnelData(input: FunnelAnalysisInput): Promise<FunnelAnalysisOutput> {
    const {output} = await analysisPrompt(input);
    if (!output) {
        throw new Error('AI analysis failed to generate insights.');
    }
    return output;
}
