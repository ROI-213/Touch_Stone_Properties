import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, ImageIcon, UploadCloud, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type Banner, listBanners, createBanner, updateBanner, deleteBanner, reorderBanners,
} from "@/lib/banners";
import { uploadStorageMedia } from "@/lib/site-cms";

export const Route = createFileRoute("/admin/banners")({
  component: BannersPage,
});

const emptyForm = { title: "", subtitle: "", image_url: "", cta_text: "", cta_link: "", is_active: true };

function BannersPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-banners"], queryFn: listBanners });
  const list = data ?? [];

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-banners"] });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form };
      return editing ? updateBanner(editing.id, payload) : createBanner(payload);
    },
    onSuccess: () => { toast.success("Saved"); invalidate(); closeEditor(); },
    onError: (e: any) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      updateBanner(id, { is_active }),
    onSuccess: invalidate,
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => { toast.success("Deleted"); invalidate(); setDeleteId(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const move = async (idx: number, dir: -1 | 1) => {
    const newList = [...list];
    const swap = idx + dir;
    if (swap < 0 || swap >= newList.length) return;
    [newList[idx], newList[swap]] = [newList[swap], newList[idx]];
    await reorderBanners(newList.map((b) => b.id));
    invalidate();
  };

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setEditorOpen(true);
  }
  function openEdit(b: Banner) {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle ?? "",
      image_url: b.image_url ?? "",
      cta_text: b.cta_text ?? "",
      cta_link: b.cta_link ?? "",
      is_active: b.is_active,
    });
    setEditorOpen(true);
  }
  function closeEditor() {
    setEditorOpen(false);
    setEditing(null);
    setForm(emptyForm);
  }

  const MAX_BANNER_BYTES = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  async function uploadBannerImage(file: File | null) {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG, or WEBP images are allowed");
      return;
    }
    if (file.size > MAX_BANNER_BYTES) {
      toast.error("Image must be 5MB or smaller");
      return;
    }
    setUploading(true);
    const previousUrl = form.image_url;
    try {
      const url = await uploadStorageMedia("banners", file, "home-banners");
      setForm((f) => ({ ...f, image_url: url }));
      toast.success("Image uploaded");
      // Best-effort cleanup of the previously uploaded file
      if (previousUrl && previousUrl !== url) {
        deleteBannerStorageObject(previousUrl).catch((err) => console.warn("Old banner cleanup failed", err));
      }
    } catch (e: any) {
      console.error("Banner upload failed", e);
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Banners</h1>
          <p className="mt-1 text-sm text-slate-500">Home page hero banners. Use arrows to reorder.</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#c9a961] px-4 py-2 text-sm font-medium text-white hover:bg-[#b89651]"
        >
          <Plus size={15} /> New Banner
        </button>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-3 w-24">Order</th>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">CTA</th>
              <th className="p-3">Active</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="p-10 text-center text-slate-400">Loading…</td></tr>}
            {!isLoading && list.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-slate-400">No banners yet.</td></tr>
            )}
            {list.map((b, i) => (
              <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => move(i, -1)} disabled={i === 0}
                      className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                      <ArrowUp size={13} />
                    </button>
                    <span className="text-xs text-slate-500">{i + 1}</span>
                    <button onClick={() => move(i, 1)} disabled={i === list.length - 1}
                      className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  {b.image_url ? (
                    <img src={b.image_url} alt="" className="h-12 w-20 rounded object-cover" />
                  ) : (
                    <div className="grid h-12 w-20 place-items-center rounded bg-slate-100 text-slate-400">
                      <ImageIcon size={14} />
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div className="font-medium text-[#0a1f44]">{b.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{b.subtitle}</div>
                </td>
                <td className="p-3 text-xs text-slate-600">
                  {b.cta_text
                    ? <><div className="font-medium">{b.cta_text}</div><div className="text-slate-400 truncate max-w-[180px]">{b.cta_link}</div></>
                    : "—"}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggle.mutate({ id: b.id, is_active: !b.is_active })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${b.is_active ? "bg-[#c9a961]" : "bg-slate-300"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${b.is_active ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(b)} className="grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-slate-100">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteId(b.id)} className="grid h-8 w-8 place-items-center rounded-md text-red-500 hover:bg-red-50">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={editorOpen} onOpenChange={(o) => { if (!o) closeEditor(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Banner" : "New Banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Title *</label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Subtitle</label>
              <Textarea rows={2} value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Upload Banner Image *</label>
              <BannerImageUpload
                value={form.image_url}
                uploading={uploading}
                onPick={(file) => uploadBannerImage(file)}
                onClear={() => setForm((f) => ({ ...f, image_url: "" }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600">CTA Text</label>
                <Input value={form.cta_text} onChange={(e) => setForm((f) => ({ ...f, cta_text: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">CTA Link</label>
                <Input value={form.cta_link} onChange={(e) => setForm((f) => ({ ...f, cta_link: e.target.value }))} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
              Active
            </label>
          </div>
          <DialogFooter>
            <button onClick={closeEditor} className="rounded-md border border-slate-200 px-4 py-2 text-sm">Cancel</button>
            <button
              disabled={!form.title || !form.image_url || save.isPending || uploading}
              onClick={() => save.mutate()}
              className="rounded-md bg-[#c9a961] px-4 py-2 text-sm text-white hover:bg-[#b89651] disabled:opacity-50"
            >{uploading ? "Uploading…" : save.isPending ? "Saving…" : "Save"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this banner?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => deleteId && remove.mutate(deleteId)}
            >Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

async function deleteBannerStorageObject(url: string) {
  // Expecting URLs like .../storage/v1/object/(sign|public)/banners/<path>?...
  const match = url.match(/\/storage\/v1\/object\/(?:sign|public)\/banners\/([^?]+)/);
  if (!match) return;
  const path = decodeURIComponent(match[1]);
  await supabase.storage.from("banners").remove([path]);
}

function BannerImageUpload({
  value,
  uploading,
  onPick,
  onClear,
}: {
  value: string;
  uploading: boolean;
  onPick: (file: File) => void;
  onClear: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputId = "banner-image-input";

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onPick(file);
  }

  return (
    <div className="mt-1">
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-slate-200">
          <img src={value} alt="Banner preview" className="h-44 w-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 grid place-items-center bg-black/40 text-white text-xs">
              <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</span>
            </div>
          )}
          <div className="absolute right-2 top-2 flex gap-1">
            <label htmlFor={inputId} className="cursor-pointer rounded-md bg-white/90 px-2 py-1 text-[11px] font-medium text-slate-700 shadow hover:bg-white">
              Replace
            </label>
            <button
              type="button"
              onClick={onClear}
              className="grid h-7 w-7 place-items-center rounded-md bg-white/90 text-slate-700 shadow hover:bg-white"
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition ${
            dragOver ? "border-[#c9a961] bg-[#c9a961]/10" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
          }`}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          ) : (
            <UploadCloud className="h-7 w-7 text-slate-400" />
          )}
          <div className="text-sm font-medium text-slate-700">
            {uploading ? "Uploading…" : "Click to upload banner image"}
          </div>
          <div className="text-[11px] text-slate-500">
            Drag & drop or click · JPG, JPEG, PNG, WEBP · Max 5MB
          </div>
        </label>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}
