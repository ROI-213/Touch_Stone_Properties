import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Share2,
  X,
  Copy,
  Link as LinkIcon,
  MessageCircle,
  Send,
  Smartphone,
  Filter,
  CheckSquare,
  Square,
  Layers,
  ListChecks,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Property } from "@/data/properties";

const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} {...p}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-3h2.4V9.6c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12H16l-.4 3h-2.2v7A10 10 0 0 0 22 12Z" />
  </svg>
);
const TwitterIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...p}>
    <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.94l-5.43-7.1L4.4 22H1.14l8.02-9.16L1 2h7.06l4.92 6.49L18.244 2Zm-1.22 18h1.92L7.06 4H5.04l11.984 16Z" />
  </svg>
);
const LinkedinIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6 0h3.83v1.57h.05c.53-1 1.84-2.07 3.79-2.07 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.34c0-1.27-.02-2.91-1.77-2.91-1.77 0-2.04 1.39-2.04 2.82V21H9V9.5Z" />
  </svg>
);

type Mode = "filtered" | "selected" | "all" | "filters";

interface FilterSummary {
  city?: string;
  areas?: string[];
  locality?: string;
  types?: string[];
  bhks?: string[];
  budget?: string;
  sort?: string;
  viewMode?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  visibleProperties: Property[];
  allFilteredProperties: Property[];
  filterSummary: FilterSummary;
  pageTitle: string;
}

