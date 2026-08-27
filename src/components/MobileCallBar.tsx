import { Phone } from "lucide-react";
import { useLocation } from "react-router-dom";
import { company } from "@/data/services";
import { trackEvent } from "@/utils/analytics";

export default function MobileCallBar() {
  const { pathname } = useLocation();
  // Hide on service pages (StickyServiceCTA covers it there)
  if (pathname.split("/").length >= 4 && pathname.startsWith("/services/")) return null;
  return (
    <a
      href={`tel:${company.phonePlain}`}
      onClick={() => trackEvent("click_phone", { source: "mobile_bar", page_url: typeof window !== "undefined" ? window.location.href : "" })}
      className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-center gap-2 py-3 btn-gold rounded-none"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
    >
      <Phone className="h-5 w-5" /> Позвонить {company.phone}
    </a>
  );
}
