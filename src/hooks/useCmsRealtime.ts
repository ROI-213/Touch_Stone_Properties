import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes once to changes on every CMS-backed table and invalidates the
 * matching public-site React Query caches. Mount this near the app root.
 */
export function useCmsRealtime() {
  const qc = useQueryClient();

  useEffect(() => {
    const rand = Math.random().toString(36).slice(2);
    const map: Array<{ table: string; keys: string[][] }> = [
      { table: "site_settings", keys: [["site-about"], ["site-about-page"], ["site-brand"], ["site-partners-section"], ["site-seo"], ["site-search-filters"], ["search-filters"], ["site-contact"]] },
      { table: "testimonials", keys: [["site-testimonials", true], ["site-testimonials", false]] as any },
      { table: "partners", keys: [["site-partners", true], ["site-partners", false]] as any },
      { table: "success_stories", keys: [["site-stories", true], ["site-stories", false]] as any },
      { table: "faqs", keys: [["site-faqs", true], ["site-faqs", false]] as any },
      { table: "navigation_items", keys: [["site-nav", "header"], ["site-nav", "footer"]] as any },
      { table: "banners", keys: [["site-banners"]] },
      { table: "hot_property_settings", keys: [["hot-property"]] },
      { table: "property_assignments", keys: [["public-properties"]] },
      { table: "property_amenities", keys: [["public-properties"]] },
      { table: "contact_info", keys: [["site-contact"]] },
    ];

    const channel = supabase.channel(`cms-live-${rand}`);
    for (const { table, keys } of map) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table } as any,
        () => {
          for (const key of keys) qc.invalidateQueries({ queryKey: key as any });
        },
      );
    }
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}
