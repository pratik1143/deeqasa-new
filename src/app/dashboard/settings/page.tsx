"use client";

import * as React from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { motion } from "framer-motion";
import { 
  User, 
  Shield, 
  Bell, 
  Save, 
  Loader2, 
  ShieldCheck,
  Smartphone,
  Globe,
  Lock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserWithRole } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { AlertMatrixHub } from "@/components/settings/alert-matrix-hub";

export default function SettingsPage() {
  const { user, profile } = useUserWithRole();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSaving, setIsSaving] = React.useState(false);

  // Profile States
  const [displayName, setDisplayName] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [photoURL, setPhotoURL] = React.useState("");

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setDesignation(profile.designation || "");
      setPhotoURL(profile.photoURL || "");
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) return;

    setIsSaving(true);
    try {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        displayName,
        designation,
        photoURL,
      });
      
      toast({
        title: "Matrix Identity Synchronized",
        description: "Your tactical parameters have been archived in the central registry.",
      });
    } catch (error) {
       toast({
        title: "Synchronization Failed",
        description: "Error updating identity protocol. Check uplink status.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">System Configuration</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Settings & <span className="text-slate-200">Security</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-6 max-w-xl">
            Calibrating operational parameters and access protocols. High-level security clearance detected.
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-slate-100/50 p-1.5 rounded-[2rem] h-16 w-full md:w-auto mb-10">
            <TabsTrigger value="profile" className="rounded-full px-8 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all">
              <User size={14} className="mr-2" /> Profile Identity
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-full px-8 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all">
              <Shield size={14} className="mr-2" /> Access Protocols
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-full px-8 h-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all">
              <Bell size={14} className="mr-2" /> Alert Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-8 outline-none">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-white border-slate-100 rounded-[3rem] shadow-sm overflow-hidden">
                <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                  <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Entity Parameters</CardTitle>
                  <CardDescription className="text-slate-400 font-medium italic mt-1">Manage your public presence within the mission matrix.</CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <form onSubmit={handleSaveProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global User Name</Label>
                          <Input 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="e.g. Rahul Singh"
                            className="bg-slate-50 border-slate-100 h-12 rounded-xl focus-visible:ring-primary shadow-inner font-bold uppercase text-[11px]" 
                          />
                       </div>
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uplink Email Address</Label>
                          <Input disabled value={user?.email || ""} className="bg-slate-100 border-slate-100 h-12 rounded-xl cursor-not-allowed opacity-60 font-medium text-[11px]" />
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Designation</Label>
                          <Input 
                            value={designation} 
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="e.g. Senior Sales Architect"
                            className="bg-slate-50 border-slate-100 h-12 rounded-xl focus-visible:ring-primary shadow-inner font-bold uppercase text-[11px]" 
                          />
                       </div>
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Picture (DP) URL</Label>
                          <Input 
                            value={photoURL} 
                            onChange={(e) => setPhotoURL(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="bg-slate-50 border-slate-100 h-12 rounded-xl focus-visible:ring-primary shadow-inner font-medium text-[11px]" 
                          />
                       </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button disabled={isSaving} type="submit" className="h-14 px-10 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl transition-all gap-2 group">
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        Store Identity Parameters
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security" className="space-y-8 outline-none">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white border-slate-100 rounded-[3rem] shadow-sm">
                  <CardHeader className="p-10">
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl w-fit mb-4">
                      <Lock size={20} />
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Password Update</CardTitle>
                    <CardDescription className="text-slate-400 font-medium italic mt-1">Recalibrate your access credentials.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Key</Label>
                      <Input type="password" placeholder="••••••••" className="bg-slate-50 border-slate-100 h-12 rounded-xl shadow-inner" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Matrix Key</Label>
                      <Input type="password" placeholder="••••••••" className="bg-slate-50 border-slate-100 h-12 rounded-xl shadow-inner" />
                    </div>
                    <Button className="w-full h-12 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all">Update Access Key</Button>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-100 rounded-[3rem] shadow-sm">
                  <CardHeader className="p-10">
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl w-fit mb-4">
                      <ShieldCheck size={20} />
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Biometric Link</CardTitle>
                    <CardDescription className="text-slate-400 font-medium italic mt-1">Multi-factor authentication protocols.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <Smartphone size={18} className="text-slate-400" />
                        <div>
                          <p className="text-[11px] font-black text-slate-900 uppercase">Device Auth</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mobile Link Protocol</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <Globe size={18} className="text-slate-400" />
                        <div>
                          <p className="text-[11px] font-black text-slate-900 uppercase">Geo-Fencing</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Location Guard Active</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-8 outline-none">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <AlertMatrixHub />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
