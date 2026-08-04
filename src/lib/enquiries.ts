import { supabase } from "@/integrations/supabase/client";

export type EnquiryStatus = "New" | "Contacted" | "Follow-up" | "Converted" | "Closed";
export const ENQUIRY_STATUSES: EnquiryStatus[] = ["New", "Contacted", "Follow-up", "Converted", "Closed"];

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  requirementType: "Buy" | "Sell" | "Rent" | "General Enquiry";
  location: string;
  budget: string;
  message: string;
  source: string;
  propertyId?: string | null;
  propertyTitle?: string;
  pageUrl?: string;
  images?: string[];
  status: EnquiryStatus;
  notes?: string;
  createdAt: string;
};

type DbRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  requirement_type: string;
  location: string | null;
  budget: string | null;
  message: string | null;
  source: string | null;
  property_id: string | null;
  property_title: string | null;
  page_url: string | null;
  images: unknown;
  status: string;
  notes: string | null;
  created_at: string;
};

const TEN_YEARS_S = 60 * 60 * 24 * 365 * 10;

function normalizeImages(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];
}

function fromDb(r: DbRow): Enquiry {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    requirementType: (r.requirement_type as Enquiry["requirementType"]) || "General Enquiry",
    location: r.location ?? "",
    budget: r.budget ?? "",
    message: r.message ?? "",
    source: r.source ?? "",
    propertyId: r.property_id,
    propertyTitle: r.property_title ?? "",
    pageUrl: r.page_url ?? "",
    images: normalizeImages(r.images),
    status: (r.status as EnquiryStatus) || "New",
    notes: r.notes ?? "",
    createdAt: r.created_at,
  };
}

export async function uploadEnquiryImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const path = `sell-submissions/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const { error } = await supabase.storage.from("property-media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from("property-media").createSignedUrl(path, TEN_YEARS_S);
  if (signErr) throw signErr;
  return data.signedUrl;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[enquiries] read failed:", error.message);
    return [];
  }
  return (data ?? []).map(fromDb);
}

export async function getNewEnquiryCount(): Promise<number> {
  const { count, error } = await supabase
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "New");
  if (error) return 0;
  return count ?? 0;
}

export type NewEnquiryInput = Omit<Enquiry, "id" | "status" | "createdAt">;

export async function addEnquiry(e: NewEnquiryInput & { assignedStaffId?: string | null; assignedStaffName?: string | null }): Promise<Enquiry | null> {
  const pageUrl =
    e.pageUrl || (typeof window !== "undefined" ? window.location.href : "");
  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      name: e.name,
      phone: e.phone,
      email: e.email,
      requirement_type: e.requirementType,
      location: e.location || "",
      budget: e.budget || "",
      message: e.message || "",
      source: e.source || "",
      property_id: e.propertyId || null,
      property_title: e.propertyTitle || "",
      page_url: pageUrl,
      images: JSON.parse(JSON.stringify(e.images ?? [])),
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      assigned_staff_id: e.assignedStaffId ?? null,
      assigned_staff_name: e.assignedStaffName ?? null,
    } as any)
    .select()
    .single();
  if (error) {
    console.warn("[enquiries] insert failed:", error.message);
    return null;
  }
  return fromDb(data as DbRow);
}

export async function updateEnquiry(id: string, patch: Partial<Enquiry>) {
  const dbPatch: { status?: string; notes?: string } = {};
  if (patch.status) dbPatch.status = patch.status;
  if (patch.notes !== undefined) dbPatch.notes = patch.notes;
  const { error } = await supabase.from("enquiries").update(dbPatch).eq("id", id);
  if (error) throw error;
}

export async function deleteEnquiry(id: string) {
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (error) throw error;
}

export function exportEnquiriesCsv(list: Enquiry[]): string {
  const headers = [
    "ID","Name","Phone","Email","Requirement","Location","Budget","Message","Source","Property","Images","Status","Notes","CreatedAt",
  ];
  const escape = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const rows = list.map((e) =>
    [e.id, e.name, e.phone, e.email, e.requirementType, e.location, e.budget, e.message, e.source, e.propertyTitle ?? "", (e.images ?? []).join(" | "), e.status, e.notes ?? "", e.createdAt]
      .map((v) => escape(String(v)))
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}
