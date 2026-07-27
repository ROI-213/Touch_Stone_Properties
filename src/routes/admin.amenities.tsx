import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { listAmenities, upsertAmenity, deleteAmenity } from "@/lib/admin-properties";
import { Input, Modal } from "./admin.builders";

export const Route = createFileRoute("/admin/amenities")({
  component: AmenitiesPage,
});

function AmenitiesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-amenities"], queryFn: listAmenities });
  const [editing, setEditing] = useState<any | null>(null);

  const save = useMutation({
    mutationFn: upsertAmenity,
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-amenities"] }); setEditing(null); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: deleteAmenity,
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-amenities"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Amenities</h1>
          <p className="mt-1 text-sm text-slate-500">{data?.length ?? 0} amenities</p>
        </div>
        <button onClick={() => setEditing({})} className="inline-flex items-center gap-1.5 rounded-md bg-[#c9a961] px-4 py-2 text-sm font-medium text-white hover:bg-[#b89651]">
          <Plus size={15} /> Add Amenity
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading && <div className="col-span-full text-sm text-slate-400">Loading…</div>}
        {!isLoading && data?.length === 0 && <div className="col-span-full text-sm text-slate-400">No amenities yet.</div>}
        {data?.map((a: any) => (
          <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
            <div>
              <div className="text-sm font-medium text-[#0a1f44]">{a.name}</div>
              {a.category && <div className="text-[11px] text-slate-400">{a.category}</div>}
            </div>
            <div className="flex">
              <button onClick={() => setEditing(a)} className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-100"><Edit2 size={12} /></button>
              <button onClick={() => { if (confirm(`Delete ${a.name}?`)) del.mutate(a.id); }} className="grid h-7 w-7 place-items-center rounded text-red-500 hover:bg-red-50"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Amenity" : "New Amenity"}>
          <AmenityForm initial={editing} onSubmit={(v: any) => save.mutate(v)} submitting={save.isPending} />
        </Modal>
      )}
    </div>
  );
}

function AmenityForm({ initial, onSubmit, submitting }: any) {
  const [v, setV] = useState({ name: "", icon: "", category: "", ...initial });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(v); }} className="space-y-3">
      <Input label="Name *" value={v.name} onChange={(x: any) => setV({ ...v, name: x })} required />
      <Input label="Icon (lucide name)" value={v.icon || ""} onChange={(x: any) => setV({ ...v, icon: x })} />
      <Input label="Category" value={v.category || ""} onChange={(x: any) => setV({ ...v, category: x })} />
      <button disabled={submitting} className="w-full rounded-md bg-[#c9a961] py-2 text-sm font-medium text-white hover:bg-[#b89651] disabled:opacity-50">
        {submitting ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
