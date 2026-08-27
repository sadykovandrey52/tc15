import { Phone, Send, MapPin, Clock } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadForm from "@/components/LeadForm";
import { company } from "@/data/services";

export default function Contacts() {
  const crumbs = [{ name: "Главная", url: "/" }, { name: "Контакты", url: "/contacts" }];
  return (
    <>
      <SEO
        title="Контакты автосервиса Tech Center 15 в Москве"
        description={`${company.addressFull}. Телефон ${company.phone}. Telegram ${company.telegram}. Режим работы: ${company.hours}.`}
        canonical="/contacts"
        breadcrumbs={crumbs}
      />
      <section className="container-x py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-5xl md:text-6xl uppercase mt-4">Контакты</h1>
        <p className="text-muted-foreground mt-3">{company.name} — премиальный автосервис на Каширском шоссе.</p>
      </section>

      <section className="container-x py-6 grid lg:grid-cols-2 gap-8">
        <div className="bg-surface-2 border border-border rounded-2xl p-6 md:p-8 space-y-5">
          <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-gold mt-0.5" /><div><div className="text-xs uppercase tracking-wider text-muted-foreground">Адрес</div><div className="mt-1">{company.addressFull}</div></div></div>
          <div className="flex items-start gap-3"><Phone className="h-5 w-5 text-gold mt-0.5" /><div><div className="text-xs uppercase tracking-wider text-muted-foreground">Телефон</div><a className="mt-1 block hover:text-gold" href={`tel:${company.phonePlain}`}>{company.phone}</a></div></div>
          <div className="flex items-start gap-3"><Send className="h-5 w-5 text-gold mt-0.5" /><div><div className="text-xs uppercase tracking-wider text-muted-foreground">Telegram</div><a className="mt-1 block hover:text-gold" href={company.telegramUrl} target="_blank" rel="noreferrer">{company.telegram}</a></div></div>
          <div className="flex items-start gap-3"><Clock className="h-5 w-5 text-gold mt-0.5" /><div><div className="text-xs uppercase tracking-wider text-muted-foreground">Режим работы</div><div className="mt-1">{company.hours}</div></div></div>
          <div className="pt-4 border-t border-border">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Как добраться</div>
            <p className="text-sm text-muted-foreground">АТЦ Москва на Каширском шоссе. Заезжайте через основные ворота, поднимитесь на 4-й этаж, бокс №15.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a href={`tel:${company.phonePlain}`} className="btn-gold flex-1"><Phone className="h-4 w-4" /> Позвонить</a>
            <a href={company.telegramUrl} target="_blank" rel="noreferrer" className="btn-outline-gold flex-1"><Send className="h-4 w-4" /> Telegram</a>
            <a href={company.routeUrl} target="_blank" rel="noreferrer" className="btn-outline-gold flex-1"><MapPin className="h-4 w-4" /> Маршрут</a>
          </div>
        </div>

        <div className="aspect-square lg:aspect-auto rounded-2xl border border-border overflow-hidden min-h-[400px]">
          <iframe title="Карта" src="https://yandex.ru/map-widget/v1/?ll=37.679%2C55.661&z=15&pt=37.679,55.661,pm2rdm" className="w-full h-full" loading="lazy" />
        </div>
      </section>

      <section className="container-x py-12">
        <div className="max-w-3xl mx-auto"><LeadForm /></div>
      </section>
    </>
  );
}
