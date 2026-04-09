"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ThemeProviderClient() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, [pathname]);

  return null;
}
