// Dev-only SEO validator for service, category, make pages.
import { allServices, categories, makes } from "@/data/services";

const DOMAIN = "https://tech-centre15.ru";

const RULES = {
  title: { min: 10, max: 60 },
  desc:  { min: 80, max: 160 },
  h1:    { min: 5,  max: 80, mustContain: "Москва" },
} as const;

type Violation = { pageUrl: string; field: string; message: string };

// ─── Canonical helpers ───────────────────────────────────────────
function checkCanonical(pageUrl: string, canonical: string | undefined): Violation[] {
  const out: Violation[] = [];
  const c = (canonical || "").trim();
  if (!c) {
    out.push({ pageUrl, field: "canonical", message: "пустой" });
    return out;
  }
  const expected = `${DOMAIN}${pageUrl}`;
  if (!c.startsWith(DOMAIN) && !c.startsWith("/")) {
    out.push({ pageUrl, field: "canonical", message: `не начинается с "${DOMAIN}" или "/"` });
  }
  // Источник истины — относительный path в данных; SEO.tsx сам префиксит DOMAIN.
  // Если canonical уже абсолютный, проверяем точное совпадение.
  if (c.startsWith("http") && c !== expected) {
    out.push({ pageUrl, field: "canonical", message: `не совпадает с "${expected}"` });
  }
  if (c.includes("?") || c.includes("#")) {
    out.push({ pageUrl, field: "canonical", message: "содержит ?query или #hash" });
  }
  if (c !== "/" && c !== `${DOMAIN}/` && c.endsWith("/")) {
    out.push({ pageUrl, field: "canonical", message: "trailing slash (кроме корня)" });
  }
  return out;
}

function checkPage(label: string, t: string, d: string, h1: string): Violation[] {
  const out: Violation[] = [];
  const T = (t || "").trim(), D = (d || "").trim(), H = (h1 || "").trim();
  if (!T) out.push({ pageUrl: label, field: "title", message: "пустой" });
  else {
    if (T.length < RULES.title.min) out.push({ pageUrl: label, field: "title", message: `слишком короткий (${T.length} < ${RULES.title.min})` });
    if (T.length > RULES.title.max) out.push({ pageUrl: label, field: "title", message: `слишком длинный (${T.length} > ${RULES.title.max})` });
  }
  if (!D) out.push({ pageUrl: label, field: "description", message: "пустой" });
  else {
    if (D.length < RULES.desc.min) out.push({ pageUrl: label, field: "description", message: `слишком короткий (${D.length} < ${RULES.desc.min})` });
    if (D.length > RULES.desc.max) out.push({ pageUrl: label, field: "description", message: `слишком длинный (${D.length} > ${RULES.desc.max})` });
  }
  if (!H) out.push({ pageUrl: label, field: "h1", message: "пустой" });
  else {
    if (H.length < RULES.h1.min) out.push({ pageUrl: label, field: "h1", message: `слишком короткий (${H.length})` });
    if (H.length > RULES.h1.max) out.push({ pageUrl: label, field: "h1", message: `слишком длинный (${H.length})` });
    if (!H.includes(RULES.h1.mustContain)) out.push({ pageUrl: label, field: "h1", message: `не содержит "${RULES.h1.mustContain}"` });
  }
  return out;
}

export function validateSeoData(): Violation[] {
  const violations: Violation[] = [];
  const titles = new Map<string, string>();
  const descs = new Map<string, string>();
  const h1s = new Map<string, string>();
  const canonicals = new Map<string, string>();

  const dedupe = (label: string, t: string, d: string, h1: string) => {
    if (titles.has(t)) violations.push({ pageUrl: label, field: "title", message: `дубль с ${titles.get(t)}` });
    else titles.set(t, label);
    if (descs.has(d)) violations.push({ pageUrl: label, field: "description", message: `дубль с ${descs.get(d)}` });
    else descs.set(d, label);
    if (h1s.has(h1)) violations.push({ pageUrl: label, field: "h1", message: `дубль с ${h1s.get(h1)}` });
    else h1s.set(h1, label);
  };

  const checkCanonicalDupe = (pageUrl: string, canonical: string) => {
    const c = (canonical || "").trim();
    if (!c) return;
    const full = c.startsWith("http") ? c : `${DOMAIN}${c}`;
    if (canonicals.has(full)) {
      violations.push({ pageUrl, field: "canonical", message: `дубль с ${canonicals.get(full)}` });
    } else {
      canonicals.set(full, pageUrl);
    }
  };

  for (const s of allServices) {
    violations.push(...checkPage(s.url, s.seoTitle, s.seoDesc, s.h1));
    violations.push(...checkCanonical(s.url, s.url));
    checkCanonicalDupe(s.url, s.url);
    dedupe(s.url, s.seoTitle, s.seoDesc, s.h1);
    if (!s.faq?.length || s.faq.length < 2) violations.push({ pageUrl: s.url, field: "faq", message: `<2 FAQ (${s.faq?.length ?? 0})` });
    s.faq?.forEach((f, i) => {
      if (!f.q?.trim()) violations.push({ pageUrl: s.url, field: "faq", message: `пустой вопрос #${i}` });
      if (!f.a?.trim()) violations.push({ pageUrl: s.url, field: "faq", message: `пустой ответ #${i}` });
    });
  }

  for (const c of categories) {
    if (!c.name) violations.push({ pageUrl: c.url, field: "name", message: "пусто" });
    if (!c.description) violations.push({ pageUrl: c.url, field: "description", message: "пусто" });
    if (!c.services.length) violations.push({ pageUrl: c.url, field: "services", message: "категория без услуг" });
    violations.push(...checkCanonical(c.url, c.url));
    checkCanonicalDupe(c.url, c.url);
  }

  for (const m of makes) {
    violations.push(...checkPage(m.url, m.seoTitle, m.seoDesc, m.h1));
    violations.push(...checkCanonical(m.url, m.url));
    checkCanonicalDupe(m.url, m.url);
    dedupe(m.url, m.seoTitle, m.seoDesc, m.h1);
  }

  return violations;
}

export function initSeoValidation() {
  if (!import.meta.env.DEV) return;
  const v = validateSeoData();
  if (!v.length) {
    // eslint-disable-next-line no-console
    console.info("%c[SEO Audit] ✅ all checks passed", "color:#4ade80");
    return;
  }
  // eslint-disable-next-line no-console
  console.warn(`%c[SEO Audit] ⚠ ${v.length} нарушений`, "color:#f59e0b;font-weight:bold");
  const byPage = v.reduce<Record<string, Violation[]>>((acc, x) => {
    (acc[x.pageUrl] ||= []).push(x); return acc;
  }, {});
  for (const [page, list] of Object.entries(byPage)) {
    // eslint-disable-next-line no-console
    console.groupCollapsed(`%c📄 ${page} (${list.length})`, "color:#fb923c");
    list.forEach((x) => console.warn(`  [${x.field}] ${x.message}`));
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
}
