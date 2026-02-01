import { cn } from "@/lib/utils";

export const LineLoader = ({ className }: { className?: string }) => {
    return (
        <div className={cn("relative w-full h-1 overflow-hidden rounded-full bg-primary/20", className)}>
            <div
                className="absolute inset-0 w-full h-full bg-primary animate-line-loader"
                style={{
                    background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
                    backgroundSize: '200% 100%',
                }}
            />
        </div>
    );
};
