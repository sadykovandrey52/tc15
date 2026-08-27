import type { Make } from "@/data/services";
import { makeHeroImage, FALLBACK_CAR } from "@/utils/makeImage";

export default function MakeHero({ make, className = "" }: { make: Make; className?: string }) {
  const src = makeHeroImage(make.slug, make.imageQuery);
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border ${className}`}>
      <img
        src={src}
        alt={make.heroAlt}
        width={1408}
        height={896}
        loading="eager"
        decoding="async"
        // @ts-expect-error - fetchpriority is valid HTML, React types lag
        fetchpriority="high"
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_CAR;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-background/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
        <span className="inline-flex h-8 px-3 items-center rounded-full bg-gold/15 border border-gold/40 text-gold text-xs uppercase tracking-wider backdrop-blur">
          {make.name}
        </span>
      </div>
    </div>
  );
}
