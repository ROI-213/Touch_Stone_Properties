import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useBrandSettings } from "@/hooks/useSiteSettings";

export function WhatsAppButton() {
  const [hover, setHover] = useState(false);
  const { brand } = useBrandSettings();
  const digits = (brand.whatsapp || brand.phone).replace(/\D/g, "");
  const href = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent("Hi, I'm interested in a property")}`
    : "#";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fixed bottom-6 right-6 z-[1000] grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white transition-transform hover:scale-110"
      style={{ animation: "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite" }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
      {hover && (
        <span className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-full bg-charcoal px-3 py-1.5 text-xs text-ivory shadow-lg">
          Chat with us on WhatsApp
        </span>
      )}
    </a>
  );
}
