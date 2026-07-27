import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { Award, ShieldCheck, ScrollText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteImages, initialsAvatar } from "@/data/siteImages";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Touch Stone Properties" },
      {
        name: "description",
        content:
          "15 years of turning stone into homes. Meet the team and story behind Bangalore's most trusted luxury real estate broker.",
      },
      { property: "og:title", content: "About Touch Stone Properties" },
      {
        property: "og:description",
        content: "15 years curating Bangalore's most exceptional homes.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      {/* Hero */}
      <section className="relative px-4 pb-16 pt-32 lg:px-6">
        <div className="mx-auto grid w-full items-center gap-10 lg:grid-cols-[55%_1fr]">
          <div className="relative">
            <div className="relative h-[420px] overflow-hidden rounded-2xl md:h-[520px]">
              <img
                src={siteImages.hero.about}
                alt="Touch Stone Properties team"
                className="h-full w-full object-cover"
              />
            </div>
            {/* gold corner frame */}
            <div className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 border-l-2 border-t-2 border-gold" />
            <div className="pointer-events-none absolute -right-4 -bottom-4 h-16 w-16 border-b-2 border-r-2 border-gold" />
          </div>
          <div>
            <div className="inline-block rounded-full bg-gold/15 px-3 py-1 text-[12px] font-semibold tracking-[2px] text-gold">
              EST. 2009 · BANGALORE
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-charcoal md:text-[52px]">
              "15 Years of Turning Stone into Homes"
            </h1>
            <div className="mt-5 space-y-3 text-[16px] leading-[1.7] text-charcoal/75">
              <p>
                Touch Stone Properties was founded in a small Indiranagar office in 2009 with
                a single conviction: that buying or selling a home should feel less like a
                transaction and more like the start of a relationship. Fifteen years later,
                that conviction still shapes every brief we accept.
              </p>
              <p>
                Today we serve high-net-worth families, NRI investors and discerning first-
                time buyers across Bangalore — pairing white-glove curation with the
                regulatory rigour modern real estate demands. Every listing is RERA-verified,
                title-checked and walked by our team before it ever reaches a client.
              </p>
              <p>
                We measure success not in commissions earned, but in the number of clients
                who return — and recommend us to the people closest to them.
              </p>
            </div>
            <a
              href="#story"
              className="story-link mt-6 inline-block text-sm font-semibold text-gold"
            >
              Read Our Story →
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsBand />

      {/* Story alternating */}
      <section id="story" className="mx-auto w-full space-y-20 px-4 py-20 lg:px-6">
        {STORY.map((s, i) => (
          <StoryRow key={s.title} item={s} reverse={i % 2 === 1} />
        ))}
      </section>

      {/* Team */}
      <section className="bg-sand px-4 py-20 lg:px-6">
        <div className="mx-auto w-full text-center">
          <h2 className="font-display text-3xl font-bold text-charcoal md:text-[44px]">
            The People Behind Your Dream Home
          </h2>
          <p className="mt-2 text-[15px] text-charcoal/65">
            Industry veterans, market analysts and design-trained advisors — all under one roof.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((t) => (
              <TeamCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="mx-auto w-full px-4 py-20 lg:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {CERTS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-charcoal/10 bg-card p-6 text-center shadow-card"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-gold">
                <c.icon size={22} />
              </div>
              <h3 className="mt-3 font-display text-[22px] font-semibold text-charcoal">
                {c.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-charcoal/65">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* --------------------------- Stats band --------------------------- */

const STATS = [
  { n: 3200, suffix: "+", label: "Properties Listed" },
  { n: 2100, suffix: "+", label: "Happy Families" },
  { n: 15, suffix: "+", label: "Years Serving" },
  { n: 2800, suffix: " Cr+", prefix: "₹ ", label: "Worth Transacted" },
];

function StatsBand() {
  return (
    <section className="bg-sand py-14">
      <div className="mx-auto grid w-full grid-cols-2 gap-8 px-4 md:grid-cols-4 lg:px-6">
        {STATS.map((s) => (
          <Counter key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}

function Counter({
  n,
  suffix = "",
  prefix = "",
  label,
}: {
  n: number;
  suffix?: string;
  prefix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setVal(Math.round(n * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, n]);
  return (
    <div ref={ref} className="text-center">
      <div className="font-numeric text-4xl font-bold text-gold md:text-[48px]">
        {prefix}
        {val.toLocaleString("en-IN")}
        {suffix}
      </div>
      <div className="mt-1 text-[14px] font-medium text-charcoal">{label}</div>
    </div>
  );
}

/* ------------------------------ Story ----------------------------- */

const STORY = [
  {
    title: "It Started in Indiranagar",
    image:
      siteImages.properties.indiranagarApartment,
    body: [
      "Our first office was a 600-sqft walk-up above a coffee roastery, with two desks, one phone line and a hand-painted sign. The first deal — a 2BHK off 100 Feet Road — took 47 days and a lot of chai with the seller's family.",
      "What changed everything wasn't a marketing push, it was a single thank-you note we received six months later, asking us to also find a home for the buyer's sister. The flywheel of trust started spinning.",
    ],
  },
  {
    title: "Curation Over Volume",
    image:
      siteImages.properties.northBangaloreTownship,
    body: [
      "By 2014 we'd turned down more listings than we accepted. Every property we represent goes through a six-point audit: title, RERA, builder reputation, structural review, neighbourhood comparables and our own walk-through.",
      "We'd rather show a client three perfect homes than thirty average ones. That discipline is why our average buyer makes a decision within two weeks of visiting our shortlist.",
    ],
  },
  {
    title: "Built for the Next Decade",
    image:
      siteImages.properties.hebbalLakeview,
    body: [
      "Today the team includes RERA specialists, market analysts, an in-house legal advisor and design-trained relationship managers — the depth that high-stakes property decisions deserve.",
      "We're investing in technology that makes the process faster without losing the warmth: 3D virtual tours, transparent dashboards, and instant document verification. The handshake stays human.",
    ],
  },
];

function StoryRow({
  item,
  reverse,
}: {
  item: (typeof STORY)[number];
  reverse: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-10 lg:grid-cols-2 ${reverse ? "lg:[direction:rtl]" : ""}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden rounded-2xl shadow-elevated [direction:ltr]"
      >
        <img
          src={item.image}
          alt={item.title}
          className="h-[420px] w-full object-cover md:h-[500px]"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="[direction:ltr]"
      >
        <h3 className="font-display text-3xl font-bold text-charcoal md:text-[38px]">
          {item.title}
        </h3>
        <div className="mt-4 space-y-3 text-[15.5px] leading-[1.75] text-charcoal/75">
          {item.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------- Team ----------------------------- */

const TEAM = [
  {
    name: "Arjun Rao",
    role: "Founder & CEO",
    photo:
      initialsAvatar("Arjun Rao"),
    bio: "Fifteen years in Bangalore real estate. Former Prestige Group. Believes the best deal is the one both sides remember fondly.",
  },
  {
    name: "Meera Sundaram",
    role: "Head of Curation",
    photo:
      initialsAvatar("Meera Sundaram", "1c1c1e"),
    bio: "Architect-turned-advisor. Personally walks every listing before it goes on our platform.",
  },
  {
    name: "Karthik Nair",
    role: "Legal & RERA",
    photo:
      initialsAvatar("Karthik Nair", "4a5e52"),
    bio: "Property law specialist. Ten years across high-value commercial and residential closings.",
  },
  {
    name: "Sneha Patil",
    role: "NRI Relations",
    photo:
      initialsAvatar("Sneha Patil", "8b2635"),
    bio: "Coordinates timezone-friendly virtual tours, power-of-attorney workflows and remote registrations for global buyers.",
  },
];

function TeamCard({
  name,
  role,
  photo,
  bio,
}: {
  name: string;
  role: string;
  photo: string;
  bio: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-6 text-center shadow-card transition hover:shadow-elevated">
      <img
        src={photo}
        alt={name}
        className="mx-auto h-[100px] w-[100px] rounded-full object-cover ring-4 ring-sand"
      />
      <h4 className="mt-4 font-display text-[22px] font-semibold text-charcoal">{name}</h4>
      <div className="text-[13px] font-medium text-gold">{role}</div>
      <button
        type="button"
        aria-label={`${name} on LinkedIn`}
        className="mt-3 inline-grid h-8 w-8 place-items-center rounded-full bg-sand text-charcoal/70 hover:bg-gold hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.31 2.4 4.31 5.52v6.22zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
      </button>


      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-charcoal/92 px-6 text-center opacity-0 transition-opacity group-hover:opacity-100"
      >
        <p className="text-[14px] leading-relaxed text-ivory">{bio}</p>
      </motion.div>
    </div>
  );
}

/* --------------------------- Certifications ----------------------- */

const CERTS = [
  {
    title: "RERA Registered",
    desc: "Karnataka RERA registered broker — Reg. No. PRM/KA/RERA/1251/308/AG/210801/00XXXX",
    icon: ShieldCheck,
  },
  {
    title: "ISO 9001:2015",
    desc: "Certified quality management across our advisory, legal and post-sale workflows.",
    icon: Award,
  },
  {
    title: "100% Legal Properties",
    desc: "Every listing carries clear title, RERA registration and a clean encumbrance certificate.",
    icon: ScrollText,
  },
];
