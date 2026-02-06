
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CenteredLoader } from '@/components/ui/centered-loader';
import { Label } from '@/components/ui/label';
import { LineLoader } from '@/components/ui/line-loader';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Credentials required for authentication.");
      return;
    };
    
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Authentication failed. Invalid identity credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return <CenteredLoader text="Verifying Identity..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black font-body">
      {/* Background Video Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-80"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Depth Layering Overlays */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />
      
      {/* Top Professional Accent */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="absolute top-0 left-0 w-full h-[2px] bg-primary z-20 origin-left shadow-[0_0_15px_rgba(0,224,255,0.5)]" 
      />
      
      {/* Main Content Container */}
      <div className="w-full max-w-[420px] relative z-20 flex flex-col items-center gap-10">
        
        {/* Branding Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Link href="/" className="group block">
            <motion.span 
              initial={{ letterSpacing: "0.2em" }}
              animate={{ letterSpacing: "0.4em" }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-4xl font-black text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] block"
            >
              DEEQASA
            </motion.span>
            <motion.div 
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mt-2 text-[10px] font-bold text-primary uppercase tracking-[0.3em]"
            >
              Enterprise Infrastructure
            </motion.div>
          </Link>
        </motion.div>

        {/* Glassmorphic Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
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
                  <Lock className="w-4 h-4 text-primary" />
                </motion.div>
              </div>
              <CardTitle className="text-xl font-bold tracking-tight text-white">Admin Authentication</CardTitle>
              <CardDescription className="text-white/40 text-xs font-medium uppercase tracking-widest">
                Identity & Access Management
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-8 px-8">
              <form onSubmit={handleLogin} className="space-y-6">
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
                    className="w-full h-12 font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 group" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-full px-4"><LineLoader className="h-0.5 bg-white/20" /></div>
                    ) : (
                      <>
                        Authorize Session
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
                    <p className="text-destructive text-center text-xs font-bold uppercase tracking-tighter">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="mt-8 pt-6 border-t border-white/5 text-center flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
                  End-to-End Encrypted Session
                </div>
                <Link href="/" className="text-[10px] font-bold text-white/40 hover:text-primary transition-colors uppercase tracking-widest border-b border-transparent hover:border-primary/30 pb-1">
                  &larr; Return to Infrastructure Site
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
