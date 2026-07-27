import { Phone, MapPin, MessageCircle, Star, Award, Languages, BadgeCheck } from "lucide-react";
import type { PropertyAssignment } from "@/lib/property-assignments";

interface Props {
  staff: PropertyAssignment[];
  propertyTitle?: string;
}

const FALLBACK_WHATSAPP = "9902925519";

export function AssignedExpert({ staff, propertyTitle }: Props) {
  if (!staff || staff.length === 0) return null;

  const sorted = [...staff].sort((a, b) =>
    a.is_primary === b.is_primary ? 0 : a.is_primary ? -1 : 1,
  );

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <BadgeCheck size={22} className="text-gold" />
        <h2 className="text-[20px] font-bold text-charcoal">Assigned Property Expert</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((s) => (
          <ExpertCard key={s.id} s={s} propertyTitle={propertyTitle} />
        ))}
      </div>
    </section>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ExpertCard({ s, propertyTitle }: { s: PropertyAssignment; propertyTitle?: string }) {
  const waRaw = s.whatsapp || s.phone || "";
  const waNumber = waRaw.replace(/[^0-9]/g, "");
  const waMessage = encodeURIComponent(
    `Hi ${s.staff_name}, I'm interested in ${propertyTitle ?? "this property"}. Please share more details.`,
  );
  const waHref = waNumber ? `https://wa.me/${waNumber || FALLBACK_WHATSAPP}?text=${waMessage}` : null;
  const telHref = s.phone ? `tel:${s.phone}` : null;
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${
        s.is_primary ? "border-gold/60" : "border-charcoal/10"
      }`}
    >
      <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-gold-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
          <BadgeCheck size={11} /> Property Expert
        </span>
        {s.is_primary && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0a1f44] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            <Star size={10} /> Primary
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {s.photo_url ? (
          <img
            src={s.photo_url}
            alt={s.staff_name}
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-gold/40"
          />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#0a1f44] to-[#13315c] text-lg font-bold text-white ring-2 ring-gold/40">
            {initials(s.staff_name)}
          </div>
        )}
        <div className="min-w-0 pr-20">
          <div className="truncate text-[17px] font-bold text-charcoal">{s.staff_name}</div>
          {s.role && <div className="truncate text-[12px] text-charcoal/60">{s.role}</div>}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {s.assigned_area && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[11px] text-charcoal/75">
            <MapPin size={11} /> {s.assigned_area}
          </span>
        )}
        {typeof s.experience_years === "number" && s.experience_years > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[11px] text-charcoal/75">
            <Award size={11} /> {s.experience_years}+ yrs
          </span>
        )}
        {s.languages?.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[11px] text-charcoal/75">
            <Languages size={11} /> {s.languages.join(", ")}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {telHref && (
          <a
            href={telHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0a1f44] px-3 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#0a1f44]/90 hover:shadow-md"
          >
            <Phone size={14} /> Call {s.phone}
          </a>
        )}
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#1ebe5b] hover:shadow-md"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
