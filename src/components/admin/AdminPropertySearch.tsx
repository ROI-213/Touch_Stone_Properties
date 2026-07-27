import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface AdminPropertySearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  isSearching?: boolean;
}

export function AdminPropertySearch({
  value,
  onChange,
  placeholder = "Search properties by title, ID, location, builder...",
  isSearching = false,
}: AdminPropertySearchProps) {
  const [internalVal, setInternalVal] = useState(value);

  // Sync internal state if external value changes (e.g. clear filters)
  useEffect(() => {
    setInternalVal(value);
  }, [value]);

  // Debounce changes (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalVal !== value) {
        onChange(internalVal);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [internalVal, onChange, value]);

  const handleClear = () => {
    setInternalVal("");
    onChange("");
  };

  return (
    <div className="relative w-full min-w-0 lg:max-w-xl">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />

      <input
        type="text"
        value={internalVal}
        onChange={(e) => setInternalVal(e.target.value)}
        placeholder={placeholder}
        aria-label="Search properties"
        className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />

      {isSearching ? (
        <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#c9a961]" />
      ) : internalVal ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
          className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}
