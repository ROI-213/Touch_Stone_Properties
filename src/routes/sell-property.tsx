import { siteImages } from "@/data/siteImages";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Target,
  Wallet,
  Zap,
  Upload,
  X,
  Plus,
  Minus,
  Home as HomeIcon,
  Building2,
  Trees,
  Store,
  Hotel,
  KeyRound,
  Check,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { uploadEnquiryImage } from "@/lib/enquiries";
import { createSellEnquiry } from "@/lib/sell-enquiries";
import { LocalityAutocomplete } from "@/components/LocalityAutocomplete";

export const Route = createFileRoute("/sell-property")({
  head: () => ({
    meta: [
      { title: "List Your Property — Touch Stone Properties" },
      {
        name: "description",
        content:
          "List your property with Bangalore's most trusted real-estate broker. Free listing, expert guidance, 15-day average closure.",
      },
    ],
  }),
  component: SellPropertyPage,
});

/* ----------------------- Validation schemas ----------------------- */

const step1Schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  intent: z.enum(["SELL", "RENT"]),
  type: z.enum(["Apartment", "Villa", "Plot", "Commercial", "Residential"]),
});

const step2Schema = z.object({
  address: z.string().trim().min(8, "Address is too short").max(500),
  city: z.string().min(1, "Select a city"),
  area: z.string().min(1, "Select an area"),
  locality: z.string().trim().max(120).optional().or(z.literal("")),
});

const step3Schema = z.object({
  price: z.number({ message: "Enter asking price" }).min(100000, "Price too low"),
  sqft: z.number({ message: "Enter sqft" }).min(100).max(100000),
  bedrooms: z.number().min(0).max(10),
  bathrooms: z.number().min(0).max(10),
  furnishing: z.enum(["Furnished", "Semi-Furnished", "Unfurnished"]),
  possession: z.enum(["Ready to Move", "Under Construction"]),
  amenities: z.array(z.string()).default([]),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

type FormData = {
  // step 1
  name: string;
  phone: string;
  email: string;
  intent: "SELL" | "RENT";
  type: "Apartment" | "Villa" | "Plot" | "Commercial" | "Residential";
  // step 2
  address: string;
  city: string;
  area: string;
  locality: string;
  lat: number;
  lng: number;
  mapLink: string;
  // step 3
  price: number | "";
  sqft: number | "";
  bedrooms: number;
  bathrooms: number;
  furnishing: "Furnished" | "Semi-Furnished" | "Unfurnished";
  possession: "Ready to Move" | "Under Construction";
  amenities: string[];
  description: string;
  images: { name: string; url: string; file?: File }[];
};

const INITIAL: FormData = {
  name: "",
  phone: "",
  email: "",
  intent: "SELL",
  type: "Apartment",
  address: "",
  city: "Bangalore",
  area: "",
  locality: "",
  lat: 12.9716,
  lng: 77.5946,
  mapLink: "",
  price: "",
  sqft: "",
  bedrooms: 2,
  bathrooms: 2,
  furnishing: "Semi-Furnished",
  possession: "Ready to Move",
  amenities: [],
  description: "",
  images: [],
};

const AREAS: Record<string, string[]> = {
  Bangalore: ["Whitefield", "Koramangala", "Indiranagar", "HSR Layout", "Hebbal", "Jayanagar", "Sarjapur", "Marathahalli", "Devanahalli", "Electronic City"],
  Hyderabad: ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Kondapur", "Madhapur"],
  Chennai: ["Adyar", "Anna Nagar", "OMR", "T Nagar", "Velachery"],
  Mumbai: ["Bandra", "Powai", "Andheri", "Worli", "Juhu"],
};

const TYPE_CHIPS = [
  { key: "Apartment", icon: Building2, emoji: "🏢" },
  { key: "Villa", icon: HomeIcon, emoji: "🏡" },
  { key: "Plot", icon: Trees, emoji: "🌳" },
  { key: "Commercial", icon: Store, emoji: "🏪" },
  { key: "Residential", icon: Hotel, emoji: "🏘️" },
] as const;

const AMENITY_LIST = [
  "Lift",
  "Security",
  "Gym",
  "Swimming Pool",
  "Garden",
  "Club House",
  "Power Backup",
  "Parking",
];

const STEPS = ["Your Info", "Location", "Details", "Review"];

/* ------------------------------ Page ------------------------------ */

function SellPropertyPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      {/* Hero */}
      <section
        className="relative flex min-h-[480px] items-end overflow-hidden px-6 pb-12 pt-36 text-ivory md:h-[400px] md:min-h-0 md:pt-32"
        style={{
          backgroundImage:
            `url(${siteImages.hero.sell})`,
          backgroundSize: "cover",
          backgroundPosition: "right center",
        }}
      >
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="relative z-10 mx-auto w-full w-full">
          <h1 className="font-display text-4xl font-bold leading-tight md:text-[56px]">
            List Your Property With Us
          </h1>
          <p className="mt-3 max-w-2xl text-[18px] text-white/85">
            We'll connect you with the right buyers. Free listing. Expert guidance.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-white/90">
            <Stat n="2,100+" label="Happy Sellers" />
            <Stat n="₹2,800 Cr" label="Transacted" />
            <Stat n="15 Days" label="Avg Sale Time" />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-sand px-4 py-14 lg:px-6">
        <div className="mx-auto grid w-full gap-5 md:grid-cols-3">
          <Benefit
            icon={<Target size={22} />}
            title="Maximum Visibility"
            desc="Listed across 20+ premium real-estate platforms and our high-intent buyer network."
          />
          <Benefit
            icon={<Wallet size={22} />}
            title="Best Price Guarantee"
            desc="Our negotiation experts validate market comparables to secure your top realistic price."
          />
          <Benefit
            icon={<Zap size={22} />}
            title="Fast Closures"
            desc="Curated, pre-qualified buyer pipeline closes the average listing in just 15 days."
          />
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-4xl px-4 py-16 lg:px-6">
        <SellForm />
      </section>

      <Footer />
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-numeric text-2xl font-bold text-gold md:text-3xl">{n}</div>
      <div className="text-[13px] uppercase tracking-wider text-white/70">{label}</div>
    </div>
  );
}

