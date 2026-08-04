import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAboutPageContent, updateAboutPageContent,
  uploadSiteMedia, logActivity, type AboutPageContent,
} from "@/lib/site-cms";

export const Route = createFileRoute("/admin/about-page")({
  component: AboutPageAdmin,
});

const inputCls = "w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#c9a961]";

function AboutPageAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-about-page"],
    queryFn: getAboutPageContent,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
  const [v, setV] = useState<AboutPageContent | null>(null);
  // Hydrate the form once. Prevents background refetches (e.g. realtime
  // invalidations) from clobbering unsaved edits with stale server data.
  useEffect(() => { if (data && v === null) setV(data); }, [data, v]);

  const save = useMutation({
    mutationFn: async (val: AboutPageContent) => {
      const saved = await updateAboutPageContent(val);
      await logActivity({ action: "update", entity: "about_page_content" });
      return saved;
    },
    onSuccess: (val) => {
      toast.success("About Us content saved successfully.");
      setV(val);
      qc.setQueryData(["admin-about-page"], val);
      qc.invalidateQueries({ queryKey: ["admin-about-page"] });
      qc.invalidateQueries({ queryKey: ["site-about-page"] });
    },
    onError: (e: any) => toast.error(e.message || "Save failed"),
  });

  if (!v) {
    return <div className="p-6 text-sm text-slate-500">Loading About Us content…</div>;
  }

  const setBlock = <K extends keyof AboutPageContent>(k: K, patch: Partial<AboutPageContent[K]>) =>
    setV((p) => (p ? { ...p, [k]: { ...p[k], ...patch } } : p));

  const uploadInto = async (file: File | null, onUrl: (url: string) => void, folder = "about") => {
    if (!file) return;
    try { onUrl(await uploadSiteMedia(file, folder)); toast.success("Uploaded"); }
    catch (e: any) { toast.error(e.message || "Upload failed"); }
  };

  // Sort sections by order for admin display
  const sectionKeys = (Object.keys(v) as (keyof AboutPageContent)[])
    .sort((a, b) => (v[a].order ?? 0) - (v[b].order ?? 0));

  const moveSection = (k: keyof AboutPageContent, dir: -1 | 1) => {
    const arr = sectionKeys.slice();
    const i = arr.indexOf(k);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    const next = { ...v };
    const a = arr[i], b = arr[j];
    const oa = next[a].order, ob = next[b].order;
    (next[a] as any).order = ob;
    (next[b] as any).order = oa;
    setV(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">About Us Page</h1>
          <p className="mt-1 text-sm text-slate-500">Manage every section of the public /about-us page. Drag the order with arrows.</p>
        </div>
        <button onClick={() => save.mutate(v)} disabled={save.isPending}
          className="rounded-md bg-[#0a1f44] px-5 py-2 text-sm text-white disabled:opacity-50">
          {save.isPending ? "Saving…" : "Save all changes"}
        </button>
      </div>

      {sectionKeys.map((k) => (
        <SectionShell
          key={k}
          title={titleFor(k)}
          active={v[k].active}
          order={v[k].order}
          onMoveUp={() => moveSection(k, -1)}
          onMoveDown={() => moveSection(k, 1)}
          onToggleActive={(active) => setBlock(k, { active } as any)}
        >
          {k === "hero" && (
            <Grid2>
              <L label="Title"><input className={inputCls} value={v.hero.title} onChange={(e) => setBlock("hero", { title: e.target.value })} /></L>
              <L label="Breadcrumb"><input className={inputCls} value={v.hero.breadcrumb} onChange={(e) => setBlock("hero", { breadcrumb: e.target.value })} /></L>
              <L label="Subtitle" full><textarea rows={2} className={inputCls} value={v.hero.subtitle} onChange={(e) => setBlock("hero", { subtitle: e.target.value })} /></L>
              <ImagePicker label="Hero background image" url={v.hero.image_url}
                onUpload={(f) => uploadInto(f, (url) => setBlock("hero", { image_url: url }))}
                onClear={() => setBlock("hero", { image_url: "" })} />
            </Grid2>
          )}

          {k === "intro" && (
            <>
              <Grid2>
                <L label="Label"><input className={inputCls} value={v.intro.label} onChange={(e) => setBlock("intro", { label: e.target.value })} /></L>
                <L label="Title"><input className={inputCls} value={v.intro.title} onChange={(e) => setBlock("intro", { title: e.target.value })} /></L>
                <L label="CTA label"><input className={inputCls} value={v.intro.cta_label} onChange={(e) => setBlock("intro", { cta_label: e.target.value })} /></L>
                <L label="CTA link"><input className={inputCls} value={v.intro.cta_href} onChange={(e) => setBlock("intro", { cta_href: e.target.value })} /></L>
                <L label="Badge title"><input className={inputCls} value={v.intro.badge_title} onChange={(e) => setBlock("intro", { badge_title: e.target.value })} /></L>
                <L label="Badge subtitle"><input className={inputCls} value={v.intro.badge_subtitle} onChange={(e) => setBlock("intro", { badge_subtitle: e.target.value })} /></L>
                <ImagePicker label="Primary image" url={v.intro.image1_url}
                  onUpload={(f) => uploadInto(f, (url) => setBlock("intro", { image1_url: url }))}
                  onClear={() => setBlock("intro", { image1_url: "" })} />
                <ImagePicker label="Secondary image" url={v.intro.image2_url}
                  onUpload={(f) => uploadInto(f, (url) => setBlock("intro", { image2_url: url }))}
                  onClear={() => setBlock("intro", { image2_url: "" })} />
              </Grid2>
              <StringList label="Bullet paragraphs" items={v.intro.bullets} onChange={(bullets) => setBlock("intro", { bullets })} />
              <Repeater
                label="Highlight points"
                items={v.intro.points}
                empty={{ icon: "ShieldCheck", text: "" }}
                onChange={(points) => setBlock("intro", { points })}
                cols={2}
                render={(it, set) => (
                  <>
                    <input className={inputCls} placeholder="Icon (lucide name)" value={it.icon} onChange={(e) => set({ icon: e.target.value })} />
                    <input className={inputCls} placeholder="Text" value={it.text} onChange={(e) => set({ text: e.target.value })} />
                  </>
                )}
              />
            </>
          )}

          {k === "mvv" && (
            <>
              <Grid2>
                <L label="Heading"><input className={inputCls} value={v.mvv.heading} onChange={(e) => setBlock("mvv", { heading: e.target.value })} /></L>
                <L label="Subheading"><input className={inputCls} value={v.mvv.subheading} onChange={(e) => setBlock("mvv", { subheading: e.target.value })} /></L>
              </Grid2>
              <Repeater
                label="Cards (Mission / Vision / Values)"
                items={v.mvv.cards}
                empty={{ icon: "Target", title: "", body: "" }}
                onChange={(cards) => setBlock("mvv", { cards })}
                cols={3}
                render={(it, set) => (
                  <>
                    <input className={inputCls} placeholder="Icon" value={it.icon} onChange={(e) => set({ icon: e.target.value })} />
                    <input className={inputCls} placeholder="Title" value={it.title} onChange={(e) => set({ title: e.target.value })} />
                    <input className={inputCls} placeholder="Body" value={it.body} onChange={(e) => set({ body: e.target.value })} />
                  </>
                )}
              />
            </>
          )}

          {k === "trust" && (
            <>
              <Grid2>
                <L label="Label"><input className={inputCls} value={v.trust.label} onChange={(e) => setBlock("trust", { label: e.target.value })} /></L>
                <L label="Title"><input className={inputCls} value={v.trust.title} onChange={(e) => setBlock("trust", { title: e.target.value })} /></L>
                <L label="Banner text" full><input className={inputCls} value={v.trust.banner_text} onChange={(e) => setBlock("trust", { banner_text: e.target.value })} /></L>
                <ImagePicker label="Side image" url={v.trust.image_url}
                  onUpload={(f) => uploadInto(f, (url) => setBlock("trust", { image_url: url }))}
                  onClear={() => setBlock("trust", { image_url: "" })} />
              </Grid2>
              <StringList label="Trust points" items={v.trust.points} onChange={(points) => setBlock("trust", { points })} />
            </>
          )}

          {k === "stats" && (
            <Repeater
              label="Stats / counters"
              items={v.stats.items}
              empty={{ value: 0, suffix: "+", label: "" }}
              onChange={(items) => setBlock("stats", { items })}
              cols={3}
              render={(it, set) => (
                <>
                  <input type="number" className={inputCls} placeholder="Value" value={it.value} onChange={(e) => set({ value: Number(e.target.value) })} />
                  <input className={inputCls} placeholder="Suffix" value={it.suffix} onChange={(e) => set({ suffix: e.target.value })} />
                  <input className={inputCls} placeholder="Label" value={it.label} onChange={(e) => set({ label: e.target.value })} />
                </>
              )}
            />
          )}

          {k === "services" && (
            <>
              <Grid2>
                <L label="Title"><input className={inputCls} value={v.services.title} onChange={(e) => setBlock("services", { title: e.target.value })} /></L>
                <L label="Subtitle"><input className={inputCls} value={v.services.subtitle} onChange={(e) => setBlock("services", { subtitle: e.target.value })} /></L>
              </Grid2>
              <Repeater
                label="Service items"
                items={v.services.items}
                empty={{ icon: "Home", title: "", body: "" }}
                onChange={(items) => setBlock("services", { items })}
                cols={3}
                render={(it, set) => (
                  <>
                    <input className={inputCls} placeholder="Icon" value={it.icon} onChange={(e) => set({ icon: e.target.value })} />
                    <input className={inputCls} placeholder="Title" value={it.title} onChange={(e) => set({ title: e.target.value })} />
                    <input className={inputCls} placeholder="Body" value={it.body} onChange={(e) => set({ body: e.target.value })} />
                  </>
                )}
              />
            </>
          )}

          {k === "process" && (
            <>
              <Grid2>
                <L label="Title"><input className={inputCls} value={v.process.title} onChange={(e) => setBlock("process", { title: e.target.value })} /></L>
                <L label="Subtitle"><input className={inputCls} value={v.process.subtitle} onChange={(e) => setBlock("process", { subtitle: e.target.value })} /></L>
              </Grid2>
              <Repeater
                label="Process steps"
                items={v.process.steps}
                empty={{ title: "", desc: "" }}
                onChange={(steps) => setBlock("process", { steps })}
                cols={2}
                render={(it, set) => (
                  <>
                    <input className={inputCls} placeholder="Step title" value={it.title} onChange={(e) => set({ title: e.target.value })} />
                    <input className={inputCls} placeholder="Description" value={it.desc} onChange={(e) => set({ desc: e.target.value })} />
                  </>
                )}
              />
            </>
          )}

          {k === "cta" && (
            <Grid2>
              <L label="Title" full><input className={inputCls} value={v.cta.title} onChange={(e) => setBlock("cta", { title: e.target.value })} /></L>
              <L label="Body" full><textarea rows={2} className={inputCls} value={v.cta.body} onChange={(e) => setBlock("cta", { body: e.target.value })} /></L>
              <L label="Primary CTA label"><input className={inputCls} value={v.cta.cta_label} onChange={(e) => setBlock("cta", { cta_label: e.target.value })} /></L>
              <L label="Primary CTA link"><input className={inputCls} value={v.cta.cta_href} onChange={(e) => setBlock("cta", { cta_href: e.target.value })} /></L>
              <L label="Secondary CTA label"><input className={inputCls} value={v.cta.secondary_label} onChange={(e) => setBlock("cta", { secondary_label: e.target.value })} /></L>
              <L label="Secondary CTA link"><input className={inputCls} value={v.cta.secondary_href} onChange={(e) => setBlock("cta", { secondary_href: e.target.value })} /></L>
              <L label="WhatsApp label"><input className={inputCls} value={v.cta.whatsapp_label} onChange={(e) => setBlock("cta", { whatsapp_label: e.target.value })} /></L>
              <L label="WhatsApp URL"><input className={inputCls} value={v.cta.whatsapp_url} onChange={(e) => setBlock("cta", { whatsapp_url: e.target.value })} /></L>
              <ImagePicker label="Background image" url={v.cta.image_url}
                onUpload={(f) => uploadInto(f, (url) => setBlock("cta", { image_url: url }))}
                onClear={() => setBlock("cta", { image_url: "" })} />
            </Grid2>
          )}
        </SectionShell>
      ))}

      <div className="sticky bottom-4 flex justify-end">
        <button onClick={() => save.mutate(v)} disabled={save.isPending}
          className="rounded-md bg-[#0a1f44] px-5 py-2 text-sm text-white shadow-lg disabled:opacity-50">
          {save.isPending ? "Saving…" : "Save all changes"}
        </button>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
function titleFor(k: string) {
  switch (k) {
    case "hero": return "Hero";
    case "intro": return "Company Intro";
    case "mvv": return "Mission / Vision / Values";
    case "trust": return "Why Trust Us";
    case "stats": return "Stats";
    case "services": return "Services";
    case "process": return "Process";
    case "cta": return "Final CTA";
    default: return k;
  }
}

function SectionShell({
  title, active, order, onMoveUp, onMoveDown, onToggleActive, children,
}: {
  title: string; active: boolean; order: number;
  onMoveUp: () => void; onMoveDown: () => void;
  onToggleActive: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="font-semibold text-[#0a1f44]">{title}</h2>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Order {order}</span>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={onMoveUp} className="rounded border border-slate-200 p-1 hover:bg-slate-50" aria-label="Move up"><ArrowUp size={14} /></button>
          <button type="button" onClick={onMoveDown} className="rounded border border-slate-200 p-1 hover:bg-slate-50" aria-label="Move down"><ArrowDown size={14} /></button>
          <label className="ml-2 inline-flex items-center gap-2 text-xs text-slate-600">
            <input type="checkbox" checked={active} onChange={(e) => onToggleActive(e.target.checked)} />
            Active
          </label>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
}
function L({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function ImagePicker({ label, url, onUpload, onClear }: { label: string; url: string; onUpload: (f: File | null) => void; onClear: () => void }) {
  return (
    <L label={label}>
      <div className="flex items-center gap-3">
        {url ? <img src={url} alt="" className="h-16 w-24 rounded object-cover" /> : <div className="grid h-16 w-24 place-items-center rounded bg-slate-100 text-[11px] text-slate-400">No image</div>}
        <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50">
          <Upload size={12} /> Upload
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0] ?? null)} />
        </label>
        {url && <button type="button" onClick={onClear} className="text-xs text-red-600">Remove</button>}
      </div>
    </L>
  );
}

function StringList({ label, items, onChange }: { label: string; items: string[]; onChange: (next: string[]) => void }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-slate-600">{label}</div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <textarea rows={2} className={inputCls} value={it} onChange={(e) => {
              const next = items.slice(); next[i] = e.target.value; onChange(next);
            }} />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="grid h-8 w-8 place-items-center rounded text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ""])} className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"><Plus size={12} /> Add</button>
      </div>
    </div>
  );
}

function Repeater<T>({
  label, items, empty, onChange, render, cols = 3,
}: {
  label: string; items: T[]; empty: T; onChange: (next: T[]) => void;
  render: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode;
  cols?: 2 | 3;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= items.length) return;
    const next = items.slice(); [next[i], next[j]] = [next[j], next[i]]; onChange(next);
  };
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-slate-600">{label}</div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-50 p-2">
            <div className={`grid flex-1 gap-2 ${cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {render(it, (patch) => {
                const next = items.slice(); next[i] = { ...(it as any), ...(patch as any) }; onChange(next);
              })}
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => move(i, -1)} className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-100"><ArrowUp size={12} /></button>
              <button type="button" onClick={() => move(i, 1)} className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-100"><ArrowDown size={12} /></button>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="grid h-7 w-7 place-items-center rounded text-red-500 hover:bg-red-50"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, { ...(empty as any) }])} className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"><Plus size={12} /> Add row</button>
      </div>
    </div>
  );
}
