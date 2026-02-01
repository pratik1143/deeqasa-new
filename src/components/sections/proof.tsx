import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

const caseStudiesData = [
  {
    client: "Global Finance Corp",
    result: "40% Reduction in Latency",
    imageId: "case-study-1"
  },
  {
    client: "Innovate Health",
    result: "99.999% Uptime Achieved",
    imageId: "case-study-2"
  },
];

const caseStudies = caseStudiesData.map(cs => {
  const imageData = PlaceHolderImages.find(img => img.id === cs.imageId);
  return { ...cs, ...imageData };
});

export function Proof() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto text-center mb-16">
        <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter">
          The Proof is in the Performance
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          See how we've transformed leading enterprises.
        </p>
      </div>
      <div className="container mx-auto space-y-16">
        {caseStudies.map((study, index) => (
          <div key={index} className="relative h-[60vh] min-h-[400px] rounded-lg overflow-hidden group">
            {study.imageUrl && (
              <Image
                src={study.imageUrl}
                alt={study.description || study.client}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={study.imageHint}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="relative z-10 h-full flex items-end p-8 md:p-12">
              <div className="bg-card/30 backdrop-blur-md p-6 rounded-lg border border-primary/10">
                <h3 className="font-headline text-2xl text-muted-foreground">{study.client}</h3>
                <p className="font-headline text-4xl md:text-5xl font-bold text-primary">{study.result}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
