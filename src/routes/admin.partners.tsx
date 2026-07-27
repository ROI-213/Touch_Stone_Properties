import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  listPartners, createPartner, updatePartner, deletePartner,
  uploadSiteMedia, type Partner,
  getPartnersSection, updatePartnersSection, PARTNERS_SECTION_DEFAULTS, type PartnersSection,
} from "@/lib/site-cms";
import { resolveLocalImage } from "@/data/siteImages";

export const Route = createFileRoute("/admin/partners")({
  component: PartnersAdmin,
});

const EMPTY: Omit<Partner, "id"> = {
  name: "", logo_url: "", website: "", display_order: 0, is_active: true,
};

function PartnersAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-partners"], queryFn: () => listPartners(false) });
  const items = (data ?? []) as Partner[];
  const [editing, setEditing] = useState<Partner | null>(null);
  const [adding, setAdding] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-partners"] });
    qc.invalidateQueries({ queryKey: ["site-partners", true] });
    qc.invalidateQueries({ queryKey: ["site-partners", false] });
  };

  const createM = useMutation({
    mutationFn: (v: Omit<Partner, "id">) => createPartner(v),
    onSuccess: () => { invalidate(); toast.success("Added"); setAdding(false); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });
  const updateM = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Partner> }) => updatePartner(id, patch),
    onSuccess: () => { invalidate(); toast.success("Saved"); setEditing(null); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });
  const deleteM = useMutation({
    mutationFn: (id: string) => deletePartner(id),
    onSuccess: () => { invalidate(); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Associated Partners</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? "Loading…" : `${items.length} partners`}
          </p>
        </div>
        <button onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#0a1f44] px-4 py-2 text-sm text-white hover:bg-[#0a1f44]/90">
          <Plus size={14} /> Add partner
        </button>
      </div>

      <SectionEditor />



      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.length === 0 && !isLoading && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No partners yet. The website is using the default starter logos — add your own to override.
          </div>
        )}
        {items.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex h-20 items-center justify-center rounded-lg bg-slate-50">
              {p.logo_url
                ? <img src={resolveLocalImage(p.logo_url, "")} alt={p.name} className="max-h-14 max-w-[80%] object-contain" />
                : <span className="text-xs text-slate-400">No logo</span>}
            </div>
            <div className="mt-3 font-semibold text-[#0a1f44]">{p.name}</div>
            {p.website && <div className="truncate text-xs text-slate-500">{p.website}</div>}
            <div className="mt-3 flex items-center justify-between text-xs">
              <label className="inline-flex cursor-pointer items-center gap-1.5">
                <input type="checkbox" checked={p.is_active}
                  onChange={(e) => updateM.mutate({ id: p.id, patch: { is_active: e.target.checked } })} />
                <span>Active</span>
              </label>
              <div className="flex gap-1">
                <button onClick={() => setEditing(p)} className="grid h-8 w-8 place-items-center rounded text-slate-600 hover:bg-slate-100"><Pencil size={14} /></button>
                <button onClick={() => { if (confirm("Delete this partner?")) deleteM.mutate(p.id); }}
                  className="grid h-8 w-8 place-items-center rounded text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Editor
        open={adding}
        initial={EMPTY}
        onClose={() => setAdding(false)}
        onSubmit={(v) => createM.mutate(v)}
        submitting={createM.isPending}
        title="Add partner"
      />
      {editing && (
        <Editor
          open
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={(v) => updateM.mutate({ id: editing.id, patch: v })}
          submitting={updateM.isPending}
          title="Edit partner"
        />
      )}
    </div>
  );
}

