import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { properties as sharedProperties, type Property as SiteProperty } from "@/data/properties";
import { FALLBACK_PROPERTY_IMAGE, resolveLocalImage } from "@/data/siteImages";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Building2,
  BadgeCheck,
  X,
  Phone,
  Mail,
  User,
  Star,
  CheckCircle2,
  Trees,
  Dumbbell,
  Waves,
  Car,
  Shield,
  Wifi,
  Wind,
  Sun,
  Tv,
  Users,
  Camera,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useContentSection } from "@/hooks/useContentSection";
import { useDbProperties } from "@/hooks/useDbProperties";

/* ============== Types & Data ============== */

type Property = {
  id: string;
  slug: string;
  projectName: string;
  builderName: string;
  builderLogo: string;
  location: string;
  priceRange: string;
  propertyType: string;
  configuration: string;
  status: string;
  highlight: string;
  heroImage: string;
  galleryImages: string[];
  overview: string;
  highlights: string[];
  configurations: { type: string; size: string; price: string }[];
  amenities: { name: string; icon: typeof Trees }[];
  floorPlans: { name: string; size: string; image: string }[];
  locationAdvantages: { place: string; distance: string }[];
  priceBreakdown: { label: string; amount: string }[];
  builderInfo: { tagline: string; established: string; projects: string; description: string };
  reraNumber: string;
};

const baseAmenities = [
  { name: "Landscaped Gardens", icon: Trees },
  { name: "Clubhouse", icon: Users },
  { name: "Gym", icon: Dumbbell },
  { name: "Swimming Pool", icon: Waves },
  { name: "Covered Parking", icon: Car },
  { name: "24x7 Security", icon: Shield },
  { name: "High-Speed Wi-Fi", icon: Wifi },
  { name: "Air Conditioning", icon: Wind },
  { name: "Solar Panels", icon: Sun },
  { name: "Mini Theatre", icon: Tv },
];

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const mapSiteProperties = (source: SiteProperty[]): Property[] => (Array.isArray(source) ? source : []).slice(0, 10).map((p, i) => {
  const config =
    p.type === "Plot"
      ? "Premium Plots"
      : p.bhk > 0
        ? `${p.bhk} BHK ${p.type}`
        : p.type;
  const highlight = p.trending
    ? "Trending"
    : p.premium
      ? "Premium"
      : p.featured
        ? "Featured"
        : "New Launch";
  return {
    id: p.id,
    slug: p.slug,
    projectName: p.title,
    builderName: p.builder,
    builderLogo: initialsOf(p.builder),
    location: p.location,
    priceRange: p.price,
    propertyType: p.type,
    configuration: config,
    status: p.possession ?? "Under Construction",
    highlight,
    heroImage: p.image,
    galleryImages: [p.image],
    overview: p.description,
    highlights: [
      "RERA approved with clear title",
      "Vaastu-compliant layouts",
      "Premium imported fittings",
      "5-tier security system",
      "Sustainable design with rainwater harvesting",
      "EV charging in every parking bay",
    ],
    configurations:
      p.type === "Plot"
        ? [{ type: "Plot", size: `${p.sqft} sq.ft`, price: p.price }]
        : [
            {
              type: `${p.bhk} BHK`,
              size: `${p.sqft.toLocaleString()} sq.ft`,
              price: p.price,
            },
          ],
    amenities: baseAmenities,
    floorPlans: [
      {
        name: `${p.bhk ? `${p.bhk} BHK ` : ""}${p.type} Plan`,
        size: `${p.sqft} sq.ft`,
        image: p.image,
      },
    ],
    locationAdvantages: [
      { place: "Tech Park", distance: "12 min drive" },
      { place: "International School", distance: "5 min walk" },
      { place: "Metro Station", distance: "8 min drive" },
      { place: "Multi-Specialty Hospital", distance: "6 min drive" },
      { place: "Shopping Mall", distance: "10 min drive" },
      { place: "International Airport", distance: "35 min drive" },
    ],
    priceBreakdown: [
      { label: "Base Price", amount: p.price },
      { label: "GST", amount: "As applicable" },
      { label: "Registration & Stamp Duty", amount: "At actuals" },
      { label: "Maintenance (1 year)", amount: "₹ 1.20 L" },
    ],
    builderInfo: {
      tagline: `${p.builder} — building landmarks`,
      established: "—",
      projects: "Multiple delivered",
      description: `${p.builder} is among India's most respected real-estate brands, known for design excellence, on-time delivery, and uncompromising quality across residential and commercial portfolios.`,
    },
    reraNumber: `PRM/KA/RERA/1251/446/PR/${230101 + i}`,
  };
});

