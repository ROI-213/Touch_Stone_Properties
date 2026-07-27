import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyMap } from "@/components/PropertyMap";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Touch Stone Properties" },
      {
        name: "description",
        content:
          "Talk to a Touch Stone Properties advisor. Koramangala, Bangalore office. Reply within 4 hours.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().min(1, "Select a subject"),
  message: z.string().trim().min(5, "Message too short").max(1000),
});

type FormValues = z.infer<typeof schema>;

const SUBJECTS = [
  "Buy Property",
  "Rent Property",
  "Sell Property",
  "Legal Assistance",
  "Home Loan",
  "General Inquiry",
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      {/* Hero */}
      <section
        className="relative grid h-[300px] place-items-center px-4 pt-20 text-center text-ivory"
        style={{
          background:
            "linear-gradient(180deg, #1c1c1e 0%, #2c2c2e 100%)",
        }}
      >
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold md:text-[56px]">Get In Touch</h1>
          <p className="mt-2 text-[16px] text-white/75">
            Our advisors typically reply within 4 hours, Monday through Saturday.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto grid w-full gap-10 px-4 py-16 lg:grid-cols-[60%_1fr] lg:px-6">
        <ContactForm />
        <ContactInfo />
      </section>

      {/* Map */}
      <section className="mx-auto w-full px-4 pb-20 lg:px-6">
        <h2 className="mb-4 font-display text-2xl font-semibold text-charcoal md:text-3xl">
          Visit Our Office
        </h2>
        <PropertyMap lat={12.9352} lng={77.6245} title="Touch Stone Properties · Koramangala" />
      </section>

      <Footer />
    </div>
  );
}

function ContactForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (_v: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message sent!");
    setDone(true);
  };

  if (done) {
    return (
      <div className="grid place-items-center rounded-2xl bg-card p-12 text-center shadow-card">
        <motion.svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <motion.circle
            cx="36"
            cy="36"
            r="32"
            stroke="#b8962e"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M22 38 L32 48 L52 26"
            stroke="#b8962e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
        </motion.svg>
        <p className="mt-4 font-display text-[24px] font-semibold text-charcoal">
          Message sent! We'll reply within 4 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl bg-card p-6 shadow-card md:p-8"
    >
      <h2 className="font-display text-2xl font-semibold text-charcoal md:text-3xl">
        Send Us a Message
      </h2>
      <p className="mt-1 text-[14px] text-charcoal/65">
        Tell us what you're looking for — we'll match you with the right advisor.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Your Name" error={errors.name?.message}>
          <input
            {...register("name")}
            maxLength={100}
            className="h-11 w-full rounded-md border border-charcoal/15 bg-card px-3 text-sm focus:border-gold focus:outline-none"
            placeholder="Full name"
          />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <div className="flex h-11 overflow-hidden rounded-md border border-charcoal/15 bg-card focus-within:border-gold">
            <span className="grid place-items-center bg-sand px-3 text-sm text-charcoal/70">
              🇮🇳 +91
            </span>
            <input
              {...register("phone")}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="9902925519"
              className="w-full bg-transparent px-3 text-sm focus:outline-none"
            />
          </div>
        </Field>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            maxLength={255}
            className="h-11 w-full rounded-md border border-charcoal/15 bg-card px-3 text-sm focus:border-gold focus:outline-none"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Subject" error={errors.subject?.message}>
          <select
            {...register("subject")}
            defaultValue=""
            className="h-11 w-full rounded-md border border-charcoal/15 bg-card px-3 text-sm focus:border-gold focus:outline-none"
          >
            <option value="">Select a subject</option>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Message" error={errors.message?.message}>
          <textarea
            {...register("message")}
            rows={5}
            maxLength={1000}
            placeholder="Tell us about the home or service you're looking for…"
            className="w-full resize-none rounded-md border border-charcoal/15 bg-card px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-12 w-full rounded-full bg-gradient-to-r from-gold to-gold-light text-sm font-semibold text-white shadow-gold transition hover:opacity-95 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send Message →"}
      </button>
    </form>
  );
}

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

function ContactInfo() {
  return (
    <aside className="space-y-4">
      <InfoCard icon={<MapPin size={18} />} title="Address">
        #42, 5th Cross, Koramangala
        <br />
        Bangalore — 560034, India
      </InfoCard>
      <InfoCard icon={<Phone size={18} />} title="Phone">
        <a href="tel:+919902925519" className="hover:text-gold">
          +91 99029 25519
        </a>
        <br />
        <a href="tel:+919902925519" className="hover:text-gold">
          +91 99029 25519
        </a>
      </InfoCard>
      <InfoCard icon={<Mail size={18} />} title="Email">
        <a href="mailto:hello@touchstoneproperties.in" className="hover:text-gold">
          hello@touchstoneproperties.in
        </a>
      </InfoCard>
      <InfoCard icon={<Clock size={18} />} title="Office Hours">
        Mon – Sat · 9:00 AM – 7:00 PM
        <br />
        Sun · 10:00 AM – 4:00 PM
      </InfoCard>
    </aside>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border-l-[3px] border-gold bg-card p-5 shadow-card">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[2px] text-gold">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/15">{icon}</span>
        {title}
      </div>
      <div className="mt-2 text-[14px] leading-relaxed text-charcoal/80">{children}</div>
    </div>
  );
}
