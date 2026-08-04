import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { X, Trophy, Phone, Calendar, MessageCircle, ExternalLink } from "lucide-react";
import type { Property } from "@/data/properties";

interface Props {
  open: boolean;
  onClose: () => void;
  properties: Property[];
  onRemove: (id: string) => void;
}

interface Row {
  label: string;
  get: (p: Property) => string;
  highlight?: "min" | "max"; // numeric best
  numeric?: (p: Property) => number;
}

const yes = (v: boolean) => (v ? "✓ Yes" : "—");

const rows: Row[] = [
  { label: "Builder", get: (p) => p.builder },
  { label: "Project Name", get: (p) => p.title },
  { label: "Project Type", get: (p) => p.type },
  { label: "Location", get: (p) => p.location },
  { label: "Category", get: (p) => p.listingType },
  { label: "Configuration", get: (p) => (p.bhk > 0 ? `${p.bhk} BHK` : "Plot / Land") },
  {
    label: "Price Starting From",
    get: (p) => p.price,
    highlight: "min",
    numeric: (p) => p.priceValue || Number.POSITIVE_INFINITY,
  },
  {
    label: "Super Built-up / Plot Size",
    get: (p) => `${p.sqft.toLocaleString()} sq.ft.`,
    highlight: "max",
    numeric: (p) => p.sqft,
  },
  { label: "Bathrooms", get: (p) => (p.baths > 0 ? `${p.baths}` : "—") },
  { label: "Possession", get: (p) => p.possession ?? "—" },
  { label: "Furnishing", get: (p) => p.furnishing ?? "—" },
  { label: "City", get: (p) => p.city },
  { label: "Area / Zone", get: (p) => p.area },
  { label: "Premium Project", get: (p) => yes(!!p.premium) },
  { label: "Trending", get: (p) => yes(!!p.trending) },
  { label: "Featured", get: (p) => yes(!!p.featured) },
  { label: "Property ID", get: (p) => p.id },
];

