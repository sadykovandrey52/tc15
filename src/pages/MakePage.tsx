import { useParams } from "react-router-dom";
import { Phone } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceCard from "@/components/ServiceCard";
import LeadForm from "@/components/LeadForm";
import ContactCTA from "@/components/ContactCTA";
import MakeHero from "@/components/MakeHero";
import { getMake, getServiceById, company, reviews } from "@/data/services";
import { Star } from "lucide-react";
import NotFound from "./NotFound";

export default function MakePage() {
  const { makeSlug = "" } = useParams();
  const m = getMake(makeSlug);
  if (!m) return <NotFound />;

  const services = m.serviceIds.map(getServiceById).filter(Boolean) as NonNullable<ReturnType<typeof getServiceById>>[];
  const crumbs = [
    { name: "Главная", url: "/" },
    { name: "Марки авто", url: "/makes" },
    { name: m.name, url: m.url },
  ];

  return (
    <>
      <SEO
        title={m.seoTitle}
        description={m.seoDesc}
        canonical={m.url}
        breadcrumbs={crumbs}
        collection={{
          name: `Услуги для ${m.name}`,
          description: m.intro,
          items: services.map((s) => ({ name: s.name, url: s.url })),
        }}
      />
      <section className="container-x py-10">
        <Breadcrumbs items={crumbs} />
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 mt-6 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Марка</div>
            <h1 className="font-display text-5xl md:text-6xl uppercase">{m.h1}</h1>
            <p className="text-muted-foreground mt-4 max-w-xl">{m.intro}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href={`tel:${company.phonePlain}`} className="btn-gold"><Phone className="h-4 w-4" /> {company.phone}</a>
              <a href="#zayavka" className="btn-outline-gold">Записаться</a>
            </div>
          </div>
          <MakeHero make={m} className="aspect-[4/3]" />
        </div>
      </section>

      <section className="container-x py-10">
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Популярные услуги для {m.name}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <ServiceCard key={s.id} s={s} />)}
        </div>
      </section>

      <section className="container-x py-10">
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Отзывы клиентов</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.slice(0, 3).map((r, i) => (
            <div key={i} className="bg-surface-2 border border-border rounded-xl p-6">
              <div className="flex gap-0.5 mb-3 text-gold">
                {Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm">«{r.text}»</p>
              <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">{r.name} • {r.car}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="zayavka" className="container-x py-12 scroll-mt-20">
        <div className="max-w-3xl mx-auto"><LeadForm defaultMessage={`Ремонт ${m.name}`} /></div>
      </section>

      <ContactCTA />
    </>
  );
}
