import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { blogPosts } from "@/data/services";

export default function BlogIndex() {
  return (
    <>
      <SEO
        title="Блог автосервиса Tech Center 15 — статьи о ремонте"
        description="Полезные статьи о ремонте автомобиля, диагностике, ТО и обслуживании. Опыт мастеров Tech Center 15."
        canonical="/blog"
        breadcrumbs={[{ name: "Главная", url: "/" }, { name: "Блог", url: "/blog" }]}
      />
      <section className="container-x py-10">
        <Breadcrumbs items={[{ name: "Главная", url: "/" }, { name: "Блог", url: "/blog" }]} />
        <h1 className="font-display text-5xl md:text-6xl uppercase mt-4">Блог</h1>
        <p className="text-muted-foreground mt-3">Гайды от практикующих мастеров.</p>
      </section>
      <section className="container-x py-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((p) => (
            <Link key={p.slug} to={p.url} className="group bg-surface-2 border border-border rounded-xl p-6 hover-lift hover:border-gold/40 block">
              <div className="text-xs text-muted-foreground flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {p.date} • {p.readTime}</div>
              <h3 className="font-head uppercase text-xl mt-3 group-hover:text-gold transition-colors">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{p.excerpt}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm text-gold">Читать <ArrowRight className="h-4 w-4" /></div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
