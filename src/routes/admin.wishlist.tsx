import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminStubPage } from "@/components/admin/AdminStubPage";

export const Route = createFileRoute("/admin/wishlist")({
  component: Wishlists,
});

function Wishlists() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-wishlists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("id, user_id, property_id, created_at, property:properties(project_name)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AdminStubPage
      title="Wishlist"
      description="Properties saved by customers."
    >
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-3">Property</th>
              <th className="p-3">User</th>
              <th className="p-3">Saved</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={3} className="p-8 text-center text-slate-400">Loading…</td></tr>}
            {!isLoading && (data ?? []).length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-400">No saved properties yet.</td></tr>
            )}
            {(data ?? []).map((w: any) => (
              <tr key={w.id} className="border-t border-slate-100">
                <td className="p-3 font-medium text-[#0a1f44]">{w.property?.project_name || "—"}</td>
                <td className="p-3 text-slate-500 font-mono text-xs">{w.user_id?.slice(0, 8)}…</td>
                <td className="p-3 text-slate-500">{new Date(w.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminStubPage>
  );
}
