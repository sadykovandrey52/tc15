import { useEffect, useState } from "react";
import { Phone, Send, Calendar } from "lucide-react";
import { company } from "@/data/services";
import { trackEvent, type EventContext } from "@/utils/analytics";

type Props = {
  ctx: EventContext;
  formAnchor?: string; // default "#zayavka"
};

export default function StickyServiceCTA({ ctx, formAnchor = "#zayavka" }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const form = document.querySelector(formAnchor);
      const formVisible = form ? form.getBoundingClientRect().top < window.innerHeight - 80 : false;
      setShow(y > 600 && !formVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [formAnchor]);

  const onForm = (e: React.MouseEvent) => {
    e.preventDefault();
    trackEvent("click_cta", { ...ctx, target: "form" });
    document.querySelector(formAnchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      data-testid="cta-bar"
      className={`fixed left-0 right-0 z-30 transition-all duration-300 pointer-events-none
        bottom-[max(env(safe-area-inset-bottom),0px)]
        ${show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
    >
      <div className="container-x pb-3 md:pb-4">
        <div className="pointer-events-auto mx-auto md:max-w-3xl bg-surface-2/95 backdrop-blur border border-border rounded-xl shadow-[var(--shadow-elegant)] p-2 grid grid-cols-3 gap-2">
          <a
            href={`tel:${company.phonePlain}`}
            onClick={() => trackEvent("click_phone", { ...ctx, source: "sticky_cta" })}
            className="flex items-center justify-center gap-2 py-3 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-semibold uppercase"
          >
            <Phone className="h-4 w-4" /> <span className="hidden sm:inline">Позвонить</span>
          </a>
          <a
            href={company.telegramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("click_telegram", { ...ctx, source: "sticky_cta" })}
            className="flex items-center justify-center gap-2 py-3 rounded-lg bg-surface border border-border text-foreground text-sm font-semibold uppercase hover:border-gold/50"
          >
            <Send className="h-4 w-4 text-gold" /> Telegram
          </a>
          <a href={formAnchor} onClick={onForm} className="btn-gold py-3 text-sm">
            <Calendar className="h-4 w-4" /> Заявка
          </a>
        </div>
      </div>
    </div>
  );
}
