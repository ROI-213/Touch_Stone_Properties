import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash2, Plus, X } from "lucide-react";
import {
  listBuilders, listLocations, listAmenities, type PropertyRow,
} from "@/lib/admin-properties";
import { supabase } from "@/integrations/supabase/client";
import { AssignmentsEditor } from "@/components/admin/AssignmentsEditor";
import type { AssignmentDraft } from "@/lib/property-assignments";

export type PropertyFormValues = Partial<PropertyRow> & {
  project_name: string;
  property_type: PropertyRow["property_type"];
  listing_type: PropertyRow["listing_type"];
};

type ImageItem = { id?: string; url: string; image_type: "gallery" | "floor_plan" | "hero"; caption?: string };

interface Props {
  initial?: Partial<PropertyRow>;
  initialImages?: ImageItem[];
  initialAmenityIds?: string[];
  initialAssignments?: AssignmentDraft[];
  onSubmit: (values: PropertyFormValues, images: ImageItem[], amenityIds: string[], assignments: AssignmentDraft[]) => Promise<void>;
  submitting?: boolean;
  submitLabel?: string;
}

const TABS = ["Basics", "Pricing", "Configurations", "Location", "Highlights", "Amenities", "Staff", "Media", "Poster", "SEO", "Flags"] as const;
type TabId = (typeof TABS)[number];

type ListItem = { title?: string; subtitle?: string; icon?: string };

