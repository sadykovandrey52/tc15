import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import useEmblaCarousel from "embla-carousel-react";
import {
  Phone, Send, MapPin, Clock, Star, Award, Shield, Wrench,
  ChevronRight, ArrowRight, Calendar, Search, FileCheck, Hammer, KeyRound, Car,
} from "lucide-react";
import SEO from "@/components/SEO";
import CategoryCard from "@/components/CategoryCard";
import Marquee from "@/components/Marquee";
import ContactCTA from "@/components/ContactCTA";
import {
  categories, company, popularServices, reviews,
} from "@/data/services";
import { heroImage } from "@/assets/serviceImages";

const trust = [
  { icon: Star, label: `${company.rating} / 5`, sub: "рейтинг клиентов" },
  { icon: Wrench, label: `${company.repairsCount}+`, sub: "выполненных ремонтов" },
  { icon: Award, label: `${company.yearsExperience} лет`, sub: "опыта" },
  { icon: Shield, label: `${company.warrantyMonths} мес`, sub: "гарантия" },
];

const steps = [
  { icon: Calendar, name: "Запись", text: "По телефону или в Telegram" },
  { icon: Search, name: "Диагностика", text: "На подъёмнике или сканером" },
  { icon: FileCheck, name: "Согласование", text: "Стоимость работ и запчастей" },
  { icon: Hammer, name: "Ремонт", text: "Качественно и в срок" },
  { icon: KeyRound, name: "Выдача", text: "С гарантией на работы" },
];

export default function Home() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <>
      <SEO
        title="Tech Center 15 — премиальный автосервис в Москве на Каширском шоссе"
        description="Слесарные и агрегатные работы в Москве. Подвеска, рулевое, ГРМ, диагностика, ТО. Гарантия 12 месяцев. Tech Center 15."
        canonical="/"
      />

      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden scanline vignette">
        <img src={heroImage} alt="" aria-hidden fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <motion.div
          aria-hidden
          className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-gold/10 blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="container-x relative py-24 md:py-32">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold border border-gold/30 rounded-full px-4 py-1.5">
              Премиальный автосервис в Москве
            </div>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.95]">
              Ремонт автомобилей<br /> <span className="text-gold">любой</span> сложности
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Слесарные и агрегатные работы на Каширском шоссе. Гарантия 12 месяцев на все виды ремонта.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/contacts" className="btn-gold"><Calendar className="h-4 w-4" /> Записаться на ремонт</Link>
              <Link to="/services" className="btn-outline-gold">Все услуги <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              {trust.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-surface-2/60 backdrop-blur border border-border rounded-lg p-4">
                  <Icon className="h-5 w-5 text-gold mb-2" />
                  <div className="font-display text-2xl">{label}</div>
                  <div className="text-xs text-muted-foreground">{sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Marquee />

      {/* CATEGORIES */}
      <section className="container-x py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Услуги</div>
            <h2 className="font-display text-4xl md:text-5xl uppercase">Что мы делаем</h2>
          </div>
          <Link to="/services" className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all">Все услуги <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => <CategoryCard key={c.id} c={c} />)}
          <div className="bg-surface-2 border border-border rounded-xl p-6 flex flex-col hover-lift hover:border-gold/40 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="font-head text-xl uppercase">Ремонт по маркам</h3>
            </div>
            <p className="text-sm text-muted-foreground">Опыт обслуживания популярных марок. Знаем особенности и слабые места.</p>
            <ul className="mt-4 space-y-1.5 flex-1">
              <li><Link to="/makes/audi" className="text-sm hover:text-gold flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold" /> Ремонт Audi</Link></li>
              <li><Link to="/makes/bmw" className="text-sm hover:text-gold flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold" /> Ремонт BMW</Link></li>
              <li><Link to="/makes/mercedes-benz" className="text-sm hover:text-gold flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold" /> Ремонт Mercedes-Benz</Link></li>
            </ul>
            <Link to="/makes" className="mt-5 inline-flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all">
              Перейти <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-surface-2 border-y border-border py-16">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: company.repairsCount, suffix: "+", label: "выполненных ремонтов" },
            { v: company.yearsExperience, suffix: " лет", label: "опыта" },
            { v: company.warrantyMonths, suffix: " мес", label: "гарантия" },
            { v: company.satisfiedPercent, suffix: "%", label: "довольных клиентов" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-5xl md:text-6xl text-gold">
                <CountUp end={s.v} duration={2.4} enableScrollSpy scrollSpyOnce />{s.suffix}
              </div>
              <div className="text-sm text-muted-foreground mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR */}
      <section className="container-x py-20">
        <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Популярное</div>
        <h2 className="font-display text-4xl md:text-5xl uppercase mb-10">Чаще всего заказывают</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularServices.map((s) => (
            <Link key={s.id} to={s.url} className="group flex items-center justify-between bg-surface-2 border border-border rounded-lg p-4 hover:border-gold/40 transition-all">
              <div>
                <div className="font-head uppercase text-base">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.freq} запросов/мес • от {s.priceFrom.toLocaleString("ru-RU")} ₽</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-surface-2 border-y border-border py-20">
        <div className="container-x">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Как мы работаем</div>
          <h2 className="font-display text-4xl md:text-5xl uppercase mb-10">Прозрачный процесс</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <div key={s.name} className="bg-background border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold"><s.icon className="h-5 w-5" /></div>
                  <span className="font-display text-3xl text-gold/40">0{i + 1}</span>
                </div>
                <div className="font-head uppercase text-lg">{s.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="container-x py-20">
        <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Отзывы</div>
        <h2 className="font-display text-4xl md:text-5xl uppercase mb-10">Что говорят клиенты</h2>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {reviews.map((r, i) => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="h-full bg-surface-2 border border-border rounded-xl p-6">
                  <div className="flex gap-0.5 mb-3 text-gold">
                    {Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-sm text-foreground/85">«{r.text}»</p>
                  <div className="mt-5 pt-4 border-t border-border">
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.car} • {r.service}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADDRESS */}
      <section className="container-x py-12">
        <div className="bg-surface-2 border border-border rounded-2xl p-8 md:p-12 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Адрес</div>
            <h2 className="font-display text-3xl md:text-4xl uppercase">Каширское шоссе, 61к3А</h2>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3"><MapPin className="h-5 w-5 text-gold flex-shrink-0" /> {company.addressFull}</li>
              <li className="flex gap-3"><Phone className="h-5 w-5 text-gold flex-shrink-0" /> <a href={`tel:${company.phonePlain}`} className="hover:text-gold">{company.phone}</a></li>
              <li className="flex gap-3"><Send className="h-5 w-5 text-gold flex-shrink-0" /> <a href={company.telegramUrl} target="_blank" rel="noreferrer" className="hover:text-gold">{company.telegram}</a></li>
              <li className="flex gap-3"><Clock className="h-5 w-5 text-gold flex-shrink-0" /> {company.hours}</li>
            </ul>
            <a href={company.routeUrl} target="_blank" rel="noreferrer" className="btn-gold mt-6 inline-flex"><MapPin className="h-4 w-4" /> Построить маршрут</a>
          </div>
          <div className="aspect-video rounded-xl border border-border overflow-hidden">
            <iframe
              title="Карта"
              src="https://yandex.ru/map-widget/v1/?ll=37.679%2C55.661&z=15&pt=37.679,55.661,pm2rdm"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
