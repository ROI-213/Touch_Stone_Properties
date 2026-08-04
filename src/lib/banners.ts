import { supabase } from "@/integrations/supabase/client";

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function listBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Banner[];
}

export async function createBanner(input: Partial<Banner> & { title: string }) {
  const { data, error } = await supabase
    .from("banners")
    .insert({
      title: input.title,
      subtitle: input.subtitle ?? null,
      image_url: input.image_url ?? null,
      cta_text: input.cta_text ?? null,
      cta_link: input.cta_link ?? null,
      display_order: input.display_order ?? 0,
      is_active: input.is_active ?? true,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Banner;
}

export async function updateBanner(id: string, patch: Partial<Banner>) {
  const { data, error } = await supabase
    .from("banners")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Banner;
}

export async function deleteBanner(id: string) {
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderBanners(ids: string[]) {
  await Promise.all(
    ids.map((id, idx) =>
      supabase.from("banners").update({ display_order: idx }).eq("id", id),
    ),
  );
}
