import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceCard from "@/components/ServiceCard";
import { categories, allServices } from "@/data/services";

export default function AllServices() {
  return (
    <>
      <SEO
        title="Все услуги автосервиса в Москве | Tech Center 15"
        description="Полный каталог услуг автосервиса Tech Center 15: ремонт подвески, рулевого, ГРМ, диагностика, ТО, тормоза. Гарантия 12 месяцев."
        canonical="/services"
        breadcrumbs={[{ name: "Главная", url: "/" }, { name: "Услуги", url: "/services" }]}
      />
      <section className="container-x py-12">
        <Breadcrumbs items={[{ name: "Главная", url: "/" }, { name: "Услуги", url: "/services" }]} />
        <h1 className="font-display text-5xl md:text-6xl uppercase mt-4">Все услуги</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">{allServices.length} услуг в {categories.length} категориях. Слесарные и агрегатные работы, диагностика и ТО. Гарантия 12 месяцев.</p>
      </section>

      {categories.map((c) => (
        <section key={c.id} className="container-x py-8">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-display text-3xl md:text-4xl uppercase">{c.name}</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{c.description}</p>
            </div>
            <Link to={c.url} className="text-sm text-gold hover:underline whitespace-nowrap">Перейти →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.services.map((s) => <ServiceCard key={s.id} s={s} />)}
          </div>
        </section>
      ))}
    </>
  );
}
