import { supabase } from "@/integrations/supabase/client";

export type ContentSection = {
  id: string;
  key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  extra: Record<string, unknown>;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export async function listContentSections(): Promise<ContentSection[]> {
  const { data, error } = await supabase
    .from("content_sections" as any)
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as ContentSection[];
}

export async function getContentSection(key: string): Promise<ContentSection | null> {
  const { data, error } = await supabase
    .from("content_sections" as any)
    .select("*")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    console.warn("[content-sections] read failed:", error.message);
    return null;
  }
  return (data as unknown as ContentSection) ?? null;
}

export async function upsertContentSection(input: Partial<ContentSection> & { key: string }) {
  const { data, error } = await supabase
    .from("content_sections" as any)
    .upsert(
      {
        key: input.key,
        title: input.title ?? null,
        subtitle: input.subtitle ?? null,
        body: input.body ?? null,
        image_url: input.image_url ?? null,
        cta_text: input.cta_text ?? null,
        cta_link: input.cta_link ?? null,
        extra: input.extra ?? {},
        is_active: input.is_active ?? true,
        display_order: input.display_order ?? 0,
      },
      { onConflict: "key" },
    )
    .select()
    .single();
  if (error) throw error;
  return data as unknown as ContentSection;
}

export async function deleteContentSection(id: string) {
  const { error } = await supabase.from("content_sections" as any).delete().eq("id", id);
  if (error) throw error;
}
