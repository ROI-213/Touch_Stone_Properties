import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Hammer, MapPin, Tag } from "lucide-react";
import { useDbProperties } from "@/hooks/useDbProperties";

type SuggestionType = "project" | "builder" | "location" | "tag";
type Suggestion = { label: string; type: SuggestionType; sub?: string };

const ICONS: Record<SuggestionType, React.ComponentType<{ size?: number; className?: string }>> = {
  project: Building2,
  builder: Hammer,
  location: MapPin,
  tag: Tag,
};

function highlight(text: string, q: string) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-gold/30 text-charcoal p-0">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function KeywordAutocomplete({
  value,
  onChange,
  label = "Keyword",
  placeholder = "Builder / Project",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
}) {
  const { data: properties = [] } = useDbProperties();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [debounced, setDebounced] = useState(value);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 250);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pool = useMemo<Suggestion[]>(() => {
    const seen = new Set<string>();
    const list: Suggestion[] = [];
    const push = (s: Suggestion) => {
      const key = `${s.type}:${s.label.toLowerCase()}`;
      if (s.label && !seen.has(key)) {
        seen.add(key);
        list.push(s);
      }
    };
    for (const p of properties) {
      push({ label: p.title, type: "project", sub: p.builder });
      push({ label: p.builder, type: "builder" });
      if (p.area) push({ label: p.area, type: "location" });
      if (p.location) push({ label: p.location, type: "location" });
      if (p.type) push({ label: p.type, type: "tag" });
      if (p.bhk) push({ label: `${p.bhk}BHK`, type: "tag" });
    }
    return list;
  }, [properties]);

  const suggestions = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (q.length < 2) return [];
    return pool.filter((s) => s.label.toLowerCase().includes(q)).slice(0, 10);
  }, [pool, debounced]);

  useEffect(() => setActive(0), [debounced]);

  const choose = (s: Suggestion) => {
    onChange(s.label);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <label className="mb-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 sm:text-xs">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder={placeholder}
        autoComplete="off"
        className="mt-1 h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-xs text-charcoal placeholder:text-charcoal/35 outline-none focus:border-gold sm:h-12 sm:text-sm"
      />
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-xl border border-charcoal/10 bg-white py-1 shadow-elevated"
          >
            {suggestions.map((s, i) => {
              const Icon = ICONS[s.type];
              return (
                <li key={`${s.type}-${s.label}-${i}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(s)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm ${
                      i === active ? "bg-gold/10" : "hover:bg-charcoal/5"
                    }`}
                  >
                    <Icon size={14} className="shrink-0 text-gold" />
                    <span className="flex-1 truncate text-charcoal">
                      {highlight(s.label, debounced)}
                    </span>
                    {s.sub && (
                      <span className="truncate text-[11px] text-charcoal/50">{s.sub}</span>
                    )}
                    <span className="text-[10px] uppercase tracking-wide text-charcoal/40">
                      {s.type}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
