"use client";

interface QasaOrbProps {
  onClick: () => void;
}

export function QasaOrb({ onClick }: QasaOrbProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full cursor-pointer group"
      aria-label="Activate QASA AI Assistant"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald to-accent rounded-full animate-pulse-slow opacity-50 blur-lg group-hover:opacity-75 group-hover:blur-xl transition-all duration-300"></div>
      <div className="absolute inset-1 bg-background rounded-full"></div>
      <div className="absolute inset-0 rounded-full animate-spin-slow">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2.5 bg-primary rounded-full"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-accent rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-0.5 bg-emerald rounded-full"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-emerald/30 to-accent/30 rounded-full group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
    </button>
  );
}