function Editor({
  open, initial, onClose, onSubmit, submitting, title,
}: {
  open: boolean;
  initial: Omit<Partner, "id"> | Partner;
  onClose: () => void;
  onSubmit: (v: Omit<Partner, "id">) => void;
  submitting: boolean;
  title: string;
}) {
  const [v, setV] = useState(initial);
  const upd = (patch: Partial<typeof v>) => setV((p) => ({ ...p, ...patch }));
  const onPickLogo = async (file: File | null) => {
    if (!file) return;
    try {
      const url = await uploadSiteMedia(file, "partners");
      upd({ logo_url: url });
      toast.success("Logo uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    }
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-3 text-sm">
          <L label="Name">
            <input value={v.name} onChange={(e) => upd({ name: e.target.value })} className={inputCls} />
          </L>
          <L label="Website">
            <input value={v.website ?? ""} onChange={(e) => upd({ website: e.target.value })} placeholder="https://…" className={inputCls} />
          </L>
          <L label="Logo">
            <div className="flex items-center gap-3">
              {v.logo_url && <img src={resolveLocalImage(v.logo_url, "")} alt="" className="h-12 w-20 rounded object-contain bg-slate-50" />}
              <input type="file" accept="image/*" onChange={(e) => onPickLogo(e.target.files?.[0] ?? null)} className="text-xs" />
            </div>
          </L>
          <div className="grid grid-cols-2 gap-3">
            <L label="Display order">
              <input type="number" value={v.display_order} onChange={(e) => upd({ display_order: Number(e.target.value) })} className={inputCls} />
            </L>
            <L label="Active">
              <label className="inline-flex items-center gap-2 pt-2">
                <input type="checkbox" checked={v.is_active} onChange={(e) => upd({ is_active: e.target.checked })} />
                <span>Show on website</span>
              </label>
            </L>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm">Cancel</button>
          <button disabled={submitting || !v.name}
            onClick={() => onSubmit(v)}
            className="rounded-md bg-[#0a1f44] px-4 py-2 text-sm text-white disabled:opacity-50">
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const inputCls = "w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#c9a961]";
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function SectionEditor() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["partners-section-admin"], queryFn: getPartnersSection });
  const [v, setV] = useState<PartnersSection>(PARTNERS_SECTION_DEFAULTS);
  const [dirty, setDirty] = useState(false);
  const initialized = useState({ done: false })[0];
  if (data && !initialized.done) { initialized.done = true; setV({ ...PARTNERS_SECTION_DEFAULTS, ...data }); }
  const upd = (patch: Partial<PartnersSection>) => { setV((p) => ({ ...p, ...patch })); setDirty(true); };
  const save = useMutation({
    mutationFn: () => updatePartnersSection(v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partners-section-admin"] });
      qc.invalidateQueries({ queryKey: ["site-partners-section"] });
      setDirty(false);
      toast.success("Section saved");
    },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });
  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-[#0a1f44]">Section Content</h2>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={v.is_section_active} onChange={(e) => upd({ is_section_active: e.target.checked })} />
          Show section on website
        </label>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="mb-1 block text-xs font-medium text-slate-600">Small label</span>
          <input value={v.small_label} onChange={(e) => upd({ small_label: e.target.value })} className={inputCls} /></label>
        <label className="block"><span className="mb-1 block text-xs font-medium text-slate-600">Main heading</span>
          <input value={v.heading} onChange={(e) => upd({ heading: e.target.value })} className={inputCls} /></label>
        <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-medium text-slate-600">Subtitle</span>
          <textarea rows={2} value={v.subtitle} onChange={(e) => upd({ subtitle: e.target.value })} className={inputCls} /></label>
        <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-medium text-slate-600">Bottom quote</span>
          <textarea rows={2} value={v.bottom_quote} onChange={(e) => upd({ bottom_quote: e.target.value })} className={inputCls} /></label>
      </div>
      <div className="mt-4 flex justify-end">
        <button disabled={!dirty || save.isPending} onClick={() => save.mutate()}
          className="rounded-md bg-[#0a1f44] px-4 py-2 text-sm text-white disabled:opacity-50">
          {save.isPending ? "Saving…" : "Save section"}
        </button>
      </div>
    </div>
  );
}
