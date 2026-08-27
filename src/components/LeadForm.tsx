import { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import { company } from "@/data/services";
import { buildLeadPayload, type LeadContext } from "@/utils/utm";
import { submitLead, leadStatusText, type LeadStatus } from "@/utils/leadSubmit";
import { trackEvent } from "@/utils/analytics";

type Props = {
  defaultMessage?: string;
  ctx?: LeadContext;
};

export default function LeadForm({ defaultMessage, ctx = {} }: Props) {
  const [status, setStatus] = useState<LeadStatus>("idle");
  const [statusMsg, setStatusMsg] = useState<string>(leadStatusText("idle"));
  const [form, setForm] = useState({ name: "", phone: "", car: "", year: "", problem: defaultMessage || "", agree: true });

  const inp = "w-full bg-surface border border-border rounded-md px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none transition-colors";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.name.length > 80) {
      setStatus("error"); setStatusMsg("Укажите имя (до 80 символов)"); return;
    }
    if (!/^[\d+\-()\s]{7,20}$/.test(form.phone)) {
      setStatus("error"); setStatusMsg("Укажите корректный телефон"); return;
    }
    if (!form.agree) {
      setStatus("error"); setStatusMsg("Необходимо согласие на обработку данных"); return;
    }
    setStatus("loading"); setStatusMsg(leadStatusText("loading"));
    trackEvent("form_submit_start", ctx);
    const payload = buildLeadPayload(form, ctx);
    const res = await submitLead(payload);
    setStatus(res.status); setStatusMsg(res.message);
    if (res.status === "success" || res.status === "prepared") {
      trackEvent("form_submit_success", ctx);
      setForm({ name: "", phone: "", car: "", year: "", problem: "", agree: true });
    } else {
      trackEvent("form_submit_error", ctx);
    }
  };

  const tone =
    status === "success" || status === "prepared" ? "text-[hsl(var(--success))]" :
    status === "error" ? "text-destructive" :
    status === "loading" ? "text-gold" : "text-muted-foreground";

  return (
    <form onSubmit={onSubmit} className="bg-surface-2 border border-border rounded-xl p-6 md:p-8 space-y-3">
      <h3 className="font-head text-xl uppercase">Записаться на ремонт</h3>
      <p className={`text-sm ${tone}`}>{statusMsg}</p>
      <div className="grid sm:grid-cols-2 gap-3 pt-2">
        <input className={inp} placeholder="Ваше имя*" maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={inp} placeholder="Телефон*" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className={inp} placeholder="Марка авто" maxLength={40} value={form.car} onChange={(e) => setForm({ ...form, car: e.target.value })} />
        <input className={inp} placeholder="Год выпуска" maxLength={4} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
      </div>
      <textarea className={`${inp} min-h-[90px] resize-none`} placeholder="Опишите проблему" maxLength={500} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} />
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} className="mt-0.5 accent-[hsl(var(--primary))]" />
        Согласен с обработкой персональных данных
      </label>
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button disabled={status === "loading"} className="btn-gold flex-1">
          <Send className="h-4 w-4" /> {status === "loading" ? "Отправка…" : "Записаться на ремонт"}
        </button>
        <a href={`tel:${company.phonePlain}`} onClick={() => trackEvent("click_phone", { ...ctx, source: "lead_form" })} className="btn-outline-gold flex-1">{company.phone}</a>
      </div>
    </form>
  );
}
