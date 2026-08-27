import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export type Crumb = { name: string; url: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.url} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />}
              {last ? (
                <span className="text-foreground/80">{c.name}</span>
              ) : (
                <Link to={c.url} className="hover:text-gold transition-colors">{c.name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
