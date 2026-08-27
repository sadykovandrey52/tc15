import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-4 bottom-44 md:bottom-24 z-40 h-11 w-11 rounded-full bg-surface-2 text-gold border border-gold/40 shadow-lg flex items-center justify-center hover:bg-gold hover:text-background transition-colors"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
