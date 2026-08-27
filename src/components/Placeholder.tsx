import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  className?: string;
  image?: string;
  eager?: boolean;
  alt?: string;
};

export default function Placeholder({ icon: Icon, label, className = "", image, eager = false, alt }: Props) {
  if (image) {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-border ${className}`}>
        <img
          src={image}
          alt={alt ?? label}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 border border-gold/40 text-gold backdrop-blur">
            <Icon className="h-4 w-4" />
          </span>
          <span className="font-head text-xs uppercase tracking-wider text-foreground/90 line-clamp-1">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-2 to-background border border-border flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="relative flex flex-col items-center gap-3 p-6 text-center">
        <div className="h-14 w-14 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
          <Icon className="h-7 w-7" />
        </div>
        <div className="font-head text-sm uppercase tracking-wider text-foreground/80">{label}</div>
      </div>
    </div>
  );
}
