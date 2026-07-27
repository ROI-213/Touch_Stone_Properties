import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import {
  getBrandSettings, updateBrandSettings, uploadSiteMedia,
  BRAND_DEFAULTS, type BrandSettings, type FooterContactItem, type FooterLinkItem,
} from "@/lib/site-cms";
import { resolveLocalImage } from "@/data/siteImages";

export const Route = createFileRoute("/admin/footer")({
  component: FooterAdmin,
});

function normalize(b: BrandSettings): BrandSettings {
  return {
    ...BRAND_DEFAULTS,
    ...b,
    social: { ...BRAND_DEFAULTS.social, ...(b.social ?? {}) },
    hero: { ...BRAND_DEFAULTS.hero, ...(b.hero ?? {}) },
    footer: {
      ...BRAND_DEFAULTS.footer,
      ...(b.footer ?? {}),
      phones: b.footer?.phones ?? [],
      emails: b.footer?.emails ?? [],
      quick_links: b.footer?.quick_links ?? [],
      property_links: b.footer?.property_links ?? [],
    },
  };
}

function FooterAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-brand"], queryFn: getBrandSettings });
  const [draft, setDraft] = useState<BrandSettings>(BRAND_DEFAULTS);

  useEffect(() => { if (data) setDraft(normalize(data)); }, [data]);

  const save = useMutation({
    mutationFn: (v: BrandSettings) => updateBrandSettings(v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-brand"] });
      qc.invalidateQueries({ queryKey: ["site-brand"] });
      toast.success("Footer saved");
    },
    onError: (e: any) => toast.error(e.message || "Save failed"),
  });

  const updateFooter = (patch: Partial<BrandSettings["footer"]>) =>
    setDraft((d) => ({ ...d, footer: { ...d.footer, ...patch } }));

  const handleLogo = async (file: File) => {
    try {
      const url = await uploadSiteMedia(file, "brand");
      setDraft((d) => ({ ...d, logo_url: url }));
      toast.success("Logo uploaded");
    } catch (e: any) { toast.error(e.message || "Upload failed"); }
  };

  if (isLoading) return <div className="p-6 text-slate-500">Loading…</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Footer Management</h1>
          <p className="mt-1 text-sm text-slate-500">Control all footer content shown on the website.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.footer.is_active ?? true}
              onChange={(e) => updateFooter({ is_active: e.target.checked })}
            />
            Footer active
          </label>
          <button
            onClick={() => save.mutate(draft)}
            disabled={save.isPending}
            className="rounded-lg bg-[#0B2447] px-5 py-2 text-sm font-medium text-white hover:bg-[#0a1f44] disabled:opacity-50"
          >
            {save.isPending ? "Saving…" : "Save Footer"}
          </button>
        </div>
      </div>

      {/* Branding */}
      <Section title="Brand">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Company name">
            <input className={input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <input className={input} value={draft.footer.tagline} onChange={(e) => updateFooter({ tagline: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea className={input} rows={2} value={draft.footer.description ?? ""} onChange={(e) => updateFooter({ description: e.target.value })} />
          </Field>
          <Field label="Address">
            <textarea className={input} rows={2} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
          </Field>
          <Field label="WhatsApp number">
            <input className={input} value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} />
          </Field>
          <Field label="Logo">
            <div className="flex items-center gap-3">
              {draft.logo_url && (
                <img src={resolveLocalImage(draft.logo_url, "")} alt="logo" className="h-12 w-auto rounded border border-slate-200 bg-white p-1" />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
                <Upload size={14} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogo(e.target.files[0])} />
              </label>
              {draft.logo_url && (
                <button onClick={() => setDraft({ ...draft, logo_url: "" })} className="text-xs text-red-600">Remove</button>
              )}
            </div>
          </Field>
        </div>
      </Section>

      {/* Phones */}
      <ContactSection
        title="Phone numbers"
        placeholder={{ label: "Sales", value: "+91 99029 25519" }}
        items={draft.footer.phones ?? []}
        onChange={(phones) => updateFooter({ phones })}
      />

      {/* Emails */}
      <ContactSection
        title="Email addresses"
        placeholder={{ label: "General", value: "info@touchstoneproperties.in" }}
        items={draft.footer.emails ?? []}
        onChange={(emails) => updateFooter({ emails })}
      />

      {/* Quick Links */}
      <LinkSection
        title="Quick links"
        items={draft.footer.quick_links ?? []}
        onChange={(quick_links) => updateFooter({ quick_links })}
        placeholder={{ label: "Home", href: "/" }}
      />

      {/* Property Links */}
      <LinkSection
        title="Property category links"
        items={draft.footer.property_links ?? []}
        onChange={(property_links) => updateFooter({ property_links })}
        placeholder={{ label: "Apartments", href: "/buy-properties/apartments" }}
      />

      {/* Socials */}
      <Section title="Social media links">
        <div className="grid gap-4 md:grid-cols-2">
          {(["instagram", "facebook", "linkedin", "youtube", "twitter"] as const).map((k) => (
            <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
              <input className={input} value={draft.social[k]} onChange={(e) => setDraft({ ...draft, social: { ...draft.social, [k]: e.target.value } })} placeholder="https://…" />
            </Field>
          ))}
        </div>
      </Section>

      {/* Legal */}
      <Section title="Copyright & legal">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Copyright text">
            <input className={input} value={draft.footer.copyright} onChange={(e) => updateFooter({ copyright: e.target.value })} />
          </Field>
          <Field label="Privacy Policy URL">
            <input className={input} value={draft.footer.privacy_url ?? ""} onChange={(e) => updateFooter({ privacy_url: e.target.value })} />
          </Field>
          <Field label="Terms URL">
            <input className={input} value={draft.footer.terms_url ?? ""} onChange={(e) => updateFooter({ terms_url: e.target.value })} />
          </Field>
        </div>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={() => save.mutate(draft)}
          disabled={save.isPending}
          className="rounded-lg bg-[#0B2447] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0a1f44] disabled:opacity-50"
        >
          {save.isPending ? "Saving…" : "Save Footer"}
        </button>
      </div>
    </div>
  );
}

const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#0B2447] focus:outline-none";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-[#0a1f44]">{title}</h2>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function ContactSection({
  title, items, onChange, placeholder,
}: {
  title: string;
  items: FooterContactItem[];
  onChange: (v: FooterContactItem[]) => void;
  placeholder: { label: string; value: string };
}) {
  const add = () => onChange([...items, { label: placeholder.label, value: "", is_active: true, display_order: items.length }]);
  const update = (i: number, patch: Partial<FooterContactItem>) =>
    onChange(items.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <Section title={title}>
      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-slate-500">No items yet.</p>}
        {items.map((it, i) => (
          <div key={i} className="grid items-center gap-2 md:grid-cols-[1fr_2fr_auto_auto_auto]">
            <input className={input} placeholder="Label" value={it.label} onChange={(e) => update(i, { label: e.target.value })} />
            <input className={input} placeholder={placeholder.value} value={it.value} onChange={(e) => update(i, { value: e.target.value })} />
            <input type="number" className={`${input} w-20`} value={it.display_order} onChange={(e) => update(i, { display_order: Number(e.target.value) })} />
            <label className="flex items-center gap-1 text-xs text-slate-600">
              <input type="checkbox" checked={it.is_active} onChange={(e) => update(i, { is_active: e.target.checked })} /> Active
            </label>
            <button onClick={() => remove(i)} className="rounded p-1.5 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={add} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
          <Plus size={14} /> Add
        </button>
      </div>
    </Section>
  );
}

function LinkSection({
  title, items, onChange, placeholder,
}: {
  title: string;
  items: FooterLinkItem[];
  onChange: (v: FooterLinkItem[]) => void;
  placeholder: { label: string; href: string };
}) {
  const add = () => onChange([...items, { label: placeholder.label, href: placeholder.href, is_active: true, display_order: items.length }]);
  const update = (i: number, patch: Partial<FooterLinkItem>) =>
    onChange(items.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <Section title={title}>
      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-slate-500">No links yet.</p>}
        {items.map((it, i) => (
          <div key={i} className="grid items-center gap-2 md:grid-cols-[1fr_2fr_auto_auto_auto]">
            <input className={input} placeholder="Label" value={it.label} onChange={(e) => update(i, { label: e.target.value })} />
            <input className={input} placeholder={placeholder.href} value={it.href} onChange={(e) => update(i, { href: e.target.value })} />
            <input type="number" className={`${input} w-20`} value={it.display_order} onChange={(e) => update(i, { display_order: Number(e.target.value) })} />
            <label className="flex items-center gap-1 text-xs text-slate-600">
              <input type="checkbox" checked={it.is_active} onChange={(e) => update(i, { is_active: e.target.checked })} /> Active
            </label>
            <button onClick={() => remove(i)} className="rounded p-1.5 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={add} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
          <Plus size={14} /> Add
        </button>
      </div>
    </Section>
  );
}
