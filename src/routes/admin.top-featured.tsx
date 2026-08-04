import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { listProperties, updateProperty } from "@/lib/admin-properties";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Trash2, Plus, Pencil, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/top-featured")({
  component: TopFeaturedAdmin,
});

const MAX_TOP = 10;

function TopFeaturedAdmin() {
  const qc = useQueryClient();
  const [picker, setPicker] = useState("");

  const { data: all = [], isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: listProperties,
  });

  const top = useMemo(
    () =>
      [...all]
        .filter((p: any) => p.is_top_featured)
        .sort(
          (a: any, b: any) =>
            (a.top_featured_rank ?? 999) - (b.top_featured_rank ?? 999),
        ),
    [all],
  );
  const available = useMemo(
    () => all.filter((p: any) => !p.is_top_featured && p.is_active !== false),
    [all],
  );

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-properties"] });
    qc.invalidateQueries({ queryKey: ["public-properties"] });
  };

  const swapRanks = useMutation({
    mutationFn: async ({ a, b }: { a: any; b: any }) => {
      // Two-step swap to avoid unique index collision: park one at NULL first.
      await supabase
        .from("properties")
        .update({ top_featured_rank: null })
        .eq("id", a.id);
      await supabase
        .from("properties")
        .update({ top_featured_rank: a.top_featured_rank })
        .eq("id", b.id);
      await supabase
        .from("properties")
        .update({ top_featured_rank: b.top_featured_rank })
        .eq("id", a.id);
    },
    onSuccess: invalidate,
    onError: (e: any) => toast.error(e.message ?? "Failed to reorder"),
  });

  const removeFromTop = useMutation({
    mutationFn: async (id: string) => {
      await updateProperty(id, {
        is_top_featured: false,
        top_featured_rank: null,
      } as any);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Removed from Top 10");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const addToTop = useMutation({
    mutationFn: async (id: string) => {
      if (top.length >= MAX_TOP) {
        throw new Error(
          "You can add only 10 properties in the Top 10 Featured Properties section. Please remove or disable one property before adding a new one.",
        );
      }
      const used = new Set(
        top.map((p: any) => p.top_featured_rank).filter(Boolean),
      );
      let rank = 1;
      while (used.has(rank) && rank <= MAX_TOP) rank++;
      await updateProperty(id, {
        is_top_featured: true,
        top_featured_rank: rank,
      } as any);
    },
    onSuccess: () => {
      invalidate();
      setPicker("");
      toast.success("Added to Top 10");
    },
    onError: (e: any) =>
      toast.error(e.message ?? "Could not add to Top 10"),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      await updateProperty(id, { is_active: active } as any);
    },
    onSuccess: invalidate,
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const move = (idx: number, dir: -1 | 1) => {
    const a = top[idx];
    const b = top[idx + dir];
    if (!a || !b) return;
    // Ensure both have a rank
    if (a.top_featured_rank == null || b.top_featured_rank == null) {
      toast.error("Ranks not set — re-add to Top 10.");
      return;
    }
    swapRanks.mutate({ a, b });
  };

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Top 10 Featured Properties
          </h1>
          <p className="text-sm text-slate-500">
            Curate up to 10 properties that appear on the homepage carousel.
            Drag-free reorder with the arrows. Edit full property details from
            the Properties section.
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {top.length} / {MAX_TOP}
        </span>
      </header>

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[260px]">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Add property to Top 10
            </label>
            <select
              value={picker}
              onChange={(e) => setPicker(e.target.value)}
              disabled={top.length >= MAX_TOP}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">
                {top.length >= MAX_TOP
                  ? "Top 10 is full — remove one first"
                  : "Select a property…"}
              </option>
              {available.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.project_name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => picker && addToTop.mutate(picker)}
            disabled={!picker || top.length >= MAX_TOP || addToTop.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
          >
            {addToTop.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add to Top 10
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 w-16">Rank</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3 w-28">Active</th>
              <th className="px-4 py-3 w-56 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && top.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No properties in Top 10 yet. Use the picker above to add the
                  first one.
                </td>
              </tr>
            )}
            {top.map((p: any, idx: number) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3 font-semibold text-amber-600">
                  #{p.top_featured_rank ?? idx + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">
                    {p.project_name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {p.property_type} · {p.listing_type}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {p.location?.locality ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <label className="inline-flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={p.is_active !== false}
                      onChange={(e) =>
                        toggleActive.mutate({
                          id: p.id,
                          active: e.target.checked,
                        })
                      }
                    />
                    {p.is_active !== false ? "Active" : "Hidden"}
                  </label>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="rounded-md border p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => move(idx, 1)}
                      disabled={idx === top.length - 1}
                      className="rounded-md border p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <Link
                      to="/admin/properties/$id"
                      params={{ id: p.id }}
                      className="rounded-md border p-1.5 text-slate-600 hover:bg-slate-50"
                      title="Edit full property"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${p.project_name}" from Top 10?`))
                          removeFromTop.mutate(p.id);
                      }}
                      className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                      title="Remove from Top 10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
