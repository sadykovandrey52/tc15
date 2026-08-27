import { Link } from "react-router-dom";
import { Phone, Send, MapPin, Clock } from "lucide-react";
import { company, categories, popularMakesNav } from "@/data/services";

export default function Footer() {
  return (
    <footer className="bg-surface-2 border-t border-border mt-20">
      <div className="container-x py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-2xl tracking-wide">TECH CENTER <span className="text-gold text-3xl leading-none">15</span></div>
          <p className="mt-3 text-sm text-muted-foreground">Премиальный автосервис на Каширском шоссе. Слесарные и агрегатные работы, ТО, диагностика. Гарантия 12 месяцев.</p>
          <div className="mt-4 space-y-2 text-sm">
            <a href={`tel:${company.phonePlain}`} className="flex items-center gap-2 hover:text-gold"><Phone className="h-4 w-4 text-gold" /> {company.phone}</a>
            <a href={company.telegramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold"><Send className="h-4 w-4 text-gold" /> {company.telegram}</a>
          </div>
        </div>

        <div>
          <h4 className="text-gold uppercase tracking-wider text-sm mb-4">Услуги</h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}><Link to={c.url} className="text-foreground/80 hover:text-gold">{c.name}</Link></li>
            ))}
            <li><Link to="/services/engine/timing-belt" className="text-foreground/80 hover:text-gold">Замена ремня ГРМ</Link></li>
            <li><Link to="/services/steering/alignment" className="text-foreground/80 hover:text-gold">Развал-схождение</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold uppercase tracking-wider text-sm mb-4">Марки авто</h4>
          <ul className="space-y-2 text-sm">
            {popularMakesNav.slice(0, 8).map((m) => (
              <li key={m.slug}><Link to={m.url} className="text-foreground/80 hover:text-gold">{m.name}</Link></li>
            ))}
            <li><Link to="/makes" className="text-gold font-semibold">Все марки →</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold uppercase tracking-wider text-sm mb-4">Контакты</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /> <span className="text-foreground/80">{company.addressFull}</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /> <a href={`tel:${company.phonePlain}`} className="hover:text-gold">{company.phone}</a></li>
            <li className="flex gap-2"><Send className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /> <a href={company.telegramUrl} target="_blank" rel="noreferrer" className="hover:text-gold">{company.telegram}</a></li>
            <li className="flex gap-2"><Clock className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /> <span className="text-foreground/80">{company.hours}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5">
        <div className="container-x text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} {company.name}. Все права защищены.</div>
          <div>Премиальный автосервис в Москве.</div>
        </div>
      </div>
    </footer>
  );
}
