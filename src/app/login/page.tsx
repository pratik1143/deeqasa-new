'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CenteredLoader } from '@/components/ui/centered-loader';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
    grecaptcha?: any;
  }
}

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!auth) return;
    
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved.
        }
      });
    }
  }, [auth]);

  const handlePhoneNumberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phoneNumber || !window.recaptchaVerifier) {
      setError("Please enter a phone number.");
      return;
    };
    
    setIsLoading(true);

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
    } catch (err: any) {
      console.error(err);
      setError('Failed to send OTP. Please check the phone number and try again (e.g., +1234567890).');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
            if (window.grecaptcha) {
                window.grecaptcha.reset(widgetId);
            }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !window.confirmationResult) return;

    setIsLoading(true);
    setError(null);

    try {
      await window.confirmationResult.confirm(otp);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid OTP. Please try again.');
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
          <CardTitle className="text-2xl font-headline">Secure Access</CardTitle>
          <CardDescription>
            {isOtpSent ? 'Enter the OTP sent to your phone.' : 'Enter your phone number to continue.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div id="recaptcha-container"></div>
          {!isOtpSent ? (
            <form onSubmit={handlePhoneNumberSubmit} className="space-y-6">
              <Input
                id="phone"
                type="tel"
                placeholder="+1 555 555 5555"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                required
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
                required
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Verify & Continue
              </Button>
            </form>
          )}
          {error && <p className="text-destructive text-center text-sm mt-4">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
