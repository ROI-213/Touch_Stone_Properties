import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, MapPin, Trash2, Share2, Calendar, GitCompareArrows, Eye } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { properties } from "@/data/properties";
import toast from "react-hot-toast";

export const Route = createFileRoute("/customer-dashboard/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const { items, remove, isLoading } = useWishlist();
  const saved = items
    .map((w) => ({ row: w, p: properties.find((x) => x.id === w.property_id) }))
    .filter((x): x is { row: typeof x.row; p: NonNullable<typeof x.p> } => !!x.p);

  return (
    <div>
      <div className="mb-6">
        <div className="text-[12px] font-bold uppercase tracking-[3px] text-[#C8A34D]">My Wishlist</div>
        <h1 className="mt-1 font-display text-3xl font-bold text-charcoal">Saved Properties</h1>
        <p className="mt-1 text-[14px] text-charcoal/60">
          {saved.length} {saved.length === 1 ? "property" : "properties"} saved
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-charcoal/60 shadow-card">Loading…</div>
      ) : saved.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <Heart size={40} className="mx-auto mb-3 text-rose-300" />
          <h3 className="font-display text-xl font-semibold text-charcoal">Your wishlist is empty</h3>
          <p className="mt-1 text-[14px] text-charcoal/60">
            Browse properties and click the heart icon to save them here.
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
        <div className="space-y-4">
          {saved.map(({ row, p }, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-elevated sm:flex-row"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-48 w-full object-cover sm:h-auto sm:w-64"
              />
              <div className="flex flex-1 flex-col p-5">
                <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#C8A34D]">
                  {p.builder}
                </div>
                <h3 className="mt-1 font-display text-xl font-bold text-charcoal">{p.title}</h3>
                <div className="mt-1 flex items-center gap-1 text-[13px] text-charcoal/60">
                  <MapPin size={12} /> {p.location}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-[12px] text-charcoal/70">
                  {p.bhk > 0 && <span className="rounded-full bg-sand px-2.5 py-1">{p.bhk} BHK</span>}
                  <span className="rounded-full bg-sand px-2.5 py-1">{p.sqft.toLocaleString()} sqft</span>
                  <span className="rounded-full bg-sand px-2.5 py-1">{p.possession}</span>
                </div>
                <div className="mt-2 font-numeric text-xl font-bold text-[#C8A34D]">{p.price}</div>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <Link
                    to="/property/$slug"
                    params={{ slug: p.slug }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#172B58] to-[#21396F] px-4 py-2 text-[12px] font-bold text-white transition hover:-translate-y-0.5"
                  >
                    <Eye size={12} /> View Details
                  </Link>
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-3 py-2 text-[12px] font-semibold text-charcoal transition hover:border-[#C8A34D] hover:text-[#C8A34D]">
                    <Calendar size={12} /> Schedule Visit
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-3 py-2 text-[12px] font-semibold text-charcoal transition hover:border-[#C8A34D] hover:text-[#C8A34D]">
                    <GitCompareArrows size={12} /> Compare
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-3 py-2 text-[12px] font-semibold text-charcoal transition hover:border-[#C8A34D] hover:text-[#C8A34D]">
                    <Share2 size={12} /> Share
                  </button>
                  <button
                    onClick={async () => {
                      await remove(p.id);
                      toast.success("Removed from wishlist");
                    }}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-2 text-[12px] font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