export function PropertyForm({ initial = {}, initialImages = [], initialAmenityIds = [], initialAssignments = [], onSubmit, submitting, submitLabel = "Save" }: Props) {
  const [tab, setTab] = useState<TabId>("Basics");
  const [v, setV] = useState<any>({
    project_name: "", property_type: "Apartment", listing_type: "Buy",
    bhk_options: [], is_active: true, ...initial,
  });
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [amenityIds, setAmenityIds] = useState<string[]>(initialAmenityIds);
  const [assignments, setAssignments] = useState<AssignmentDraft[]>(initialAssignments);
  const [imgUrl, setImgUrl] = useState("");
  const [imgType, setImgType] = useState<ImageItem["image_type"]>("gallery");
  const [imgCaption, setImgCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const builders = useQuery({ queryKey: ["admin-builders"], queryFn: listBuilders });
  const locations = useQuery({ queryKey: ["admin-locations"], queryFn: listLocations });
  const amenities = useQuery({ queryKey: ["admin-amenities"], queryFn: listAmenities });
  const staff = useQuery({
    queryKey: ["admin-staff-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_users" as any)
        .select("id, name, email, mobile, designation, status")
        .eq("status", "active")
        .order("name");
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  const set = (k: string, val: any) => setV((s: any) => ({ ...s, [k]: val }));
  const details = (v.details ?? {}) as Record<string, any>;
  const setD = (k: string, val: any) => setV((s: any) => ({ ...s, details: { ...(s.details ?? {}), [k]: val } }));
  const getList = (k: string): ListItem[] => Array.isArray(details[k]) ? details[k] : [];
  const setList = (k: string, next: ListItem[]) => setD(k, next);
  const addItem = (k: string) => setList(k, [...getList(k), { title: "", subtitle: "", icon: "" }]);
  const updItem = (k: string, i: number, patch: Partial<ListItem>) =>
    setList(k, getList(k).map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const rmItem = (k: string, i: number) => setList(k, getList(k).filter((_, idx) => idx !== i));

  const toggleAmenity = (id: string) =>
    setAmenityIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const uploadOne = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop() || "bin";
    const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("property-media")
      .upload(path, file, { contentType: file.type || undefined, cacheControl: "31536000", upsert: false });
    if (error) throw error;
    const TEN_YEARS_S = 60 * 60 * 24 * 365 * 10;
    const { data, error: signErr } = await supabase.storage
      .from("property-media")
      .createSignedUrl(path, TEN_YEARS_S);
    if (signErr) throw signErr;
    return data.signedUrl;
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    const list = Array.from(files);
    let added = 0;
    try {
      const uploaded: ImageItem[] = [];
      for (const file of list) {
        try {
          const url = await uploadOne(file);
          uploaded.push({ url, image_type: imgType, caption: "" });
          added++;
        } catch (e: any) {
          toast.error(`${file.name}: ${e.message || "upload failed"}`);
        }
      }
      if (uploaded.length) setImages((cur) => [...cur, ...uploaded]);
      if (added) toast.success(`Uploaded ${added} file${added > 1 ? "s" : ""}`);
    } finally {
      setUploading(false);
    }
  };

  const addImage = () => {
    if (!imgUrl.trim()) return;
    setImages([...images, { url: imgUrl.trim(), image_type: imgType, caption: imgCaption }]);
    setImgUrl(""); setImgCaption("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.project_name?.trim()) { toast.error("Project name required"); setTab("Basics"); return; }
    const primaries = assignments.filter((a) => a.is_primary).length;
    if (primaries > 1) { toast.error("Only one primary contact is allowed."); setTab("Staff"); return; }
    for (const a of assignments) {
      if (!a.staff_name?.trim() || !a.phone?.trim()) {
        toast.error("Every assigned staff needs a name and phone number.");
        setTab("Staff");
        return;
      }
      if (a.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) {
        toast.error(`Invalid email for ${a.staff_name}.`);
        setTab("Staff");
        return;
      }
    }
    await onSubmit(v, images, amenityIds, assignments);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex flex-nowrap gap-1 overflow-x-auto border-b border-slate-200 scrollbar-hide pb-1">
        {TABS.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex-none whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium ${
              tab === t ? "text-[#0a1f44]" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
            {tab === t && <span className="absolute inset-x-2 sm:inset-x-3 -bottom-px h-0.5 bg-[#c9a961]" />}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {tab === "Basics" && (
          <Grid>
            <Field label="Project Name *"><input className={input} value={v.project_name || ""} onChange={(e) => set("project_name", e.target.value)} required /></Field>
            <Field label="Slug (auto if blank)"><input className={input} value={v.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" /></Field>
            <Field label="Builder / Developer">
              <select className={input} value={v.builder_id || ""} onChange={(e) => set("builder_id", e.target.value || null)}>
                <option value="">— Select —</option>
                {(builders.data ?? []).filter((b: any) => ["builder","developer"].includes(b.contact_type ?? "builder")).map((b: any) => <option key={b.id} value={b.id}>{b.display_name || b.name}</option>)}
              </select>
            </Field>
            <Field label="Agent">
              <select className={input} value={v.agent_id || ""} onChange={(e) => set("agent_id", e.target.value || null)}>
                <option value="">— Select —</option>
                {(builders.data ?? []).filter((b: any) => b.contact_type === "agent").map((b: any) => <option key={b.id} value={b.id}>{b.display_name || b.name}</option>)}
              </select>
            </Field>
            <Field label="Owner / Seller">
              <select className={input} value={v.owner_id || ""} onChange={(e) => set("owner_id", e.target.value || null)}>
                <option value="">— Select —</option>
                {(builders.data ?? []).filter((b: any) => ["owner","land_owner","individual_seller"].includes(b.contact_type)).map((b: any) => <option key={b.id} value={b.id}>{`${b.display_name || b.name} (${b.contact_type})`}</option>)}
              </select>
            </Field>
            <Field label="Channel Partner">
              <select className={input} value={v.channel_partner_id || ""} onChange={(e) => set("channel_partner_id", e.target.value || null)}>
                <option value="">— Select —</option>
                {(builders.data ?? []).filter((b: any) => b.contact_type === "channel_partner").map((b: any) => <option key={b.id} value={b.id}>{b.display_name || b.name}</option>)}
              </select>
            </Field>
            <Field label="RERA Number"><input className={input} value={v.rera_number || ""} onChange={(e) => set("rera_number", e.target.value)} /></Field>
            <Field label="Property Type *">
              <select className={input} value={v.property_type} onChange={(e) => set("property_type", e.target.value)}>
                {["Apartment", "Villa", "Plot", "Commercial", "Residential"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Property Category"><input className={input} value={v.property_category || ""} onChange={(e) => set("property_category", e.target.value)} placeholder="e.g. Luxury, Premium" /></Field>
            <Field label="Listing Type *">
              <select className={input} value={v.listing_type} onChange={(e) => set("listing_type", e.target.value)}>
                {["Buy", "Rent", "Sell"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Project Status"><input className={input} value={v.project_status || ""} onChange={(e) => set("project_status", e.target.value)} placeholder="Under Construction / Ready" /></Field>
            <Field label="Possession Date"><input className={input} value={v.possession_date || ""} onChange={(e) => set("possession_date", e.target.value)} placeholder="Dec 2026" /></Field>
            <Field label="Contact Phone"><input className={input} value={v.contact_phone || ""} onChange={(e) => set("contact_phone", e.target.value)} /></Field>
            <Field label="WhatsApp"><input className={input} value={v.whatsapp || ""} onChange={(e) => set("whatsapp", e.target.value)} /></Field>
            <Field label="About This Property" full>
              <textarea
                rows={8}
                className={input}
                value={v.overview || ""}
                onChange={(e) => set("overview", e.target.value)}
                placeholder="Write a detailed description about this property, project highlights, location benefits, builder quality, investment value, and other important details."
              />
            </Field>
            <Field label="Highlights" full>
              <textarea rows={3} className={input} value={v.highlights || ""} onChange={(e) => set("highlights", e.target.value)} placeholder="One highlight per line" />
            </Field>
            <Field label="Display Title"><input className={input} value={details.display_title || ""} onChange={(e) => setD("display_title", e.target.value)} placeholder="3.5 BHK Premium Apartment" /></Field>
            <Field label="Tagline"><input className={input} value={details.tagline || ""} onChange={(e) => setD("tagline", e.target.value)} placeholder="Royal Living, Redefined" /></Field>
            <Field label="Sale Label">
              <select className={input} value={details.sale_label || ""} onChange={(e) => setD("sale_label", e.target.value)}>
                <option value="">— Select —</option>
                {["For Sale","For Rent","Sold Out","Coming Soon","Price on Request"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Badge Text"><input className={input} value={details.badge_text || ""} onChange={(e) => setD("badge_text", e.target.value)} placeholder="Premium Apartment" /></Field>
            <Field label="Short Location Text" full><input className={input} value={details.short_location_text || ""} onChange={(e) => setD("short_location_text", e.target.value)} placeholder="Sarjapura Road, Near RGA Tech Park, Bengaluru" /></Field>
          </Grid>
        )}

        {tab === "Pricing" && (
          <Grid>
            <Field label="Starting Price (₹)"><input type="number" className={input} value={v.starting_price ?? ""} onChange={(e) => set("starting_price", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Price / Sqft (₹)"><input type="number" className={input} value={v.price_per_sqft ?? ""} onChange={(e) => set("price_per_sqft", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Price Min (₹)"><input type="number" className={input} value={v.price_min ?? ""} onChange={(e) => set("price_min", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Price Max (₹)"><input type="number" className={input} value={v.price_max ?? ""} onChange={(e) => set("price_max", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Price Display Text"><input className={input} value={details.price_display_text || ""} onChange={(e) => setD("price_display_text", e.target.value)} placeholder="₹ 3.50 Crore" /></Field>
            <Field label="Price Suffix / Status">
              <select className={input} value={details.price_suffix || ""} onChange={(e) => setD("price_suffix", e.target.value)}>
                <option value="">— Select —</option>
                {["Negotiable","Fixed Price","All Inclusive","Starting Price"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Maintenance Charges"><input className={input} value={details.maintenance_charges || ""} onChange={(e) => setD("maintenance_charges", e.target.value)} /></Field>
            <Field label="Booking Amount"><input className={input} value={details.booking_amount || ""} onChange={(e) => setD("booking_amount", e.target.value)} /></Field>
            <Field label="Registration Status">
              <select className={input} value={details.registration_status || ""} onChange={(e) => setD("registration_status", e.target.value)}>
                <option value="">— Select —</option>
                {["Registration Done","Registration Not Done","Not Applicable"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Home Loan Status">
              <select className={input} value={details.home_loan_status || ""} onChange={(e) => setD("home_loan_status", e.target.value)}>
                <option value="">— Select —</option>
                {["Home Loan Available","No Home Loan on Property","Bank Approved","Not Applicable"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Covered Parking Count"><input className={input} value={details.covered_parking || ""} onChange={(e) => setD("covered_parking", e.target.value)} placeholder="1 Covered Car Parking" /></Field>
            <Field label="Price Note" full><textarea rows={2} className={input} value={details.price_note || ""} onChange={(e) => setD("price_note", e.target.value)} /></Field>
          </Grid>
        )}

        {tab === "Configurations" && (
          <Grid>
            <Field label="BHK Options (comma-separated)" full>
              <input className={input} value={(v.bhk_options || []).join(", ")} onChange={(e) => set("bhk_options", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="2 BHK, 3 BHK, 4 BHK" />
            </Field>
            <Field label="Unit Sizes"><input className={input} value={v.unit_sizes || ""} onChange={(e) => set("unit_sizes", e.target.value)} placeholder="1200 - 2100 sqft" /></Field>
            <Field label="Carpet Area"><input className={input} value={v.carpet_area || ""} onChange={(e) => set("carpet_area", e.target.value)} /></Field>
            <Field label="Land Parcel"><input className={input} value={v.land_parcel || ""} onChange={(e) => set("land_parcel", e.target.value)} placeholder="7 acres" /></Field>
            <Field label="Towers"><input type="number" className={input} value={v.towers ?? ""} onChange={(e) => set("towers", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Floors"><input type="number" className={input} value={v.floors ?? ""} onChange={(e) => set("floors", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Total Units"><input type="number" className={input} value={v.total_units ?? ""} onChange={(e) => set("total_units", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Open Space %"><input type="number" className={input} value={v.open_space_pct ?? ""} onChange={(e) => set("open_space_pct", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Clubhouse Size"><input className={input} value={v.clubhouse_size || ""} onChange={(e) => set("clubhouse_size", e.target.value)} /></Field>
            <Field label="Amenities Count"><input type="number" className={input} value={v.amenities_count ?? ""} onChange={(e) => set("amenities_count", e.target.value ? Number(e.target.value) : null)} /></Field>
            <Field label="Super Built-up Area"><input className={input} value={details.super_builtup_area || ""} onChange={(e) => setD("super_builtup_area", e.target.value)} placeholder="1805 Sq.ft." /></Field>
            <Field label="Built-up Area"><input className={input} value={details.builtup_area || ""} onChange={(e) => setD("builtup_area", e.target.value)} /></Field>
            <Field label="Wing / Block"><input className={input} value={details.wing_block || ""} onChange={(e) => setD("wing_block", e.target.value)} placeholder="Wing 5" /></Field>
            <Field label="Floor Details"><input className={input} value={details.floor_details || ""} onChange={(e) => setD("floor_details", e.target.value)} placeholder="13th Floor" /></Field>
            <Field label="Total Floors"><input className={input} value={details.total_floors || ""} onChange={(e) => setD("total_floors", e.target.value)} /></Field>
            <Field label="Facing Direction"><input className={input} value={details.facing_direction || ""} onChange={(e) => setD("facing_direction", e.target.value)} placeholder="East" /></Field>
            <Field label="View From Property"><input className={input} value={details.property_view || ""} onChange={(e) => setD("property_view", e.target.value)} placeholder="Beautiful View of School & Tech Park" /></Field>
            <Field label="Interior Status">
              <select className={input} value={details.interior_status || ""} onChange={(e) => setD("interior_status", e.target.value)}>
                <option value="">— Select —</option>
                {["Basic Interiors Completed","Fully Furnished","Semi Furnished","Unfurnished"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Occupancy Status">
              <select className={input} value={details.occupancy_status || ""} onChange={(e) => setD("occupancy_status", e.target.value)}>
                <option value="">— Select —</option>
                {["Ready to Occupy","Under Construction","Possession Soon"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="BHK Display Label"><input className={input} value={details.bhk_display_label || ""} onChange={(e) => setD("bhk_display_label", e.target.value)} placeholder="3.5 BHK" /></Field>
          </Grid>
        )}

        {tab === "Location" && (
          <Grid>
            <Field label="Location (Zone / Locality)">
              <select className={input} value={v.location_id || ""} onChange={(e) => set("location_id", e.target.value || null)}>
                <option value="">— Select —</option>
                {(locations.data ?? []).map((l: any) => <option key={l.id} value={l.id}>{l.zone} · {l.locality}</option>)}
              </select>
            </Field>
            <Field label="Full Address" full>
              <input className={input} value={v.address || ""} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field label="Google Map Link"><input className={input} value={v.map_link || ""} onChange={(e) => set("map_link", e.target.value)} /></Field>
            <Field label="Directions Link"><input className={input} value={v.directions_link || ""} onChange={(e) => set("directions_link", e.target.value)} /></Field>
            <Field label="Location Advantages" full>
              <textarea rows={3} className={input} value={v.location_advantages || ""} onChange={(e) => set("location_advantages", e.target.value)} placeholder="One advantage per line" />
            </Field>
          </Grid>
        )}

        {tab === "Highlights" && (
          <div className="space-y-6">
            {[
              { key: "bullet_highlights", title: "Property Highlight Bullets", ph: { title: "Ready to Occupy", subtitle: "" }, showSubtitle: false },
              { key: "connectivity", title: "Excellent Connectivity", ph: { title: "RGA Tech Park", subtitle: "2 mins" }, showSubtitle: true },
              { key: "nearby_schools", title: "Nearby Schools", ph: { title: "Oakridge International", subtitle: "5 mins" }, showSubtitle: true },
              { key: "nearby_hospitals", title: "Nearby Hospitals", ph: { title: "Manipal Hospital", subtitle: "10 mins" }, showSubtitle: true },
              { key: "nearby_lifestyle", title: "Lifestyle Destinations", ph: { title: "Market Square Mall", subtitle: "8 mins" }, showSubtitle: true },
            ].map((section) => (
              <div key={section.key} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-semibold text-[#0a1f44]">{section.title}</div>
                  <button type="button" onClick={() => addItem(section.key)} className="inline-flex items-center gap-1 rounded-md bg-[#0a1f44] px-2 py-1 text-xs text-white">
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {getList(section.key).map((it, i) => (
                    <div key={i} className="grid gap-2 sm:grid-cols-[80px_1fr_1fr_auto]">
                      <input className={input} placeholder="Icon (emoji)" value={it.icon || ""} onChange={(e) => updItem(section.key, i, { icon: e.target.value })} />
                      <input className={input} placeholder={section.ph.title} value={it.title || ""} onChange={(e) => updItem(section.key, i, { title: e.target.value })} />
                      {section.showSubtitle ? (
                        <input className={input} placeholder={section.ph.subtitle} value={it.subtitle || ""} onChange={(e) => updItem(section.key, i, { subtitle: e.target.value })} />
                      ) : <div />}
                      <button type="button" onClick={() => rmItem(section.key, i)} className="grid h-9 w-9 place-items-center rounded-md bg-red-50 text-red-600 hover:bg-red-100"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  {getList(section.key).length === 0 && <div className="text-xs text-slate-400">No items added yet.</div>}
                </div>
              </div>
            ))}
          </div>
        )}



        {tab === "Amenities" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">
                {amenities.isLoading ? "Loading amenities…" : `${amenityIds.length} selected · ${amenities.data?.length ?? 0} available`}
              </div>
              {(amenities.data?.length ?? 0) === 0 && !amenities.isLoading && (
                <span className="text-xs text-slate-400">Add amenities under Admin → Amenities first.</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {(amenities.data ?? []).map((a: any) => {
                const checked = amenityIds.includes(a.id);
                return (
                  <label key={a.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 ${checked ? "border-[#c9a961] bg-[#c9a961]/5" : "border-slate-200"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleAmenity(a.id)} className="h-4 w-4 accent-[#c9a961]" />
                    <span className="flex-1 truncate text-slate-700">{a.name}</span>
                    {a.category && <span className="text-[10px] text-slate-400">{a.category}</span>}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {tab === "Staff" && (
          <div className="space-y-6">
            <Field label="Assigned Staff (shown on the property's Enquire button)" full>
              <select
                className={input}
                value={v.assigned_staff_id || ""}
                onChange={(e) => set("assigned_staff_id", e.target.value || null)}
              >
                <option value="">— None (use default company contact) —</option>
                {(staff.data ?? []).map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.designation ? ` · ${s.designation}` : ""}
                    {s.mobile ? ` · ${s.mobile}` : ""}
                    {s.email ? ` · ${s.email}` : ""}
                  </option>
                ))}
              </select>
              {staff.isLoading && <div className="mt-1 text-xs text-slate-400">Loading staff…</div>}
              {!staff.isLoading && (staff.data?.length ?? 0) === 0 && (
                <div className="mt-1 text-xs text-slate-400">Add staff under Admin → Staff first.</div>
              )}
            </Field>
            <div className="border-t border-slate-200 pt-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Additional contacts shown on the detail page
              </div>
              <AssignmentsEditor value={assignments} onChange={setAssignments} />
            </div>
          </div>
        )}

        {tab === "Media" && (
          <div className="space-y-4">
            <Field label="Hero Image">
              <div className="space-y-2">
                {v.hero_image && (
                  <div className="relative inline-block">
                    <img src={v.hero_image} alt="" className="h-32 w-auto rounded-lg border border-slate-200 object-cover" />
                    <button type="button" onClick={() => set("hero_image", "")}
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white">
                      <X size={12} />
                    </button>
                  </div>
                )}
                <input type="file" accept="image/*" disabled={uploading}
                  onChange={async (e) => {
                    const f = e.target.files?.[0]; e.target.value = "";
                    if (!f) return;
                    setUploading(true);
                    try { const url = await uploadOne(f); set("hero_image", url); toast.success("Hero image uploaded"); }
                    catch (err: any) { toast.error(err.message || "Upload failed"); }
                    finally { setUploading(false); }
                  }}
                  className="block text-xs" />
              </div>
            </Field>
            <Field label="Brochure PDF">
              <div className="space-y-2">
                {v.brochure_url && (
                  <a href={v.brochure_url} target="_blank" rel="noreferrer" className="block text-xs text-[#c9a961] hover:underline">
                    View current brochure
                  </a>
                )}
                <input type="file" accept="application/pdf" disabled={uploading}
                  onChange={async (e) => {
                    const f = e.target.files?.[0]; e.target.value = "";
                    if (!f) return;
                    setUploading(true);
                    try { const url = await uploadOne(f); set("brochure_url", url); toast.success("Brochure uploaded"); }
                    catch (err: any) { toast.error(err.message || "Upload failed"); }
                    finally { setUploading(false); }
                  }}
                  className="block text-xs" />
              </div>
            </Field>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-[#0a1f44]">Upload Gallery / Floor Plan Images</div>
              <div className="mt-2 grid gap-2 sm:grid-cols-[140px_1fr]">
                <select className={input} value={imgType} onChange={(e) => setImgType(e.target.value as any)}>
                  <option value="gallery">Gallery</option>
                  <option value="floor_plan">Floor Plan</option>
                  <option value="hero">Hero</option>
                </select>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#0a1f44] px-3 py-2 text-xs font-medium text-white hover:bg-[#0a1f44]/90">
                  <Plus size={13} /> {uploading ? "Uploading…" : "Choose images (multi-select)"}
                  <input type="file" multiple accept="image/*" className="hidden"
                    onChange={(e) => { const fs = e.target.files; if (fs && fs.length) handleFileUpload(fs); e.target.value = ""; }} />
                </label>
              </div>
              <p className="mt-2 text-xs text-slate-400">Hold Ctrl/Cmd or Shift to pick multiple. They'll be added with the selected type.</p>
            </div>


            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((img, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <img src={img.url} alt="" className="h-32 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <X size={13} />
                    </button>
                    <div className="px-2 py-1.5 text-[11px] text-slate-600">
                      <div className="font-medium">{img.image_type}</div>
                      {img.caption && <div className="truncate text-slate-400">{img.caption}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "Poster" && (
          <Grid>
            <Field label="Enable Poster Section on Frontend" full>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={!!details.poster_enabled} onChange={(e) => setD("poster_enabled", e.target.checked)} className="h-4 w-4 accent-[#c9a961]" />
                Show poster block on the property page
              </label>
            </Field>
            <Field label="Poster Main Heading"><input className={input} value={details.poster_heading || ""} onChange={(e) => setD("poster_heading", e.target.value)} placeholder="FOR SALE" /></Field>
            <Field label="Poster Sub Heading"><input className={input} value={details.poster_subheading || ""} onChange={(e) => setD("poster_subheading", e.target.value)} placeholder="3.5 BHK Premium Apartment" /></Field>
            <Field label="Poster Price Badge"><input className={input} value={details.poster_price_badge || ""} onChange={(e) => setD("poster_price_badge", e.target.value)} placeholder="₹ 3.50 Crore" /></Field>
            <Field label="Poster Price Note"><input className={input} value={details.poster_price_note || ""} onChange={(e) => setD("poster_price_note", e.target.value)} placeholder="Negotiable" /></Field>
            <Field label="Poster Location Text" full><input className={input} value={details.poster_location_text || ""} onChange={(e) => setD("poster_location_text", e.target.value)} /></Field>
            <Field label="Quality Badge Text"><input className={input} value={details.quality_badge_text || ""} onChange={(e) => setD("quality_badge_text", e.target.value)} placeholder="Sobha Quality Assured" /></Field>
            <Field label="Footer Contact Number"><input className={input} value={details.poster_footer_phone || ""} onChange={(e) => setD("poster_footer_phone", e.target.value)} /></Field>
            <Field label="Footer Agent Name"><input className={input} value={details.poster_footer_agent || ""} onChange={(e) => setD("poster_footer_agent", e.target.value)} /></Field>
            <Field label="Footer Company Name"><input className={input} value={details.poster_footer_company || ""} onChange={(e) => setD("poster_footer_company", e.target.value)} /></Field>
          </Grid>
        )}

        {tab === "SEO" && (
          <Grid>
            <Field label="SEO Title" full><input className={input} value={v.seo_title || ""} onChange={(e) => set("seo_title", e.target.value)} /></Field>
            <Field label="Meta Description" full><textarea rows={3} className={input} value={v.seo_description || ""} onChange={(e) => set("seo_description", e.target.value)} /></Field>
            <Field label="Keywords (comma-separated)" full><input className={input} value={v.seo_keywords || ""} onChange={(e) => set("seo_keywords", e.target.value)} /></Field>
          </Grid>
        )}

        {tab === "Flags" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["is_active", "Active (visible on site)"],
              ["is_featured", "Featured"],
              ["is_top_featured", "Top Featured"],
              ["is_hot", "Hot Property"],
              ["is_trending", "Trending"],
              ["is_new_launch", "New Launch"],
              ["is_pre_launch", "Pre Launch"],
              ["is_ready_to_move", "Ready to Move"],
            ].map(([k, label]) => (
              <label key={k} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">
                <input type="checkbox" checked={!!v[k]} onChange={(e) => set(k, e.target.checked)} className="h-4 w-4 accent-[#c9a961]" />
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
            <Field label="Display Order">
              <input type="number" className={input} value={v.display_order ?? 0} onChange={(e) => set("display_order", Number(e.target.value) || 0)} />
            </Field>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md bg-[#c9a961] px-6 text-sm font-medium text-white hover:bg-[#b89651] disabled:opacity-50"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

const input = "w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#c9a961]";

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <div className={full ? "col-span-1 sm:col-span-2 lg:col-span-3" : ""}>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-500">{label}</label>
      {children}
    </div>
  );
}
