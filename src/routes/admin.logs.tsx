import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listActivityLogs } from "@/lib/site-cms";

export const Route = createFileRoute("/admin/logs")({
  component: LogsAdmin,
});

function LogsAdmin() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-activity-logs"],
    queryFn: () => listActivityLogs(300),
  });
  const items = data ?? [];

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Activity Logs</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? "Loading…" : `${items.length} recent events`}
          </p>
        </div>
        <button onClick={() => refetch()} disabled={isFetching}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && !isLoading && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                No activity yet. Logs are written when admins create, edit or delete content.
              </td></tr>
            )}
            {items.map((l) => (
              <tr key={l.id} className="border-t border-slate-100">
                <td className="whitespace-nowrap px-4 py-2 text-xs text-slate-500">
                  {new Date(l.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    l.action === "delete" ? "bg-red-100 text-red-700" :
                    l.action === "create" ? "bg-emerald-100 text-emerald-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>{l.action}</span>
                </td>
                <td className="px-4 py-2 text-xs text-slate-600">{l.entity || "—"}</td>
                <td className="px-4 py-2 font-mono text-[10px] text-slate-500">{l.entity_id ? l.entity_id.slice(0, 8) : "—"}</td>
                <td className="px-4 py-2 font-mono text-[10px] text-slate-500">{l.actor_id ? l.actor_id.slice(0, 8) : "—"}</td>
                <td className="px-4 py-2 text-xs text-slate-500">
                  {l.metadata ? <code className="block max-w-md truncate">{JSON.stringify(l.metadata)}</code> : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
