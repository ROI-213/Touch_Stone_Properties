import { siteImages } from "@/data/siteImages";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { useBrandSettings } from "@/hooks/useSiteSettings";
import { useContentSection } from "@/hooks/useContentSection";

export function ContactCTA() {
  const { brand } = useBrandSettings();
  const heading = useContentSection("home.contact_cta", {
    title: "Ready to Find Your Dream Property?",
    subtitle: "Our experts are available 7 days a week to guide your property journey.",
  });
  const phoneDigits = (brand.phone || "").replace(/\D/g, "");
  const waDigits = (brand.whatsapp || brand.phone || "").replace(/\D/g, "");
  return (
    <section
      className="relative h-[400px] w-full overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          `url(${siteImages.hero.skyline})`,
      }}
    >
      <div className="absolute inset-0 bg-charcoal/75" />
      <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center">
        <motion.h2
          initial={{ y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[34px] md:text-[46px] font-bold text-ivory"
        >
          {heading.title}
        </motion.h2>
        <motion.p
          initial={{ y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/80"
        >
          {heading.subtitle}
        </motion.p>

        <motion.div
          initial={{ y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={phoneDigits ? `tel:+${phoneDigits}` : "#"}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-sm font-medium text-charcoal transition-transform hover:scale-105"
          >
            <Phone size={16} /> Call Now
          </a>
          <a
            href={waDigits ? `https://wa.me/${waDigits}` : "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-whatsapp px-6 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
