import { useParams } from "react-router-dom";
import { Phone, AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceCard from "@/components/ServiceCard";
import Placeholder from "@/components/Placeholder";
import { imageForService } from "@/assets/serviceImages";
import ContactCTA from "@/components/ContactCTA";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getCategory, company } from "@/data/services";
import NotFound from "./NotFound";

export default function CategoryPage() {
  const { categorySlug = "" } = useParams();
  const c = getCategory(categorySlug);
  if (!c) return <NotFound />;

  const crumbs = [
    { name: "Главная", url: "/" },
    { name: "Услуги", url: "/services" },
    { name: c.name, url: c.url },
  ];

  return (
    <>
      <SEO
        title={`${c.name} в Москве — Tech Center 15`}
        description={c.description.slice(0, 160)}
        canonical={c.url}
        breadcrumbs={crumbs}
        collection={{
          name: c.name,
          description: c.description,
          items: c.services.map((s) => ({ name: s.name, url: s.url })),
        }}
      />

      {/* HERO */}
      <section className="container-x py-10">
        <Breadcrumbs items={crumbs} />
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 mt-6 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Категория</div>
            <h1 className="font-display text-5xl md:text-6xl uppercase">{c.name}</h1>
            <p className="text-muted-foreground mt-4 max-w-xl">{c.description}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href={`tel:${company.phonePlain}`} className="btn-gold"><Phone className="h-4 w-4" /> Записаться на диагностику</a>
            </div>
          </div>
          <Placeholder icon={c.icon} label={c.name} className="aspect-[4/3]" image={imageForService(undefined, c.id)} eager />
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="container-x py-10">
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Услуги раздела</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.services.map((s) => <ServiceCard key={s.id} s={s} />)}
        </div>
      </section>

      {/* SYMPTOMS */}
      <section className="container-x py-10">
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Когда нужен ремонт</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {c.symptoms.map((s) => (
            <div key={s} className="flex gap-3 bg-surface-2 border border-border rounded-lg p-4">
              <AlertCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-sm">{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRICE TABLE */}
      <section className="container-x py-10">
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Стоимость работ</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left">
              <tr>
                <th className="px-4 py-3 font-head uppercase">Работа</th>
                <th className="px-4 py-3 font-head uppercase">Стоимость от</th>
                <th className="px-4 py-3 font-head uppercase">Срок</th>
              </tr>
            </thead>
            <tbody>
              {c.services.map((s) => (
                <tr key={s.id} className="border-t border-border bg-surface/50">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3 text-gold font-semibold">от {s.priceFrom.toLocaleString("ru-RU")} ₽</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Цены указаны за выполнение работ. Стоимость запчастей согласовывается отдельно.</p>
      </section>

      {/* SEO TEXT */}
      <section className="container-x py-10">
        <Accordion type="single" collapsible>
          <AccordionItem value="more" className="border-border">
            <AccordionTrigger className="font-head uppercase hover:text-gold hover:no-underline">Читать подробнее о категории</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {c.longText}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <ContactCTA />
    </>
  );
}
