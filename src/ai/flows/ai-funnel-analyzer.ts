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
  pipelineRevenueByMonth: z.record(z.string(), z.number()).describe('Projected pipeline revenue by expected closure month.'),
  funnelsByOwner: z.record(z.string(), z.number()),
  funnelsBySegment: z.record(z.string(), z.number()),
  winRatioBySegment: z.record(z.string(), z.number()),
});

export type FunnelAnalysisInput = z.infer<typeof FunnelAnalysisInputSchema>;

const FunnelAnalysisOutputSchema = z.object({
  executiveSummary: z.string().describe('A very brief, high-level summary for a CXO, including key wins, pipeline value, and top risk.'),
  performanceSummary: z.string().describe('A detailed summary of the overall funnel performance.'),
  stuckDealsInsight: z.string().describe('An insight into where deals are getting stuck or what is causing losses, identifying bottlenecks.'),
  topPerformerInsight: z.string().describe('An insight identifying the BDM with the strongest pipeline or best performance.'),
  segmentInsight: z.string().describe('An insight into which business segment requires the most attention, including risks and opportunities.'),
  revenueForecast: z.string().describe('A short-term revenue forecast based on the current pipeline, including confidence level.'),
  keyRisks: z.array(z.string()).describe('A list of the top 3-5 critical risks in the funnel right now.'),
  keyOpportunities: z.array(z.string()).describe('A list of the top 3-5 key opportunities to focus on.'),
});

export type FunnelAnalysisOutput = z.infer<typeof FunnelAnalysisOutputSchema>;

const analysisPrompt = ai.definePrompt({
  name: 'funnelAnalysisPrompt',
  input: { schema: FunnelAnalysisInputSchema },
  output: { schema: FunnelAnalysisOutputSchema },
  prompt: `You are an expert sales operations analyst and business strategist, acting as an AI Funnel Intelligence System for an enterprise IT company. Your audience is a C-level executive who needs clear, concise, and actionable insights.

  Based on the sales funnel data provided below, generate a comprehensive analysis. Use the provided exchange rate of 1 USD = 80 INR for all currency conversions.

  **Data Snapshot:**
  - Total Funnels: {{{totalFunnels}}}
  - Won: {{{wonCount}}}, Lost: {{{lostCount}}}, Active Pipeline: {{{pipelineCount}}}
  - Total Revenue (Won + Est. Pipeline): \${{{totalRevenue}}} USD (approx. ₹{{{totalRevenueInr}}} INR)
  - Won Revenue: \${{{wonRevenue}}} USD (approx. ₹{{{wonRevenueInr}}} INR)
  - Pipeline Revenue (probability-weighted): \${{{pipelineRevenue}}} USD (approx. ₹{{{pipelineRevenueInr}}} INR)

  **Breakdowns:**
  - Historical Won Revenue by Month (in USD): {{{json revenueByMonth}}}
  - Projected Pipeline Revenue by Month (in USD): {{{json pipelineRevenueByMonth}}}
  - Funnels by Owner (BDM/ISR): {{{json funnelsByOwner}}}
  - Funnels by Segment: {{{json funnelsBySegment}}}
  - Historical Win Ratio by Segment (%): {{{json winRatioBySegment}}}

  **Your Analysis (Generate the following fields):**

  1.  **executiveSummary:** A single, impactful paragraph for a CXO. Start with the most important numbers (e.g., total pipeline value, won revenue this period), then state the single biggest opportunity and the single most critical risk.
  2.  **revenueForecast:** Analyze the 'Projected Pipeline Revenue by Month' and historical trends. Provide a short-term forecast (e.g., "For next 30-60 days, we forecast X revenue with Y% confidence based on...").
  3.  **keyRisks:** Identify the top 3-5 most critical risks to the funnel right now. Be specific. Examples: "Deal X ($100k) has been idle for 3 weeks", "Manufacturing segment shows a 20% drop in win rate this quarter", "BDM [Name] has 80% of their pipeline value in a single high-risk deal".
  4.  **keyOpportunities:** Identify the top 3-5 actionable opportunities. Be specific. Examples: "Accelerate Deal Y ($50k) which has a 90% probability", "Focus on the Finance segment, which has a 15% higher win rate than average", "BDM [Name] has a strong closing ratio and should be assigned another high-value lead".
  5.  **performanceSummary:** A detailed overview of performance. Is it strong? What are the key trends in won revenue and new pipeline?
  6.  **stuckDealsInsight:** Where are deals getting stuck or lost? Analyze based on segment, owner, and deal size. Identify potential bottlenecks.
  7.  **topPerformerInsight:** Which BDM or ISR is showing the strongest performance? Consider win rate, total revenue, and pipeline health.
  8.  **segmentInsight:** Which business segment presents the biggest opportunity or the greatest risk? Where should sales leadership focus attention?`
});


export async function analyzeFunnelData(input: FunnelAnalysisInput): Promise<FunnelAnalysisOutput> {
    const {output} = await analysisPrompt(input);
    if (!output) {
        throw new Error('AI analysis failed to generate insights.');
    }
    return output;
}
