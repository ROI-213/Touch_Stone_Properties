import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MessageCircle, UserRound, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { addEnquiry } from "@/lib/enquiries";
import {
  getPropertyContact,
  formatIndianPhone,
  type AssignedStaff,
  type SettingsLike,
} from "@/lib/propertyContact";

type ResolvedContact = {
  id: string | null;
  name: string;
  designation: string;
  staff: AssignedStaff;
  companySettings: SettingsLike | null;
  source: "staff" | "company";
};

interface Props {
  open: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    location: string;
    price: string;
    assignedStaffId?: string | null;
  };
}

const DEFAULT_FALLBACK: ResolvedContact = {
  id: null,
  name: "Touch Stone Properties",
  designation: "Customer Care",
  staff: null,
  companySettings: null,
  source: "company",
};

export function EnquireModal({ open, onClose, property }: Props) {
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState<ResolvedContact>(DEFAULT_FALLBACK);
  const [contactError, setContactError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm((f) => ({
      ...f,
      message:
        f.message ||
        `Hi, I'm interested in ${property.title} located at ${property.location}. Please share more details.`,
    }));

    let cancelled = false;
    async function loadCompanySettings(): Promise<SettingsLike | null> {
      try {
        const { data } = await supabase
          .from("contact_info" as any)
          .select("phone, whatsapp, email")
          .limit(1)
          .maybeSingle();
        const row = data as any;
        if (!row) return null;
        return {
          phone_number: row.phone || null,
          whatsapp_number: row.whatsapp || null,
          email: row.email || null,
        };
      } catch {
        return null;
      }
    }
    async function resolve() {
      setLoading(true);
      setContactError(null);
      try {
        const companySettings = await loadCompanySettings();
        let staff: AssignedStaff = null;
        let staffName = "";
        let designation = "";

        // 1) Staff assigned via properties.assigned_staff_id
        if (property.assignedStaffId) {
          const { data } = await supabase
            .from("staff_users" as any)
            .select("id, name, email, mobile, designation, status")
            .eq("id", property.assignedStaffId)
            .eq("status", "active")
            .maybeSingle();
          const s = data as any;
          if (s) {
            staff = {
              id: s.id,
              name: s.name || "",
              phone: s.mobile || "",
              whatsapp: s.mobile || "",
              email: s.email || "",
              active: true,
            };
            staffName = s.name || "";
            designation = s.designation || "Property Consultant";
          }
        }

        // 2) Primary public row from property_assignments
        if (!staff && property.id) {
          const { data } = await supabase
            .from("property_assignments" as any)
            .select("id, staff_name, role, phone, whatsapp, email, is_primary, is_active, show_publicly, display_order")
            .eq("property_id", property.id)
            .eq("is_active", true)
            .eq("show_publicly", true)
            .order("is_primary", { ascending: false })
            .order("display_order", { ascending: true })
            .limit(1);
          const row = Array.isArray(data) ? (data[0] as any) : null;
          if (row) {
            staff = {
              id: row.id,
              name: row.staff_name || "",
              phone: row.phone || "",
              whatsapp: row.whatsapp || row.phone || "",
              email: row.email || "",
              active: true,
            };
            staffName = row.staff_name || "";
            designation = row.role || "Property Consultant";
          }
        }

        if (cancelled) return;
        const resolved = getPropertyContact({ assigned_staff: staff }, undefined, companySettings);
        setContact({
          id: resolved.staffId,
          name: resolved.source === "staff" && staffName ? staffName : DEFAULT_FALLBACK.name,
          designation: resolved.source === "staff" && designation ? designation : DEFAULT_FALLBACK.designation,
          staff,
          companySettings,
          source: resolved.source,
        });
      } catch (e: any) {
        if (!cancelled) {
          setContactError(e?.message || "Could not load contact");
          setContact(DEFAULT_FALLBACK);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    resolve();
    return () => {
      cancelled = true;
    };
  }, [open, property.assignedStaffId, property.id, property.title, property.location]);


  if (!open || typeof document === "undefined") return null;

  const resolved = getPropertyContact(
    { assigned_staff: contact.staff },
    undefined,
    contact.companySettings,
  );
  const waNumber = formatIndianPhone(resolved.phone);
  const fallbackMode = contact.source === "company";


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }
    setSubmitting(true);
    try {
      await addEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        requirementType: "General Enquiry",
        location: property.location,
        budget: property.price,
        message: form.message.trim(),
        source: "Enquire Modal",
        propertyId: property.id,
        propertyTitle: property.title,
        assignedStaffId: contact.source === "staff" ? contact.id : null,
        assignedStaffName: fallbackMode ? null : contact.name,
      });
      toast.success(
        fallbackMode ? "Our team will contact you shortly." : `Enquiry sent to ${contact.name}.`,
      );
      if (waNumber) {
        const wa = `Hi ${contact.name}, I'm interested in ${property.title} located at ${property.location} — ${property.price}. ${form.message}`;
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(wa)}`, "_blank");
      }
      onClose();
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err: any) {
      toast.error(err?.message || "Could not send enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const waMessage = `Hi, I am interested in ${property.title} located at ${property.location}. Please share more details.`;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="enquire-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gold">
                Enquire about
              </div>
              <h3 className="mt-0.5 font-display text-lg font-semibold text-charcoal line-clamp-1">
                {property.title}
              </h3>
              <div className="text-xs text-charcoal/60">{property.location}</div>
            </div>
            <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-charcoal/60 hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="rounded-xl border border-slate-200 bg-sand/40 p-4">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-charcoal/60">
                  <Loader2 size={14} className="animate-spin" /> Loading staff…
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-gold">
                    <UserRound size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-charcoal">{contact.name}</div>
                    <div className="text-xs text-charcoal/60">{contact.designation}</div>
                    {fallbackMode && (
                      <div className="mt-1 text-[11px] italic text-charcoal/50">
                        Our team will contact you shortly.
                      </div>
                    )}
                    {contactError && (
                      <div className="mt-1 text-[11px] text-crimson">Could not load staff: {contactError}</div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {waNumber && (
                        <a
                          href={`tel:+${waNumber}`}
                          className="inline-flex items-center gap-1 rounded-full border border-gold px-3 py-1 text-xs font-medium text-gold hover:bg-gold hover:text-white"
                        >
                          <Phone size={12} /> Call
                        </a>
                      )}
                      {waNumber && (
                        <a
                          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-sage px-3 py-1 text-xs font-medium text-sage hover:bg-sage hover:text-white"
                        >
                          <MessageCircle size={12} /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  placeholder="Your name *"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  placeholder="Phone *"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                />
              </div>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <textarea
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                rows={3}
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-white transition hover:bg-gold-light disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send Enquiry"}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
