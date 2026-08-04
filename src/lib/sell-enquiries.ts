import { supabase } from "@/integrations/supabase/client";

export const SELL_ENQUIRY_STATUSES = [
  "New",
  "Contacted",
  "Site Visit Scheduled",
  "Verified",
  "Listed",
  "Rejected",
] as const;
export type SellEnquiryStatus = (typeof SELL_ENQUIRY_STATUSES)[number];

export type SellEnquiry = {
  id: string;
  seller_name: string;
  seller_phone: string;
  seller_email: string | null;
  city: string | null;
  zone: string | null;
  locality: string | null;
  full_address: string | null;
  property_type: string | null;
  asking_price: number | null;
  built_up_area: number | null;
  configuration: string | null;
  furnishing: string | null;
  possession: string | null;
  amenities: string[] | null;
  photos: string[] | null;
  description: string | null;
  coordinates: { lat: number; lng: number } | null;
  google_map_link: string | null;
  status: SellEnquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type NewSellEnquiry = Omit<SellEnquiry, "id" | "status" | "notes" | "created_at" | "updated_at">;

export async function createSellEnquiry(input: NewSellEnquiry) {
  const { data, error } = await supabase
    .from("sell_property_enquiries" as any)
    .insert({ ...input, status: "New" })
    .select("id")
    .single();
  if (error) throw error;
  return data as unknown as { id: string };
}

export async function listSellEnquiries(): Promise<SellEnquiry[]> {
  const { data, error } = await supabase
    .from("sell_property_enquiries" as any)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as SellEnquiry[];
}

export async function updateSellEnquiry(id: string, patch: Partial<SellEnquiry>) {
  const { error } = await supabase.from("sell_property_enquiries" as any).update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteSellEnquiry(id: string) {
  const { error } = await supabase.from("sell_property_enquiries" as any).delete().eq("id", id);
  if (error) throw error;
}
