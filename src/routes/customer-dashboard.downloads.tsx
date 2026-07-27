import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, MapPin, Eye, FileText } from "lucide-react";
import { useDownloadsStore } from "@/hooks/useDownloadsStore";
import { properties } from "@/data/properties";

export const Route = createFileRoute("/customer-dashboard/downloads")({
  component: DownloadsPage,
});

function DownloadsPage() {
  const ids = useDownloadsStore((s) => s.ids);
  const clear = useDownloadsStore((s) => s.clear);
  const downloads = ids
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[3px] text-[#C8A34D]">My Dashboard</div>
          <h1 className="mt-1 font-display text-3xl font-bold text-charcoal">Downloads</h1>
          <p className="mt-1 text-[14px] text-charcoal/60">
            Property brochures and documents you've downloaded.
          </p>
        </div>
        {downloads.length > 0 && (
          <button
            onClick={clear}
            className="text-[13px] font-semibold text-red-600 hover:underline"
          >
            Clear History
          </button>
        )}
      </div>

      {downloads.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <Download size={40} className="mx-auto mb-3 text-violet-300" />
          <h3 className="font-display text-xl font-semibold text-charcoal">No downloads yet</h3>
          <p className="mt-1 text-[14px] text-charcoal/60">
            When you download a property brochure, it will appear here for easy access.
          </p>
          <Link
            to="/buy-properties/$type"
            params={{ type: "all" }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A34D] to-[#E4C06F] px-5 py-2.5 text-[13px] font-bold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {downloads.map((p) => (
            <div
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold text-charcoal line-clamp-1">{p.title}</h3>
                <div className="mt-1 flex items-center gap-1 text-[12px] text-charcoal/60">
                  <MapPin size={12} /> {p.location}
                </div>
                <div className="mt-auto pt-4 flex gap-2">
                   <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-50 text-violet-700 py-2.5 text-[13px] font-bold transition hover:bg-violet-100"
                    onClick={() => {
                      // Trigger download logic or open modal again if real implementation exists
                      alert("Re-downloading brochure for " + p.title);
                    }}
                  >
                    <FileText size={14} /> Brochure
                  </button>
                  <Link
                    to="/property/$slug"
                    params={{ slug: p.slug }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#172B58] to-[#21396F] py-2.5 text-[13px] font-bold text-white transition hover:shadow-md"
                  >
                    <Eye size={14} /> View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
