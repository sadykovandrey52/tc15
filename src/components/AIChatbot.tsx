import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageCircle, X, Phone, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { company } from "@/data/services";
import { trackEvent } from "@/utils/analytics";

type Msg = { role: "bot" | "user"; text: string };

const BOT_HELLO = "Здравствуйте! Я консультант Tech Center 15. Опишите симптом — помогу понять причину и записать вас на диагностику.";

const QUICK = ["Стук в подвеске", "Не заводится", "Замена масла", "ГРМ", "Рулевое", "Стоимость", "Адрес"];

function reply(input: string): string {
  const t = input.toLowerCase();
  if (/(стук|подвес|ходов|сайлент|амортизатор|шаров)/.test(t))
    return "Стук в подвеске чаще всего из-за изношенных сайлентблоков, амортизаторов или шаровых опор. Точный источник определим на диагностике на подъёмнике (от 1500 ₽). Записать вас?";
  if (/(не\s*завод|стартер|щёлк|щелк|не\s*крут)/.test(t))
    return "Если стартер щёлкает или машина не заводится — причина в стартере, генераторе или АКБ. Нужна диагностика цепи запуска. Можем принять сегодня.";
  if (/(масло|то\b|обслуж|регламент)/.test(t))
    return `Замена масла — от 2500 ₽, около 30 минут. Полное ТО — от 5000 ₽. Работаем ${company.hours}. Записать вас?`;
  if (/(рул|рейк|наконечник|тяг)/.test(t))
    return "Любой стук, люфт или тугой руль в рулевом — это вопрос безопасности. Нужна диагностика рулевого управления. Запишу вас?";
  if (/(грм|ремен|цеп)/.test(t))
    return "Обрыв ремня ГРМ — это капитальный ремонт двигателя. Меняем строго по регламенту с роликами от 6000 ₽. Подъезжайте на диагностику.";
  if (/(цена|стоим|сколько|почем)/.test(t))
    return "Точную стоимость можем сказать только после диагностики — она зависит от модели и состояния узла. Позвоните, обсудим предварительно.";
  if (/(адрес|где|как\s*добраться|найти)/.test(t))
    return `${company.addressFull}. Режим работы: ${company.hours}. Построить маршрут можно с сайта.`;
  return "Опишите подробнее симптом — стук, скрип, утечка, ошибка на панели — и я подскажу. Или можете сразу позвонить, дежурный мастер ответит.";
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: BOT_HELLO }]);
  const [val, setVal] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.scrollTo({ top: 9999, behavior: "smooth" }); }, [msgs, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setTimeout(() => setMsgs((m) => [...m, { role: "bot", text: reply(text) }]), 350);
    setVal("");
  };

  const onSubmit = (e: FormEvent) => { e.preventDefault(); send(val); };

  return (
    <>
      <button
        onClick={() => { setOpen(true); trackEvent("open_chatbot"); }}
        aria-label="Открыть чат"
        className={`fixed right-4 z-40 h-14 w-14 rounded-full gradient-gold text-[hsl(var(--primary-foreground))] flex items-center justify-center shadow-[var(--shadow-gold)] animate-pulse-gold ${open ? "hidden" : ""} bottom-24 md:bottom-6`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed right-4 bottom-20 md:bottom-6 z-50 w-[min(380px,calc(100vw-2rem))] h-[560px] max-h-[80vh] rounded-xl bg-surface-2 border border-border shadow-[var(--shadow-elegant)] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 gradient-gold text-[hsl(var(--primary-foreground))]">
              <div>
                <div className="font-head uppercase">Консультант Tech Center 15</div>
                <div className="text-xs opacity-80">{company.hours}</div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Закрыть"><X className="h-5 w-5" /></button>
            </div>

            <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] text-sm rounded-lg px-3 py-2 ${m.role === "user" ? "bg-gold/15 border border-gold/30" : "bg-surface border border-border"}`}>
                    {m.text}
                    {m.role === "bot" && i > 0 && (
                      <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-border/50">
                        <a href={`tel:${company.phonePlain}`} onClick={() => trackEvent("chatbot_click_phone")} className="flex-1 text-xs flex items-center justify-center gap-1 py-1.5 rounded bg-gold/15 text-gold border border-gold/30"><Phone className="h-3 w-3" /> Позвонить</a>
                        <a href={company.telegramUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent("chatbot_click_telegram")} className="flex-1 text-xs flex items-center justify-center gap-1 py-1.5 rounded bg-gold/15 text-gold border border-gold/30"><Send className="h-3 w-3" /> Telegram</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-t border-border">
              {QUICK.map((q) => (
                <button key={q} onClick={() => send(q)} className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border hover:border-gold/50 hover:text-gold transition-colors">{q}</button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="p-3 flex gap-2 border-t border-border">
              <input value={val} onChange={(e) => setVal(e.target.value)} maxLength={300} placeholder="Опишите симптом…" className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm focus:border-gold focus:outline-none" />
              <button className="btn-gold px-3 py-2 text-sm"><Send className="h-4 w-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
