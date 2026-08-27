// Unique, SEO-friendly alt text for hero + gallery images on service pages.
const GALLERY_VARIANTS = [
  "крупный план",
  "процесс работы",
  "результат",
  "детали узла",
] as const;

export function generateHeroAlt(serviceName: string): string {
  return `${serviceName} в Москве — автосервис Tech Center 15`;
}

export function generateGalleryAlts(serviceName: string, count = 3): string[] {
  const alts: string[] = [];
  for (let i = 0; i < count; i++) {
    const v = GALLERY_VARIANTS[i % GALLERY_VARIANTS.length];
    alts.push(`${serviceName} — ${v} — Tech Center 15, Москва`);
  }
  if (import.meta.env.DEV) {
    const all = [generateHeroAlt(serviceName), ...alts];
    const seen = new Set<string>();
    const dupes = all.filter((a) => (seen.has(a) ? true : (seen.add(a), false)));
    if (dupes.length) {
      // eslint-disable-next-line no-console
      console.warn(`[Alt] Duplicate alts on "${serviceName}":`, dupes);
    }
  }
  return alts;
}

export function generateCategoryImageAlt(categoryName: string, index = 0): string {
  const v = GALLERY_VARIANTS[index % GALLERY_VARIANTS.length];
  return `${categoryName} — ${v} — автосервис в Москве, Tech Center 15`;
}
