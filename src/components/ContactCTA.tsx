import { Phone, Send } from "lucide-react";
import { company } from "@/data/services";

export default function ContactCTA({ title = "ЗАПИШИТЕСЬ ПРЯМО СЕЙЧАС", text = "Получите консультацию по ремонту и предварительную оценку работ." }) {
  return (
    <section className="container-x py-16">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-2 via-surface to-background p-8 md:p-14 text-center">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <h2 className="font-display text-3xl md:text-5xl uppercase">{title}</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{text}</p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`tel:${company.phonePlain}`} className="btn-gold"><Phone className="h-4 w-4" /> Позвонить {company.phone}</a>
            <a href={company.telegramUrl} target="_blank" rel="noreferrer" className="btn-outline-gold"><Send className="h-4 w-4" /> Написать в Telegram</a>
          </div>
        </div>
      </div>
    </section>
  );
}
