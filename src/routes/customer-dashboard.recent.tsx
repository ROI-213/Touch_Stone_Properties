import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, MapPin, Eye } from "lucide-react";
import { useRecentStore } from "@/hooks/useRecentStore";
import { properties } from "@/data/properties";

export const Route = createFileRoute("/customer-dashboard/recent")({
  component: RecentPage,
});

function RecentPage() {
  const ids = useRecentStore((s) => s.ids);
  const clear = useRecentStore((s) => s.clear);
  const recent = ids
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[3px] text-[#C8A34D]">My Dashboard</div>
          <h1 className="mt-1 font-display text-3xl font-bold text-charcoal">Recently Viewed</h1>
          <p className="mt-1 text-[14px] text-charcoal/60">
            Properties you've looked at recently.
          </p>
        </div>
        {recent.length > 0 && (
          <button
            onClick={clear}
            className="text-[13px] font-semibold text-red-600 hover:underline"
          >
            Clear History
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <Clock size={40} className="mx-auto mb-3 text-amber-300" />
          <h3 className="font-display text-xl font-semibold text-charcoal">No recent views</h3>
          <p className="mt-1 text-[14px] text-charcoal/60">
            Properties you view will automatically appear here.
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
          {recent.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group block overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-charcoal line-clamp-1">{p.title}</h3>
                <div className="mt-1 flex items-center gap-1 text-[12px] text-charcoal/60">
                  <MapPin size={12} /> {p.location}
                </div>
                <div className="mt-3 font-numeric text-lg font-bold text-[#C8A34D]">{p.price}</div>
                <Link
                  to="/property/$slug"
                  params={{ slug: p.slug }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#172B58] to-[#21396F] py-2.5 text-[13px] font-bold text-white transition hover:shadow-md"
                >
                  <Eye size={14} /> View Again
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
