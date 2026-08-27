import { useState, useMemo } from "react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactCTA from "@/components/ContactCTA";
import MakeCard from "@/components/MakeCard";
import { makes, ORIGIN_LABELS, type MakeOrigin } from "@/data/services";

const FILTERS: Array<{ key: "all" | MakeOrigin; label: string }> = [
  { key: "all", label: "Все марки" },
  { key: "german", label: "Германия" },
  { key: "japanese", label: "Япония" },
  { key: "korean", label: "Корея" },
  { key: "british", label: "Великобритания" },
  { key: "american", label: "США" },
  { key: "french", label: "Франция" },
  { key: "chinese", label: "Китай" },
];

export default function MakesIndex() {
  const [filter, setFilter] = useState<"all" | MakeOrigin>("all");
  const crumbs = [{ name: "Главная", url: "/" }, { name: "Марки авто", url: "/makes" }];

  const filtered = useMemo(
    () => (filter === "all" ? makes : makes.filter((m) => m.origin === filter)),
    [filter],
  );

  // Only show filters that have at least one make
  const availableFilters = FILTERS.filter(
    (f) => f.key === "all" || makes.some((m) => m.origin === f.key),
  );

  return (
    <>
      <SEO
        title="Ремонт авто по маркам в Москве — Tech Center 15"
        description="Ремонт и обслуживание Audi, BMW, Mercedes, Porsche, VW, Skoda, Toyota, Kia и других марок в Москве на Каширском шоссе."
        canonical="/makes"
        breadcrumbs={crumbs}
        collection={{
          name: "Ремонт авто по маркам",
          description: "Премиальный сервис на Каширском шоссе. Полный список марок.",
          items: makes.map((m) => ({ name: m.name, url: m.url })),
        }}
      />
      <section className="container-x py-10">
        <Breadcrumbs items={crumbs} />
        <div className="text-xs uppercase tracking-[0.3em] text-gold mt-6 mb-3">Марки авто</div>
        <h1 className="font-display text-5xl md:text-6xl uppercase">Все марки авто</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Обслуживаем {makes.length}+ марок: премиум и массовые автомобили. Знаем особенности
          конструкции, электронные блоки и слабые места — экономим ваше время.
        </p>
      </section>

      <section className="container-x pb-4">
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                  active
                    ? "bg-gold text-background border-gold font-semibold"
                    : "bg-transparent text-muted-foreground border-border hover:border-gold/40 hover:text-foreground"
                }`}
              >
                {f.label}
                {f.key !== "all" && (
                  <span className="ml-1.5 opacity-60">
                    ({makes.filter((m) => m.origin === f.key).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="container-x py-8">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground">Нет марок в этой категории.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((m) => (
              <MakeCard key={m.slug} make={m} />
            ))}
          </div>
        )}
      </section>

      <ContactCTA />
    </>
  );
}

// Helper for grouping by origin
export const _filterByOrigin = (origin: MakeOrigin) => makes.filter((m) => m.origin === origin);
export { ORIGIN_LABELS };
