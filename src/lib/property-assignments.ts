import { supabase } from "@/integrations/supabase/client";

export type PropertyAssignment = {
  id: string;
  property_id: string;
  staff_name: string;
  role: string | null;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  assigned_area: string | null;
  notes: string | null;
  is_primary: boolean;
  is_active: boolean;
  show_publicly: boolean;
  display_order: number;
  photo_url: string | null;
  signature_url: string | null;
  id_url: string | null;
  qr_code_url: string | null;
  experience_years: number | null;
  languages: string[];
  created_at?: string;
  updated_at?: string;
};

export type AssignmentDraft = Omit<PropertyAssignment, "id" | "property_id" | "created_at" | "updated_at"> & {
  id?: string;
};

function normalize(row: any): PropertyAssignment {
  return {
    ...row,
    languages: Array.isArray(row?.languages) ? row.languages : [],
    photo_url: row?.photo_url ?? null,
    signature_url: row?.signature_url ?? null,
    id_url: row?.id_url ?? null,
    qr_code_url: row?.qr_code_url ?? null,
    experience_years: row?.experience_years ?? null,
  };
}

export async function listAssignments(propertyId: string): Promise<PropertyAssignment[]> {
  const { data, error } = await supabase
    .from("property_assignments" as any)
    .select("*")
    .eq("property_id", propertyId)
    .order("is_primary", { ascending: false })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return ((data as any[]) ?? []).map(normalize);
}

export async function listPublicAssignments(propertyId: string): Promise<PropertyAssignment[]> {
  const { data, error } = await supabase
    .from("property_assignments" as any)
    .select(
      "id, property_id, staff_name, role, phone, whatsapp, email, assigned_area, is_primary, is_active, show_publicly, display_order, photo_url, experience_years, languages, qr_code_url",
    )
    .eq("property_id", propertyId)
    .eq("show_publicly", true)
    .eq("is_active", true)
    .order("is_primary", { ascending: false })
    .order("display_order", { ascending: true });
  if (error) {
    console.warn("[listPublicAssignments]", error.message);
    return [];
  }
  return ((data as any[]) ?? []).map(normalize);
}

/** Pick the best contact: primary > first active public > null */
export function pickPrimaryContact(staff: PropertyAssignment[]): PropertyAssignment | null {
  if (!staff || staff.length === 0) return null;
  const publicActive = staff.filter((s) => s.is_active && s.show_publicly);
  return publicActive.find((s) => s.is_primary) ?? publicActive[0] ?? null;
}

export async function uploadAssignmentAsset(file: File, kind: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safe = ["jpg", "jpeg", "png", "webp", "gif", "pdf"].includes(ext) ? ext : "jpg";
  const path = `staff/${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safe}`;
  const { error } = await supabase.storage.from("property-media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: urlErr } = await supabase.storage
    .from("property-media")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (urlErr) throw urlErr;
  return data.signedUrl;
}

export async function saveAssignments(propertyId: string, drafts: AssignmentDraft[]) {
  // Validation
  const primaries = drafts.filter((d) => d.is_primary);
  if (primaries.length > 1) {
    throw new Error("Only one primary contact is allowed per property.");
  }
  for (const d of drafts) {
    if (!d.staff_name?.trim()) throw new Error("Staff name is required for every entry.");
    if (!d.phone?.trim()) throw new Error(`Phone number is required for ${d.staff_name}.`);
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
      throw new Error(`Invalid email for ${d.staff_name}.`);
    }
  }

  // Strategy: delete-all then insert. Simpler and safe with cascading FK.
  const { error: delErr } = await supabase
    .from("property_assignments" as any)
    .delete()
    .eq("property_id", propertyId);
  if (delErr) throw delErr;
  if (drafts.length === 0) return;

  const rows = drafts.map((d, i) => ({
    property_id: propertyId,
    staff_name: d.staff_name.trim(),
    role: d.role || null,
    phone: d.phone.trim(),
    whatsapp: d.whatsapp || null,
    email: d.email || null,
    assigned_area: d.assigned_area || null,
    notes: d.notes || null,
    is_primary: !!d.is_primary,
    is_active: d.is_active !== false,
    show_publicly: !!d.show_publicly,
    display_order: typeof d.display_order === "number" ? d.display_order : i,
    photo_url: d.photo_url || null,
    signature_url: d.signature_url || null,
    id_url: d.id_url || null,
    qr_code_url: d.qr_code_url || null,
    experience_years:
      typeof d.experience_years === "number" && !Number.isNaN(d.experience_years)
        ? d.experience_years
        : null,
    languages: Array.isArray(d.languages) ? d.languages.filter(Boolean) : [],
  }));
  const { error } = await supabase.from("property_assignments" as any).insert(rows);
  if (error) throw error;
}
