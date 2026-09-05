// Generates public/sitemap.xml and public/robots.txt from src/data/services.ts.
// Strict: validates slugs, detects duplicate URLs, logs every URL with source.
// Runs as `prebuild` so output is always fresh before vite build.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── Единственное место для домена ───────────────────────────────
const DOMAIN = "https://tech-centre15.ru";
const TODAY = new Date().toISOString().split("T")[0];

// ─── Валидатор slug ──────────────────────────────────────────────
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function validateSlug(slug, source) {
  if (!slug || !slug.trim()) {
    console.error(`[sitemap] ❌ пустой slug в "${source}"`);
    process.exit(1);
  }
  if (!SLUG_RE.test(slug)) {
    console.error(`[sitemap] ❌ некорректный slug "${slug}" в "${source}". Только [a-z0-9-].`);
    process.exit(1);
  }
}

// ─── Парсинг src/data/services.ts ────────────────────────────────
const src = readFileSync(resolve(ROOT, "src/data/services.ts"), "utf-8");

// Service URLs: url: "/services/{cat}/{slug}"
const serviceUrls = [
  ...new Set([...src.matchAll(/url:\s*"(\/services\/[a-z0-9-]+\/[a-z0-9-]+)"/g)].map((m) => m[1])),
];
serviceUrls.forEach((u) => {
  const [, , cat, slug] = u.split("/");
  validateSlug(cat, `service.url ${u} (categorySlug)`);
  validateSlug(slug, `service.url ${u} (slug)`);
});

// Category URLs: parsed from cat("slug-id", "Name", "/services/{slug}", ...)
const categoryUrls = [
  ...new Set([...src.matchAll(/cat\(\s*"[^"]+",\s*"[^"]+",\s*"(\/services\/[a-z0-9-]+)"/g)].map((m) => m[1])),
];
categoryUrls.forEach((u) => {
  const slug = u.split("/").pop();
  validateSlug(slug, `category ${u}`);
});

// Make slugs from MAKE_SEEDS
const makeSlugs = [...src.matchAll(/\{\s*slug:\s*"([a-z0-9-]+)",\s*name:\s*"[^"]+",\s*tier:/g)].map((m) => m[1]);
makeSlugs.forEach((s) => validateSlug(s, `make ${s}`));
const makeUrls = makeSlugs.map((s) => `/makes/${s}`);

// Blog slugs (if any)
const blogSlugs = [...src.matchAll(/slug:\s*"([a-z0-9-]+)",\s*url:\s*"\/blog\//g)].map((m) => m[1]);
blogSlugs.forEach((s) => validateSlug(s, `blog ${s}`));
const blogUrls = blogSlugs.map((s) => `/blog/${s}`);

// ─── Статические страницы ───────────────────────────────────────
const STATIC = [
  { url: "/", priority: "1.0", changefreq: "weekly", source: "static" },
  { url: "/services", priority: "0.9", changefreq: "weekly", source: "static" },
  { url: "/makes", priority: "0.8", changefreq: "monthly", source: "static" },
  { url: "/blog", priority: "0.8", changefreq: "weekly", source: "static" },
  { url: "/contacts", priority: "0.7", changefreq: "monthly", source: "static" },
];

const entries = [
  ...STATIC,
  ...categoryUrls.map((u) => ({ url: u, priority: "0.9", changefreq: "weekly", source: `category:${u}` })),
  ...serviceUrls.map((u) => ({ url: u, priority: "0.85", changefreq: "weekly", source: `service:${u}` })),
  ...makeUrls.map((u) => ({ url: u, priority: "0.75", changefreq: "monthly", source: `make:${u}` })),
  ...blogUrls.map((u) => ({ url: u, priority: "0.6", changefreq: "monthly", source: `blog:${u}` })),
];

// ─── Дубли = ошибка сборки ──────────────────────────────────────
const seen = new Set();
const dupes = [];
for (const e of entries) {
  const full = `${DOMAIN}${e.url}`;
  if (seen.has(full)) dupes.push(full);
  else seen.add(full);
}
if (dupes.length) {
  console.error(`[sitemap] ❌ дубли URL (${dupes.length}):`);
  dupes.forEach((u) => console.error(`  • ${u}`));
  process.exit(1);
}

// ─── Лог ────────────────────────────────────────────────────────
console.log(`\n[sitemap] Итого URL: ${entries.length}`);
console.log(`  Статических: ${STATIC.length}`);
console.log(`  Категорий:   ${categoryUrls.length}`);
console.log(`  Услуг:       ${serviceUrls.length}`);
console.log(`  Марок:       ${makeUrls.length}`);
console.log(`  Блог:        ${blogUrls.length}`);
console.log(`\n[sitemap] Список:`);
entries.forEach((e) => console.log(`  ${e.url}  [${e.source}]`));

// ─── Запись sitemap.xml ─────────────────────────────────────────
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entries
    .map(
      (e) =>
        `  <url>\n    <loc>${DOMAIN}${e.url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

mkdirSync(resolve(ROOT, "public"), { recursive: true });
writeFileSync(resolve(ROOT, "public/sitemap.xml"), xml, "utf-8");

const robots = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /404

Sitemap: ${DOMAIN}/sitemap.xml
`;
writeFileSync(resolve(ROOT, "public/robots.txt"), robots, "utf-8");

console.log(`\n✅ sitemap.xml (${entries.length} URL) + robots.txt → public/`);
