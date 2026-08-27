// UTM persistence and lead payload builder
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STORAGE_KEY = "tc15_utm";
const CID_KEY = "tc15_cid";

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: UtmParams = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
}

export function saveUtmParams(): void {
  if (typeof window === "undefined") return;
  const fresh = getUtmParams();
  if (Object.keys(fresh).length === 0) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...fresh, _ts: Date.now() }));
  } catch {/* storage may be blocked */}
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const out: UtmParams = {};
    UTM_KEYS.forEach((k) => { if (parsed[k]) out[k] = parsed[k]; });
    return out;
  } catch { return {}; }
}

export function getClientId(): string {
  if (typeof window === "undefined") return "";
  try {
    let cid = localStorage.getItem(CID_KEY);
    if (!cid) {
      cid = `cid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(CID_KEY, cid);
    }
    return cid;
  } catch { return ""; }
}

export type LeadContext = {
  service_name?: string;
  service_slug?: string;
  category_name?: string;
};

export function buildLeadPayload(form: Record<string, unknown>, ctx: LeadContext = {}) {
  const utm = { ...getStoredUtmParams(), ...getUtmParams() };
  return {
    ...form,
    ...ctx,
    page_url: typeof window !== "undefined" ? window.location.href : "",
    page_title: typeof document !== "undefined" ? document.title : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    client_id: getClientId(),
    submitted_at: new Date().toISOString(),
    utm_source: utm.utm_source || "",
    utm_medium: utm.utm_medium || "",
    utm_campaign: utm.utm_campaign || "",
    utm_content: utm.utm_content || "",
    utm_term: utm.utm_term || "",
  };
}
