'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { CenteredLoader } from '@/components/ui/centered-loader';
import { Label } from '@/components/ui/label';

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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Link href="/" className="absolute top-4 left-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            &larr; Back to Home
        </Link>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
                <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">Admin Portal Access</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard.
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
                    />
                </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </form>
          {error && <p className="text-destructive text-center text-sm mt-4">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
