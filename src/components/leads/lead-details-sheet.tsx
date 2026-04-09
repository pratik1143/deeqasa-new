"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  History, 
  MessageSquare, 
  ChevronRight,
  Plus,
  Zap,
  TrendingUp,
  Tag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  ExternalLink,
  MessageCircle,
  Play,
  Target
} from "lucide-react";
import { Lead } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { calculateLeadScore, getAutomatedActionSuggestion } from "@/lib/crm-logic";
import { useAiSuggestion } from "@/hooks/use-ai-suggestion";
import { useCrmAudio } from "@/hooks/use-crm-audio";

interface LeadDetailsSheetProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailsSheet({ lead, isOpen, onClose }: LeadDetailsSheetProps) {
  const [note, setNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const { suggestion: aiSuggestion, isLoading: isAiLoading } = useAiSuggestion(lead);
  const { playSound } = useCrmAudio();

  if (!lead) return null;

  const score = calculateLeadScore(lead);

  const handleUpdateStatus = async (newStatus: string, actionNote: string) => {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      const leadRef = doc(firestore, "leads", lead.id!);
      const newActivity = {
        id: crypto.randomUUID(),
        type: 'status_change',
        action: `Status recalibrated: ${newStatus}`,
        note: actionNote,
        timestamp: new Date().toISOString(),
        performer: 'Admin'
      };

      await updateDoc(leadRef, {
        status: newStatus,
        activityLog: arrayUnion(newActivity),
        updatedAt: serverTimestamp()
      });

      if (newStatus === 'Won') {
        playSound('WON');
      } else {
        playSound('SUCCESS');
      }

      toast({
        title: "Status Synchronized",
        description: `Entity shifted to ${newStatus} phase.`,
      });
    } catch (err) {
      toast({ title: "Sync Error", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddActivity = async (type: string, action: string, message?: string) => {
     if (!firestore) return;
     try {
       const leadRef = doc(firestore, "leads", lead.id!);
       const newActivity = {
         id: crypto.randomUUID(),
         type,
         action,
         note: message,
         timestamp: new Date().toISOString(),
         performer: 'Admin'
       };
       await updateDoc(leadRef, {
         activityLog: arrayUnion(newActivity),
         updatedAt: serverTimestamp()
       });
     } catch(e) {}
  };

  const QUICK_NOTES = [
    "Interested",
    "Proposal Sent",
    "Negotiation",
    "Won",
    "Lost"
  ];

  const handleQuickNote = (qNote: string) => {
    setNote(qNote);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl bg-white border-l border-slate-100 p-0 overflow-hidden flex flex-col">
        <SheetHeader className="p-10 bg-slate-50/50 border-b border-slate-100 text-left shrink-0">
           <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center text-white text-2xl font-black shadow-xl shrink-0">
                  {lead.name[0]}
                </div>
                <div className="space-y-1">
                   <SheetTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{lead.name}</SheetTitle>
                   <SheetDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lead.company} // {lead.source}</SheetDescription>
                </div>
              </div>
              
              <div className="text-right">
                 <div className="flex items-center gap-2 mb-1 justify-end">
                    <Zap size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Lead Score</span>
                 </div>
                 <div className="text-2xl font-black text-slate-900 leading-none mb-2">{score}</div>
                 <Progress value={score} className="h-1.5 w-24 bg-slate-200" />
              </div>
           </div>
           
           <div className="flex flex-wrap gap-3">
              <Badge className={cn(
                 "rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none",
                 lead.status === "Won" ? "bg-emerald-600 text-white shadow-[0_5px_15px_rgba(16,185,129,0.3)]" : 
                 lead.status === "Lost" ? "bg-slate-400 text-white" : 
                 "bg-slate-900 text-white"
              )}>
                 {lead.status}
              </Badge>
              <Badge className={cn(
                 "rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest border-none",
                 score > 70 ? "bg-red-100 text-red-700" : score > 40 ? "bg-blue-100 text-primary" : "bg-slate-100 text-slate-400"
              )}>
                 {score > 70 ? 'Hot' : score > 40 ? 'Warm' : 'Cold'}
              </Badge>
              <div className="h-px w-6 bg-slate-200 my-auto mx-1" />
              <button 
                onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`, '_blank')}
                className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
              >
                 <MessageCircle size={14} />
              </button>
              <button 
                onClick={() => window.open(`tel:${lead.phone}`, '_self')}
                className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                 <Phone size={14} />
              </button>
           </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
           {/* AI Insight Panel */}
           <motion.section 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="p-6 bg-primary border-none rounded-[2rem] shadow-xl shadow-primary/10 relative overflow-hidden group"
           >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.4em]">Tactical Suggestion Engine</span>
                </div>
                <h4 className="text-white font-black text-xl uppercase tracking-tighter leading-tight mb-4">
                  {isAiLoading ? "Processing Mission History..." : `“${aiSuggestion}”`}
                </h4>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
                   <Target size={10} /> High Impact Action
                </div>
              </div>
              <Zap className="absolute -right-4 -bottom-4 h-32 w-32 text-white opacity-[0.05] group-hover:scale-110 transition-transform duration-700" />
           </motion.section>

           {/* Core Parameters */}
           <section className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Core Parameters</h3>
              <div className="grid grid-cols-2 gap-6">
                 <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="p-2.5 bg-white rounded-xl text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                       <Mail size={16} />
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Uplink</p>
                        <p className="text-[11px] font-bold text-slate-900 truncate max-w-[150px]">{lead.email}</p>
                    </div>
                 </div>
                 <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="p-2.5 bg-white rounded-xl text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                       <Phone size={16} />
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Phone Link</p>
                        <p className="text-[11px] font-bold text-slate-900">{lead.phone}</p>
                    </div>
                 </div>
                 <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="p-2.5 bg-white rounded-xl text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                       <Calendar size={16} />
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Deadline</p>
                        <p className="text-[11px] font-bold text-slate-900">{lead.followUpDate ? formatDate(lead.followUpDate) : '-- --'}</p>
                    </div>
                 </div>
                 <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="p-2.5 bg-white rounded-xl text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                       <TrendingUp size={16} />
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Revenue Impact</p>
                        <p className="text-[11px] font-bold text-slate-900">₹{(lead.revenue || 0).toLocaleString()}</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Activity Timeline */}
           <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Mission Log</h3>
                <History className="text-slate-200" size={16} />
              </div>
              
              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                 {lead.activityLog && lead.activityLog.length > 0 ? (
                    lead.activityLog.slice().reverse().map((activity, i) => (
                       <div key={activity.id} className="relative flex gap-6 pl-12 group">
                          <div className={cn(
                             "absolute left-0 h-10 w-10 rounded-full border border-slate-100 bg-white flex items-center justify-center transition-all shadow-sm z-10",
                             activity.type === 'call' ? "text-blue-500" : activity.type === 'status_change' ? "text-emerald-500" : "text-slate-300"
                          )}>
                              {activity.type === 'call' ? <Phone size={14} /> : activity.type === 'status_change' ? <TrendingUp size={14} /> : <MessageSquare size={14} />}
                          </div>
                          <div className="flex-1 space-y-1">
                             <div className="flex items-center justify-between">
                                 <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{activity.action}</p>
                                 <p className="text-[8px] font-bold text-slate-400 uppercase">{formatDate(activity.timestamp, "MMM dd, HH:mm")}</p>
                             </div>
                             {activity.note && (
                                <p className="text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                                   "{activity.note}"
                                </p>
                             )}
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="pl-12 py-10">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Mission registry empty.</p>
                    </div>
                 )}
              </div>
           </section>
        </div>

        {/* Command Center (Sticky Bottom) */}
        <section className="p-8 bg-slate-50 border-t border-slate-100 space-y-6 shrink-0 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)]">
           <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                 {QUICK_NOTES.map(q => (
                    <button 
                       key={q}
                       onClick={() => handleQuickNote(q)}
                       className="px-4 py-1.5 rounded-full bg-white border border-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
                    >
                       {q}
                    </button>
                 ))}
              </div>
              
              <div className="relative group">
                <Textarea 
                   placeholder="ENTER MISSION NOTES OR LOG CALL SUMMARY..." 
                   value={note}
                   onChange={(e) => setNote(e.target.value)}
                   className="min-h-[100px] bg-white border-slate-200 rounded-2xl text-xs font-bold tracking-wider text-slate-900 placeholder:text-slate-300 focus-visible:ring-primary p-6 shadow-inner"
                />
                <Button 
                   size="sm"
                   disabled={!note.trim() || isSubmitting}
                   onClick={() => {
                        handleAddActivity('note', 'Intelligence Recorded', note);
                        setNote("");
                   }}
                   className="absolute right-4 bottom-4 h-10 w-10 p-0 rounded-xl bg-slate-900 hover:bg-primary text-white"
                >
                   <ChevronRight size={18} />
                </Button>
              </div>

              {/* Advanced One-Click Commands */}
              <div className="grid grid-cols-4 gap-3">
                 <Button 
                    variant="outline"
                    onClick={() => {
                        handleUpdateStatus('Contacted', 'Manual call uplink successful');
                        handleAddActivity('call', 'Call Initiated');
                    }}
                    className="h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 group"
                 >
                    <div className="flex flex-col items-center">
                       <Phone size={18} className="mb-1 group-hover:animate-bounce" />
                       <span className="text-[8px] font-black uppercase tracking-tighter">Call</span>
                    </div>
                 </Button>
                 <Button 
                    variant="outline"
                    onClick={() => handleUpdateStatus('Not Picked', 'Entity unavailable during primary uplink')}
                    className="h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-600 group"
                 >
                    <div className="flex flex-col items-center">
                       <XCircle size={18} className="mb-1 group-hover:rotate-90 transition-transform" />
                       <span className="text-[8px] font-black uppercase tracking-tighter">Missed</span>
                    </div>
                 </Button>
                 <Button 
                    variant="outline"
                    onClick={() => handleUpdateStatus('Meeting Fixed', 'Engagement scheduled')}
                    className="h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 group"
                 >
                    <div className="flex flex-col items-center">
                       <CheckCircle2 size={18} className="mb-1 group-hover:scale-110 transition-transform" />
                       <span className="text-[8px] font-black uppercase tracking-tighter">Fixed</span>
                    </div>
                 </Button>
                 <Button 
                    onClick={() => handleUpdateStatus('Won', 'Mission successful: Entity converted')}
                    className="h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-xl group"
                 >
                    <div className="flex flex-col items-center">
                       <Target size={18} className="mb-1 fill-white animate-pulse" />
                       <span className="text-[8px] font-black uppercase tracking-tighter text-white/80">WON</span>
                    </div>
                 </Button>
              </div>
           </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}
