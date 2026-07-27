import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, Star } from "lucide-react";
import toast from "react-hot-toast";

const toastSaved = (msg: string) =>
  toast.success(msg, {
    style: { background: "#16a34a", color: "#fff", fontWeight: 600 },
    iconTheme: { primary: "#fff", secondary: "#16a34a" },
  });
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  uploadSiteMedia, type Testimonial, type TestimonialCategory,
} from "@/lib/site-cms";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsAdmin,
});

const CATEGORIES: TestimonialCategory[] = ["Buyer", "Seller", "Tenant", "Owner", "NRI"];
const EMPTY: Omit<Testimonial, "id"> = {
  name: "", role: "", avatar_url: "", quote: "", rating: 5,
  category: "Buyer", location: "", display_order: 0, is_active: true,
};

function TestimonialsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: () => listTestimonials(false),
  });
  const items = (data ?? []) as Testimonial[];
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [adding, setAdding] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    qc.invalidateQueries({ queryKey: ["site-testimonials", true] });
    qc.invalidateQueries({ queryKey: ["site-testimonials", false] });
  };

  const createM = useMutation({
    mutationFn: (v: Omit<Testimonial, "id">) => createTestimonial(v),
    onSuccess: () => { invalidate(); toastSaved("Added"); setAdding(false); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });
  const updateM = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Testimonial> }) => updateTestimonial(id, patch),
    onSuccess: () => { invalidate(); toastSaved("Saved"); setEditing(null); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });
  const deleteM = useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => { invalidate(); toastSaved("Deleted"); },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Testimonials</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? "Loading…" : `${items.length} testimonials`}
          </p>
        </div>
        <button onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#0a1f44] px-4 py-2 text-sm text-white hover:bg-[#0a1f44]/90">
          <Plus size={14} /> Add testimonial
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.length === 0 && !isLoading && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No testimonials yet. The website is using the default starter set — add your own to override.
          </div>
        )}
        {items.map((t) => (
          <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                {t.avatar_url ? <img src={t.avatar_url} alt={t.name} className="h-full w-full object-cover" /> : t.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate font-semibold text-[#0a1f44]">{t.name}</div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < t.rating ? "fill-current" : "opacity-30"} />
                    ))}
                  </div>
                </div>
                <div className="truncate text-xs text-slate-500">{t.role} · {t.location || "—"}</div>
                <div className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">{t.category}</div>
              </div>
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-slate-600">{t.quote}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <label className="inline-flex cursor-pointer items-center gap-1.5">
                <input type="checkbox" checked={t.is_active}
                  onChange={(e) => updateM.mutate({ id: t.id, patch: { is_active: e.target.checked } })} />
                <span>Active</span>
              </label>
              <div className="flex gap-1">
                <button onClick={() => setEditing(t)} className="grid h-8 w-8 place-items-center rounded text-slate-600 hover:bg-slate-100"><Pencil size={14} /></button>
                <button onClick={() => { if (confirm("Delete this testimonial?")) deleteM.mutate(t.id); }}
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
        title="Add testimonial"
      />
      {editing && (
        <Editor
          open
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={(v) => updateM.mutate({ id: editing.id, patch: v })}
          submitting={updateM.isPending}
          title="Edit testimonial"
        />
      )}
    </div>
  );
}

function Editor({
  open, initial, onClose, onSubmit, submitting, title,
}: {
  open: boolean;
  initial: Omit<Testimonial, "id"> | Testimonial;
  onClose: () => void;
  onSubmit: (v: Omit<Testimonial, "id">) => void;
  submitting: boolean;
  title: string;
}) {
  const [v, setV] = useState(initial);
  const upd = (patch: Partial<typeof v>) => setV((p) => ({ ...p, ...patch }));
  const onPickAvatar = async (file: File | null) => {
    if (!file) return;
    try {
      const url = await uploadSiteMedia(file, "testimonials");
      upd({ avatar_url: url });
      toast.success("Photo uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    }
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-3 text-sm">
          <L label="Name"><input value={v.name} onChange={(e) => upd({ name: e.target.value })} className={inputCls} /></L>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <L label="Role / Title"><input value={v.role} onChange={(e) => upd({ role: e.target.value })} className={inputCls} /></L>
            <L label="Location"><input value={v.location} onChange={(e) => upd({ location: e.target.value })} className={inputCls} /></L>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <L label="Category">
              <select value={v.category} onChange={(e) => upd({ category: e.target.value as TestimonialCategory })} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </L>
            <L label="Rating">
              <select value={v.rating} onChange={(e) => upd({ rating: Number(e.target.value) })} className={inputCls}>
                {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </L>
          </div>
          <L label="Quote"><textarea rows={4} value={v.quote} onChange={(e) => upd({ quote: e.target.value })} className={inputCls} /></L>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          <button disabled={submitting || !v.name || !v.quote}
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
