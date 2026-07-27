import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { properties as staticProperties } from "@/data/properties";
import { useDbProperties } from "@/hooks/useDbProperties";
import { PropertyCard } from "./PropertyCard";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { useContentSection } from "@/hooks/useContentSection";

const tabs = ["Latest Listings", "Premium Properties", "Trending"] as const;
type Tab = (typeof tabs)[number];

export function FeaturedProperties() {
  const [tab, setTab] = useState<Tab>("Latest Listings");
  const { data: dbProps = [], isLoading } = useDbProperties();
  const heading = useContentSection("home.featured", {
    title: "Featured Properties",
    subtitle: "Premium & Verified Listings",
  });

  const list = useMemo(() => {
    const combined = [
      ...(Array.isArray(dbProps) ? dbProps : []),
      ...(Array.isArray(staticProperties) ? staticProperties : []),
    ];
    const seen = new Set<string>();
    const unique = combined.filter((p) => {
      const key = String(p.id ?? p.slug ?? p.title);
      const slugKey = `slug:${p.slug ?? ""}`;
      const titleKey = `title:${(p.title ?? "").trim().toLowerCase()}`;
      if (seen.has(key) || (p.slug && seen.has(slugKey)) || seen.has(titleKey)) return false;
      seen.add(key);
      if (p.slug) seen.add(slugKey);
      seen.add(titleKey);
      return true;
    });
    return unique.filter((p) => {
      if (tab === "Premium Properties") return p.premium;
      if (tab === "Trending") return p.trending;
      return true;
    });
  }, [dbProps, tab]);

  return (
    <section className="bg-ivory px-6 py-16 md:py-20">
      <div className="mx-auto w-full">
        <motion.div
          initial={{ y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mx-auto mb-6 h-px w-10 bg-gold" />
          <h2 className="font-display text-[40px] md:text-[50px] font-bold text-charcoal">
            {heading.title}
          </h2>
          <p className="mt-2 text-base text-charcoal/60">
            {heading.subtitle}
          </p>
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-8 border-b border-charcoal/10">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                tab === t ? "text-charcoal" : "text-charcoal/50 hover:text-charcoal/80"
              }`}
            >
              {t}
              {tab === t && (
                <motion.div
                  layoutId="feat-tab"
                  className="absolute inset-x-0 -bottom-px h-[2px] bg-gold"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} view="grid" />
                ))
              : list.map((p, i) => (
                  <PropertyCard key={p.id} p={p} index={i} />
                ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 text-center">
          <Link
            to="/buy-properties/$type"
            params={{ type: "all" }}
            className="inline-flex h-12 w-[200px] items-center justify-center rounded-full border-[1.5px] border-gold text-sm font-medium text-gold transition-all hover:bg-gold hover:text-white"
          >
            View All Properties →
          </Link>
        </div>
      </div>
    </section>
  );
}
