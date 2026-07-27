import { siteImages, initialsAvatar } from "@/data/siteImages";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Star, Quote, Users, BadgeCheck, Award, Sparkles, Play, MessageCircle, ArrowRight, Home as HomeIcon, ShoppingBag, Key, Tag } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getInitials, type TestimonialCategory, type ClientTestimonial } from "@/data/testimonialsData";
import { useTestimonials } from "@/hooks/useSiteSettings";


export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Client Testimonials | Touch Stone Properties" },
      { name: "description", content: "Read real client experiences from buyers, sellers, owners, and tenants who trusted Touch Stone Properties for verified property buying, selling, and rental support." },
      { property: "og:title", content: "Client Testimonials | Touch Stone Properties" },
      { property: "og:description", content: "Real experiences from 1000+ happy buyers, sellers, owners, and tenants." },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: TestimonialsPage,
});

const HERO_BG = siteImages.hero.skyline;
const CTA_BG = siteImages.hero.welcome;

type TabKey = "All" | "Buyers" | "Sellers" | "Tenants" | "Owners";
const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; map?: TestimonialCategory }[] = [
  { key: "All", label: "All", icon: Sparkles },
  { key: "Buyers", label: "Buyers", icon: ShoppingBag, map: "Buyer" },
  { key: "Sellers", label: "Sellers", icon: Tag, map: "Seller" },
  { key: "Tenants", label: "Tenants", icon: Key, map: "Tenant" },
  { key: "Owners", label: "Owners", icon: HomeIcon, map: "Owner" },
];

const STATS = [
  { value: 1000, suffix: "+", label: "Happy Clients", icon: Users },
  { value: 500, suffix: "+", label: "Verified Properties", icon: BadgeCheck },
  { value: 17, suffix: "+", label: "Years Experience", icon: Award },
  { value: 4.9, suffix: "/5", label: "Average Rating", icon: Star, decimal: true },
];

function CountUp({ to, decimal }: { to: number; decimal?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{decimal ? val.toFixed(1) : Math.round(val)}</span>;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < Math.round(rating) ? "fill-gold text-gold" : "text-gold/30"} />
      ))}
      <span className="ml-1.5 text-xs font-semibold text-charcoal/70">{rating.toFixed(1)}</span>
    </div>
  );
}

