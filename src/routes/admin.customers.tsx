import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminStubPage } from "@/components/admin/AdminStubPage";

export const Route = createFileRoute("/admin/customers")({
  component: Customers,
});

function Customers() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AdminStubPage
      title="Customers"
      description="Registered customers across the site."
    >
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-400">Loading…</td></tr>
            )}
            {!isLoading && (data ?? []).length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-400">No customers yet.</td></tr>
            )}
            {(data ?? []).map((c: any) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="p-3 font-medium text-[#0a1f44]">{c.full_name || "—"}</td>
                <td className="p-3 text-slate-700">{c.phone || "—"}</td>
                <td className="p-3 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminStubPage>
  );
}
