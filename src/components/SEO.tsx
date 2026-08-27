import { Helmet } from "react-helmet-async";
import { company } from "@/data/services";

type Crumb = { name: string; url: string };

type Props = {
  title: string;
  description: string;
  canonical?: string;
  breadcrumbs?: Crumb[];
  faq?: { q: string; a: string }[];
  service?: { name: string; description: string; priceFrom?: number };
  collection?: { name: string; description: string; items: { name: string; url: string }[] };
  type?: "website" | "article";
  /** Имя услуги — используется для проверки релевантности FAQ-ответов */
  faqContext?: string;
};

const SITE = "https://tc15.ru";

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Каширское шоссе, д. 61 к3А",
  addressLocality: "Москва",
  addressCountry: "RU",
};

const localBusiness = () => ({
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: company.name,
  telephone: company.phonePlain,
  address: ADDRESS,
  url: SITE,
  openingHours: "Mo-Su 09:00-21:00",
  priceRange: "₽₽",
  areaServed: "Москва",
});

export default function SEO({ title, description, canonical, breadcrumbs, faq, service, collection, type = "website", faqContext }: Props) {
  const url = canonical ? `${SITE}${canonical}` : SITE;
  const ld: Record<string, unknown>[] = [localBusiness()];

  if (breadcrumbs?.length) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: `${SITE}${b.url}`,
      })),
    });
  }
  if (faq?.length) {
    const seenPairs = new Set<string>();
    const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
    // Контекст для проверки релевантности: имя услуги или title
    const ctx = norm(faqContext || service?.name || title || "");
    const ctxWords = ctx.split(" ").filter((w) => w.length > 3);
    const isRelevant = (a: string) => {
      if (!ctxWords.length) return true;
      const an = norm(a);
      return ctxWords.some((w) => an.includes(w));
    };

    const irrelevant: { q: string; a: string }[] = [];
    const valid = faq
      .filter((f) => f && typeof f.q === "string" && typeof f.a === "string")
      .map((f) => ({ q: f.q.trim().replace(/\s+/g, " "), a: f.a.trim().replace(/\s+/g, " ") }))
      .filter((f) => f.q.length > 0 && f.a.length > 0)
      // Дедуп по паре q+a
      .filter((f) => {
        const k = `${norm(f.q)}|||${norm(f.a)}`;
        if (seenPairs.has(k)) return false;
        seenPairs.add(k);
        return true;
      })
      // Релевантность ответа
      .filter((f) => {
        const ok = isRelevant(f.a);
        if (!ok) irrelevant.push(f);
        return ok;
      });

    if (import.meta.env.DEV && irrelevant.length) {
      // eslint-disable-next-line no-console
      console.warn(`[FAQ JSON-LD] ${canonical ?? "page"}: ${irrelevant.length} ответ(а) не содержат ключевых слов "${ctx}":`,
        irrelevant.map((f) => f.q.slice(0, 60)));
    }

    if (valid.length >= 2) {
      ld.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: valid.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    } else if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[JSON-LD] FAQPage skipped on ${canonical ?? "page"}: <2 valid FAQ (${valid.length})`);
    }
  }
  if (service) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.description,
      provider: { "@type": "AutoRepair", name: company.name, telephone: company.phonePlain, address: ADDRESS },
      areaServed: "Москва",
      ...(service.priceFrom ? { offers: { "@type": "Offer", price: service.priceFrom, priceCurrency: "RUB", availability: "https://schema.org/InStock" } } : {}),
    });
  }
  if (collection) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: collection.name,
      description: collection.description,
      url,
    });
    ld.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: collection.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: `${SITE}${it.url}`,
      })),
    });
  }

  return (
    <Helmet>
      <html lang="ru" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ru_RU" />
      <meta name="twitter:card" content="summary_large_image" />
      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(obj)}</script>
      ))}
    </Helmet>
  );
}