function Benefit({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-card">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-gold/15 text-gold">
        {icon}
      </div>
      <h3 className="mt-3 font-display text-[22px] font-semibold text-charcoal">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-charcoal/70">{desc}</p>
    </div>
  );
}

/* ------------------------------ Form ------------------------------ */

function SellForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    let result;
    if (step === 0) result = step1Schema.safeParse(data);
    else if (step === 1) result = step2Schema.safeParse(data);
    else if (step === 2)
      result = step3Schema.safeParse({
        ...data,
        price: data.price === "" ? undefined : Number(data.price),
        sqft: data.sqft === "" ? undefined : Number(data.sqft),
      });
    else return true;

    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      const first = result.error.issues[0];
      toast.error(first?.message || "Please complete the required fields");
      if (typeof window !== "undefined") {
        const key = String(first?.path[0] ?? "");
        const el = document.querySelector<HTMLElement>(`[name="${key}"], #${key}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus?.();
      }
      return false;
    }
    setErrors({});
    return true;
  };

  const next = () => {
    if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    const ref = `TSP-${Date.now().toString().slice(-8)}`;
    try {
      const uploadedImages = await Promise.all(
        data.images.map((img) => (img.file ? uploadEnquiryImage(img.file) : Promise.resolve(img.url))),
      );
      const price = typeof data.price === "number" ? data.price : Number(data.price || 0);
      const saved = await createSellEnquiry({
        seller_name: data.name,
        seller_phone: data.phone,
        seller_email: data.email || null,
        city: data.city || null,
        zone: data.area || null,
        locality: data.locality || null,
        full_address: data.address || null,
        property_type: data.type,
        asking_price: price || null,
        built_up_area: typeof data.sqft === "number" ? data.sqft : Number(data.sqft) || null,
        configuration: `${data.bedrooms} BHK · ${data.bathrooms} Bath`,
        furnishing: data.furnishing,
        possession: data.possession,
        amenities: data.amenities,
        photos: uploadedImages,
        description: [
          `Reference: ${ref}`,
          `Intent: ${data.intent}`,
          data.description || "",
        ].filter(Boolean).join("\n"),
        coordinates: { lat: data.lat, lng: data.lng },
        google_map_link: data.mapLink || null,
      });
      if (!saved) throw new Error("Could not save the enquiry");
      toast.success("Your property listing enquiry has been submitted successfully. Our team will contact you shortly.");
      setDone(ref);
    } catch (e: any) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <SuccessOverlay ref_={done} />;

  return (
    <div>
      <Stepper step={step} />
      <div className="mt-8 rounded-2xl bg-card p-6 shadow-card md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && <Step1 data={data} update={update} errors={errors} />}
            {step === 1 && <Step2 data={data} update={update} errors={errors} />}
            {step === 2 && <Step3 data={data} update={update} errors={errors} />}
            {step === 3 && <Step4 data={data} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="rounded-full border border-charcoal/15 px-5 py-2.5 text-sm font-medium text-charcoal disabled:opacity-30"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-gradient-to-r from-gold to-gold-light px-6 py-2.5 text-sm font-semibold text-white shadow-gold"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="h-14 rounded-full bg-gradient-to-r from-gold to-gold-light px-8 text-sm font-semibold text-white shadow-gold"
            >
              {submitting ? "Submitting…" : "📋 Submit Property Listing"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const pct = ((step) / (STEPS.length - 1)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div key={label} className="flex flex-col items-center text-center">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full text-[12px] font-semibold transition ${
                  done
                    ? "bg-gold text-white"
                    : current
                      ? "bg-charcoal text-gold ring-2 ring-gold"
                      : "bg-sand text-charcoal/50"
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <div className="mt-2 hidden text-[12px] font-medium text-charcoal/70 sm:block">
                {label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-sand">
        <motion.div
          className="h-full bg-gradient-to-r from-gold to-gold-light"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}

/* ------------------------------ Steps ------------------------------ */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-charcoal/70">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-crimson">{error}</span>}
    </label>
  );
}

const inputCls =
  "h-11 w-full rounded-md border border-charcoal/15 bg-card px-3 text-sm focus:border-gold focus:outline-none";

function Step1({
  data,
  update,
  errors,
}: {
  data: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Your Information</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Your Name" error={errors.name}>
          <input
            className={inputCls}
            maxLength={100}
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Full name"
          />
        </Field>
        <Field label="Mobile Number" error={errors.phone}>
          <div className="flex h-11 overflow-hidden rounded-md border border-charcoal/15 bg-card focus-within:border-gold">
            <span className="grid place-items-center bg-sand px-3 text-sm text-charcoal/70">
              🇮🇳 +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={data.phone}
              onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
              placeholder="9902925519"
              className="w-full bg-transparent px-3 text-sm focus:outline-none"
            />
          </div>
        </Field>
      </div>
      <Field label="Email Address" error={errors.email}>
        <input
          type="email"
          maxLength={255}
          className={inputCls}
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
        />
      </Field>

      <div>
        <div className="mb-2 block text-[13px] font-medium text-charcoal/70">
          Transaction Type
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleCard
            active={data.intent === "SELL"}
            onClick={() => update("intent", "SELL")}
            title="I want to SELL"
            icon={<HomeIcon size={22} />}
          />
          <ToggleCard
            active={data.intent === "RENT"}
            onClick={() => update("intent", "RENT")}
            title="I want to RENT OUT"
            icon={<KeyRound size={22} />}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 block text-[13px] font-medium text-charcoal/70">Property Type</div>
        <div className="flex flex-wrap gap-2">
          {TYPE_CHIPS.map((t) => {
            const active = data.type === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => update("type", t.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition ${
                  active
                    ? "bg-gold text-charcoal shadow-card"
                    : "bg-sand text-charcoal/75 hover:bg-gold/20"
                }`}
              >
                <span>{t.emoji}</span>
                {t.key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ToggleCard({
  active,
  onClick,
  title,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition ${
        active
          ? "border-gold bg-gold/10 text-charcoal shadow-card"
          : "border-charcoal/15 bg-card text-charcoal/70 hover:border-gold/40"
      }`}
    >
      <div
        className={`grid h-10 w-10 place-items-center rounded-full ${
          active ? "bg-gold text-white" : "bg-sand text-charcoal/60"
        }`}
      >
        {icon}
      </div>
      <div className="font-semibold">{title}</div>
    </button>
  );
}

function Step2({
  data,
  update,
  errors,
}: {
  data: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Property Location</h2>
      <Field label="Property Address" error={errors.address}>
        <textarea
          rows={3}
          maxLength={500}
          className="w-full resize-none rounded-md border border-charcoal/15 bg-card px-3 py-2 text-sm focus:border-gold focus:outline-none"
          value={data.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Door no, street, landmark…"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="City" error={errors.city}>
          <select
            className={inputCls}
            value={data.city}
            onChange={(e) => {
              update("city", e.target.value);
              update("area", "");
            }}
          >
            {Object.keys(AREAS).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Area / Zone" error={errors.area}>
          <select
            className={inputCls}
            value={data.area}
            onChange={(e) => update("area", e.target.value)}
          >
            <option value="">Select area</option>
            {(AREAS[data.city] || []).map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Field>
        <div>
          <LocalityAutocomplete
            value={data.locality}
            onChange={(v: string) => update("locality", v)}
            city={data.city}
            zone={data.area}
            label="Locality"
            placeholder="e.g. Rajajinagar"
          />
          {errors.locality && (
            <div className="mt-1 text-[11px] text-crimson">{errors.locality}</div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] font-medium text-charcoal/70">
            Google Maps link
          </span>
          {(data.lat !== 12.9716 || data.lng !== 77.5946) && (
            <span className="font-mono text-[12px] text-charcoal/60">
              {data.lat.toFixed(4)}, {data.lng.toFixed(4)}
            </span>
          )}
        </div>
        <input
          type="url"
          inputMode="url"
          placeholder="https://maps.google.com/... or https://maps.app.goo.gl/..."
          value={data.mapLink}
          onChange={(e) => {
            const link = e.target.value;
            update("mapLink", link);
            const m =
              link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
              link.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
              link.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ||
              link.match(/(-?\d{1,3}\.\d+),\s*(-?\d{1,3}\.\d+)/);
            if (m) {
              update("lat", parseFloat(m[1]));
              update("lng", parseFloat(m[2]));
            }
          }}
          className="h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-gold focus:outline-none"
        />
        <p className="mt-1.5 text-[11px] text-charcoal/55">
          Open Google Maps, find your property, tap Share → Copy link, and paste it here.
        </p>
      </div>
    </div>
  );
}

function Step3({
  data,
  update,
  errors,
}: {
  data: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  errors: Record<string, string>;
}) {
  const priceNum = typeof data.price === "number" ? data.price : Number(data.price || 0);

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files)
      .filter((f) => f.size <= 5 * 1024 * 1024 && f.type.startsWith("image/"))
      .slice(0, 15 - data.images.length)
      .map((f) => ({ name: f.name, url: URL.createObjectURL(f), file: f }));
    if (valid.length === 0) {
      toast.error("Please upload images under 5MB each");
      return;
    }
    update("images", [...data.images, ...valid]);
  };

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-semibold">Property Details</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Asking Price (₹)" error={errors.price}>
          <input
            type="number"
            className={inputCls}
            value={data.price}
            onChange={(e) => update("price", e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g. 4500000"
          />
          {priceNum > 0 && (
            <div className="mt-1 text-[12px] text-charcoal/60">
              ₹ {priceNum.toLocaleString("en-IN")} · ~{formatIndianShort(priceNum)}
            </div>
          )}
        </Field>
        <Field label="Sqft Area" error={errors.sqft}>
          <input
            type="number"
            className={inputCls}
            value={data.sqft}
            onChange={(e) => update("sqft", e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g. 1450"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Stepper2
          label="Bedrooms"
          value={data.bedrooms}
          onChange={(v) => update("bedrooms", v)}
        />
        <Stepper2
          label="Bathrooms"
          value={data.bathrooms}
          onChange={(v) => update("bathrooms", v)}
        />
      </div>

      <div>
        <div className="mb-2 text-[13px] font-medium text-charcoal/70">Furnishing</div>
        <PillRow
          value={data.furnishing}
          onChange={(v) => update("furnishing", v as FormData["furnishing"])}
          options={["Furnished", "Semi-Furnished", "Unfurnished"]}
        />
      </div>
      <div>
        <div className="mb-2 text-[13px] font-medium text-charcoal/70">Possession Status</div>
        <PillRow
          value={data.possession}
          onChange={(v) => update("possession", v as FormData["possession"])}
          options={["Ready to Move", "Under Construction"]}
        />
      </div>

      <div>
        <div className="mb-2 text-[13px] font-medium text-charcoal/70">Amenities</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {AMENITY_LIST.map((a) => {
            const active = data.amenities.includes(a);
            return (
              <label
                key={a}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-sand px-3 py-2 text-[13px] text-charcoal/80"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() =>
                    update(
                      "amenities",
                      active ? data.amenities.filter((x) => x !== a) : [...data.amenities, a],
                    )
                  }
                  className="h-4 w-4 accent-gold"
                />
                {a}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[13px] font-medium text-charcoal/70">Property Description</span>
          <span className="text-[11px] text-charcoal/50">{data.description.length}/500</span>
        </div>
        <textarea
          rows={4}
          maxLength={500}
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe what makes your property special…"
          className="w-full resize-none rounded-md border border-charcoal/15 bg-card px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <div className="mb-2 text-[13px] font-medium text-charcoal/70">Photos</div>
        <label
          className="grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-gold bg-gold/5 px-6 py-10 text-center transition hover:bg-gold/10"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleImages(e.dataTransfer.files);
          }}
        >
          <Upload className="mb-2 text-gold" size={26} />
          <div className="text-sm text-charcoal/75">
            📷 Drag & drop images here or click to browse
          </div>
          <div className="mt-1 text-[12px] text-charcoal/50">
            Max 15 images · 5MB each · {data.images.length}/15 uploaded
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleImages(e.target.files)}
          />
        </label>
        {data.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.images.map((img, i) => (
              <div key={i} className="group relative h-24 overflow-hidden rounded-lg">
                <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "images",
                      data.images.filter((_, idx) => idx !== i),
                    )
                  }
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper2({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 text-[13px] font-medium text-charcoal/70">{label}</div>
      <div className="inline-flex items-center gap-3 rounded-full border border-charcoal/15 bg-card px-3 py-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="grid h-8 w-8 place-items-center rounded-full bg-sand text-charcoal hover:bg-gold/20"
        >
          <Minus size={14} />
        </button>
        <span className="min-w-[2ch] text-center font-numeric text-lg font-bold text-charcoal">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(10, value + 1))}
          className="grid h-8 w-8 place-items-center rounded-full bg-sand text-charcoal hover:bg-gold/20"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function PillRow({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
            value === o ? "bg-gold text-white" : "bg-sand text-charcoal/75 hover:bg-gold/20"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Step4({ data }: { data: FormData }) {
  const row = (k: string, v: React.ReactNode) => (
    <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 py-2 text-[14px]">
      <span className="text-charcoal/60">{k}</span>
      <span className="text-right font-medium text-charcoal">{v}</span>
    </div>
  );
  const priceNum = Number(data.price || 0);
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Review & Submit</h2>
      <p className="mt-1 text-sm text-charcoal/60">Please verify your details below.</p>
      <div className="mt-6 rounded-xl bg-sand/60 p-5">
        {row("Name", data.name)}
        {row("Phone", `+91 ${data.phone}`)}
        {row("Email", data.email)}
        {row("Intent", data.intent === "SELL" ? "Sell" : "Rent out")}
        {row("Type", data.type)}
        {row("Address", data.address)}
        {row("City / Area", `${data.city} · ${data.area || "—"}`)}
        {row("Locality", data.locality || "—")}
        {row("Coordinates", `${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`)}
        {row("Asking Price", priceNum ? `₹ ${priceNum.toLocaleString("en-IN")} · ${formatIndianShort(priceNum)}` : "—")}
        {row("Built-up", `${data.sqft || "—"} sqft`)}
        {row("Configuration", `${data.bedrooms} BHK · ${data.bathrooms} Bath`)}
        {row("Furnishing", data.furnishing)}
        {row("Possession", data.possession)}
        {row("Amenities", data.amenities.length ? data.amenities.join(", ") : "—")}
        {row("Photos", `${data.images.length} uploaded`)}
        {data.description && row("Description", <span className="block max-w-md">{data.description}</span>)}
      </div>
    </div>
  );
}

/* ----------------------------- Success ---------------------------- */

function SuccessOverlay({ ref_ }: { ref_: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden rounded-3xl bg-card p-12 text-center shadow-elevated"
    >
      {/* confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${(i * 53) % 100}%`,
              background: ["#b8962e", "#d4af6a", "#4a5e52", "#8b2635"][i % 4],
              animationDelay: `${(i % 10) * 0.15}s`,
            }}
          />
        ))}
      </div>
      <div className="relative">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-white">
          <Check size={28} />
        </div>
        <h2 className="mt-4 font-display text-4xl font-bold text-charcoal">
          🎉 Property Listed Successfully!
        </h2>
        <p className="mt-2 text-charcoal/70">
          Our team will contact you within 24 hours.
        </p>
        <div className="mt-4 inline-block rounded-full bg-sand px-4 py-1.5 font-mono text-sm text-charcoal/80">
          Ref #{ref_}
        </div>
      </div>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0); opacity: 1; }
          100% { transform: translateY(380px) rotate(540deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 14px;
          border-radius: 2px;
          animation: confetti-fall 2.4s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}

function formatIndianShort(n: number) {
  if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹ ${(n / 100000).toFixed(1)} Lakhs`;
  return `₹ ${n.toLocaleString("en-IN")}`;
}
