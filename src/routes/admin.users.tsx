import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminStubPage } from "@/components/admin/AdminStubPage";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("id, user_id, role, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AdminStubPage
      title="Admin Users"
      description="Users with elevated roles. Promote new admins by inserting a row in user_roles."
    >
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-3">User ID</th>
              <th className="p-3">Role</th>
              <th className="p-3">Granted</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={3} className="p-8 text-center text-slate-400">Loading…</td></tr>}
            {!isLoading && (data ?? []).length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-400">No role assignments yet.</td></tr>
            )}
            {(data ?? []).map((u: any) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs text-slate-600">{u.user_id}</td>
                <td className="p-3">
                  <span className="rounded-full bg-[#c9a961]/15 px-2 py-0.5 text-[11px] font-medium text-[#c9a961]">
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {isLoading && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">Loading admin roles…</div>}
        {!isLoading && (data ?? []).length === 0 && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">No admin users found.</div>}
        {!isLoading && (data ?? []).map((u: any) => (
          <div key={u.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-mono text-xs text-slate-700 truncate">{u.user_id}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Granted: {new Date(u.created_at).toLocaleDateString()}</div>
            </div>
            <span className="rounded-full bg-[#c9a961]/15 px-2.5 py-1 text-xs font-semibold text-[#c9a961] shrink-0">
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </AdminStubPage>
  );
}
