import { Link, useParams } from "react-router-dom";
import { Phone, AlertCircle, ShieldAlert, CheckCircle2, Clock, Wallet } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import Placeholder from "@/components/Placeholder";
import { imageForService, galleryForService, altForService } from "@/assets/serviceImages";
import ServiceCard from "@/components/ServiceCard";
import LeadForm from "@/components/LeadForm";
import FAQ from "@/components/FAQ";
import ContactCTA from "@/components/ContactCTA";
import StickyServiceCTA from "@/components/StickyServiceCTA";
import { getService, getServiceById, categories, company } from "@/data/services";
import { trackEvent } from "@/utils/analytics";
import { generateHeroAlt, generateGalleryAlts } from "@/utils/altGenerator";
import NotFound from "./NotFound";

export default function ServicePage() {
  const { categorySlug = "", serviceSlug = "" } = useParams();
  const s = getService(categorySlug, serviceSlug);
  const cat = categories.find((c) => c.id === s?.categoryId);
  if (!s || !cat) return <NotFound />;

  const crumbs = [
    { name: "Главная", url: "/" },
    { name: "Услуги", url: "/services" },
    { name: cat.name, url: cat.url },
    { name: s.name, url: s.url },
  ];
  const related = s.related.map(getServiceById).filter(Boolean) as ReturnType<typeof getServiceById>[];

  return (
    <>
      <SEO
        title={s.seoTitle}
        description={s.seoDesc}
        canonical={s.url}
        breadcrumbs={crumbs}
        faq={s.faq}
        faqContext={s.name}
        service={{ name: s.name, description: s.seoDesc, priceFrom: s.priceFrom }}
      />

      {/* HERO */}
      <section className="container-x py-10" data-testid="service-hero">
        <Breadcrumbs items={crumbs} />
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 mt-6 items-center">
          <div>
            <Link to={cat.url} className="inline-block text-xs uppercase tracking-[0.3em] text-gold border border-gold/30 rounded-full px-3 py-1 hover:bg-gold/10">{cat.name}</Link>
            <h1 className="font-display text-4xl md:text-6xl uppercase mt-4 leading-[0.95]">{s.h1}</h1>
            <p className="text-muted-foreground mt-4 max-w-xl">{s.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2 border border-border"><Wallet className="h-3.5 w-3.5 text-gold" /> от {s.priceFrom.toLocaleString("ru-RU")} ₽</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2 border border-border"><Clock className="h-3.5 w-3.5 text-gold" /> {s.duration}</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2 border border-border"><CheckCircle2 className="h-3.5 w-3.5 text-gold" /> гарантия {s.warranty}</span>
            </div>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a href="#zayavka" className="btn-gold">Записаться на ремонт</a>
              <a href={`tel:${company.phonePlain}`} onClick={() => trackEvent("click_phone", { service_name: s.name, service_slug: s.slug, category_name: cat.name, source: "hero" })} className="btn-outline-gold"><Phone className="h-4 w-4" /> {company.phone}</a>
            </div>
          </div>
          <Placeholder
            icon={s.icon}
            label={s.name}
            alt={generateHeroAlt(s.name)}
            className="aspect-[4/3]"
            image={imageForService(s.id, s.categoryId)}
            eager
          />
        </div>
      </section>

      {/* SYMPTOMS */}
      <section className="container-x py-10">
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Когда нужна услуга</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {s.symptoms.map((sym) => (
            <div key={sym} className="flex gap-3 bg-surface-2 border border-border rounded-lg p-4">
              <AlertCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-sm">{sym}</span>
            </div>
          ))}
        </div>
      </section>

      {/* RISKS */}
      <section className="container-x py-10">
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Что будет, если тянуть</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {s.risks.map((r) => (
            <div key={r} className="flex gap-3 bg-destructive/5 border border-destructive/30 rounded-lg p-4">
              <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <span className="text-sm">{r}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-surface-2 border-y border-border py-14">
        <div className="container-x">
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-8">Как мы работаем</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {s.process.map((p, i) => (
              <div key={p} className="bg-background border border-border rounded-xl p-5">
                <div className="font-display text-3xl text-gold/50 mb-2">0{i + 1}</div>
                <div className="text-sm">{p}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE */}
      <section className="container-x py-12">
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Стоимость работ</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left">
              <tr>
                <th className="px-4 py-3 font-head uppercase">Наименование</th>
                <th className="px-4 py-3 font-head uppercase">Стоимость работы</th>
                <th className="px-4 py-3 font-head uppercase">Срок выполнения</th>
              </tr>
            </thead>
            <tbody>
              {s.priceTable.map((row) => (
                <tr key={row.title} className="border-t border-border bg-surface/50">
                  <td className="px-4 py-3">{row.title}</td>
                  <td className="px-4 py-3 text-gold font-semibold">{row.price}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Цены указаны за выполнение работ. Стоимость запчастей согласовывается отдельно.</p>
      </section>

      {/* GALLERY */}
      <section className="container-x py-10">
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Фотогалерея</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(() => {
            const imgs = galleryForService(s.id, s.categoryId).slice(0, 3);
            const alts = generateGalleryAlts(s.name, imgs.length);
            return imgs.map((img, i) => (
              <Placeholder
                key={img + i}
                icon={s.icon}
                label={`${altForService(s.name)} — фото ${i + 1}`}
                alt={alts[i]}
                className="aspect-[4/3]"
                image={img}
              />
            ));
          })()}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-10">
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Частые вопросы</h2>
        <div className="bg-surface-2 border border-border rounded-xl p-2 md:p-6">
          <FAQ items={s.faq} />
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="container-x py-10">
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Связанные услуги</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => r && <ServiceCard key={r.id} s={r} />)}
          </div>
        </section>
      )}

      {/* LEAD FORM */}
      <section id="zayavka" className="container-x py-12 scroll-mt-20" data-testid="booking-form">
        <div className="max-w-3xl mx-auto">
          <LeadForm defaultMessage={s.name} ctx={{ service_name: s.name, service_slug: s.slug, category_name: cat.name }} />
        </div>
      </section>

      <ContactCTA />
      <StickyServiceCTA ctx={{ service_name: s.name, service_slug: s.slug, category_name: cat.name }} />
    </>
  );
}