export function CompareModal({ open, onClose, properties, onRemove }: Props) {
  const winners = useMemo(() => {
    const map: Record<string, string> = {};
    if (properties.length < 2) return map;
    rows.forEach((r) => {
      if (!r.highlight || !r.numeric) return;
      const vals = properties.map((p) => ({ id: p.id, v: r.numeric!(p) }));
      const best =
        r.highlight === "min"
          ? vals.reduce((a, b) => (b.v < a.v ? b : a))
          : vals.reduce((a, b) => (b.v > a.v ? b : a));
      map[r.label] = best.id;
    });
    return map;
  }, [properties]);

  const allDifferent = (r: Row) => {
    const s = new Set(properties.map((p) => r.get(p)));
    return s.size > 1;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[90vh] w-[95%] max-w-7xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 bg-gradient-to-br from-white to-sand/40 px-6 py-5">
              <div>
                <h2 className="font-display text-2xl font-semibold text-charcoal sm:text-3xl">
                  Compare Properties
                </h2>
                <p className="mt-1 text-sm text-charcoal/60">
                  Compare specifications, pricing, location and amenities to choose the right
                  property.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-full bg-charcoal/5 text-charcoal transition hover:bg-charcoal/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {/* Summary cards — desktop & mobile horizontal scroll */}
              <div className="border-b border-charcoal/10 bg-sand/30 px-4 py-5 sm:px-6">
                <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gold">
                  Selected Properties
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {properties.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group relative overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-card"
                    >
                      <button
                        onClick={() => onRemove(p.id)}
                        aria-label="Remove"
                        className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-crimson"
                      >
                        <X size={14} />
                      </button>
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[1px] text-gold">
                          {p.builder}
                        </div>
                        <h3 className="mt-0.5 line-clamp-2 font-display text-sm font-semibold text-charcoal">
                          {p.title}
                        </h3>
                        <div className="mt-1 font-numeric text-sm font-bold text-charcoal">
                          {p.price}
                        </div>
                        {winners["Price Starting From"] === p.id && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 12 }}
                            className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold"
                          >
                            <Trophy size={10} /> Best Value
                          </motion.span>
                        )}
                        {winners["Super Built-up / Plot Size"] === p.id && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.05 }}
                            className="ml-1 mt-2 inline-flex items-center gap-1 rounded-full bg-sage/15 px-2 py-0.5 text-[10px] font-semibold text-sage"
                          >
                            <Trophy size={10} /> Largest
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Comparison table — desktop */}
              <div className="hidden px-4 py-5 sm:px-6 md:block">
                <div className="overflow-hidden rounded-2xl border border-charcoal/10">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-charcoal text-white">
                        <th className="sticky left-0 z-10 bg-charcoal px-4 py-3 text-left font-semibold">
                          Specification
                        </th>
                        {properties.map((p) => (
                          <th key={p.id} className="px-4 py-3 text-left font-semibold">
                            {p.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, idx) => {
                        const diff = allDifferent(r);
                        return (
                          <motion.tr
                            key={r.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className={idx % 2 === 0 ? "bg-white" : "bg-sand/40"}
                          >
                            <td className="sticky left-0 z-10 bg-inherit px-4 py-3 font-medium text-charcoal/70">
                              {r.label}
                            </td>
                            {properties.map((p) => {
                              const isWinner = winners[r.label] === p.id;
                              return (
                                <td
                                  key={p.id}
                                  className={`px-4 py-3 ${
                                    isWinner
                                      ? "bg-gold/20 font-semibold text-charcoal"
                                      : diff
                                        ? "text-charcoal"
                                        : "text-charcoal/70"
                                  }`}
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    {isWinner && <Trophy size={12} className="text-gold" />}
                                    {r.get(p)}
                                  </span>
                                </td>
                              );
                            })}
                          </motion.tr>
                        );
                      })}
                      {/* Actions row */}
                      <tr className="bg-white">
                        <td className="sticky left-0 z-10 bg-white px-4 py-4 font-medium text-charcoal/70">
                          Actions
                        </td>
                        {properties.map((p) => (
                          <td key={p.id} className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <Link
                                to="/property/$slug"
                                params={{ slug: p.slug }}
                                className="inline-flex items-center gap-1 rounded-full bg-charcoal px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-brand"
                              >
                                <ExternalLink size={11} /> View
                              </Link>
                              <a
                                href="tel:+919902925519"
                                className="inline-flex items-center gap-1 rounded-full border border-charcoal/20 px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-charcoal/5"
                              >
                                <Phone size={11} /> Contact
                              </a>
                              <a
                                href={`https://wa.me/919902925519?text=${encodeURIComponent(
                                  `Hi, I'm interested in ${p.title} (${p.location})`,
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1.5 text-xs font-semibold text-white hover:bg-sage/90"
                              >
                                <MessageCircle size={11} /> WhatsApp
                              </a>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile — swipe cards */}
              <div className="block px-4 py-5 md:hidden">
                <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
                  {properties.map((p) => (
                    <div
                      key={p.id}
                      className="w-[85%] flex-shrink-0 snap-center overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-card"
                    >
                      <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />
                      <div className="p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[1px] text-gold">
                          {p.builder}
                        </div>
                        <h3 className="mt-0.5 font-display text-base font-semibold text-charcoal">
                          {p.title}
                        </h3>
                        <div className="mt-1 font-numeric text-lg font-bold text-charcoal">
                          {p.price}
                        </div>
                        <dl className="mt-3 divide-y divide-charcoal/10 text-xs">
                          {rows.map((r) => {
                            const isWinner = winners[r.label] === p.id;
                            return (
                              <div
                                key={r.label}
                                className={`flex justify-between gap-3 py-1.5 ${
                                  isWinner ? "bg-gold/15 px-2 font-semibold" : ""
                                }`}
                              >
                                <dt className="text-charcoal/60">{r.label}</dt>
                                <dd className="text-right text-charcoal">{r.get(p)}</dd>
                              </div>
                            );
                          })}
                        </dl>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link
                            to="/property/$slug"
                            params={{ slug: p.slug }}
                            className="inline-flex items-center gap-1 rounded-full bg-charcoal px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            <ExternalLink size={11} /> View
                          </Link>
                          <a
                            href="tel:+919902925519"
                            className="inline-flex items-center gap-1 rounded-full border border-charcoal/20 px-3 py-1.5 text-xs font-semibold text-charcoal"
                          >
                            <Phone size={11} /> Contact
                          </a>
                          <a
                            href={`https://wa.me/919902925519?text=${encodeURIComponent(
                              `Hi, I'm interested in ${p.title}`,
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            <MessageCircle size={11} /> WhatsApp
                          </a>
                          <button
                            onClick={() => onRemove(p.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-crimson/30 px-3 py-1.5 text-xs font-semibold text-crimson"
                          >
                            <X size={11} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/10 bg-sand/30 px-6 py-4">
              <div className="text-xs text-charcoal/60">
                Comparing {properties.length} of 4 properties
              </div>
              <div className="flex gap-2">
                <Link
                  to="/contact-us"
                  className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/20 px-4 py-2 text-xs font-semibold text-charcoal hover:bg-charcoal/5"
                >
                  <Calendar size={12} /> Schedule Site Visit
                </Link>
                <button
                  onClick={onClose}
                  className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-white hover:bg-gold-light"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
