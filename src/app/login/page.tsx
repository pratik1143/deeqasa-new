'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { CenteredLoader } from '@/components/ui/centered-loader';
import { Label } from '@/components/ui/label';
import { LineLoader } from '@/components/ui/line-loader';

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
      setError("Please enter both email and password.");
      return;
    };
    
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return <CenteredLoader text="Authenticating..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center gap-8">
        <Link href="/" className="group transition-transform duration-250 hover:scale-[1.05] block relative h-16 w-full">
            <Image 
              src="/logo_hp.png" 
              alt="DEEQA SA TECH" 
              fill
              className="object-contain"
              priority
            />
        </Link>
        
        <Card className="w-full border-gray-100 shadow-2xl shadow-gray-200/50 bg-white">
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">Admin Portal</CardTitle>
            <CardDescription className="text-gray-500 font-medium">
              Enterprise Identity Verification
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">Corporate Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@deeqasa.tech"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                  className="bg-gray-50/50 border-gray-200 h-11 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500">Security Credential</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                  className="bg-gray-50/50 border-gray-200 h-11 focus:bg-white transition-colors"
                />
              </div>
              
              <Button type="submit" className="w-full h-11 font-bold text-sm bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? <div className="w-6"><LineLoader className="h-0.5 bg-white/20" /></div> : "Sign In to Portal"}
              </Button>
            </form>
            
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-center text-xs font-bold">{error}</p>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link href="/" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">
                &larr; Return to Infrastructure Site
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
          Secure Terminal v4.0.1
        </p>
      </div>
    </div>
  );
}