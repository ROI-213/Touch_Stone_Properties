import { useEffect, useState } from "react";
// useState is used inside ShareModal for isMobile state
import { AnimatePresence, motion } from "framer-motion";
import {
  Share2,
  X,
  Copy,
  Link as LinkIcon,
  MessageCircle,
  Send,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";
import { useShareModal } from "@/contexts/ShareModalContext";

/* Inline brand glyphs (lucide-react no longer ships these) */
const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} {...p}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-3h2.4V9.6c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12H16l-.4 3h-2.2v7A10 10 0 0 0 22 12Z"/>
  </svg>
);
const TwitterIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} {...p}>
    <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.94l-5.43-7.1L4.4 22H1.14l8.02-9.16L1 2h7.06l4.92 6.49L18.244 2Zm-1.22 18h1.92L7.06 4H5.04l11.984 16Z"/>
  </svg>
);
const LinkedinIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6 0h3.83v1.57h.05c.53-1 1.84-2.07 3.79-2.07 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.34c0-1.27-.02-2.91-1.77-2.91-1.77 0-2.04 1.39-2.04 2.82V21H9V9.5Z"/>
  </svg>
);
const InstagramIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={20} height={20} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);


export interface SharePropertyData {
  title: string;
  slug: string;
  location?: string;
  price?: string;
  image?: string;
}

interface ShareButtonProps {
  property: SharePropertyData;
  variant?: "icon" | "pill";
  className?: string;
  stopPropagation?: boolean;
}

function buildShareUrl(slug: string) {
  if (typeof window === "undefined") return `/property/${slug}`;
  return `${window.location.origin}/property/${slug}`;
}

function buildShareText(p: SharePropertyData, url: string) {
  const parts = [
    `Check out this property: ${p.title}`,
    p.location ? `, ${p.location}` : "",
    p.price ? `, ${p.price}` : "",
    `. View details here: ${url}`,
  ];
  return parts.join("");
}

export function ShareButton({
  property,
  variant = "icon",
  className = "",
  stopPropagation = true,
}: ShareButtonProps) {
  const share = useShareModal();

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    share.open(property);
  };

  if (variant === "pill") {
    return (
      <button
        onClick={handleClick}
        aria-label="Share property"
        className={`inline-flex items-center gap-1.5 rounded-full border border-[#21396F]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#21396F] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C8A34D] hover:text-[#C8A34D] hover:shadow-md ${className}`}
      >
        <Share2 size={13} /> Share
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Share property"
      className={`grid h-9 w-9 place-items-center rounded-full border border-[#21396F]/15 bg-white text-[#21396F] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C8A34D] hover:text-[#C8A34D] hover:shadow-md ${className}`}
    >
      <Share2 size={15} />
    </button>
  );
}

interface ShareModalProps {
  property: SharePropertyData;
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ property, open, onClose }: ShareModalProps) {
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
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open, onClose]);

  const url = buildShareUrl(property.slug);
  const text = buildShareText(property, url);
  const title = `${property.title} - Touchstone Properties`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const encodedTitle = encodeURIComponent(title);

  const openShare = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer,width=620,height=560");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Property link copied!");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const nativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      toast("Native share not available on this device");
      return;
    }
    try {
      await navigator.share({ title: property.title, text, url });
      onClose();
    } catch {
      /* user cancelled */
    }
  };

  const openInstagram = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied. Paste it in Instagram chat or story.");
    } catch {
      /* ignore */
    }
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const options: Array<{
    key: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
  }> = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <MessageCircle size={20} />,
      color: "bg-[#25D366] text-white",
      onClick: () => openShare(`https://wa.me/?text=${encodedText}`),
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: <FacebookIcon />,
      color: "bg-[#1877F2] text-white",
      onClick: () => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`),
    },
    {
      key: "twitter",
      label: "X / Twitter",
      icon: <TwitterIcon />,
      color: "bg-black text-white",
      onClick: () =>
        openShare(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <LinkedinIcon />,
      color: "bg-[#0A66C2] text-white",
      onClick: () =>
        openShare(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`,
        ),
    },
    {
      key: "telegram",
      label: "Telegram",
      icon: <Send size={20} />,
      color: "bg-[#229ED9] text-white",
      onClick: () =>
        openShare(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`),
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: <InstagramIcon />,
      color: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white",
      onClick: openInstagram,
    },
  ];

  const sheetVariants = isMobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : { initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.94 } };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Share this property"
        >
          <motion.div
            initial={sheetVariants.initial}
            animate={sheetVariants.animate}
            exit={sheetVariants.exit}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] sm:rounded-3xl"
          >
            {/* Mobile drag handle */}
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
                  Share this property
                </div>
                <h3
                  className="mt-1 truncate text-lg font-bold text-[#172B58]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {property.title}
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

            {/* Property preview */}
            <div className="mx-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
              {property.image ? (
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#21396F] to-[#172B58] text-white">
                  <LinkIcon size={18} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {property.location && (
                  <div className="truncate text-[12px] text-slate-500">{property.location}</div>
                )}
                {property.price && (
                  <div className="truncate text-[14px] font-bold text-[#C8A34D]">
                    {property.price}
                  </div>
                )}
              </div>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-4 gap-3 px-6 py-6">
              {options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={opt.onClick}
                  className="group flex flex-col items-center gap-2 transition active:scale-95"
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl shadow-md transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg ${opt.color}`}
                  >
                    {opt.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700">{opt.label}</span>
                </button>
              ))}

              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={nativeShare}
                  className="group flex flex-col items-center gap-2 transition active:scale-95"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#21396F] to-[#172B58] text-white shadow-md transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                    <Smartphone size={20} />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700">More</span>
                </button>
              )}
            </div>

            {/* Copy link */}
            <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <div className="flex items-center gap-2 rounded-xl bg-white p-2 ring-1 ring-slate-200">
                <LinkIcon size={14} className="ml-2 shrink-0 text-slate-400" />
                <span className="min-w-0 flex-1 truncate text-[12px] text-slate-600">{url}</span>
                <button
                  onClick={copyLink}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#21396F] to-[#172B58] px-3 py-2 text-[12px] font-bold text-white transition hover:from-[#C8A34D] hover:to-[#b8923f]"
                >
                  <Copy size={13} /> Copy
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ShareButton;
