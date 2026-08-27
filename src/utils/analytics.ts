// Analytics event dispatcher. Falls back to dataLayer or console in dev.
import { getStoredUtmParams, getUtmParams } from "./utm";

export type AnalyticsEvent =
  | "form_submit_start"
  | "form_submit_success"
  | "form_submit_error"
  | "click_phone"
  | "click_telegram"
  | "click_cta"
  | "open_chatbot"
  | "chatbot_click_phone"
  | "chatbot_click_telegram";

export type EventContext = {
  service_name?: string;
  service_slug?: string;
  category_name?: string;
  [k: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(event: AnalyticsEvent, ctx: EventContext = {}) {
  if (typeof window === "undefined") return;
  const utm = { ...getStoredUtmParams(), ...getUtmParams() };
  const payload = {
    event,
    page_url: window.location.href,
    utm_source: utm.utm_source || "",
    utm_campaign: utm.utm_campaign || "",
    ...ctx,
  };
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  } else if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info("[analytics]", event, payload);
  }
}
