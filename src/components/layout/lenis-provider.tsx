"use client";

import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Disable Lenis on the admin and internal dashboards
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 2.2, smoothWheel: true, orientation: 'vertical', gestureOrientation: 'vertical' }}>
      {children}
    </ReactLenis>
  );
}
