import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/data/services";

export default function CategoryCard({ c }: { c: Category }) {
  const Icon = c.icon;
  return (
    <div className="bg-surface-2 border border-border rounded-xl p-6 flex flex-col hover-lift hover:border-gold/40 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-12 w-12 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-head text-xl uppercase">{c.name}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{c.description}</p>
      <ul className="mt-4 space-y-1.5 flex-1">
        {c.services.slice(0, 4).map((s) => (
          <li key={s.id}>
            <Link to={s.url} className="text-sm text-foreground/85 hover:text-gold transition-colors flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-gold" /> {s.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link to={c.url} className="mt-5 inline-flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all">
        Все услуги раздела <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
