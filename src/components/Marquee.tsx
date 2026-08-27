import { popularServiceLine } from "@/data/services";

export default function Marquee() {
  const items = [...popularServiceLine, ...popularServiceLine];
  return (
    <div className="border-y border-border bg-surface overflow-hidden py-4">
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-6 px-6">
            <span className="font-head text-gold text-lg uppercase tracking-wider">{t}</span>
            <span className="text-gold/50">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
