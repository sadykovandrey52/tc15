import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Make } from "@/data/services";
import { ORIGIN_LABELS } from "@/data/services";
import { makeCardImage, FALLBACK_CAR } from "@/utils/makeImage";

export default function MakeCard({ make }: { make: Make }) {
  const src = makeCardImage(make.slug, make.cardQuery);
  return (
    <Link
      to={make.url}
      className="group relative block overflow-hidden rounded-xl border border-border bg-surface-2 hover:border-gold/40 transition-all"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={src}
          alt={make.cardAlt}
          width={600}
          height={400}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_CAR;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        <div>
          <div className="font-head uppercase text-xl leading-none text-foreground">{make.name}</div>
          <div className="text-xs text-muted-foreground mt-1">{ORIGIN_LABELS[make.origin]}</div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
