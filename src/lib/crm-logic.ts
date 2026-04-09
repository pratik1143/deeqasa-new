import { Lead } from "@/lib/types";
import { 
  differenceInDays, 
  isToday as isDateToday, 
  isPast, 
  parseISO 
} from "date-fns";

/**
 * Calculates a lead score (0-100) based on multiple engagement factors.
 */
export function calculateLeadScore(lead: Lead): number {
  let score = 50; // Base score

  // 1. Status Factor
  const statusWeights: Record<string, number> = {
    "New": 10,
    "Contacted": 15,
    "Meeting Fixed": 30,
    "Proposal Sent": 35,
    "Negotiation": 40,
    "Won": 50,
    "Not Picked": -5,
    "Lost": -50
  };
  score += statusWeights[lead.status] || 0;

  // 2. Priority Factor
  const priorityWeights: Record<string, number> = {
    "Hot": 20,
    "Warm": 10,
    "Cold": -10,
    "High Budget": 15
  };
  score += priorityWeights[lead.priority || "Warm"] || 0;

  // 3. Activity Recency
  if (lead.updatedAt) {
    const lastUpdate = typeof lead.updatedAt === 'string' ? parseISO(lead.updatedAt) : new Date(lead.updatedAt);
    const daysSinceLastActivity = differenceInDays(new Date(), lastUpdate);
    
    if (daysSinceLastActivity <= 2) score += 10;
    else if (daysSinceLastActivity > 7) score -= 15;
    else if (daysSinceLastActivity > 30) score -= 30;
  }

  // 4. Interaction Volume
  const interactionCount = lead.activityLog?.length || 0;
  score += Math.min(interactionCount * 2, 20);

  return Math.max(0, Math.min(100, score));
}

/**
 * Determines lead urgency category based on follow-up schedule.
 */
export type LeadUrgency = 'overdue' | 'today' | 'upcoming' | 'none';

export function getLeadUrgency(followUpDate?: string): LeadUrgency {
  if (!followUpDate) return 'none';
  
  try {
    const date = parseISO(followUpDate);
    if (isDateToday(date)) return 'today';
    if (isPast(date)) return 'overdue';
    return 'upcoming';
  } catch (e) {
    return 'none';
  }
}

/**
 * Rule-based fallback for AI suggestions.
 */
export function getAutomatedActionSuggestion(lead: Lead): string {
  if (lead.status === 'New') return "Initiate primary contact uplink via WhatsApp.";
  if (lead.status === 'Not Picked') return "Secondary attempt triggered. Call after 2 hours.";
  if (lead.status === 'Meeting Fixed') return "Prepare enterprise presentation deck.";
  if (lead.followUpDate && getLeadUrgency(lead.followUpDate) === 'overdue') {
    return "Mission Overdue! Re-engage immediately to prevent fallout.";
  }
  
  return "Monitor status and log any organic engagement signals.";
}
