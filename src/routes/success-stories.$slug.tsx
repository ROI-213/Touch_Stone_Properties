import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Home,
  CheckCircle2,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSuccessStoryBySlug, slugifyStory, type SuccessStoryRow } from "@/lib/site-cms";
import { successStories as fallbackStories, type SuccessStory } from "@/data/successStories";
import { FALLBACK_PROPERTY_IMAGE, resolveLocalImage } from "@/data/siteImages";

type DetailModel = {
  title: string;
  category: string;
  badge: string;
  clientName: string;
  clientLabel?: string;
  location: string;
  summary: string;
  body: string;
  images: string[];
  services: string[];
  contactLink: string;
  whatsappLink: string;
  buttonText: string;
};

function rowToModel(r: SuccessStoryRow): DetailModel {
  const imgs = (r.images && r.images.length > 0 ? r.images : (r.image_url ? [r.image_url] : []))
    .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  return {
    title: r.title,
    category: r.category || "Success Story",
    badge: r.badge_text || r.story_type || "Story",
    clientName: r.client || "",
    clientLabel: r.client_label || undefined,
    location: r.location || "",
    summary: r.summary || "",
    body: r.body || r.summary || "",
    images: imgs,
    services: Array.isArray(r.services_provided)
      ? r.services_provided.filter((s) => s?.active !== false && s?.name).map((s) => s.name)
      : [],
    contactLink: r.contact_button_link || "/contact-us",
    whatsappLink: r.whatsapp_link || (r.whatsapp_number ? `https://wa.me/${r.whatsapp_number.replace(/\D/g, "")}` : "https://wa.me/919902925519"),
    buttonText: r.button_text || r.cta_text || "Contact Us",
  };
}

function fallbackToModel(s: SuccessStory): DetailModel {
  return {
    title: s.title,
    category: s.category,
    badge: s.badgeText || s.storyType,
    clientName: s.clientName,
    clientLabel: s.clientLabel,
    location: s.location,
    summary: s.description,
    body: s.fullStory,
    images: s.images,
    services: s.services ?? [],
    contactLink: s.contactLink || "/contact-us",
    whatsappLink: s.whatsappLink || "https://wa.me/919902925519",
    buttonText: s.buttonText || "Contact Us",
  };
}

export const Route = createFileRoute("/success-stories/$slug")({
  ssr: false,
  loader: async ({ params }) => {
    try {
      const row = await getSuccessStoryBySlug(params.slug);
      if (row) return { story: rowToModel(row) };
    } catch (e) {
      console.warn("[success-stories] load failed", e);
    }
    const fb = fallbackStories.find(
      (s) => (s.slug || slugifyStory(s.id) || s.id) === params.slug || slugifyStory(s.title) === params.slug
    );
    if (fb) return { story: fallbackToModel(fb) };
    throw notFound();
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <p className="text-amber-600 text-xs uppercase tracking-[0.2em] font-semibold">404</p>
        <h1 className="mt-3 text-3xl font-serif text-[#0a1f44]">Success story not found</h1>
        <p className="mt-3 text-slate-600">The success story you're looking for doesn't exist or was removed.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0a1f44] text-white px-5 py-2.5 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>
      <Footer />
    </div>
  ),
  component: SuccessStoryDetail,
});

function SuccessStoryDetail() {
  const { story } = Route.useLoaderData() as { story: DetailModel };
  const mainImage = resolveLocalImage(story.images[0], FALLBACK_PROPERTY_IMAGE);
  const galleryImages = story.images.slice(1).map((src) => resolveLocalImage(src, FALLBACK_PROPERTY_IMAGE));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative pt-28 pb-12 bg-gradient-to-b from-[#0a1f44] to-[#142b5c] text-white">
        <div className="w-full mx-auto px-5 sm:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-amber-300 text-sm hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Success Stories
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-amber-400 text-[#0a1f44] px-3 py-1 text-xs font-semibold tracking-wide">
              {story.badge}
            </span>
            <span className="text-amber-300 text-xs uppercase tracking-[0.2em] font-semibold">
              {story.category}
            </span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-serif leading-tight">{story.title}</h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-200">
            {story.clientName && (
              <span className="inline-flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-300" />
                {story.clientName}{story.clientLabel ? ` · ${story.clientLabel}` : ""}
              </span>
            )}
            {story.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-300" />
                {story.location}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="w-full mx-auto px-5 sm:px-8 -mt-8">
        <motion.img
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          src={mainImage}
          alt={story.title}
          className="w-full h-[320px] sm:h-[480px] object-cover rounded-3xl shadow-2xl ring-1 ring-slate-200"
        />

        {galleryImages.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${story.title} ${i + 2}`}
                className="w-full h-44 sm:h-56 object-cover rounded-2xl ring-1 ring-slate-200 hover:scale-[1.02] transition"
              />
            ))}
          </div>
        )}
      </section>

      <section className="w-full mx-auto px-5 sm:px-8 py-14 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {story.summary && (
            <p className="text-lg text-slate-700 leading-relaxed font-medium">{story.summary}</p>
          )}
          {story.body && (
            <div className="mt-6 text-slate-600 leading-relaxed whitespace-pre-line">{story.body}</div>
          )}
        </div>

        <aside className="lg:col-span-1">
          {story.services.length > 0 && (
            <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">
                Services Provided
              </p>
              <ul className="mt-4 space-y-3">
                {story.services.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-[#0a1f44]">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 rounded-3xl bg-[#0a1f44] p-6 text-white">
            <p className="text-amber-300 text-xs uppercase tracking-[0.2em] font-semibold">
              Let's talk
            </p>
            <h3 className="mt-2 text-xl font-serif">Get a similar result for your property</h3>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href={story.contactLink}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#0a1f44] px-5 py-3 text-sm font-semibold hover:bg-amber-50 transition"
              >
                <Phone className="w-4 h-4" />
                {story.buttonText}
              </a>
              <a
                href={story.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 text-[#0a1f44] px-5 py-3 text-sm font-semibold hover:bg-amber-400 transition"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Now
              </a>
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
