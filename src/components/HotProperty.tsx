import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Bed, Bath, Maximize, MapPin, Heart, Phone, Flame, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDbProperties } from "@/hooks/useDbProperties";

import type { Property } from "@/data/properties";
import { FALLBACK_PROPERTY_IMAGE, resolveLocalImage } from "@/data/siteImages";
import { ShareButton } from "@/components/ShareButton";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { getHotPropertySettings, type HotPropertySettings } from "@/lib/hot-property";


const WHATSAPP_NUMBER = "9902925519";



export function HotProperty() {
  const settingsQ = useQuery({
    queryKey: ["hot-property-settings"],
    queryFn: getHotPropertySettings,
    staleTime: 60_000,
  });
  const { data, isLoading: dbLoading } = useDbProperties();

  const isLoading = settingsQ.isLoading || dbLoading;

  if (isLoading) {
    return <HotPropertySkeleton />;
  }

  const settings = settingsQ.data;
  // While settings are still loading on the very first render, keep the
  // section hidden (we don't yet know if admin enabled it). Once resolved,
  // only render if explicitly enabled with a selected active property.
  if (!settings) return null;
  if (settings.enabled === false || settings.status === "inactive") return null;
  if (!settings.property_id) return null;

  const list = (data ?? []) as Property[];
  const selected = list.find((p) => p.id === settings.property_id);
  if (!selected) return null;

  return <HotPropertyCard p={selected} settings={settings} />;
}

function HotPropertySkeleton() {
  return (
    <section className="bg-ivory px-6 py-20 md:py-28">
      <div className="mx-auto w-full">
        <div className="text-center animate-pulse">
          <div className="mx-auto mb-6 h-px w-10 bg-gold/50" />
          <div className="mx-auto h-12 w-64 rounded-lg bg-charcoal/10" />
          <div className="mx-auto mt-4 h-4 w-48 rounded bg-charcoal/10" />
        </div>

        <article className="group mt-12 overflow-hidden rounded-[20px] bg-white shadow-card animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-72 w-full bg-charcoal/5 sm:h-96 lg:h-[520px]" />
            <div className="flex flex-col gap-6 p-6 sm:p-10">
              <div className="h-4 w-24 rounded bg-gold/20" />
              <div className="h-10 w-3/4 rounded bg-charcoal/10" />
              <div className="h-4 w-1/2 rounded bg-charcoal/10" />
              
              <div className="h-10 w-32 rounded bg-charcoal/10 mt-4" />
              
              <div className="grid grid-cols-3 gap-3 rounded-2xl bg-ivory/60 p-4">
                <div className="h-12 rounded bg-charcoal/5" />
                <div className="h-12 rounded bg-charcoal/5" />
                <div className="h-12 rounded bg-charcoal/5" />
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="h-4 w-full rounded bg-charcoal/5" />
                <div className="h-4 w-5/6 rounded bg-charcoal/5" />
                <div className="h-4 w-4/5 rounded bg-charcoal/5" />
              </div>
              
              <div className="mt-8 flex gap-3">
                <div className="h-12 w-32 rounded-full bg-charcoal/10" />
                <div className="h-12 w-32 rounded-full bg-gold/30" />
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}


function HotPropertyCard({ p, settings }: { p: Property; settings?: HotPropertySettings }) {
  const { has } = useWishlist();
  const toggle = useToggleWishlist();
  const liked = has(p.id);

  const image = settings?.override_image || resolveLocalImage(p.image, FALLBACK_PROPERTY_IMAGE);
  const title = settings?.override_title || p.title;
  const location = settings?.override_location || p.location;
  const price = settings?.override_price || p.price;
  const propertyType = settings?.override_property_type || p.type;
  const bedrooms = settings?.override_bedrooms ?? p.bhk;
  const bathrooms = settings?.override_bathrooms ?? p.baths;
  const area = settings?.override_area || (p.sqft ? `${p.sqft} sqft` : "—");
  const description = settings?.override_description || p.description;
  const badge = settings?.badge_text || "Hot Deal";

  const highlights =
    settings?.highlights && settings.highlights.length > 0
      ? settings.highlights
      : [
          p.possession || "Ready to Move",
          p.furnishing || "Premium Finishes",
          p.area ? `Prime ${p.area}` : "Prime Location",
          "Verified Listing",
        ];

  const waHref =
    settings?.cta_contact_url ||
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hi, I'm interested in the Hot Property: ${title} (${location}). Please share more details.`,
    )}`;

  return (
    <section className="bg-ivory px-6 py-20 md:py-28">
      <div className="mx-auto w-full">
        <div className="text-center">
          <div className="mx-auto mb-6 h-px w-10 bg-gold" />
          <h2 className="font-display text-[40px] font-bold text-charcoal md:text-[50px]">Hot Property</h2>
          <p className="mt-2 text-base text-charcoal/60">This week's most sought-after listing</p>
        </div>

        <motion.article
          initial={{ y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -4 }}
          className="group mt-12 overflow-hidden rounded-[20px] bg-white shadow-card transition-shadow duration-300 hover:shadow-elevated"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative overflow-hidden lg:min-h-[520px]">
              <img
                src={image}
                alt={title}
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-96 lg:h-full"
                loading="lazy"
              />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff3d00] to-[#ff8a00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                <Flame className="h-3.5 w-3.5" /> {badge}
              </div>
              <button
                onClick={() => toggle(p.id)}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-md transition hover:scale-110"
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-rose-500 text-rose-500" : "text-charcoal"}`} />
              </button>
              <div className="absolute bottom-4 left-4 rounded-full bg-charcoal/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-ivory">
                {propertyType} · {p.listingType === "RENT" ? "For Rent" : "For Sale"}
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6 sm:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{p.builder}</p>
                <h3 className="mt-2 font-display text-3xl font-bold text-charcoal md:text-4xl">{title}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-charcoal/70">
                  <MapPin className="h-4 w-4 text-gold" /> {location}
                </p>
              </div>

              <div className="flex items-end gap-3">
                <span className="font-display text-3xl font-bold text-charcoal md:text-4xl">{price}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-2xl bg-ivory/60 p-4">
                <Stat icon={<Bed className="h-4 w-4" />} label="Bedrooms" value={bedrooms ? `${bedrooms} BHK` : "—"} />
                <Stat icon={<Bath className="h-4 w-4" />} label="Bathrooms" value={bathrooms ? `${bathrooms}` : "—"} />
                <Stat icon={<Maximize className="h-4 w-4" />} label="Built-up" value={area} />
              </div>

              <p className="text-sm leading-relaxed text-charcoal/75 line-clamp-3">{description}</p>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Key Highlights</p>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-charcoal/80">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-gold/15 text-gold">
                        <Check className="h-3 w-3" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                {settings?.cta_view_url ? (
                  <a
                    href={settings.cta_view_url}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-charcoal px-6 text-sm font-semibold text-ivory transition hover:bg-charcoal/90"
                  >
                    View Details
                  </a>
                ) : (
                  <Link
                    to="/property/$slug"
                    params={{ slug: p.slug }}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-charcoal px-6 text-sm font-semibold text-ivory transition hover:bg-charcoal/90"
                  >
                    View Details
                  </Link>
                )}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-charcoal transition hover:brightness-105"
                >
                  <Phone className="h-4 w-4" /> Contact Now
                </a>
                <ShareButton
                  property={{ title, slug: p.slug, location, price, image }}
                  className="h-12 w-12"
                />
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center gap-1 text-gold">{icon}</div>
      <div className="mt-1 text-sm font-bold text-charcoal">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-charcoal/50">{label}</div>
    </div>
  );
}
