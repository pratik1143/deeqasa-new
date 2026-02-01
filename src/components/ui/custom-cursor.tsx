"use client";

import { useMousePosition } from '@/hooks/use-mouse-position';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function CustomCursor() {
  const position = useMousePosition();
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer') {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const x = position.x;
  const y = position.y;

  return (
    <div
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[9999] rounded-full transition-transform duration-300 ease-out",
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
      }}
    >
        <div 
            className="w-10 h-10 rounded-full transition-all duration-300"
            style={{
                background: isPointer ? 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 60%)' : 'radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
            }}
        />
    </div>
  );
}
