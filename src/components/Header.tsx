import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Phone, Send, Menu, X, ChevronDown } from "lucide-react";
import { company, categories, popularServices, popularMakesNav } from "@/data/services";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState(false);
  const [makesOpen, setMakesOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => { setOpen(false); setServices(false); setMakesOpen(false); }, [loc.pathname]);

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-2 font-medium transition-colors ${isActive ? "text-gold" : "text-foreground/85 hover:text-gold"}`;

  return (
    <header className="glass fixed inset-x-0 top-0 z-50">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl tracking-wide">
          <span>TECH CENTER</span>
          <span className="text-gold text-3xl leading-none">15</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          <div
            className="relative"
            onMouseEnter={() => setServices(true)}
            onMouseLeave={() => setServices(false)}
          >
            <button className="flex items-center gap-1 font-medium text-foreground/85 hover:text-gold transition-colors py-2">
              Услуги <ChevronDown className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {services && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                >
                  <div className="w-[640px] rounded-lg border border-border bg-surface-2 p-6 shadow-[var(--shadow-elegant)] grid grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Категории</div>
                      {categories.map((c) => (
                        <Link key={c.id} to={c.url} className="block py-1.5 text-sm hover:text-gold">{c.name}</Link>
                      ))}
                      <Link to="/services" className="block pt-2 mt-2 border-t border-border text-sm font-semibold text-gold">Все услуги →</Link>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Популярное</div>
                      {popularServices.slice(0,6).map((s) => (
                        <Link key={s.id} to={s.url} className="block py-1.5 text-sm hover:text-gold">{s.name}</Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setMakesOpen(true)}
            onMouseLeave={() => setMakesOpen(false)}
          >
            <button className="flex items-center gap-1 font-medium text-foreground/85 hover:text-gold transition-colors py-2">
              Марки авто <ChevronDown className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {makesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                >
                  <div className="w-[280px] rounded-lg border border-border bg-surface-2 p-5 shadow-[var(--shadow-elegant)]">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Популярные</div>
                    {popularMakesNav.map((m) => (
                      <Link key={m.slug} to={m.url} className="block py-1.5 text-sm hover:text-gold">{m.name}</Link>
                    ))}
                    <Link to="/makes" className="block pt-2 mt-2 border-t border-border text-sm font-semibold text-gold">Все марки →</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavLink to="/blog" className={navLink}>Блог</NavLink>
          <NavLink to="/contacts" className={navLink}>Контакты</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={`tel:${company.phonePlain}`} className="flex items-center gap-2 text-sm font-semibold hover:text-gold transition-colors">
            <Phone className="h-4 w-4 text-gold" /> <span className="hidden xl:inline">{company.phone}</span>
          </a>
          <a href={company.telegramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold hover:text-gold transition-colors">
            <Send className="h-4 w-4 text-gold" /> <span className="hidden xl:inline">{company.telegram}</span>
          </a>
          <Link to="/contacts" className="btn-gold text-sm py-2.5 px-4">Записаться</Link>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2" aria-label="Меню">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-border bg-surface overflow-hidden">
            <div className="container-x py-5 space-y-4">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Услуги</div>
                {categories.map((c) => (
                  <Link key={c.id} to={c.url} className="block py-1.5 text-sm hover:text-gold">{c.name}</Link>
                ))}
                <Link to="/services" className="block py-1.5 text-sm font-semibold text-gold">Все услуги →</Link>
              </div>
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Марки</div>
                {popularMakesNav.slice(0, 6).map((m) => (
                  <Link key={m.slug} to={m.url} className="block py-1.5 text-sm hover:text-gold">{m.name}</Link>
                ))}
                <Link to="/makes" className="block py-1.5 text-sm font-semibold text-gold">Все марки →</Link>
                <Link to="/blog" className="block py-1.5 hover:text-gold">Блог</Link>
                <Link to="/contacts" className="block py-1.5 hover:text-gold">Контакты</Link>
              </div>
              <div className="pt-4 border-t border-border space-y-2">
                <a href={`tel:${company.phonePlain}`} className="flex items-center gap-2 py-2"><Phone className="h-4 w-4 text-gold" /> {company.phone}</a>
                <a href={company.telegramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 py-2"><Send className="h-4 w-4 text-gold" /> {company.telegram}</a>
                <Link to="/contacts" className="btn-gold w-full mt-2">Записаться</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
