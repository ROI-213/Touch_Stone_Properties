import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Loader2, Save } from "lucide-react";
import {
  BRAND_DEFAULTS,
  getBrandSettings,
  updateBrandSettings,
  uploadSiteMedia,
  type BrandSettings,
} from "@/lib/site-cms";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["site-brand"], queryFn: getBrandSettings });
  const [form, setForm] = useState<BrandSettings>(BRAND_DEFAULTS);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mut = useMutation({
    mutationFn: () => updateBrandSettings(form),
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["site-brand"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function onLogoChange(file: File) {
    setUploading(true);
    try {
      const url = await uploadSiteMedia(file, "branding");
      setForm((f) => ({ ...f, logo_url: url }));
      toast.success("Logo uploaded — remember to save");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (isLoading) {
    return <div className="p-8 text-slate-500">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Site Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Brand identity, contact details, social links, hero & footer copy.</p>
        </div>
        <button
          onClick={() => mut.mutate()}
          disabled={mut.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-[#0a1f44] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a1f44]/90 disabled:opacity-60"
        >
          {mut.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save changes
        </button>
      </header>

      <div className="space-y-6">
        <Card title="Brand">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Brand name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <div>
              <label className="text-xs font-medium text-slate-600">Logo</label>
              <div className="mt-1 flex items-center gap-3">
                {form.logo_url && (
                  <img src={form.logo_url} alt="logo" className="h-12 w-auto rounded border bg-white p-1 object-contain" />
                )}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50 disabled:opacity-60"
                >
                  {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  {form.logo_url ? "Replace logo" : "Upload logo"}
                </button>
                {form.logo_url && (
                  <button onClick={() => setForm({ ...form, logo_url: "" })} className="text-xs text-rose-600 hover:underline">
                    Remove
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) onLogoChange(f); e.target.value = ""; }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Contact">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="WhatsApp number" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          </div>
        </Card>

        <Card title="Social links">
          <div className="grid gap-4 md:grid-cols-2">
            {(["instagram", "facebook", "linkedin", "youtube", "twitter"] as const).map((k) => (
              <Field
                key={k}
                label={k.charAt(0).toUpperCase() + k.slice(1)}
                value={form.social[k]}
                onChange={(v) => setForm({ ...form, social: { ...form.social, [k]: v } })}
                placeholder="https://…"
              />
            ))}
          </div>
        </Card>

        <Card title="Hero copy">
          <div className="grid gap-4">
            <Field label="Headline" value={form.hero.headline} onChange={(v) => setForm({ ...form, hero: { ...form.hero, headline: v } })} />
            <Field label="Subheadline" value={form.hero.subheadline} onChange={(v) => setForm({ ...form, hero: { ...form.hero, subheadline: v } })} textarea />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="CTA label" value={form.hero.cta_label} onChange={(v) => setForm({ ...form, hero: { ...form.hero, cta_label: v } })} />
              <Field label="CTA link" value={form.hero.cta_href} onChange={(v) => setForm({ ...form, hero: { ...form.hero, cta_href: v } })} />
            </div>
          </div>
        </Card>

        <Card title="Footer">
          <div className="grid gap-4">
            <Field label="Tagline" value={form.footer.tagline} onChange={(v) => setForm({ ...form, footer: { ...form.footer, tagline: v } })} />
            <Field label="Copyright" value={form.footer.copyright} onChange={(v) => setForm({ ...form, footer: { ...form.footer, copyright: v } })} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label, value, onChange, placeholder, textarea,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-[#c9a961] focus:outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-[#c9a961] focus:outline-none"
        />
      )}
    </div>
  );
}
