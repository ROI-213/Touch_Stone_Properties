import type { ReactNode } from "react";
import { Construction } from "lucide-react";

export function PlaceholderPanel({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-6">
        <div className="text-[12px] font-bold uppercase tracking-[3px] text-[#C8A34D]">
          {eyebrow}
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold text-charcoal">{title}</h1>
      </div>
      <div className="rounded-2xl bg-white p-12 text-center shadow-card">
        <Construction size={36} className="mx-auto mb-3 text-[#C8A34D]" />
        <h2 className="font-display text-xl font-semibold text-charcoal">Coming soon</h2>
        <p className="mt-2 text-[14px] text-charcoal/60">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
