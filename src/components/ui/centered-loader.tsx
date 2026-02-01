"use client";

import { cn } from '@/lib/utils';
import { LineLoader } from './line-loader';

export function CenteredLoader({ text = "Initializing", className }: { text?: string, className?: string }) {
  return (
    <div className={cn("fixed inset-0 z-[9999] flex flex-col items-center justify-center", className)}>
        <div className="w-1/3 max-w-xs">
            <LineLoader />
            {text && <p className="mt-3 text-center font-code text-[11px] text-muted-foreground/60 tracking-[0.05em]">{text}</p>}
        </div>
    </div>
  );
}