const fallbackProperties = mapSiteProperties(sharedProperties);


/* ============== Sub-components ============== */

function BuilderLogo({ initials }: { initials: string }) {
  return (
    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#6D28D9] to-[#A855F7] text-white font-bold text-sm shadow-[0_8px_22px_rgba(109,40,217,0.35)]">
      {initials}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "Ready to Move"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "Pre-Launch"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-violet-50 text-violet-700 ring-violet-200";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${color}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function PropertyCard({ p, onOpen }: { p: Property; onOpen: () => void }) {
  return (
    <article className="grid h-full overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(76,29,149,0.12)] ring-1 ring-violet-100 md:grid-cols-[40%_60%]">
      {/* Details */}
      <div className="order-2 flex flex-col gap-5 p-7 md:order-1 md:p-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BuilderLogo initials={p.builderLogo} />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[2px] text-violet-600">
                {p.builderName}
              </div>
              <div className="text-[10px] text-slate-500">RERA: {p.reraNumber.slice(-8)}</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
            <Sparkles size={11} /> {p.highlight}
          </span>
        </div>

        <div>
          <h3
            className="text-[28px] font-bold leading-tight text-slate-900 md:text-[34px]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {p.projectName}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-[14px] text-slate-600">
            <MapPin size={14} className="text-violet-600" />
            <span>{p.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-violet-50/60 p-3.5 ring-1 ring-violet-100">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-violet-700">
              <Building2 size={12} /> Type
            </div>
            <div className="mt-1 text-[14px] font-semibold text-slate-900">{p.propertyType}</div>
          </div>
          <div className="rounded-2xl bg-violet-50/60 p-3.5 ring-1 ring-violet-100">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-violet-700">
              <Bed size={12} /> Config
            </div>
            <div className="mt-1 text-[14px] font-semibold text-slate-900">{p.configuration}</div>
          </div>
        </div>

        <StatusPill status={p.status} />

        <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-4 text-white shadow-[0_12px_30px_rgba(109,40,217,0.35)]">
          <div className="text-[10px] font-semibold uppercase tracking-[2px] text-white/70">Price Range</div>
          <div className="text-[22px] font-bold">{p.priceRange}</div>
        </div>

        <div className="mt-auto flex flex-wrap gap-3">
          <Link
            to="/property/$slug"
            params={{ slug: p.slug }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-[13px] font-bold text-white shadow-[0_10px_25px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            View Details <ArrowRight size={15} />
          </Link>
        </div>

      </div>

      {/* Image */}
      <div className="relative order-1 h-64 overflow-hidden md:order-2 md:h-full md:min-h-[520px]">
        <img
          src={p.heroImage}
          alt={p.projectName}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-white/30" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-violet-700 shadow-md backdrop-blur md:hidden">
          <BadgeCheck size={12} /> Verified
        </div>
      </div>
    </article>
  );
}

/* ============== Modal ============== */

function AmenitiesGrid({ amenities }: { amenities: Property["amenities"] }) {
  const list = Array.isArray(amenities) ? amenities : [];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {list.map((a) => {
        const Icon = a.icon;
        return (
          <div
            key={a.name}
            className="flex flex-col items-center gap-2 rounded-2xl bg-violet-50/60 p-4 text-center ring-1 ring-violet-100 transition hover:-translate-y-1 hover:bg-violet-100"
          >
            <Icon size={22} className="text-violet-700" />
            <div className="text-[12px] font-semibold text-slate-700">{a.name}</div>
          </div>
        );
      })}
    </div>
  );
}

function ConfigurationsTable({ rows }: { rows: Property["configurations"] }) {
  const list = Array.isArray(rows) ? rows : [];
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-violet-100">
      <table className="w-full text-left text-sm">
        <thead className="bg-violet-50 text-[11px] uppercase tracking-[1.5px] text-violet-700">
          <tr>
            <th className="p-4 font-semibold">Type</th>
            <th className="p-4 font-semibold">Carpet Area</th>
            <th className="p-4 font-semibold">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-violet-100 bg-white">
          {list.map((r) => (
            <tr key={r.type} className="text-slate-700">
              <td className="p-4 font-bold text-slate-900">{r.type}</td>
              <td className="p-4">{r.size}</td>
              <td className="p-4 font-semibold text-violet-700">{r.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Gallery({ images }: { images: string[] }) {
  const safeImages = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean).map((src) => resolveLocalImage(src, FALLBACK_PROPERTY_IMAGE))
    : [FALLBACK_PROPERTY_IMAGE];
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="overflow-hidden rounded-3xl ring-1 ring-violet-100">
        <img src={safeImages[active] ?? safeImages[0]} alt="Gallery" className="h-[360px] w-full object-cover sm:h-[440px]" />
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {safeImages.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            className={`overflow-hidden rounded-xl ring-2 transition ${
              i === active ? "ring-violet-600" : "ring-transparent hover:ring-violet-200"
            }`}
          >
            <img src={src} alt="" className="h-16 w-full object-cover sm:h-20" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactForm({ project }: { project: string }) {
  const [sent, setSent] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white shadow-[0_20px_50px_rgba(109,40,217,0.35)] sm:p-7"
    >
      <div className="text-[11px] font-bold uppercase tracking-[2px] text-white/70">Get in touch</div>
      <h4 className="mt-1 text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
        Enquire about {project}
      </h4>
      {sent ? (
        <div className="mt-5 rounded-2xl bg-white/15 p-4 text-sm">
          Thanks! Our property advisor will reach out within 24 hours.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <label className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2.5 ring-1 ring-white/20">
            <User size={16} className="text-white/70" />
            <input required placeholder="Your name" className="w-full bg-transparent text-sm placeholder-white/60 outline-none" />
          </label>
          <label className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2.5 ring-1 ring-white/20">
            <Phone size={16} className="text-white/70" />
            <input required type="tel" placeholder="Phone number" className="w-full bg-transparent text-sm placeholder-white/60 outline-none" />
          </label>
          <label className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2.5 ring-1 ring-white/20">
            <Mail size={16} className="text-white/70" />
            <input required type="email" placeholder="Email" className="w-full bg-transparent text-sm placeholder-white/60 outline-none" />
          </label>
          <button className="w-full rounded-full bg-white py-3 text-sm font-bold text-violet-700 transition hover:bg-amber-300 hover:text-violet-900">
            Request a Call Back
          </button>
        </div>
      )}
    </form>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof Trees; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100 text-violet-700">
          <Icon size={16} />
        </div>
        <h3 className="text-[20px] font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function PropertyDetailsModal({ p, onClose }: { p: Property; onClose: () => void }) {
  const highlights = Array.isArray(p.highlights) ? p.highlights : [];
  const locationAdvantages = Array.isArray(p.locationAdvantages) ? p.locationAdvantages : [];
  const floorPlans = Array.isArray(p.floorPlans) ? p.floorPlans : [];
  const priceBreakdown = Array.isArray(p.priceBreakdown) ? p.priceBreakdown : [];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-stretch justify-center sm:items-center sm:p-6">
      <motion.div
        initial={{ }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-violet-100 bg-white/95 px-6 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <BuilderLogo initials={p.builderLogo} />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[2px] text-violet-700">{p.builderName}</div>
              <h2 className="text-[22px] font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                {p.projectName}
              </h2>
              <div className="flex items-center gap-1 text-[12px] text-slate-500">
                <MapPin size={12} /> {p.location}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="grid flex-1 grid-cols-1 gap-8 overflow-y-auto p-6 sm:p-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <Section title="Project Overview" icon={Sparkles}>
              <p className="text-[15px] leading-[1.75] text-slate-700">{p.overview}</p>
              <div className="flex flex-wrap gap-2">
                <StatusPill status={p.status} />
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200">
                  <BadgeCheck size={11} /> RERA: {p.reraNumber}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                  <Star size={11} /> {p.highlight}
                </span>
              </div>
            </Section>

            <Section title="Project Highlights" icon={Star}>
              <div className="grid gap-2 sm:grid-cols-2">
                {highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2 text-[14px] text-slate-700">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-violet-600" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Apartment Configurations" icon={Bed}>
              <ConfigurationsTable rows={p.configurations} />
            </Section>

            <Section title="Development Details" icon={Building2}>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { k: "Type", v: p.propertyType },
                  { k: "Configuration", v: p.configuration },
                  { k: "Status", v: p.status },
                  { k: "Possession", v: "Dec 2026" },
                  { k: "Total Units", v: "420" },
                  { k: "Total Towers", v: "6" },
                ].map((d) => (
                  <div key={d.k} className="rounded-2xl bg-violet-50/60 p-4 ring-1 ring-violet-100">
                    <div className="text-[10px] font-semibold uppercase tracking-[1.5px] text-violet-700">{d.k}</div>
                    <div className="mt-1 text-[14px] font-semibold text-slate-900">{d.v}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Amenities" icon={Dumbbell}>
              <AmenitiesGrid amenities={p.amenities} />
            </Section>

            <Section title="Image Gallery" icon={Camera}>
              <Gallery images={p.galleryImages} />
            </Section>

            <Section title="Location Advantages" icon={MapPin}>
              <div className="grid gap-2 sm:grid-cols-2">
                {locationAdvantages.map((l) => (
                  <div key={l.place} className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-violet-100">
                    <div className="flex items-center gap-2.5 text-[14px] text-slate-700">
                      <MapPin size={14} className="text-violet-600" /> {l.place}
                    </div>
                    <span className="text-[12px] font-semibold text-violet-700">{l.distance}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Floor Plans" icon={Building2}>
              <div className="grid gap-4 sm:grid-cols-3">
                {floorPlans.map((fp) => (
                  <div key={fp.name} className="overflow-hidden rounded-2xl bg-white ring-1 ring-violet-100">
                    <img src={fp.image} alt={fp.name} className="h-40 w-full object-cover" />
                    <div className="p-4">
                      <div className="text-[14px] font-bold text-slate-900">{fp.name}</div>
                      <div className="text-[12px] text-slate-500">{fp.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Price Breakdown" icon={Calendar}>
              <div className="overflow-hidden rounded-2xl ring-1 ring-violet-100">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-violet-100 bg-white">
                    {priceBreakdown.map((b, i) => (
                      <tr key={b.label} className={i === priceBreakdown.length - 1 ? "bg-violet-50 font-bold text-violet-900" : "text-slate-700"}>
                        <td className="p-4">{b.label}</td>
                        <td className="p-4 text-right">{b.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Builder Information" icon={Shield}>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-violet-100">
                <div className="flex items-center gap-3">
                  <BuilderLogo initials={p.builderLogo} />
                  <div>
                    <div className="text-[16px] font-bold text-slate-900">{p.builderName}</div>
                    <div className="text-[12px] text-violet-700">{p.builderInfo.tagline}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-violet-50 p-3">
                    <div className="text-[10px] uppercase tracking-[1.5px] text-violet-700">Established</div>
                    <div className="font-bold text-slate-900">{p.builderInfo.established}</div>
                  </div>
                  <div className="rounded-xl bg-violet-50 p-3">
                    <div className="text-[10px] uppercase tracking-[1.5px] text-violet-700">Projects</div>
                    <div className="font-bold text-slate-900">{p.builderInfo.projects}</div>
                  </div>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-slate-700">{p.builderInfo.description}</p>
              </div>
            </Section>
          </div>

          {/* Sticky contact rail */}
          <aside className="lg:sticky lg:top-4 lg:self-start">
            <ContactForm project={p.projectName} />
          </aside>
        </div>
      </motion.div>
    </div>
  );
}

/* ============== Carousel ============== */

function Top10PropertyCardSkeleton() {
  return (
    <article className="grid h-full overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(76,29,149,0.12)] ring-1 ring-violet-100 md:grid-cols-[40%_60%]">
      {/* Details Skeleton */}
      <div className="order-2 flex flex-col gap-5 p-7 md:order-1 md:p-10 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-violet-100" />
            <div>
              <div className="h-3 w-20 rounded bg-violet-100" />
              <div className="mt-1.5 h-2 w-16 rounded bg-violet-100" />
            </div>
          </div>
          <div className="h-6 w-20 rounded-full bg-violet-100" />
        </div>

        <div>
          <div className="h-8 w-3/4 rounded bg-violet-100" />
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-violet-100" />
            <div className="h-3 w-32 rounded bg-violet-100" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-violet-50/60 p-3.5 ring-1 ring-violet-100">
            <div className="h-2 w-12 rounded bg-violet-200" />
            <div className="mt-2 h-4 w-20 rounded bg-violet-200" />
          </div>
          <div className="rounded-2xl bg-violet-50/60 p-3.5 ring-1 ring-violet-100">
            <div className="h-2 w-12 rounded bg-violet-200" />
            <div className="mt-2 h-4 w-20 rounded bg-violet-200" />
          </div>
        </div>

        <div className="h-6 w-32 rounded-full bg-violet-100" />

        <div className="rounded-2xl bg-violet-100 p-4 h-20" />

        <div className="mt-auto flex flex-wrap gap-3">
          <div className="h-12 w-full rounded-full bg-slate-200" />
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="relative order-1 h-64 overflow-hidden bg-slate-200 animate-pulse md:order-2 md:h-full md:min-h-[520px]" />
    </article>
  );
}

export function Top10Properties() {
  const { data: dbProps = [], isLoading } = useDbProperties();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<Property | null>(null);
  const properties = useMemo(() => {
    const curated = (dbProps as any[]).filter((p) => p?.isTopFeatured);
    if (curated.length > 0) {
      const sorted = [...curated].sort((a, b) => {
        const ra = a.topFeaturedRank ?? 999;
        const rb = b.topFeaturedRank ?? 999;
        return ra - rb;
      });
      return mapSiteProperties(sorted.slice(0, 10) as SiteProperty[]);
    }
    return mapSiteProperties(dbProps.length > 0 ? dbProps : sharedProperties);
  }, [dbProps]);
  const total = properties.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const heading = useContentSection("home.top10", {
    title: "Top 10 Featured Properties",
    subtitle: "Hand-curated projects from India's most trusted developers — explore details, floor plans, and pricing in one place.",
  });

  // Swipe
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
    startX.current = null;
  };

  const next = () => setIndex((i) => (total ? (i + 1) % total : 0));
  const prev = () => setIndex((i) => (total ? (i - 1 + total) % total : 0));

  useEffect(() => {
    if (paused || open || total < 2) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, open, total]);

  const active = useMemo(() => properties[index] ?? properties[0] ?? fallbackProperties[0], [properties, index]);

  if (!isLoading && total === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-violet-50/40 to-white py-16 sm:py-20">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative mx-auto w-full px-5 sm:px-8">
        <motion.div
          initial={{ y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[3px] text-violet-700 shadow-[0_6px_18px_rgba(109,40,217,0.15)] ring-1 ring-violet-200">
            <Sparkles size={12} /> Top 10
          </span>
          <h2
            className="mt-5 text-[40px] font-bold leading-tight text-slate-900 sm:text-[54px]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {heading.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
            {heading.subtitle}
          </p>
        </motion.div>

        <div
          className="relative mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div ref={trackRef} className="overflow-hidden rounded-[32px]">
            {isLoading ? (
              <Top10PropertyCardSkeleton />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={active?.id || "empty"}
                  initial={{ x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {active && <PropertyCard p={active} onOpen={() => setOpen(active)} />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Arrows */}
          {!isLoading && (
            <>
              <button
                onClick={prev}
                aria-label="Previous property"
                className="absolute left-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-violet-700 shadow-[0_10px_25px_rgba(15,23,42,0.18)] ring-1 ring-violet-100 transition hover:scale-110 hover:bg-violet-700 hover:text-white sm:-left-5 sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next property"
                className="absolute right-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-violet-700 shadow-[0_10px_25px_rgba(15,23,42,0.18)] ring-1 ring-violet-100 transition hover:scale-110 hover:bg-violet-700 hover:text-white sm:-right-5 sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {!isLoading && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {properties.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to property ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-10 bg-violet-700" : "w-2 bg-violet-200 hover:bg-violet-400"
                }`}
              />
            ))}
          </div>
        )}

        {!isLoading && total > 0 && (
          <div className="mt-4 text-center text-[12px] font-semibold uppercase tracking-[2px] text-slate-500">
            {String(index + 1).padStart(2, "0")} <span className="text-violet-400">/</span>{" "}
            {String(total).padStart(2, "0")}
          </div>
        )}
      </div>

      <AnimatePresence>{open && <PropertyDetailsModal p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

export default Top10Properties;
