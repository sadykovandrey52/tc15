// Visual regression for Tech Center 15 service pages.
// Local-only: requires playwright, pixelmatch, pngjs.
// Usage:
//   npm run preview &
//   node scripts/visual-regression.mjs --update-baseline
//   node scripts/visual-regression.mjs
//   node scripts/visual-regression.mjs --only zamena-saylentblokov
import { readFileSync, existsSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BASE_URL = process.env.PREVIEW_URL || "http://localhost:4173";
const SNAP = resolve(ROOT, "test/snapshots");
const DIFF = resolve(ROOT, "test/diffs");
const THRESHOLD = 0.05;

let chromium, PNG, pixelmatch;
try {
  ({ chromium } = await import("playwright"));
  ({ PNG } = await import("pngjs"));
  ({ default: pixelmatch } = await import("pixelmatch"));
} catch {
  console.error("Install: npm i -D playwright pixelmatch pngjs && npx playwright install chromium");
  process.exit(1);
}

const src = readFileSync(resolve(ROOT, "src/data/services.ts"), "utf-8");
const allUrls = [...new Set([...src.matchAll(/url:\s*"(\/services\/[^"]+\/[^"]+)"/g)].map((m) => m[1]))];

// --only <slug>
const onlyIdx = process.argv.indexOf("--only");
const onlySlug = onlyIdx >= 0 ? process.argv[onlyIdx + 1] : null;
const urls = onlySlug ? allUrls.filter((u) => u.endsWith(`/${onlySlug}`)) : allUrls;
if (onlySlug && !urls.length) {
  console.error(`❌ Услуга со slug "${onlySlug}" не найдена`);
  process.exit(1);
}

const ZONES = [
  { name: "hero", selector: '[data-testid="service-hero"]' },
  { name: "form", selector: '[data-testid="booking-form"]' },
  { name: "cta", selector: '[data-testid="cta-bar"]' },
];

const ensure = (d) => { if (!existsSync(d)) mkdirSync(d, { recursive: true }); };
const slugify = (u) => u.replace(/^\/services\//, "").replace(/\//g, "__");
ensure(join(SNAP, "baseline"));
ensure(join(SNAP, "current"));
ensure(DIFF);

async function waitForReady(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page
    .waitForFunction(
      () => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
      { timeout: 15000 },
    )
    .catch(() => console.warn("  ⚠ не все картинки догрузились"));
  await page.addStyleTag({
    content: `*,*::before,*::after{animation-duration:.001ms!important;animation-delay:0s!important;transition-duration:.001ms!important;transition-delay:0s!important;scroll-behavior:auto!important}`,
  });
  await page.waitForTimeout(300);
}

const browser = await chromium.launch({
  headless: true,
  args: ["--font-render-hinting=none", "--force-color-profile=srgb"],
});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
});
const IS_BASELINE = process.argv.includes("--update-baseline");
const regressions = [];

for (const url of urls) {
  const page = await ctx.newPage();
  console.log(`\n📄 ${url}`);
  try {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForReady(page);
    const slug = slugify(url);
    for (const z of ZONES) {
      if (z.name === "cta") {
        await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: "instant" }));
        await page.waitForTimeout(200);
      }
      const el = await page.$(z.selector);
      if (!el || !(await el.isVisible())) {
        console.warn(`  ⚠ [${z.name}] не найден/не виден`);
        continue;
      }
      const cur = join(SNAP, "current", `${slug}__${z.name}.png`);
      await el.screenshot({ path: cur });
      const base = join(SNAP, "baseline", `${slug}__${z.name}.png`);
      if (IS_BASELINE || !existsSync(base)) {
        copyFileSync(cur, base);
        console.log(`  📸 baseline ${z.name}`);
        continue;
      }
      const a = PNG.sync.read(readFileSync(base));
      const b = PNG.sync.read(readFileSync(cur));
      const d = new PNG({ width: a.width, height: a.height });
      const mm = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: 0.1 });
      writeFileSync(join(DIFF, `${slug}__${z.name}.png`), PNG.sync.write(d));
      const ratio = mm / (a.width * a.height);
      if (ratio > THRESHOLD) {
        regressions.push({ url, zone: z.name, ratio });
        console.error(`  ❌ ${z.name}: ${(ratio * 100).toFixed(2)}%`);
      } else {
        console.log(`  ✅ ${z.name}: ${(ratio * 100).toFixed(2)}%`);
      }
    }
  } catch (err) {
    console.error(`  ❌ ${err?.message || err}`);
    regressions.push({ url, zone: "ERROR", ratio: 1 });
  } finally {
    await page.close();
  }
}
await browser.close();
if (regressions.length) {
  console.error(`\n🔴 Регрессий: ${regressions.length}`);
  process.exit(1);
}
console.log("\n🟢 No visual regressions");