function Avatar({ t }: { t: ClientTestimonial }) {
  if (t.photo) {
    return <img src={t.photo} alt={t.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-gold/40" />;
  }
  return (
    <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-gold to-[#8a6b1e] font-display text-lg font-bold text-white ring-2 ring-gold/40">
      {getInitials(t.name)}
    </div>
  );
}

function categoryColor(c: TestimonialCategory) {
  switch (c) {
    case "Buyer": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Seller": return "bg-amber-50 text-amber-700 border-amber-200";
    case "Tenant": return "bg-sky-50 text-sky-700 border-sky-200";
    case "Owner": return "bg-purple-50 text-purple-700 border-purple-200";
  }
}

function TestimonialCard({ t, i }: { t: ClientTestimonial; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-7 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] backdrop-blur-xl transition-shadow hover:shadow-[0_20px_50px_-15px_rgba(184,150,46,0.35)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition group-hover:ring-gold/40" />
      <Quote className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 text-gold/10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <Stars rating={t.rating} />
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${categoryColor(t.category)}`}>
            {t.category}
          </span>
        </div>
        <p className="mt-5 text-[15px] leading-relaxed text-charcoal/85">"{t.text}"</p>
        <div className="mt-6 flex items-center gap-3 border-t border-charcoal/10 pt-5">
          <Avatar t={t} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-lg font-semibold text-charcoal">{t.name}</h3>
            <p className="truncate text-xs text-charcoal/60">{t.location}</p>
          </div>
          <span className="shrink-0 rounded-md bg-charcoal px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
            {t.propertyType}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function TestimonialsPage() {
  const [tab, setTab] = useState<TabKey>("All");
  const { items: dbItems } = useTestimonials(true);

  const allTestimonials = useMemo<ClientTestimonial[]>(() => {
    return dbItems.map((t): ClientTestimonial => {
      const category = (["Buyer", "Seller", "Tenant", "Owner"].includes(t.category) ? t.category : "Buyer") as TestimonialCategory;
      const propertyType: ClientTestimonial["propertyType"] = category === "Seller" ? "Sell" : category === "Tenant" || category === "Owner" ? "Rent" : "Buy";
      return {
        id: t.id,
        name: t.name,
        location: t.location || "",
        photo: t.avatar_url || undefined,
        rating: t.rating ?? 5,
        text: t.quote,
        category,
        propertyType,
      };
    });
  }, [dbItems]);

  const filtered = useMemo(() => {
    const t = TABS.find((x) => x.key === tab);
    if (!t?.map) return allTestimonials;
    return allTestimonials.filter((c) => c.category === t.map);
  }, [tab, allTestimonials]);

  const featured = allTestimonials[0];


  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory via-white to-ivory">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate flex h-[60vh] min-h-[440px] w-full items-center justify-center overflow-hidden md:h-[60vh]" style={{ height: "60vh" }}>
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: "easeOut" }}
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/70 to-charcoal/90" />

        {/* floating quote chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{ delay: 0.8, duration: 6, repeat: Infinity }}
          className="absolute left-[6%] top-[28%] hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md md:flex md:items-center md:gap-2"
        >
          <Star size={14} className="fill-gold text-gold" />
          <span className="text-xs text-white">4.9/5 rated</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.2, duration: 7, repeat: Infinity }}
          className="absolute right-[7%] top-[34%] hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md md:block"
        >
          <Quote size={16} className="text-gold" />
        </motion.div>

        <div className="relative mx-auto max-w-3xl px-6 pt-20 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur">
            <Sparkles size={12} /> Trusted by 1000+ Happy Clients
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-5 font-display text-4xl font-bold leading-tight text-ivory md:text-6xl"
          >
            What Our Clients Say
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mx-auto mt-4 max-w-xl text-base text-ivory/80 md:text-lg"
          >
            Real experiences from buyers, sellers, owners, and tenants.
          </motion.p>
          <motion.nav
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            aria-label="Breadcrumb"
            className="mt-6 text-xs text-ivory/60"
          >
            <Link to="/" className="hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Testimonials</span>
          </motion.nav>
        </div>
      </section>

      {/* TRUST STATS */}
      <section className="relative z-10 -mt-16 px-4 md:-mt-20 md:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-2xl border border-gold/20 bg-white p-5 text-center shadow-[0_12px_40px_-15px_rgba(15,23,42,0.25)] md:p-6"
            >
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-gold/15 to-emerald-500/10">
                <s.icon size={20} className="text-gold" />
              </div>
              <div className="mt-3 font-display text-3xl font-bold text-charcoal md:text-4xl">
                <CountUp to={s.value} decimal={s.decimal} />{s.suffix}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-charcoal/60 md:text-xs">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="px-4 pt-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mx-auto h-px w-10 bg-gold" />
            <h2 className="mt-4 font-display text-3xl font-bold text-charcoal md:text-4xl">Voices from our community</h2>
            <p className="mt-2 text-sm text-charcoal/60">Filter testimonials by client type</p>
          </div>

          <div className="mt-8 overflow-x-auto scrollbar-none">
            <div className="mx-auto flex w-max items-center gap-2 rounded-full border border-charcoal/10 bg-white p-1.5 shadow-sm md:gap-1">
              {TABS.map((t) => {
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors md:px-5 ${
                      active ? "text-white" : "text-charcoal/70 hover:text-charcoal"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="tabpill"
                        className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-charcoal to-[#1a2740] shadow-[inset_0_0_0_1px_rgba(184,150,46,0.5)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <t.icon size={14} className={active ? "text-gold" : ""} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="px-4 pb-24 pt-10 md:px-6">
        <div className="mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((t, i) => (
                <TestimonialCard key={t.id} t={t} i={i} />
              ))}
            </motion.div>
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="py-20 text-center text-charcoal/60">No testimonials in this category yet.</p>
          )}
        </div>
      </section>

      {/* FEATURED STORY */}
      {featured && (
      <section className="relative overflow-hidden bg-gradient-to-br from-charcoal via-[#0e1a2e] to-emerald-950 px-4 py-16 md:py-20 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,150,46,0.18),transparent_50%)]" />
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mx-auto h-px w-10 bg-gold" />
            <h2 className="mt-4 font-display text-3xl font-bold text-ivory md:text-4xl">Featured Client Story</h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mt-12 grid grid-cols-1 gap-0 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[300px_1fr]"
          >
            <div className="relative flex items-center justify-center bg-gradient-to-br from-gold/15 via-emerald-50 to-white p-10">
              {featured.photo ? (
                <img src={featured.photo} alt={featured.name} className="h-40 w-40 rounded-full object-cover shadow-xl ring-4 ring-white" />
              ) : (
                <div className="grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-gold to-[#7a5d18] font-display text-5xl font-bold text-white shadow-xl ring-4 ring-white">
                  {getInitials(featured.name)}
                </div>
              )}
            </div>
            <div className="relative p-8 md:p-12">
              <Quote className="absolute right-6 top-6 h-20 w-20 text-gold/10" />
              <Stars rating={featured.rating} />
              <p className="mt-5 font-display text-xl italic leading-relaxed text-charcoal md:text-2xl">
                "{featured.text}"
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div>
                  <div className="font-display text-lg font-bold text-charcoal">{featured.name}</div>
                  <div className="text-xs text-charcoal/60">{featured.location}</div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  Property Type: {featured.propertyType}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      )}


      {/* VIDEO PLACEHOLDER */}
      <section className="bg-white px-4 py-16 md:py-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mx-auto h-px w-10 bg-gold" />
            <h2 className="mt-4 font-display text-3xl font-bold text-charcoal md:text-4xl">Client Stories That Build Trust</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-charcoal/60 md:text-base">
              Video testimonials and client experiences can be added here to make the page more engaging.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: "Ramesh Kumar", type: "Buy", img: initialsAvatar("Ramesh Kumar") },
              { name: "Priya Nair", type: "Rent", img: initialsAvatar("Priya Nair", "1c1c1e") },
              { name: "Suresh Reddy", type: "Sell", img: initialsAvatar("Suresh Reddy", "4a5e52") },
            ].map((v, i) => (
              <motion.button
                key={v.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => alert("Video coming soon")}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg"
              >
                <img src={v.img} alt={`${v.name} testimonial`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-2xl transition-transform group-hover:scale-110">
                    <Play size={22} className="ml-1 fill-charcoal text-charcoal" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                  <div className="font-display text-lg font-semibold text-white">{v.name}</div>
                  <span className="mt-1 inline-block rounded-full bg-gold/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-charcoal">{v.type}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden px-4 py-16 md:py-20 md:px-6">
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${CTA_BG})` }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/95 via-charcoal/85 to-emerald-950/90" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-ivory md:text-5xl">Ready to Find Your Perfect Property?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ivory/80 md:text-lg">
            Whether you want to buy, sell, or rent, Touch Stone Properties is ready to guide you with verified listings and expert support.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact-us"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-charcoal shadow-lg transition hover:shadow-[0_0_30px_rgba(184,150,46,0.6)] sm:w-auto"
            >
              Contact Us <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://wa.me/919902925519?text=Hi%20Touch%20Stone%20Properties%2C%20I%20am%20interested%20in%20buying%2C%20selling%2C%20or%20renting%20a%20property.%20Please%20contact%20me."
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] sm:w-auto"
            >
              <MessageCircle size={16} /> WhatsApp Now
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
