"use client";

import { useState, useEffect } from "react";
import { Lead } from "@/lib/types";
import { analyzeLeadNextAction } from "@/ai/flows/ai-lead-analyzer";

export function useAiSuggestion(lead: Lead | null) {
  const [suggestion, setSuggestion] = useState<string>("Synthesizing logic matrix...");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchSuggestion() {
      if (!lead) return;
      setIsLoading(true);
      try {
        const result = await analyzeLeadNextAction({
          name: lead.name,
          status: lead.status,
          lastNotes: lead.notes,
          activityLog: (lead.activityLog || []).map(a => ({
            action: a.action,
            note: a.note,
            timestamp: typeof a.timestamp === 'string' ? a.timestamp : new Date().toISOString()
          })),
        });
        
        if (result && result.suggestion) {
          setSuggestion(result.suggestion);
        }
      } catch (err) {
        console.error("AI Intel Error:", err);
        setSuggestion("Monitor status for organic engagement signals.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuggestion();
  }, [lead?.id, lead?.status, lead?.updatedAt]);

  return { suggestion, isLoading };
}
