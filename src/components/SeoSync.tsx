import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { getSeoForRoute } from "@/lib/seo";

function setMeta(attr: "name" | "property", key: string, value: string | null) {
  if (typeof document === "undefined") return;
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!value) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string | null) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!href) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Reads seo_metadata for the current pathname and patches document head live. */
export function SeoSync() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data } = useQuery({
    queryKey: ["seo", pathname],
    queryFn: () => getSeoForRoute(pathname),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!data) return;
    if (data.title) document.title = data.title;
    setMeta("name", "description", data.description);
    setMeta("name", "keywords", data.keywords);
    setMeta("property", "og:title", data.title);
    setMeta("property", "og:description", data.description);
    setMeta("property", "og:image", data.og_image);
    setMeta("name", "twitter:title", data.title);
    setMeta("name", "twitter:description", data.description);
    setMeta("name", "twitter:image", data.og_image);
    setLink("canonical", data.canonical);
  }, [data]);

  return null;
}
