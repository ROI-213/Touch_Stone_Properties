import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { filterLocalities } from "@/data/localities";

interface Props {
  value: string;
  onChange: (v: string) => void;
  city?: string;
  zone?: string;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function LocalityAutocomplete({
  value,
  onChange,
  city,
  zone,
  placeholder,
  label = "Locality",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => filterLocalities(value, { city, zone, limit: 8 }),
    [value, city, zone],
  );

  useEffect(() => {
    setActive(0);
  }, [value, city, zone]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const select = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, Math.max(suggestions.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open && suggestions[active]) {
      e.preventDefault();
      select(suggestions[active].name);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      {label && (
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 sm:text-xs">
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder ?? "Type locality..."}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        autoComplete="off"
        className="mt-1 h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-xs text-charcoal placeholder:text-charcoal/35 outline-none focus:border-gold sm:h-12 sm:text-sm"
      />
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-charcoal/10 bg-white shadow-lg">
          {suggestions.length === 0 ? (
            <div className="px-3 py-3 text-xs text-charcoal/55">
              No locality found. Please try another location.
            </div>
          ) : (
            <ul className="max-h-64 overflow-auto py-1">
              {suggestions.map((s, i) => (
                <li key={`${s.city}-${s.name}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      select(s.name);
                    }}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                      i === active ? "bg-gold/15 text-charcoal" : "text-charcoal/80 hover:bg-gold/10"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin size={12} className="text-gold" />
                      {s.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal/40">
                      {s.zone}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
