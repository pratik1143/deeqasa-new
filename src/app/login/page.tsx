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
    return <CenteredLoader text="Redirecting..." />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Layer 1: Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Layer 2: Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Layer 3: Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <Link href="/" className="absolute top-4 left-4 text-sm font-medium text-white/80 hover:text-primary transition-colors">
              &larr; Back to Home
        </Link>
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
            <div className="text-center">
                <Image 
                  src="/logo_hp.png" 
                  alt="DEEQASA TECH" 
                  width={240} 
                  height={60} 
                  className="h-16 w-auto object-contain mb-4 mx-auto"
                />
                <h1 className="text-xl font-headline font-bold tracking-widest text-white/90 uppercase">Admin Portal</h1>
            </div>
            <Card className="w-full bg-card/80 backdrop-blur-md border-primary/20 shadow-2xl">
                <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Secure Access</CardTitle>
                <CardDescription>
                    Authorized personnel only.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@deeqasa.tech"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                                autoComplete="email"
                                className="bg-background/50 border-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                                autoComplete="current-password"
                                className="bg-background/50 border-primary/20"
                            />
                        </div>
                    <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                        {isLoading ? <div className="w-4 h-4 mr-2 flex items-center"><LineLoader className="h-0.5"/></div> : null}
                        Sign In
                    </Button>
                    </form>
                {error && <p className="text-destructive text-center text-sm mt-4 font-medium">{error}</p>}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
