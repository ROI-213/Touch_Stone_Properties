import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Sparkles } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function AdminStubPage({ title, description, children }: Props) {
  return (
    <div>
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft size={14} /> Dashboard
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold text-[#0a1f44]">{title}</h1>
      {description && <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>}

      <div className="mt-6">
        {children ?? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#c9a961]/10 text-[#c9a961]">
              <Sparkles size={20} />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-[#0a1f44]">
              Workspace ready
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              This section is wired up for admin access. Records will appear here as soon
              as customers and visitors begin interacting with the site.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
