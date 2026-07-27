import { supabase } from "@/integrations/supabase/client";

export type HotPropertySettings = {
  id: string;
  enabled: boolean;
  property_id: string | null;
  badge_text: string;
  highlights: string[];
  cta_view_url: string | null;
  cta_contact_url: string | null;
  override_image: string | null;
  override_title: string | null;
  override_location: string | null;
  override_price: string | null;
  override_property_type: string | null;
  override_bedrooms: number | null;
  override_bathrooms: number | null;
  override_area: string | null;
  override_description: string | null;
  status: string;
  updated_at?: string;
};

export const HOT_DEFAULTS: HotPropertySettings = {
  id: "default",
  enabled: true,
  property_id: null,
  badge_text: "Hot Deal",
  highlights: [],
  cta_view_url: null,
  cta_contact_url: null,
  override_image: null,
  override_title: null,
  override_location: null,
  override_price: null,
  override_property_type: null,
  override_bedrooms: null,
  override_bathrooms: null,
  override_area: null,
  override_description: null,
  status: "active",
};

export async function getHotPropertySettings(): Promise<HotPropertySettings> {
  const { data, error } = await supabase
    .from("hot_property_settings" as any)
    .select("*")
    .eq("id", "default")
    .maybeSingle();
  if (error || !data) return HOT_DEFAULTS;
  const row = data as any;
  return {
    ...HOT_DEFAULTS,
    ...row,
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
  };
}

export async function saveHotPropertySettings(value: Partial<HotPropertySettings>) {
  const payload = { id: "default", ...value, updated_at: new Date().toISOString() };
  const { error } = await supabase
    .from("hot_property_settings" as any)
    .upsert(payload, { onConflict: "id" });
  if (error) throw error;
}
