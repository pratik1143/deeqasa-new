import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { LenisProvider } from '@/components/layout/lenis-provider';
import { ThemeProviderClient } from '@/components/layout/theme-provider-client';

export const metadata: Metadata = {
  title: 'DEEQASA TECH',
  description: 'Smart. Secure. Sustainable. IT Solutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=IBM+Plex+Mono:wght@400;700&family=Space+Grotesk:wght@700&family=Outfit:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <FirebaseClientProvider>
          <ThemeProviderClient />
          <LenisProvider>
            {children}
            <Toaster />
          </LenisProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
