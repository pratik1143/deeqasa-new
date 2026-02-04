export function Clients() {
  const partners = [
    "HP Enterprise",
    "Microsoft",
    "Cisco",
    "AWS",
    "Dell Technologies",
    "VMware",
    "SAP",
    "Intel",
  ];
  // Duplicate partners to ensure a seamless infinite loop
  const repeatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-16 sm:py-24 bg-background overflow-hidden">
      <div className="container mx-auto text-center">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Trusted by Fortune 500 and Industry Leaders
        </h2>
        <div className="relative mt-12 w-full overflow-hidden">
          <div className="flex w-max animate-marquee-infinite">
            {repeatedPartners.map((partner, index) => (
              <div key={index} className="mx-8 flex-shrink-0 text-2xl font-semibold text-foreground/60 hover:text-foreground transition-colors cursor-pointer">
                {partner}
              </div>
            ))}
          </div>
          {/* Gradient Overlays for Fade Effect */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
