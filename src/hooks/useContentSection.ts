import { useQuery } from "@tanstack/react-query";
import { getContentSection, type ContentSection } from "@/lib/content-sections";

export function useContentSection(key: string, fallback?: Partial<ContentSection>) {
  const q = useQuery({
    queryKey: ["content-section", key],
    queryFn: () => getContentSection(key),
    staleTime: 60_000,
  });
  const section = q.data ?? null;
  return {
    section,
    title: section?.title ?? fallback?.title ?? null,
    subtitle: section?.subtitle ?? fallback?.subtitle ?? null,
    body: section?.body ?? fallback?.body ?? null,
    image_url: section?.image_url ?? fallback?.image_url ?? null,
    cta_text: section?.cta_text ?? fallback?.cta_text ?? null,
    cta_link: section?.cta_link ?? fallback?.cta_link ?? null,
    extra: (section?.extra ?? fallback?.extra ?? {}) as Record<string, unknown>,
    isLoading: q.isLoading,
  };
}
