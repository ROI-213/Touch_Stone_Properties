import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GitCompareArrows, Trash2, Check, X } from "lucide-react";
import { useCompareStore } from "@/hooks/useCompareStore";
import { useDbProperties } from "@/hooks/useDbProperties";
import { properties as staticProperties, type Property } from "@/data/properties";

export const Route = createFileRoute("/customer-dashboard/compare")({
  component: ComparePage,
});

function ComparePage() {
  const ids = useCompareStore((s) => s.ids);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const { data: dbProps = [] } = useDbProperties();

  const allProps = useMemo(
    () => (dbProps.length > 0 ? dbProps : staticProperties),
    [dbProps],
  );

  const compare = useMemo(() => {
    return ids
      .map((id) => allProps.find((p) => p.id === id || p.slug === id))
      .filter((p): p is Property => Boolean(p));
  }, [ids, allProps]);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[3px] text-[#C8A34D]">My Dashboard</div>
          <h1 className="mt-1 font-display text-3xl font-bold text-charcoal">Compare Properties</h1>
          <p className="mt-1 text-[14px] text-charcoal/60">
            Compare up to 4 properties side-by-side.
          </p>
        </div>
        {compare.length > 0 && (
          <button
            onClick={clear}
            className="text-[13px] font-semibold text-red-600 hover:underline"
          >
            Clear List
          </button>
        )}
      </div>

      {compare.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <GitCompareArrows size={40} className="mx-auto mb-3 text-indigo-300" />
          <h3 className="font-display text-xl font-semibold text-charcoal">Nothing to compare</h3>
          <p className="mt-1 text-[14px] text-charcoal/60">
            Add properties to compare them side-by-side.
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
        <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
          <table className="w-full min-w-[800px] text-left text-[14px]">
            <thead>
              <tr>
                <th className="w-48 p-4 font-bold text-charcoal/50">Features</th>
                {compare.map((p) => (
                  <th key={p.id} className="min-w-[250px] p-4 text-center">
                    <div className="relative mx-auto mb-3 h-32 w-full overflow-hidden rounded-xl">
                      <img src={p.image} className="h-full w-full object-cover" alt={p.title} />
                      <button
                        onClick={() => remove(p.id)}
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-red-600 shadow transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="font-display text-lg font-bold text-charcoal">{p.title}</div>
                    <div className="mt-1 font-numeric text-[#C8A34D]">{p.price}</div>
                    <Link
                      to="/property/$slug"
                      params={{ slug: p.slug }}
                      className="mt-3 inline-block rounded-full border border-[#C8A34D] px-4 py-1.5 text-[12px] font-bold text-[#C8A34D] transition hover:bg-[#C8A34D] hover:text-white"
                    >
                      View
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="p-4 font-semibold text-charcoal/70">Location</td>
                {compare.map((p) => (
                  <td key={p.id} className="p-4 text-center font-medium text-charcoal">{p.location}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-charcoal/70">Builder</td>
                {compare.map((p) => (
                  <td key={p.id} className="p-4 text-center font-medium text-charcoal">{p.builder}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-charcoal/70">Size / Configuration</td>
                {compare.map((p) => (
                  <td key={p.id} className="p-4 text-center font-medium text-charcoal">
                    {p.bhk > 0 && `${p.bhk} BHK • `}{p.sqft.toLocaleString()} sqft
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-charcoal/70">Possession</td>
                {compare.map((p) => (
                  <td key={p.id} className="p-4 text-center font-medium text-charcoal">{p.possession}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-charcoal/70">RERA Registered</td>
                {compare.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    {p.rera ? <Check size={18} className="mx-auto text-emerald-500" /> : <X size={18} className="mx-auto text-red-500" />}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
