'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CenteredLoader } from '@/components/ui/centered-loader';
import { Label } from '@/components/ui/label';
import { LineLoader } from '@/components/ui/line-loader';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Credentials required for authentication.");
      return;
    };
    
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Automatically create admin profile for the prototype
        await setDoc(doc(firestore, 'users', userCredential.user.uid), {
          email: email,
          role: 'admin',
          createdAt: new Date().toISOString()
        });
      }
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Authentication failed. Invalid identity credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Identity already exists. Please use login protocol.');
      } else if (err.code === 'auth/weak-password') {
        setError('Security key is too weak. Minimum 6 characters required.');
      } else {
        setError('System error during authentication. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return <CenteredLoader text="Verifying Identity..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black font-body">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-black z-0" />
      <div className="absolute inset-0 command-grid opacity-20 pointer-events-none" />
      
      {/* Top Professional Accent */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="absolute top-0 left-0 w-full h-[2px] bg-primary z-20 origin-left shadow-[0_0_15px_rgba(0,224,255,0.5)]" 
      />
      
      {/* Main Content Container */}
      <div className="w-full max-w-[420px] relative z-20 flex flex-col items-center gap-8">
        
        {/* Branding Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Link href="/" className="group block">
            <span className="text-4xl font-black text-white uppercase tracking-tight block">
              DEEQASA
            </span>
            <div className="mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
              HP AUTHORIZED RESELLER
            </div>
          </Link>
        </motion.div>

        {/* Auth Mode Selector */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 rounded-full h-12 p-1">
            <TabsTrigger value="login" className="rounded-full text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black">
              Authorize
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-full text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black">
              Register
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full"
        >
          <Card className="w-full border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl ring-1 ring-white/5 overflow-hidden">
            <CardHeader className="text-center pt-8 space-y-2">
              <div className="flex justify-center mb-2">
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="p-2 rounded-full bg-primary/10 border border-primary/20"
                >
                  {mode === 'login' ? <Lock className="w-4 h-4 text-primary" /> : <UserPlus className="w-4 h-4 text-primary" />}
                </motion.div>
              </div>
              <CardTitle className="text-xl font-bold tracking-tight text-white uppercase tracking-[0.1em]">
                {mode === 'login' ? 'System Authorization' : 'New Identity Request'}
              </CardTitle>
              <CardDescription className="text-white/40 text-xs font-medium uppercase tracking-widest">
                {mode === 'login' ? 'Identity & Access Management' : 'Admin Infrastructure Access'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-8 px-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-white/50 group-focus-within:text-primary transition-colors">Corporate Identity</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@deeqasa.tech"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      className="bg-white/5 border-white/10 h-12 focus:bg-white/10 focus:ring-primary/30 transition-all text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-white/50 group-focus-within:text-primary transition-colors">Security Key</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="bg-white/5 border-white/10 h-12 focus:bg-white/10 focus:ring-primary/30 transition-all text-white placeholder:text-white/20"
                  />
                </div>
                
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    className="w-full h-12 font-bold text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 group" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-full px-4"><LineLoader className="h-0.5 bg-white/20" /></div>
                    ) : (
                      <>
                        {mode === 'login' ? 'Authorize Session' : 'Request Access'}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                  >
                    <p className="text-destructive text-center text-[10px] font-bold uppercase tracking-tight">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="mt-8 pt-6 border-t border-white/5 text-center flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
                  End-to-End Encrypted Session
                </div>
                <Link href="/" className="text-[10px] font-bold text-white/40 hover:text-primary transition-colors uppercase tracking-widest border-b border-transparent hover:border-primary/30 pb-1">
                  &larr; Return to Portal
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Terminal Info Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center space-y-3"
        >
          <div className="w-12 h-[1px] bg-white/10 mx-auto" />
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
            Secure Terminal <span className="text-white/40 font-code">v4.0.1</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
