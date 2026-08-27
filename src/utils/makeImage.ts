// Stable image URL per make slug.

import audiImg from "@/assets/make-audi.jpg";
import bmwImg from "@/assets/make-bmw.jpg";
import mercedesImg from "@/assets/make-mercedes.jpg";
import porscheImg from "@/assets/make-porsche.jpg";
import vwImg from "@/assets/make-volkswagen.jpg";
import skodaImg from "@/assets/make-skoda.jpg";
import lexusImg from "@/assets/make-lexus.jpg";
import landRoverImg from "@/assets/make-landrover.jpg";
import rangeRoverImg from "@/assets/make-rangerover.jpg";

const LOCAL: Record<string, string> = {
  audi: audiImg,
  bmw: bmwImg,
  "mercedes-benz": mercedesImg,
  porsche: porscheImg,
  volkswagen: vwImg,
  skoda: skodaImg,
  lexus: lexusImg,
  "land-rover": landRoverImg,
  "range-rover": rangeRoverImg,
};

function sigFor(slug: string, salt = 1): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return (h % 10000) * salt + slug.length;
}

export function makeHeroImage(slug: string, query: string, w = 1400, h = 700): string {
  if (LOCAL[slug]) return LOCAL[slug];
  return `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(query)}&sig=${sigFor(slug, 7)}`;
}

export function makeCardImage(slug: string, query: string, w = 600, h = 400): string {
  if (LOCAL[slug]) return LOCAL[slug];
  return `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(query)}&sig=${sigFor(slug, 3)}`;
}

export const FALLBACK_CAR = "https://source.unsplash.com/1400x700/?car,dark,studio";
