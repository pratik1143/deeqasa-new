export function Sustainability() {
  return (
    <section className="bg-card py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto text-center">
        <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter">
          Building a Sustainable Future
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Our commitment to green technology is not an afterthought. It's our core.
        </p>
        <div className="relative mt-12 h-96 w-full max-w-4xl mx-auto">
          <svg viewBox="0 0 800 400" className="w-full h-full opacity-70">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="50%" stopColor="hsl(var(--emerald-hsl))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Nodes */}
            <g style={{ filter: 'url(#glow)' }}>
              <circle cx="100" cy="200" r="10" fill="url(#line-gradient)" className="animate-pulse" />
              <circle cx="280" cy="80" r="8" fill="url(#line-gradient)" className="animate-pulse" style={{ animationDelay: '0.2s' }}/>
              <circle cx="280" cy="320" r="8" fill="url(#line-gradient)" className="animate-pulse" style={{ animationDelay: '0.4s' }}/>
              <circle cx="520" cy="80" r="8" fill="url(#line-gradient)" className="animate-pulse" style={{ animationDelay: '0.6s' }}/>
              <circle cx="520" cy="320" r="8" fill="url(#line-gradient)" className="animate-pulse" style={{ animationDelay: '0.8s' }}/>
              <circle cx="700" cy="200" r="10" fill="url(#line-gradient)" className="animate-pulse" style={{ animationDelay: '1s' }}/>
            </g>

            {/* Connections */}
            <g stroke="url(#line-gradient)" strokeWidth="1" fill="none">
              <path d="M 110 200 C 190 120, 190 120, 272 85" strokeDasharray="300" strokeDashoffset="300" className="animate-draw" style={{ animationDelay: '0.2s' }} />
              <path d="M 110 200 C 190 280, 190 280, 272 315" strokeDasharray="300" strokeDashoffset="300" className="animate-draw" style={{ animationDelay: '0.4s' }} />
              <path d="M 288 80 C 350 80, 450 80, 512 80" strokeDasharray="300" strokeDashoffset="300" className="animate-draw" style={{ animationDelay: '0.8s' }} />
              <path d="M 288 320 C 350 320, 450 320, 512 320" strokeDasharray="300" strokeDashoffset="300" className="animate-draw" style={{ animationDelay: '1s' }} />
              <path d="M 528 85 C 600 120, 600 120, 690 190" strokeDasharray="300" strokeDashoffset="300" className="animate-draw" style={{ animationDelay: '1.2s' }} />
              <path d="M 528 315 C 600 280, 600 280, 690 210" strokeDasharray="300" strokeDashoffset="300" className="animate-draw" style={{ animationDelay: '1.4s' }} />
              <path d="M 285 80 L 515 320" strokeDasharray="500" strokeDashoffset="500" className="animate-draw" style={{ animationDelay: '1.6s' }} opacity="0.5"/>
              <path d="M 285 320 L 515 80" strokeDasharray="500" strokeDashoffset="500" className="animate-draw" style={{ animationDelay: '1.8s' }} opacity="0.5"/>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
