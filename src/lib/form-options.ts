import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FormOption = {
  id: string;
  form_key: string;
  field_key: string;
  label: string;
  value: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function listFormOptions(): Promise<FormOption[]> {
  const { data, error } = await supabase
    .from("form_options" as any)
    .select("*")
    .order("form_key").order("field_key").order("display_order");
  if (error) throw error;
  return (data ?? []) as unknown as FormOption[];
}

export async function listFieldOptions(formKey: string, fieldKey: string): Promise<FormOption[]> {
  const { data, error } = await supabase
    .from("form_options" as any)
    .select("*")
    .eq("form_key", formKey)
    .eq("field_key", fieldKey)
    .eq("is_active", true)
    .order("display_order");
  if (error) {
    console.warn("[form_options] read failed:", error.message);
    return [];
  }
  return (data ?? []) as unknown as FormOption[];
}

export async function createFormOption(input: Omit<FormOption, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("form_options" as any).insert(input).select().single();
  if (error) throw error;
  return data as unknown as FormOption;
}

export async function updateFormOption(id: string, patch: Partial<FormOption>) {
  const { data, error } = await supabase.from("form_options" as any).update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data as unknown as FormOption;
}

export async function deleteFormOption(id: string) {
  const { error } = await supabase.from("form_options" as any).delete().eq("id", id);
  if (error) throw error;
}

/** Hook: live list of active options for a (form, field) pair, with a fallback. */
export function useFormOptions(formKey: string, fieldKey: string, fallback: string[] = []) {
  const q = useQuery({
    queryKey: ["form_options", formKey, fieldKey],
    queryFn: () => listFieldOptions(formKey, fieldKey),
    staleTime: 60_000,
  });
  const opts = q.data ?? [];
  if (opts.length === 0 && fallback.length) {
    return fallback.map((v) => ({ label: v, value: v }));
  }
  return opts.map((o) => ({ label: o.label, value: o.value }));
}
