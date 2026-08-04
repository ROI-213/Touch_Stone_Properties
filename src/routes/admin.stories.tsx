import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, X, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  listSuccessStories, createSuccessStory, updateSuccessStory, deleteSuccessStory,
  uploadStorageMedia, slugifyStory,
  type SuccessStoryRow, type SuccessStoryType, type SuccessService,
} from "@/lib/site-cms";

export const Route = createFileRoute("/admin/stories")({
  component: StoriesAdmin,
});

const TYPES: SuccessStoryType[] = ["Buy", "Sell", "Rent", "Property Management", "Custom"];

const EMPTY: Omit<SuccessStoryRow, "id"> = {
  title: "", slug: "", client: "", client_label: "", image_url: "",
  images: [], summary: "", body: "", category: "", badge_text: "",
  story_type: "Buy", location: "", cta_text: "View Story", button_text: "",
  contact_button_link: "/contact-us", whatsapp_number: "", whatsapp_link: "",
  services_provided: [],
  display_order: 0, is_active: true,
};

function StoriesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-stories"], queryFn: () => listSuccessStories(false) });
  const items = (data ?? []) as SuccessStoryRow[];
  const [editing, setEditing] = useState<SuccessStoryRow | null>(null);
  const [adding, setAdding] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-stories"] });
    qc.invalidateQueries({ queryKey: ["site-stories", true] });
    qc.invalidateQueries({ queryKey: ["site-stories", false] });
  };

  const createM = useMutation({
    mutationFn: (v: Omit<SuccessStoryRow, "id">) => createSuccessStory(v),
    onSuccess: () => { invalidate(); toast.success("Added"); setAdding(false); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });
  const updateM = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<SuccessStoryRow> }) => updateSuccessStory(id, patch),
    onSuccess: () => { invalidate(); toast.success("Saved"); setEditing(null); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });
  const deleteM = useMutation({
    mutationFn: (id: string) => deleteSuccessStory(id),
    onSuccess: () => { invalidate(); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const reorder = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    const me = items[idx];
    await updateSuccessStory(me.id, { display_order: swap.display_order });
    await updateSuccessStory(swap.id, { display_order: me.display_order });
    invalidate();
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Success Stories</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? "Loading…" : `${items.length} stories`} · Drag-style reorder via the up/down arrows.
          </p>
        </div>
        <button onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#0a1f44] px-4 py-2 text-sm text-white hover:bg-[#0a1f44]/90">
          <Plus size={14} /> Add story
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.length === 0 && !isLoading && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No success stories yet. The website uses the default starter set — add your own to override.
          </div>
        )}
        {items.map((s, i) => (
          <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-4">
            {s.images[0] && (
              <img src={s.images[0]} alt={s.title} className="mb-3 h-40 w-full rounded-lg object-cover" />
            )}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate font-semibold text-[#0a1f44]">{s.title}</div>
                <div className="truncate text-xs text-slate-500">{s.client} · {s.location}</div>
                <div className="mt-1 text-[10px] text-slate-400">/{s.slug}</div>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">{s.story_type}</span>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-slate-600">{s.summary}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <label className="inline-flex cursor-pointer items-center gap-1.5">
                <input type="checkbox" checked={s.is_active}
                  onChange={(e) => updateM.mutate({ id: s.id, patch: { is_active: e.target.checked } })} />
                <span>Active</span>
              </label>
              <div className="flex items-center gap-1">
                <button onClick={() => reorder(s.id, -1)} disabled={i === 0}
                  className="grid h-8 w-8 place-items-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30" title="Move up">
                  <GripVertical size={14} className="rotate-90" />↑
                </button>
                <button onClick={() => reorder(s.id, 1)} disabled={i === items.length - 1}
                  className="grid h-8 w-8 place-items-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30" title="Move down">
                  ↓
                </button>
                <button onClick={() => setEditing(s)} className="grid h-8 w-8 place-items-center rounded text-slate-600 hover:bg-slate-100"><Pencil size={14} /></button>
                <button onClick={() => { if (confirm(`Delete "${s.title}"? This cannot be undone.`)) deleteM.mutate(s.id); }}
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
        title="Add story"
      />
      {editing && (
        <Editor
          open
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={(v) => updateM.mutate({ id: editing.id, patch: v })}
          submitting={updateM.isPending}
          title="Edit story"
        />
      )}
    </div>
  );
}

function Editor({
  open, initial, onClose, onSubmit, submitting, title,
}: {
  open: boolean;
  initial: Omit<SuccessStoryRow, "id"> | SuccessStoryRow;
  onClose: () => void;
  onSubmit: (v: Omit<SuccessStoryRow, "id">) => void;
  submitting: boolean;
  title: string;
}) {
  const [v, setV] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const upd = (patch: Partial<typeof v>) => setV((p) => ({ ...p, ...patch }));

  const slots: [string, string, string] = [v.images[0] ?? "", v.images[1] ?? "", v.images[2] ?? ""];
  const commitSlots = (next: [string, string, string]) => {
    // Strip trailing empties, preserve positions of earlier ones with "" placeholder removed only at the tail
    let end = 2;
    while (end >= 0 && !next[end]) end--;
    const trimmed = next.slice(0, end + 1);
    upd({ images: trimmed, image_url: next[0] || "" });
  };
  const setSlot = async (slot: 0 | 1 | 2, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { toast.error("Only JPG, PNG, or WebP allowed"); return; }
    setUploading(true);
    try {
      const url = await uploadStorageMedia("success-stories", file, "stories");
      const next: [string, string, string] = [slots[0], slots[1], slots[2]];
      next[slot] = url;
      commitSlots(next);
      toast.success(`Image ${slot + 1} uploaded`);
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };
  const clearSlot = (slot: 0 | 1 | 2) => {
    const next: [string, string, string] = [slots[0], slots[1], slots[2]];
    next[slot] = "";
    commitSlots(next);
  };

  const setService = (idx: number, patch: Partial<SuccessService>) => {
    const next = [...v.services_provided];
    next[idx] = { ...next[idx], ...patch };
    upd({ services_provided: next });
  };
  const addService = () => upd({ services_provided: [...v.services_provided, { name: "", icon: "check", active: true }] });
  const removeService = (idx: number) => upd({ services_provided: v.services_provided.filter((_, i) => i !== idx) });

  const computedSlug = v.slug?.trim() ? v.slug : slugifyStory(v.title || "");

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="max-h-[75vh] space-y-3 overflow-y-auto pr-1 text-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <L label="Story title"><input value={v.title} onChange={(e) => upd({ title: e.target.value })} className={inputCls} /></L>
            <L label="Slug (URL)"><input value={v.slug ?? ""} placeholder={computedSlug} onChange={(e) => upd({ slug: e.target.value })} className={inputCls} /></L>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <L label="Story type">
              <select value={v.story_type} onChange={(e) => upd({ story_type: e.target.value as SuccessStoryType })} className={inputCls}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </L>
            <L label="Badge text"><input value={v.badge_text ?? ""} placeholder={v.story_type} onChange={(e) => upd({ badge_text: e.target.value })} className={inputCls} /></L>
            <L label="Category"><input value={v.category ?? ""} onChange={(e) => upd({ category: e.target.value })} className={inputCls} /></L>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <L label="Client name"><input value={v.client ?? ""} onChange={(e) => upd({ client: e.target.value })} className={inputCls} /></L>
            <L label="Client role / label"><input value={v.client_label ?? ""} onChange={(e) => upd({ client_label: e.target.value })} className={inputCls} /></L>
          </div>
          <L label="Location"><input value={v.location ?? ""} onChange={(e) => upd({ location: e.target.value })} className={inputCls} /></L>
          <L label="Short summary"><textarea rows={2} value={v.summary ?? ""} onChange={(e) => upd({ summary: e.target.value })} className={inputCls} /></L>
          <L label="Full story description"><textarea rows={6} value={v.body ?? ""} onChange={(e) => upd({ body: e.target.value })} className={inputCls} /></L>

          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              Story images (3 separate slots)
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {([0, 1, 2] as const).map((i) => {
                const url = slots[i];
                const label = i === 0 ? "Image 1 · Main / Hero" : i === 1 ? "Image 2 · Gallery" : "Image 3 · Gallery";
                const inputId = `story-img-${i}`;
                return (
                  <div key={i} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                    <p className="mb-2 text-[11px] font-semibold text-slate-600">{label}</p>
                    {url ? (
                      <div className="relative">
                        <img src={url} alt="" className="h-28 w-full rounded object-cover" />
                        <button type="button" onClick={() => clearSlot(i)} title="Remove image"
                          className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white hover:bg-red-600">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="grid h-28 w-full place-items-center rounded border border-dashed border-slate-300 text-[11px] text-slate-400">
                        No image
                      </div>
                    )}
                    <div className="mt-2">
                      <label htmlFor={inputId}
                        className="block cursor-pointer rounded border border-slate-300 bg-white px-2 py-1 text-center text-[11px] font-medium text-slate-700 hover:bg-slate-100">
                        {url ? "Replace" : "Upload"}
                      </label>
                      <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp"
                        disabled={uploading} className="hidden"
                        onChange={(e) => { setSlot(i, e.target.files); e.target.value = ""; }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {uploading && <p className="mt-2 text-xs text-amber-600">Uploading…</p>}
            <p className="mt-2 text-[11px] text-slate-500">
              Image 1 is required (hero). Images 2 & 3 are optional gallery slots and can be removed individually.
            </p>
          </div>


          <L label="Services provided">
            <div className="space-y-2">
              {v.services_provided.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={s.name} placeholder="Service name"
                    onChange={(e) => setService(i, { name: e.target.value })}
                    className={inputCls + " flex-1"} />
                  <input value={s.icon ?? "check"} placeholder="icon"
                    onChange={(e) => setService(i, { icon: e.target.value })}
                    className={inputCls + " w-24"} />
                  <label className="inline-flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={s.active !== false}
                      onChange={(e) => setService(i, { active: e.target.checked })} />
                    On
                  </label>
                  <button type="button" onClick={() => removeService(i)}
                    className="grid h-8 w-8 place-items-center rounded text-red-500 hover:bg-red-50">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addService}
                className="inline-flex items-center gap-1 rounded border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                <Plus size={12} /> Add service
              </button>
            </div>
          </L>

          <div className="grid grid-cols-2 gap-3">
            <L label="Card button label"><input value={v.cta_text ?? ""} onChange={(e) => upd({ cta_text: e.target.value })} className={inputCls} /></L>
            <L label="Detail page button label"><input value={v.button_text ?? ""} placeholder="Contact Us" onChange={(e) => upd({ button_text: e.target.value })} className={inputCls} /></L>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <L label="Contact button link"><input value={v.contact_button_link ?? ""} placeholder="/contact-us" onChange={(e) => upd({ contact_button_link: e.target.value })} className={inputCls} /></L>
            <L label="WhatsApp number"><input value={v.whatsapp_number ?? ""} placeholder="919902925519" onChange={(e) => upd({ whatsapp_number: e.target.value })} className={inputCls} /></L>
          </div>
          <L label="WhatsApp link (overrides number if set)">
            <input value={v.whatsapp_link ?? ""} placeholder="https://wa.me/919902925519" onChange={(e) => upd({ whatsapp_link: e.target.value })} className={inputCls} />
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
          <button disabled={submitting || uploading || !v.title}
            onClick={() => onSubmit(v)}
            className="rounded-md bg-[#0a1f44] px-4 py-2 text-sm text-white disabled:opacity-50">
            {submitting ? "Saving…" : uploading ? "Uploading…" : "Save"}
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
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  );
}
