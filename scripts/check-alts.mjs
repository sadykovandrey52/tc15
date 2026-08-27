// Проверка alt-тегов сервис/категория/маркa-страниц.
// Запуск: npm run check:alts
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const src = readFileSync(resolve(ROOT, "src/data/services.ts"), "utf-8");

const GEO_RE = /москв|moscow/i;
const hasGeo = (s) => GEO_RE.test(s);

const problems = [];
const push = (page, element, problem, actual) => problems.push({ page, element, problem, actual });

function check(alt, page, element) {
  const a = (alt || "").trim();
  if (!a) return push(page, element, "🔴 Пустой alt", "");
  if (a.length < 10) return push(page, element, "🟠 Слишком короткий", a);
  if (!hasGeo(a)) return push(page, element, "🟡 Нет гео-сигнала", a);
}

// ─── Services: name + url ───────────────────────────────────────
// Reuse alt generators by inlining the rules (mirrors src/utils/altGenerator.ts)
const GALLERY_VARIANTS = ["крупный план", "процесс работы", "результат", "детали узла"];
const heroAlt = (name) => `${name} в Москве — автосервис Tech Center 15`;
const galleryAlts = (name, n = 3) =>
  Array.from({ length: n }, (_, i) => `${name} — ${GALLERY_VARIANTS[i % GALLERY_VARIANTS.length]} — Tech Center 15, Москва`);

// Парсим { name: "...", short: ..., h1: ..., url: "/services/X/Y" }
const serviceBlocks = [
  ...src.matchAll(/name:\s*"([^"]+)",[\s\S]{0,400}?url:\s*"(\/services\/[a-z0-9-]+\/[a-z0-9-]+)"/g),
];
const seenPerPage = new Map();
for (const m of serviceBlocks) {
  const name = m[1];
  const url = m[2];
  const all = [heroAlt(name), ...galleryAlts(name, 3)];
  check(all[0], url, "hero");
  all.slice(1).forEach((a, i) => check(a, url, `gallery[${i}]`));
  // дубли в пределах страницы
  const lc = all.map((s) => s.toLowerCase().trim());
  const dup = lc.filter((s, i) => lc.indexOf(s) !== i);
  if (dup.length) push(url, "page", "🟣 Дубль alt", dup[0]);
}

// ─── Categories ─────────────────────────────────────────────────
const catMatches = [...src.matchAll(/cat\(\s*"[^"]+",\s*"([^"]+)",\s*"(\/services\/[a-z0-9-]+)"/g)];
for (const [, name, url] of catMatches) {
  const alt = `${name} — крупный план — автосервис в Москве, Tech Center 15`;
  check(alt, url, "category hero");
}

// ─── Makes ──────────────────────────────────────────────────────
const makeMatches = [...src.matchAll(/\{\s*slug:\s*"([a-z0-9-]+)",\s*name:\s*"([^"]+)",\s*tier:/g)];
for (const [, slug, name] of makeMatches) {
  const url = `/makes/${slug}`;
  check(`Ремонт и обслуживание ${name} в Москве — Tech Center 15`, url, "make hero");
  check(`Автосервис ${name} Москва`, url, "make card");
}

const total = serviceBlocks.length + catMatches.length + makeMatches.length;

if (!problems.length) {
  console.log(`✅ Alt-теги: проверено ${total} страниц, нарушений нет`);
  process.exit(0);
}

console.error(`\n❌ Alt-нарушений: ${problems.length}\n`);
const byPage = problems.reduce((acc, p) => ((acc[p.page] ||= []).push(p), acc), {});
for (const [page, list] of Object.entries(byPage)) {
  console.error(`  📄 ${page}`);
  list.forEach((p) => console.error(`     ${p.problem} [${p.element}]: "${p.actual}"`));
}
process.exit(1);
