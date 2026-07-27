import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { listLocations, upsertLocation, deleteLocation } from "@/lib/admin-properties";
import { Input, Modal } from "./admin.builders";

export const Route = createFileRoute("/admin/locations")({
  component: LocationsPage,
});

function LocationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-locations"], queryFn: listLocations });
  const [editing, setEditing] = useState<any | null>(null);

  const save = useMutation({
    mutationFn: upsertLocation,
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-locations"] }); setEditing(null); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-locations"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Areas / Locations</h1>
          <p className="mt-1 text-sm text-slate-500">{data?.length ?? 0} locations</p>
        </div>
        <button onClick={() => setEditing({})} className="inline-flex items-center gap-1.5 rounded-md bg-[#c9a961] px-4 py-2 text-sm font-medium text-white hover:bg-[#b89651]">
          <Plus size={15} /> Add Location
        </button>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Zone</th><th className="p-3">Locality</th><th className="p-3">City</th><th className="p-3">Active</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading…</td></tr>}
            {!isLoading && data?.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400">No locations yet.</td></tr>}
            {data?.map((l: any) => (
              <tr key={l.id} className="border-t border-slate-100">
                <td className="p-3"><span className="rounded-full bg-[#0a1f44]/5 px-2 py-0.5 text-[11px] font-medium text-[#0a1f44]">{l.zone}</span></td>
                <td className="p-3 font-medium text-[#0a1f44]">{l.locality}</td>
                <td className="p-3 text-slate-600">{l.city}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[11px] ${l.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{l.active ? "Active" : "Inactive"}</span></td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing(l)} className="mr-1 grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-slate-100 inline-grid"><Edit2 size={14} /></button>
                  <button onClick={() => { if (confirm(`Delete ${l.locality}?`)) del.mutate(l.id); }} className="grid h-8 w-8 place-items-center rounded-md text-red-500 hover:bg-red-50 inline-grid"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Location" : "New Location"}>
          <LocationForm initial={editing} onSubmit={(v: any) => save.mutate(v)} submitting={save.isPending} />
        </Modal>
      )}
    </div>
  );
}

function LocationForm({ initial, onSubmit, submitting }: any) {
  const [v, setV] = useState({ city: "Bangalore", zone: "East", locality: "", active: true, display_order: 0, ...initial });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(v); }} className="space-y-3">
      <Input label="City" value={v.city} onChange={(x: any) => setV({ ...v, city: x })} />
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-slate-500">Zone *</label>
        <select value={v.zone} onChange={(e) => setV({ ...v, zone: e.target.value })} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
          {["East", "West", "North", "South", "Central"].map((z) => <option key={z}>{z}</option>)}
        </select>
      </div>
      <Input label="Locality *" value={v.locality} onChange={(x: any) => setV({ ...v, locality: x })} required />
      <div className="flex items-center gap-4">
        <Input label="Display Order" type="number" value={v.display_order} onChange={(x: any) => setV({ ...v, display_order: Number(x) || 0 })} />
        <label className="mt-5 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} className="h-4 w-4 accent-[#c9a961]" /> Active
        </label>
      </div>
      <button disabled={submitting} className="w-full rounded-md bg-[#c9a961] py-2 text-sm font-medium text-white hover:bg-[#b89651] disabled:opacity-50">
        {submitting ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
