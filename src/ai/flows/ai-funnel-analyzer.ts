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
  fullFunnelData: z.array(z.any()).describe('The full, raw data for all funnels in the current view. Used for generating detailed alerts and opportunities. Note the `lastModified` field which indicates when a deal was last updated.'),
});


export type FunnelAnalysisInput = z.infer<typeof FunnelAnalysisInputSchema>;

const FunnelAnalysisOutputSchema = z.object({
  executiveSummary: z.string().describe("A very brief, high-level summary for a C-level executive, readable in under 60 seconds. Include total pipeline value, expected revenue this month, the single top opportunity, and the single biggest risk."),
  
  revenueForecast: z.object({
    forecast: z.string().describe("A 30-60 day revenue forecast based on the probability-weighted pipeline and historical trends."),
    confidence: z.number().min(0).max(100).describe("A confidence level percentage for the forecast, from 0 to 100."),
  }).describe("Read-only revenue forecast."),

  smartAlerts: z.array(z.object({
    title: z.string().describe("A short, descriptive title for the alert (e.g., 'High-Value Deal Stalled')."),
    description: z.string().describe("A detailed description of the alert, explaining the risk and why it's important."),
    priority: z.enum(['High', 'Medium', 'Low']).describe("The priority of the alert."),
  })).describe("A list of actionable alerts for deals that need attention. Base this on the `fullFunnelData`, looking for things like high-value deals that haven't been modified recently (use `lastModified` to determine staleness), or deals with low probability near their closure month."),

  topOpportunities: z.array(z.object({
    title: z.string().describe("A short, descriptive title for the opportunity (e.g., 'Accelerate High-Probability Deal')."),
    description: z.string().describe("A detailed description of the opportunity, including the deal name and potential revenue."),
    nextAction: z.string().describe("A single, clear, recommended next action to capitalize on the opportunity."),
  })).describe("A list of the top 3-5 key opportunities to focus on, including a suggested next action for each."),

  funnelLeakageAnalysis: z.object({
    primaryLeakagePoint: z.string().describe("The segment or stage where the most deals are being lost, based on the provided win ratios."),
    insight: z.string().describe("A short AI-powered explanation of the leakage pattern and its business impact."),
  }).describe("Analysis of where and why deals are being lost in the funnel."),

  ownerPerformance: z.object({
    topPerformer: z.object({
      name: z.string().describe("Name of the top-performing BDM/ISR."),
      reason: z.string().describe("A brief explanation of why they are the top performer (e.g., highest win rate, largest pipeline value)."),
    }),
    needsAttention: z.object({
      name: z.string().describe("Name of the BDM/ISR who may need support."),
      reason: z.string().describe("A brief, constructive explanation of why they need attention (e.g., low win rate in a key segment, multiple stalled deals)."),
    }),
  }).describe("Intelligence on BDM/ISR performance, highlighting top performers and those who may need support."),
  
  lostDealIntelligence: z.string().describe("An analysis of the deals in the `fullFunnelData` with status 'Lost'. Identify common themes or patterns in segment, owner, or revenue size that could explain why they were lost."),
});

export type FunnelAnalysisOutput = z.infer<typeof FunnelAnalysisOutputSchema>;

const analysisPrompt = ai.definePrompt({
  name: 'funnelAnalysisPrompt',
  input: { schema: FunnelAnalysisInputSchema },
  output: { schema: FunnelAnalysisOutputSchema },
  prompt: `You are an expert sales operations analyst and business strategist, acting as an AI Funnel Intelligence System for an enterprise IT company. Your audience is a C-level executive who needs clear, concise, and actionable insights.

  Based on the sales funnel data provided below, generate a comprehensive analysis.

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
  - Full Funnel Data (for deep analysis): {{{json fullFunnelData}}}

  **Your Task: Generate the AI Funnel Intelligence Report**

  Please populate all fields in the output JSON schema with specific, actionable, and data-driven insights based *only* on the information provided.

  1.  **executiveSummary:** A single, impactful paragraph for a CXO. Start with the most important numbers (total pipeline value, won revenue), then state the single biggest opportunity and the single most critical risk.
  2.  **revenueForecast:** Analyze the 'Projected Pipeline Revenue by Month' and historical trends. Provide a short-term forecast (e.g., "For the next 30-60 days...") and a confidence percentage in your prediction.
  3.  **smartAlerts:** Identify the top 3 most critical risks/alerts from the \`fullFunnelData\`. Prioritize them as 'High', 'Medium', or 'Low'. Focus on actionable issues like high-value deals that are stalled (check the \`lastModified\` date for inactivity), deals with low probability but near their closure month, or significant drops in segment performance.
  4.  **topOpportunities:** Identify the top 3-5 most actionable opportunities. For each, provide a clear, specific, and compelling "Next Action" that the sales team can take immediately.
  5.  **funnelLeakageAnalysis:** Based on the \`winRatioBySegment\` data, identify the segment with the lowest win ratio. State this is the primary leakage point and provide a brief insight.
  6.  **ownerPerformance:** Identify the single top-performing owner based on metrics like revenue, win rate, or pipeline size. Also, identify one owner who might need attention or support, explaining why in a constructive manner.
  7.  **lostDealIntelligence:** Analyze the deals with status 'Lost' from the \`fullFunnelData\`. Provide a summary of any common patterns you observe (e.g., "A number of lost deals were concentrated in the X segment" or "Several high-revenue deals were lost by owner Y").`
});


export async function analyzeFunnelData(input: FunnelAnalysisInput): Promise<FunnelAnalysisOutput> {
    const {output} = await analysisPrompt(input);
    if (!output) {
        throw new Error('AI analysis failed to generate insights.');
    }
    return output;
}
