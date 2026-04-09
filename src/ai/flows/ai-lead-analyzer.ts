'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LeadAnalyzerInputSchema = z.object({
  name: z.string(),
  status: z.string(),
  lastNotes: z.string().optional(),
  activityLog: z.array(z.object({
    action: z.string(),
    note: z.string().optional(),
    timestamp: z.string(),
  })),
});

const LeadAnalyzerOutputSchema = z.object({
  suggestion: z.string(),
  reason: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
});

const leadAnalyzerPrompt = ai.definePrompt({
  name: 'analyzeLeadNextAction',
  input: { schema: LeadAnalyzerInputSchema },
  output: { schema: LeadAnalyzerOutputSchema },
  prompt: `
    You are an expert sales strategist for DEEQASA, a tech solutions provider and HP Authorized Reseller.
    Analyze the following lead data and suggest the absolute BEST next action to move the deal forward.

    LEAD: {{name}}
    CURRENT STATUS: {{status}}
    LAST NOTES: {{lastNotes}}
    
    RECENT ACTIVITY:
    {{#each activityLog}}
    • [{{timestamp}}] {{action}}: {{note}}
    {{/each}}

    Rules:
    1. Suggestion must be concise (max 12 words).
    2. Suggestion should be actionable and specific to the last activity.
    3. TONE: Professional, strategic, high-velocity.
  `,
});

export async function analyzeLeadNextAction(input: z.infer<typeof LeadAnalyzerInputSchema>) {
  try {
    const { output } = await leadAnalyzerPrompt(input);
    if (!output) throw new Error('Empty output from AI');
    return output;
  } catch (error: any) {
    console.warn("AI Quota/Network Error detected. Activating deterministic fallback matrix.", error.message);
    
    // Deterministic Fallback Matrix
    const fallbackMap: Record<string, { suggestion: string, reason: string, priority: 'low' | 'medium' | 'high' }> = {
      'New': {
        suggestion: "Initiate contact uplink immediately.",
        reason: "New entry detected in the lead registry requires urgent verification.",
        priority: 'high'
      },
      'Follow-up Scheduled': {
        suggestion: "Prepare mission briefing for scheduled engagement.",
        reason: "Next contact window is approaching. Ensure tactical alignment.",
        priority: 'medium'
      },
      'Contacted': {
        suggestion: "Nurture relationship protocol.",
        reason: "Initial contact established. Move towards proposal phase.",
        priority: 'medium'
      },
      'Proposal Sent': {
        suggestion: "Execute follow-up sequence to confirm receipt.",
        reason: "Proposal is in-flight. Verify acknowledgment with the client.",
        priority: 'high'
      },
      'Negotiation': {
        suggestion: "Refine commercial terms for win-optimization.",
        reason: "Final phase engagement. Focus on closing protocols.",
        priority: 'high'
      },
      'Won': {
        suggestion: "Initiate post-sale success protocol.",
        reason: "Engagement successful. Handover to operations.",
        priority: 'low'
      }
    };

    return fallbackMap[input.status] || {
      suggestion: "Monitor activity logs for next engagement window.",
      reason: "Status is stable. Review history for subtle triggers.",
      priority: 'low'
    };
  }
}
