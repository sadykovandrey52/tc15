import { Link, useParams } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceCard from "@/components/ServiceCard";
import ContactCTA from "@/components/ContactCTA";
import { getBlogPost, getServiceById } from "@/data/services";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { postSlug = "" } = useParams();
  const p = getBlogPost(postSlug);
  if (!p) return <NotFound />;
  const related = p.relatedServices.map(getServiceById).filter(Boolean) as NonNullable<ReturnType<typeof getServiceById>>[];

  const crumbs = [
    { name: "Главная", url: "/" },
    { name: "Блог", url: "/blog" },
    { name: p.title, url: p.url },
  ];

  return (
    <>
      <SEO title={p.seoTitle} description={p.seoDesc} canonical={p.url} breadcrumbs={crumbs} type="article" />
      <article className="container-x py-10 max-w-3xl">
        <Breadcrumbs items={crumbs} />
        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-4"><Calendar className="h-3.5 w-3.5" /> {p.date} • {p.readTime}</div>
        <h1 className="font-display text-4xl md:text-5xl uppercase mt-3 leading-tight">{p.h1}</h1>
        <p className="text-muted-foreground mt-4 text-lg">{p.excerpt}</p>
        <div className="mt-8 space-y-8">
          {p.sections.map((sec) => (
            <section key={sec.heading}>
              <h2 className="font-head text-2xl uppercase text-gold mb-3">{sec.heading}</h2>
              <p className="text-foreground/85 leading-relaxed">{sec.body}</p>
            </section>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="container-x py-10">
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Связанные услуги</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <ServiceCard key={r.id} s={r} />)}
          </div>
        </section>
      )}

      <section className="container-x py-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all">← Все статьи блога</Link>
      </section>
      <ContactCTA />
    </>
  );
}
