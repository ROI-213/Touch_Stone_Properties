import { supabase } from "@/integrations/supabase/client";

export type SeoMetadata = {
  id: string;
  route: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
  canonical: string | null;
  keywords: string | null;
  created_at: string;
  updated_at: string;
};

export async function listSeo(): Promise<SeoMetadata[]> {
  const { data, error } = await supabase
    .from("seo_metadata")
    .select("*")
    .order("route", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SeoMetadata[];
}

export async function getSeoForRoute(route: string): Promise<SeoMetadata | null> {
  const { data, error } = await supabase
    .from("seo_metadata")
    .select("*")
    .eq("route", route)
    .maybeSingle();
  if (error) {
    console.warn("[seo] read failed:", error.message);
    return null;
  }
  return (data as SeoMetadata) ?? null;
}

export async function upsertSeo(input: Partial<SeoMetadata> & { route: string }) {
  const { data, error } = await supabase
    .from("seo_metadata")
    .upsert(
      {
        route: input.route,
        title: input.title ?? null,
        description: input.description ?? null,
        og_image: input.og_image ?? null,
        canonical: input.canonical ?? null,
        keywords: input.keywords ?? null,
      },
      { onConflict: "route" },
    )
    .select()
    .single();
  if (error) throw error;
  return data as SeoMetadata;
}

export async function deleteSeo(id: string) {
  const { error } = await supabase.from("seo_metadata").delete().eq("id", id);
  if (error) throw error;
}
