import { INTEGRATIONS } from "@/config/integrations";

export type LeadStatus = "idle" | "loading" | "success" | "error" | "prepared";

export type SubmitResult = {
  status: LeadStatus;
  message: string;
};

const STATUS_TEXT: Record<LeadStatus, string> = {
  idle: "Заполните форму — подскажем по срокам и стоимости",
  loading: "Отправляем заявку…",
  success: "Заявка отправлена. Мы свяжемся с вами в рабочее время: Пн–Вс 09:00–21:00.",
  error: "Не удалось отправить заявку. Позвоните +7 (915) 279 90-90 или напишите в Telegram @techcenter15.",
  prepared: "Заявка подготовлена. Свяжитесь с нами по телефону или Telegram — ответим в течение 15 минут.",
};

export const leadStatusText = (s: LeadStatus) => STATUS_TEXT[s];

export async function submitLead(payload: Record<string, unknown>): Promise<SubmitResult> {
  const url = INTEGRATIONS.crmWebhookUrl;
  if (!url) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info("[lead] prepared (no webhook)", payload);
    }
    return { status: "prepared", message: STATUS_TEXT.prepared };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { status: "success", message: STATUS_TEXT.success };
  } catch (e) {
    if (import.meta.env.DEV) console.error("[lead] failed", e);
    return { status: "error", message: STATUS_TEXT.error };
  }
}
