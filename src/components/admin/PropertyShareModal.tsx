import { useState, useEffect } from "react";
import {
  X,
  Share2,
  MessageCircle,
  Copy,
  Mail,
  ExternalLink,
  AlertTriangle,
  Link2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  buildPropertyPublicUrl,
  buildPropertyShareMessage,
  formatPropertyPrice,
  shareViaWhatsApp,
  shareViaNative,
  shareViaEmail,
  copyToClipboard,
} from "@/lib/property-sharing";

interface PropertyShareModalProps {
  open: boolean;
  onClose: () => void;
  selectedProperties: any[];
  onRemoveFromSelection?: (id: string) => void;
}

export function PropertyShareModal({
  open,
  onClose,
  selectedProperties,
  onRemoveFromSelection,
}: PropertyShareModalProps) {
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && Boolean(navigator.share));
  }, []);

  if (!selectedProperties.length) return null;

  const inactiveCount = selectedProperties.filter((p) => p.is_active === false).length;
  const shareMessage = buildPropertyShareMessage(selectedProperties);
  const linksOnly = selectedProperties
    .map((p) => buildPropertyPublicUrl(p.slug || p.id))
    .join("\n");

  const handleWhatsApp = () => {
    shareViaWhatsApp(shareMessage, selectedProperties.length);
  };

  const handleNative = async () => {
    await shareViaNative(
      selectedProperties.length === 1
        ? selectedProperties[0].project_name
        : "Selected Properties from Touchstone Properties",
      shareMessage
    );
  };

  const handleEmail = () => {
    const subject =
      selectedProperties.length === 1
        ? `Property: ${selectedProperties[0].project_name}`
        : "Selected Properties from Touchstone Properties";
    shareViaEmail(subject, shareMessage);
  };

  const handleCopyLinks = () => {
    void copyToClipboard(linksOnly, "Property link(s) copied to clipboard!");
  };

  const handleCopyDetails = () => {
    void copyToClipboard(shareMessage, "Property details copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[calc(100vw-24px)] max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl bg-white p-4 sm:p-6 shadow-2xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <DialogTitle className="text-lg font-bold text-[#0a1f44]">
              Share Selected Properties
            </DialogTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedProperties.length} property{selectedProperties.length > 1 ? "ies" : ""} selected for sharing
            </p>
          </div>
        </DialogHeader>

        {/* Warning Banner for Inactive/Draft Properties */}
        {inactiveCount > 0 && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <AlertTriangle size={16} className="shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-semibold">Notice:</span> {inactiveCount} selected property{inactiveCount > 1 ? "ies are" : " is"} currently set to <strong>Inactive</strong> on the CMS. Public links will only function once activated.
            </div>
          </div>
        )}

        {/* Selected Properties Preview List */}
        <div className="mt-4 space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {selectedProperties.map((p) => {
            const locParts = [p.location?.locality, p.location?.zone, p.city || "Bengaluru"].filter(Boolean);
            const locationStr = locParts.length > 0 ? locParts.join(", ") : (p.address || "Bengaluru");
            const priceStr = formatPropertyPrice(p.starting_price, p.details);
            const publicUrl = buildPropertyPublicUrl(p.slug || p.id);

            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-200 border border-slate-200 grid place-items-center">
                    {p.hero_image ? (
                      <img src={p.hero_image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400">PROP</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 truncate">{p.project_name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{locationStr} · <span className="font-semibold text-slate-700">{priceStr}</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#c9a961] hover:underline"
                    title="Preview Public Link"
                  >
                    Public Link <ExternalLink size={11} />
                  </a>

                  {onRemoveFromSelection && selectedProperties.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveFromSelection(p.id)}
                      className="grid h-6 w-6 place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                      title="Remove from selection"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Share Channel Buttons Grid */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Choose Sharing Method
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {/* WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-700 shadow-xs"
            >
              <MessageCircle size={16} /> WhatsApp
            </button>

            {/* Native Mobile Share */}
            {canNativeShare && (
              <button
                type="button"
                onClick={handleNative}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700 shadow-xs"
              >
                <Share2 size={16} /> Share Device
              </button>
            )}

            {/* Copy Full Details */}
            <button
              type="button"
              onClick={handleCopyDetails}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 shadow-xs"
            >
              <Copy size={16} className="text-slate-500" /> Copy Details
            </button>

            {/* Copy Links Only */}
            <button
              type="button"
              onClick={handleCopyLinks}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 shadow-xs"
            >
              <Link2 size={16} className="text-slate-500" /> Copy Links Only
            </button>

            {/* Email */}
            <button
              type="button"
              onClick={handleEmail}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 shadow-xs"
            >
              <Mail size={16} className="text-slate-500" /> Email
            </button>
          </div>
        </div>

        {/* Message Preview Box */}
        <div className="mt-4 rounded-xl bg-slate-100 p-3 text-[11px] font-mono text-slate-700 max-h-32 overflow-y-auto whitespace-pre-wrap border border-slate-200">
          <div className="font-sans font-semibold text-slate-500 uppercase tracking-wider text-[9px] mb-1">Generated Share Message:</div>
          {shareMessage}
        </div>
      </DialogContent>
    </Dialog>
  );
}
