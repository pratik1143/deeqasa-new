import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { LenisProvider } from '@/components/layout/lenis-provider';
import { ThemeProviderClient } from '@/components/layout/theme-provider-client';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

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
        {/* Google Analytics 4 Script - Loaded ONCE at root level */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

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

