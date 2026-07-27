import { Share2, Download, Trash2, X } from "lucide-react";

interface PropertyBulkActionBarProps {
  selectedCount: number;
  onShare: () => void;
  onExportCsv: () => void;
  onDeleteSelected: () => void;
  onClear: () => void;
}

export function PropertyBulkActionBar({
  selectedCount,
  onShare,
  onExportCsv,
  onDeleteSelected,
  onClear,
}: PropertyBulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-[#c9a961]/40 bg-white p-3.5 shadow-2xl transition-all md:static md:inset-auto md:mt-3 md:rounded-xl md:border-slate-200 md:bg-slate-50/80 md:shadow-xs">
      <div className="flex items-center gap-2 min-w-0">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#c9a961] text-xs font-bold text-white shrink-0">
          {selectedCount}
        </span>
        <span className="text-xs font-bold text-[#0a1f44] truncate">
          {selectedCount} propert{selectedCount > 1 ? "ies" : "y"} selected
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
        <button
          type="button"
          onClick={onShare}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#c9a961] px-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#b89651]"
        >
          <Share2 size={14} /> Share Selected
        </button>

        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Download size={13} /> Export CSV
        </button>

        <button
          type="button"
          onClick={onDeleteSelected}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-red-600 px-3 text-xs font-medium text-white transition hover:bg-red-700"
        >
          <Trash2 size={13} /> Delete
        </button>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
          title="Clear Selection"
        >
          <X size={14} /> <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </div>
  );
}
