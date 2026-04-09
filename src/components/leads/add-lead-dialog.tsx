"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, ShieldCheck, X } from "lucide-react";
import { LeadSchema } from "@/lib/schemas";
import { Lead } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUserWithRole } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function AddLeadDialog() {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, profile } = useUserWithRole();

  const form = useForm<any>({
    resolver: zodResolver(LeadSchema.omit({ id: true as any, createdAt: true as any, updatedAt: true as any })),
    defaultValues: {
      status: "New",
      revenue: 0,
      source: "Direct",
      assignedTo: user?.uid || "",
      assignedToName: profile?.email || user?.email || "",
    },
  });

  async function onSubmit(values: any) {
    if (!firestore || !user) return;
    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      await addDoc(collection(firestore, "leads"), {
        ...values,
        assignedTo: user.uid,
        assignedToName: profile?.email || user.email,
        createdAt: now,
        updatedAt: now,
      });

      toast({
        title: "Protocol Success",
        description: "New lead successfully integrated into the matrix.",
      });
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uplink Failed",
        description: error.message || "Failed to sync data with central registry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 px-6 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg transition-all gap-2 group">
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
          Ingest New Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white border-slate-100 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <DialogHeader className="bg-slate-50 border-b border-slate-100 p-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Secure Data Ingestion</span>
          </div>
          <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Entity Registration</DialogTitle>
          <DialogDescription className="text-slate-400 font-medium italic mt-2">
            Populating mission-critical lead data for administrative processing.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="bg-slate-50 border-slate-100 h-12 rounded-xl focus-visible:ring-primary shadow-inner" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company / Entity</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" className="bg-slate-50 border-slate-100 h-12 rounded-xl focus-visible:ring-primary shadow-inner" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uplink Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@acme.com" className="bg-slate-50 border-slate-100 h-12 rounded-xl focus-visible:ring-primary shadow-inner" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Identity</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 85952..." className="bg-slate-50 border-slate-100 h-12 rounded-xl focus-visible:ring-primary shadow-inner" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-50 border-slate-100 h-12 rounded-xl focus:ring-primary font-bold text-xs">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-slate-100 rounded-xl overflow-hidden">
                        {[
                          "New", 
                          "Contacted", 
                          "Not Picked", 
                          "Follow-up Scheduled", 
                          "Meeting Fixed", 
                          "Proposal Sent", 
                          "Negotiation", 
                          "Won", 
                          "Lost"
                        ].map(s => (
                          <SelectItem key={s} value={s} className="font-bold text-xs py-3 uppercase tracking-widest">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inflow Source</FormLabel>
                    <FormControl>
                      <Input placeholder="LinkedIn, Referral, etc." className="bg-slate-50 border-slate-100 h-12 rounded-xl focus-visible:ring-primary shadow-inner" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligence Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add strategic observations or follow-up protocols..." 
                      className="bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-primary min-h-[120px] shadow-inner" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setOpen(false)}
                className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest h-14"
              >
                Abort Protocol
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-slate-900 border border-slate-800 text-white hover:bg-primary hover:border-primary font-black uppercase tracking-[0.2em] text-[11px] h-14 rounded-2xl shadow-xl transition-all"
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Commit to Central Registry
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
