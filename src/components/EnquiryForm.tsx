import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Phone, MessageCircle } from "lucide-react";
import { addEnquiry } from "@/lib/enquiries";

const DEFAULT_PHONE = "9902925519";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please enter a message").max(1000),
});

type FormValues = z.infer<typeof schema>;

type AssignedStaff = {
  id: string;
  staff_name: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  role?: string | null;
} | null;

function normalizePhone(raw?: string | null): string {
  if (!raw) return DEFAULT_PHONE;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length > 10) return digits.slice(-10);
  return DEFAULT_PHONE;
}

export function EnquiryForm({
  propertyTitle,
  propertyId,
  propertySlug,
  assignedStaff,
}: {
  propertyTitle: string;
  propertyId?: string;
  propertySlug?: string;
  assignedStaff?: AssignedStaff;
}) {
  const [done, setDone] = useState(false);

  const staffPhone = normalizePhone(assignedStaff?.phone);
  const staffWa = normalizePhone(assignedStaff?.whatsapp ?? assignedStaff?.phone);
  const staffLabel = assignedStaff?.staff_name ?? "Touch Stone Properties";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { message: `Hi, I'm interested in ${propertyTitle}.` },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await addEnquiry({
      name: values.name,
      phone: values.phone,
      email: values.email || "",
      requirementType: "Buy",
      location: "",
      budget: "",
      message: values.message,
      source: `Property Detail Page · ${propertyTitle}`,
      propertyId: propertyId || null,
      propertyTitle,
      assignedStaffId: assignedStaff?.id ?? null,
      assignedStaffName: assignedStaff?.staff_name ?? null,
    });
    if (!result) {
      toast.error("Could not submit. Please try again.");
      return;
    }

    const propertyUrl =
      typeof window !== "undefined"
        ? window.location.href
        : propertySlug
          ? `https://touchstoneproperties.in/property/${propertySlug}`
          : "";

    const waMessage = [
      `Hello ${staffLabel}, I am interested in ${propertyTitle}.`,
      ``,
      `Name: ${values.name}`,
      `Phone: +91 ${values.phone}`,
      values.email ? `Email: ${values.email}` : null,
      `Property: ${propertyTitle}`,
      `Message: ${values.message}`,
      propertyUrl ? `Property Link: ${propertyUrl}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    toast.success(
      assignedStaff
        ? `Enquiry sent to ${assignedStaff.staff_name}!`
        : "Your enquiry has been submitted. Our team will contact you shortly.",
    );
    setDone(true);

    const waUrl = `https://wa.me/91${staffWa}?text=${encodeURIComponent(waMessage)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid place-items-center px-6 py-10 text-center"
      >
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
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
        </svg>
        <p className="mt-4 font-display text-[22px] font-semibold leading-snug text-charcoal">
          Thank you! {staffLabel} will contact you shortly on WhatsApp.
        </p>
      </motion.div>
    );
  }

  const displayPhone = `+91 ${staffPhone.replace(/(\d{5})(\d{5})/, "$1 $2")}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-5">
      <Field label="Full Name" error={errors.name?.message}>
        <input
          {...register("name")}
          placeholder="John Doe"
          maxLength={100}
          className="h-11 w-full rounded-md border border-charcoal/15 bg-card px-3 text-sm focus:border-gold focus:outline-none"
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
      <Field label="Email" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          maxLength={255}
          className="h-11 w-full rounded-md border border-charcoal/15 bg-card px-3 text-sm focus:border-gold focus:outline-none"
        />
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={3}
          maxLength={1000}
          placeholder="Tell us your requirements…"
          className="w-full resize-none rounded-md border border-charcoal/15 bg-card px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-full bg-gradient-to-r from-gold to-gold-light text-sm font-semibold text-white shadow-gold transition hover:opacity-95 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Submit Enquiry"}
      </button>

      <div className="my-2 flex items-center gap-3 text-[11px] uppercase tracking-[2px] text-charcoal/40">
        <span className="h-px flex-1 bg-charcoal/10" />
        or contact directly
        <span className="h-px flex-1 bg-charcoal/10" />
      </div>

      <a
        href={`tel:+91${staffPhone}`}
        className="flex h-11 items-center justify-center gap-2 rounded-full border border-charcoal/15 text-sm font-medium text-charcoal hover:bg-sand"
      >
        <Phone size={15} className="text-gold" /> {displayPhone}
      </a>
      <a
        href={`https://wa.me/91${staffWa}?text=${encodeURIComponent(
          `Hello ${staffLabel}, I'm interested in ${propertyTitle}.`,
        )}`}
        target="_blank"
        rel="noreferrer"
        className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#25d366] text-sm font-semibold text-white hover:opacity-95"
      >
        <MessageCircle size={16} /> WhatsApp Us
      </a>
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
      <span className="mb-1 block text-[12px] font-medium text-charcoal/70">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-crimson">{error}</span>}
    </label>
  );
}
