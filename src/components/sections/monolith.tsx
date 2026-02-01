"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MonolithProps {
  icon: React.ReactNode;
  title: string;
  statistic: string;
  description: string;
}

export function Monolith({ icon, title, statistic, description }: MonolithProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="perspective-1000 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative w-full h-80 transition-transform duration-700 transform-style-preserve-3d",
          isHovered && "rotate-y-180"
        )}
      >
        {/* Front face */}
        <Card className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center text-center p-6 bg-card/50 backdrop-blur-sm border-primary/10 group-hover:border-primary/30 transition-colors">
          <div className="text-primary mb-4 transition-transform duration-300 group-hover:scale-110">{icon}</div>
          <h3 className="font-headline text-2xl font-bold">{title}</h3>
        </Card>
        
        {/* Back face */}
        <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center p-6 bg-card/50 backdrop-blur-sm border-accent/10 group-hover:border-accent/30 transition-colors">
          <p className="font-code text-5xl font-bold text-accent">{statistic}</p>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </Card>
      </div>
    </div>
  );
}