export function SharePropertiesModal({
  open,
  onClose,
  visibleProperties,
  allFilteredProperties,
  filterSummary,
  pageTitle,
}: Props) {
  const [mode, setMode] = useState<Mode>("filtered");
  const [selected, setSelected] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  const filterParams = useMemo(() => {
    const p = new URLSearchParams();
    if (filterSummary.city) p.set("city", filterSummary.city);
    if (filterSummary.areas?.length) p.set("areas", filterSummary.areas.join(","));
    if (filterSummary.locality) p.set("locality", filterSummary.locality);
    if (filterSummary.types?.length) p.set("propertyType", filterSummary.types.join(","));
    if (filterSummary.bhks?.length) p.set("bhk", filterSummary.bhks.join(","));
    if (filterSummary.budget) p.set("budget", filterSummary.budget);
    if (filterSummary.sort) p.set("sort", filterSummary.sort);
    if (filterSummary.viewMode) p.set("viewMode", filterSummary.viewMode);
    return p;
  }, [filterSummary]);

  const shareUrl = useMemo(() => {
    if (mode === "filtered") {
      const qs = filterParams.toString();
      return `${origin}${currentPath}${qs ? `?${qs}` : ""}`;
    }
    if (mode === "selected") {
      const ids = selected.join(",");
      return `${origin}/shared-properties?ids=${ids}`;
    }
    if (mode === "all") {
      const ids = allFilteredProperties.map((p) => p.id).join(",");
      return `${origin}/shared-properties?ids=${ids}`;
    }
    // filters only
    const qs = filterParams.toString();
    return `${origin}${currentPath}${qs ? `?${qs}` : ""}`;
  }, [mode, selected, allFilteredProperties, filterParams, origin, currentPath]);

  const propertyNames = useMemo(() => {
    if (mode === "selected") {
      return allFilteredProperties
        .filter((p) => selected.includes(p.id))
        .map((p) => p.title);
    }
    if (mode === "all") return allFilteredProperties.map((p) => p.title);
    if (mode === "filtered") return visibleProperties.map((p) => p.title);
    return [];
  }, [mode, selected, visibleProperties, allFilteredProperties]);

  const filterText = useMemo(() => {
    const bits: string[] = [];
    if (filterSummary.city) bits.push(filterSummary.city);
    if (filterSummary.areas?.length) bits.push(filterSummary.areas.join("/"));
    if (filterSummary.types?.length) bits.push(filterSummary.types.join("/"));
    if (filterSummary.bhks?.length) bits.push(`${filterSummary.bhks.join("/")} BHK`);
    if (filterSummary.budget) bits.push(filterSummary.budget);
    return bits.join(" • ") || "All properties";
  }, [filterSummary]);

  const shareText = useMemo(() => {
    const lines = ["Check out these properties from Touchstone Properties:"];
    if (propertyNames.length) {
      lines.push(propertyNames.slice(0, 8).map((n) => `• ${n}`).join("\n"));
      if (propertyNames.length > 8) lines.push(`…and ${propertyNames.length - 8} more`);
    }
    if (filterSummary.areas?.length || filterSummary.city) {
      lines.push(
        `Location: ${[filterSummary.areas?.join("/"), filterSummary.city].filter(Boolean).join(", ")}`,
      );
    }
    lines.push(`Filters: ${filterText}`);
    lines.push(`View here: ${shareUrl}`);
    return lines.join("\n");
  }, [propertyNames, filterSummary, filterText, shareUrl]);

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(pageTitle);

  const openShare = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer,width=620,height=560");

  const canShare = mode !== "selected" || selected.length > 0;

  const copyLink = async () => {
    if (!canShare) return toast.error("Select at least one property");
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied!");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const nativeShare = async () => {
    if (!canShare) return toast.error("Select at least one property");
    if (typeof navigator === "undefined" || !navigator.share) {
      toast("Native share not available on this device");
      return;
    }
    try {
      await navigator.share({ title: pageTitle, text: shareText, url: shareUrl });
      onClose();
    } catch {
      /* cancelled */
    }
  };

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const modes: { key: Mode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: "filtered",
      label: "Current filtered page",
      desc: "Share this page with applied filters",
      icon: <Filter size={16} />,
    },
    {
      key: "selected",
      label: "Selected properties",
      desc: "Pick specific properties to share",
      icon: <ListChecks size={16} />,
    },
    {
      key: "all",
      label: "All visible properties",
      desc: `Share all ${allFilteredProperties.length} matching properties`,
      icon: <Layers size={16} />,
    },
    {
      key: "filters",
      label: "Only filters",
      desc: "Share just the search setup",
      icon: <Filter size={16} />,
    },
  ];

  const shareOptions = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <MessageCircle size={18} />,
      color: "bg-[#25D366] text-white",
      onClick: () => canShare ? openShare(`https://wa.me/?text=${encodedText}`) : toast.error("Select at least one property"),
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: <FacebookIcon />,
      color: "bg-[#1877F2] text-white",
      onClick: () => canShare ? openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`) : toast.error("Select at least one property"),
    },
    {
      key: "twitter",
      label: "X / Twitter",
      icon: <TwitterIcon />,
      color: "bg-black text-white",
      onClick: () => canShare ? openShare(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`) : toast.error("Select at least one property"),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <LinkedinIcon />,
      color: "bg-[#0A66C2] text-white",
      onClick: () => canShare ? openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`) : toast.error("Select at least one property"),
    },
    {
      key: "telegram",
      label: "Telegram",
      icon: <Send size={18} />,
      color: "bg-[#229ED9] text-white",
      onClick: () => canShare ? openShare(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`) : toast.error("Select at least one property"),
    },
  ];

  const sheetVariants = isMobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : {
        initial: { opacity: 0, scale: 0.94 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.94 },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={sheetVariants.initial}
            animate={sheetVariants.animate}
            exit={sheetVariants.exit}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-[600px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:rounded-3xl"
            style={{ maxHeight: "92vh" }}
          >
            <div className="flex justify-center pt-3 sm:hidden">
              <span className="h-1.5 w-12 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-5 sm:pt-6">
              <div className="min-w-0">
                <div
                  className="text-[11px] font-bold uppercase tracking-[2px] text-[#C8A34D]"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Share Properties Page
                </div>
                <h3
                  className="mt-1 text-lg font-bold text-[#172B58]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Select what to share with your client
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-2">
              {/* Mode selector */}
              <div className="grid grid-cols-2 gap-2">
                {modes.map((m) => {
                  const active = mode === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setMode(m.key)}
                      className={`flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition ${
                        active
                          ? "border-[#C8A34D] bg-[#C8A34D]/10 shadow-sm"
                          : "border-slate-200 bg-white hover:border-[#C8A34D]/40"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center gap-1.5 text-[12px] font-bold ${
                          active ? "text-[#C8A34D]" : "text-[#172B58]"
                        }`}
                      >
                        {m.icon} {m.label}
                      </span>
                      <span className="text-[11px] text-slate-500">{m.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selectable list */}
              {mode === "selected" && (
                <div className="mt-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                    <span className="text-[12px] font-bold text-[#172B58]">
                      Select properties ({selected.length}/{visibleProperties.length})
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(visibleProperties.map((p) => p.id))}
                        className="text-[11px] font-semibold text-[#C8A34D] hover:underline"
                      >
                        Select all
                      </button>
                      <button
                        onClick={() => setSelected([])}
                        className="text-[11px] font-semibold text-slate-500 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[240px] overflow-y-auto">
                    {visibleProperties.map((p) => {
                      const isSel = selected.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => toggleSelect(p.id)}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-slate-50 ${
                            isSel ? "bg-[#C8A34D]/5" : ""
                          }`}
                        >
                          {isSel ? (
                            <CheckSquare size={18} className="shrink-0 text-[#C8A34D]" />
                          ) : (
                            <Square size={18} className="shrink-0 text-slate-300" />
                          )}
                          {p.image && (
                            <img
                              src={p.image}
                              alt={p.title}
                              className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[13px] font-semibold text-[#172B58]">
                              {p.title}
                            </div>
                            <div className="truncate text-[11px] text-slate-500">
                              {p.location} • {p.bhk} BHK
                            </div>
                          </div>
                          <span className="shrink-0 text-[12px] font-bold text-[#C8A34D]">
                            {p.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* URL preview */}
              <div className="mt-4 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Share URL
                </div>
                <div className="truncate text-[12px] text-slate-700">{shareUrl}</div>
              </div>

              {/* Share options */}
              <div className="mt-4">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Share via
                </div>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                  {shareOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={opt.onClick}
                      className="group flex flex-col items-center gap-1.5 transition active:scale-95"
                    >
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-2xl shadow-md transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg ${opt.color}`}
                      >
                        {opt.icon}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-700">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                  {typeof navigator !== "undefined" && "share" in navigator && (
                    <button
                      onClick={nativeShare}
                      className="group flex flex-col items-center gap-1.5 transition active:scale-95"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#21396F] to-[#172B58] text-white shadow-md transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                        <Smartphone size={18} />
                      </span>
                      <span className="text-[10px] font-semibold text-slate-700">More</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-3">
              <button
                onClick={() => setSelected([])}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Clear selection
              </button>
              <div className="flex-1" />
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-[#172B58] transition hover:border-[#C8A34D] hover:text-[#C8A34D]"
              >
                <Copy size={13} /> Copy link
              </button>
              <button
                onClick={() =>
                  canShare
                    ? openShare(`https://wa.me/?text=${encodedText}`)
                    : toast.error("Select at least one property")
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C8A34D] to-[#b8923f] px-4 py-2 text-[12px] font-bold text-white shadow-md transition hover:from-[#172B58] hover:to-[#21396F]"
              >
                <Share2 size={13} /> Share Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SharePropertiesModal;
