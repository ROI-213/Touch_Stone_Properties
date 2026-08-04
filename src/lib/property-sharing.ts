import toast from "react-hot-toast";

export function buildPropertyPublicUrl(slug: string): string {
  if (typeof window === "undefined") return `/property/${slug}`;
  return `${window.location.origin}/property/${slug}`;
}

export function formatPropertyPrice(startingPrice?: number | string | null, details?: Record<string, any>): string {
  if (details?.poster_price_badge) return details.poster_price_badge;
  if (!startingPrice || Number(startingPrice) === 0) return "Contact for price";
  const num = Number(startingPrice);
  if (isNaN(num)) return "Contact for price";
  return `₹ ${num.toLocaleString("en-IN")}`;
}

export function buildPropertyShareMessage(properties: any[]): string {
  if (!properties || properties.length === 0) return "";

  if (properties.length === 1) {
    const p = properties[0];
    const details = p.details || {};
    const locParts = [p.location?.locality, p.location?.zone, p.city || "Bengaluru"].filter(Boolean);
    const locationStr = locParts.length > 0 ? locParts.join(", ") : (p.address || "Bengaluru");
    const priceStr = formatPropertyPrice(p.starting_price, details);
    const url = buildPropertyPublicUrl(p.slug || p.id);

    const lines = [
      `Property: ${p.project_name}`,
      `Location: ${locationStr}`,
      `Type: ${p.property_type || "Residential"}`,
    ];

    if (details.super_builtup_area || p.bhk_options?.length) {
      const area = details.super_builtup_area ? `${details.super_builtup_area} sq. ft.` : "";
      const bhk = p.bhk_options?.length ? `${p.bhk_options.join(", ")} BHK` : "";
      lines.push(`Configurations: ${[bhk, area].filter(Boolean).join(" · ")}`);
    }

    if (p.project_status || details.possession_status) {
      lines.push(`Status: ${p.project_status || details.possession_status}`);
    }

    lines.push(`Price: ${priceStr}`);
    lines.push("");
    lines.push(`View property:`);
    lines.push(url);

    return lines.join("\n");
  }

  // Multi-property formatting
  const lines = ["Selected Properties from Touchstone Properties", ""];

  properties.forEach((p, idx) => {
    const locParts = [p.location?.locality, p.location?.zone, p.city || "Bengaluru"].filter(Boolean);
    const locationStr = locParts.length > 0 ? locParts.join(", ") : (p.address || "Bengaluru");
    const priceStr = formatPropertyPrice(p.starting_price, p.details);
    const url = buildPropertyPublicUrl(p.slug || p.id);

    lines.push(`${idx + 1}. ${p.project_name}`);
    lines.push(`   Location: ${locationStr}`);
    lines.push(`   Type: ${p.property_type || "Residential"}`);
    lines.push(`   Price: ${priceStr}`);
    lines.push(`   View: ${url}`);
    lines.push("");
  });

  lines.push("Contact us for more details or to schedule a site visit.");
  return lines.join("\n");
}

export function shareViaWhatsApp(message: string, propertyCount: number) {
  const encoded = encodeURIComponent(message);

  if (encoded.length > 3500 || propertyCount > 15) {
    toast.error("Sharing too many properties via WhatsApp may exceed link limits. Copied formatted text to clipboard instead!");
    void copyToClipboard(message, "Formatted property details copied!");
  }

  const whatsappUrl = `https://wa.me/?text=${encoded}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

export async function shareViaNative(title: string, text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) {
    return false;
  }
  try {
    await navigator.share({
      title,
      text,
    });
    return true;
  } catch (err: any) {
    if (err?.name !== "AbortError") {
      toast.error("Could not share natively.");
    }
    return false;
  }
}

export function shareViaEmail(subject: string, message: string) {
  const encSubject = encodeURIComponent(subject);
  const encBody = encodeURIComponent(message);
  window.location.href = `mailto:?subject=${encSubject}&body=${encBody}`;
}

export async function copyToClipboard(text: string, successMessage = "Copied to clipboard!") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success(successMessage);
    } catch {
      toast.error("Failed to copy text.");
    }
    document.body.removeChild(textarea);
  }
}
