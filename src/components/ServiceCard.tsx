import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/data/services";

export default function ServiceCard({ s }: { s: Service }) {
  const Icon = s.icon;
  return (
    <Link to={s.url} className="group block bg-surface-2 border border-border rounded-xl p-5 hover-lift hover:border-gold/40 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs text-muted-foreground">{s.warranty}</span>
      </div>
      <h3 className="font-head text-lg leading-tight">{s.name}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{s.short}</p>
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
        <span className="text-gold font-semibold">от {s.priceFrom.toLocaleString("ru-RU")} ₽</span>
        <span className="text-muted-foreground">{s.duration}</span>
      </div>
      <div className="mt-3 inline-flex items-center gap-1 text-sm text-foreground/85 group-hover:text-gold transition-colors">
        Подробнее <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
