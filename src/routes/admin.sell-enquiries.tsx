import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2, Download, Phone, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  SELL_ENQUIRY_STATUSES, type SellEnquiry, type SellEnquiryStatus,
  deleteSellEnquiry, listSellEnquiries, updateSellEnquiry,
} from "@/lib/sell-enquiries";

export const Route = createFileRoute("/admin/sell-enquiries")({
  component: SellEnquiriesPage,
});

const STATUS_STYLES: Record<SellEnquiryStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  "Site Visit Scheduled": "bg-amber-100 text-amber-700",
  Verified: "bg-emerald-100 text-emerald-700",
  Listed: "bg-teal-100 text-teal-700",
  Rejected: "bg-rose-100 text-rose-700",
};

function waNumber(raw?: string | null): string {
  const d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  return d.startsWith("91") ? d : d.length === 10 ? `91${d}` : d;
}
function waText(e: SellEnquiry): string {
  const name = e.seller_name || "there";
  const type = e.property_type || "property";
  const loc = e.locality || e.zone || e.city || "your area";
  return `Hi ${name}, this is Touch Stone Properties. We received your property listing enquiry for ${type} in ${loc}. Our team would like to discuss your property details.`;
}

function SellEnquiriesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-sell-enquiries"], queryFn: listSellEnquiries });
  const list: SellEnquiry[] = data ?? [];

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<SellEnquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-sell-enquiries"] });

  const updateM = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<SellEnquiry> }) => updateSellEnquiry(id, patch),
    onSuccess: (_d, vars) => {
      invalidate();
      if (active?.id === vars.id) setActive({ ...active, ...vars.patch } as SellEnquiry);
    },
    onError: (e: any) => toast.error(e.message || "Update failed"),
  });
  const deleteM = useMutation({
    mutationFn: (id: string) => deleteSellEnquiry(id),
    onSuccess: (_d, id) => {
      invalidate();
      if (active?.id === id) setActive(null);
      setDeleteId(null);
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message || "Delete failed"),
  });

  const filtered = useMemo(() => list.filter((e) => {
    if (statusFilter !== "All" && e.status !== statusFilter) return false;
    if (dateFilter && !e.created_at.startsWith(dateFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = [e.seller_name, e.seller_phone, e.seller_email, e.locality, e.zone, e.city, e.property_type, e.status].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }), [list, statusFilter, dateFilter, search]);

  const stats = useMemo(() => {
    const acc: Record<string, number> = { Total: list.length };
    for (const s of SELL_ENQUIRY_STATUSES) acc[s] = 0;
    for (const e of list) acc[e.status]++;
    return acc;
  }, [list]);

  const exportCsv = () => {
    const header = ["Date","Name","Phone","Email","City","Zone","Locality","Address","Type","Price","Sqft","Config","Furnishing","Possession","Amenities","Status","Map Link"];
    const q = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = filtered.map((e) => [
      e.created_at, e.seller_name, e.seller_phone, e.seller_email, e.city, e.zone, e.locality, e.full_address,
      e.property_type, e.asking_price, e.built_up_area, e.configuration, e.furnishing, e.possession,
      (e.amenities ?? []).join("; "), e.status, e.google_map_link,
    ].map(q).join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sell-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Sell Property Enquiries</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? "Loading…" : `${list.length} seller submissions`}
          </p>
        </div>
        <button onClick={exportCsv}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#0a1f44] px-4 py-2 text-sm text-white hover:bg-[#0a1f44]/90">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div>
            <div className="font-numeric text-2xl font-bold text-[#0a1f44]">{v}</div>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="mt-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, locality, type…"
          className="flex-1 min-w-0 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#c9a961]" />
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:w-auto">
            <option>All</option>
            {SELL_ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:w-auto" />
        </div>
        {(statusFilter !== "All" || dateFilter || search) && (
          <button onClick={() => { setStatusFilter("All"); setDateFilter(""); setSearch(""); }}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">Clear</button>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-3">Date</th><th className="p-3">Seller</th><th className="p-3">Phone</th>
              <th className="p-3">Locality</th><th className="p-3">Type</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-slate-400">No seller enquiries yet.</td></tr>}
            {filtered.map((e) => (
              <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="p-3 text-xs text-slate-500">{new Date(e.created_at).toLocaleString()}</td>
                <td className="p-3 font-medium text-[#0a1f44]">{e.seller_name}</td>
                <td className="p-3">{e.seller_phone}</td>
                <td className="p-3 text-xs text-slate-500">{[e.locality, e.zone, e.city].filter(Boolean).join(", ") || "—"}</td>
                <td className="p-3 text-xs text-slate-500">{e.property_type || "—"}</td>
                <td className="p-3">
                  <select value={e.status} onChange={(ev) => updateM.mutate({ id: e.id, patch: { status: ev.target.value as SellEnquiryStatus } })}
                    className={`rounded border-0 px-2 py-1 text-xs font-medium ${STATUS_STYLES[e.status]}`}>
                    {SELL_ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setActive(e)} title="View"
                      className="grid h-8 w-8 place-items-center rounded text-slate-600 hover:bg-slate-100">
                      <Eye size={14} />
                    </button>
                    {waNumber(e.seller_phone) && (
                      <>
                        <a href={`tel:+${waNumber(e.seller_phone)}`} title="Call seller"
                          className="grid h-8 w-8 place-items-center rounded text-[#c9a961] hover:bg-amber-50">
                          <Phone size={14} />
                        </a>
                        <a href={`https://wa.me/${waNumber(e.seller_phone)}?text=${encodeURIComponent(waText(e))}`}
                          target="_blank" rel="noopener noreferrer" title="WhatsApp seller"
                          className="grid h-8 w-8 place-items-center rounded text-emerald-600 hover:bg-emerald-50">
                          <MessageCircle size={14} />
                        </a>
                      </>
                    )}
                    <button onClick={() => setDeleteId(e.id)} title="Delete"
                      className="grid h-8 w-8 place-items-center rounded text-red-500 hover:bg-red-50">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:hidden">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">No seller enquiries found.</div>
        )}
        {filtered.map((e) => (
          <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-[#0a1f44] text-sm">{e.seller_name}</div>
                <div className="text-xs text-slate-500">{new Date(e.created_at).toLocaleDateString()} · {e.seller_phone}</div>
              </div>
              <select value={e.status} onChange={(ev) => updateM.mutate({ id: e.id, patch: { status: ev.target.value as SellEnquiryStatus } })}
                className={`rounded border-0 px-2 py-1 text-xs font-medium ${STATUS_STYLES[e.status]}`}>
                {SELL_ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Locality: <strong>{[e.locality, e.zone, e.city].filter(Boolean).join(", ") || "—"}</strong></span>
              <span className="truncate">{e.property_type || "—"}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
              <button onClick={() => setActive(e)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                <Eye size={14} /> View Details
              </button>
              {waNumber(e.seller_phone) && (
                <>
                  <a href={`tel:+${waNumber(e.seller_phone)}`} className="grid h-9 w-9 place-items-center rounded-lg border border-amber-200 bg-amber-50 text-[#c9a961]">
                    <Phone size={15} />
                  </a>
                  <a href={`https://wa.me/${waNumber(e.seller_phone)}?text=${encodeURIComponent(waText(e))}`} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                    <MessageCircle size={15} />
                  </a>
                </>
              )}
              <button onClick={() => setDeleteId(e.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="flex max-h-[85vh] max-w-lg flex-col gap-0 p-0">
          <DialogHeader className="flex-row items-center gap-2 border-b border-slate-100 px-5 py-3">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              aria-label="Back"
            >
              ← Back
            </button>
            <DialogTitle className="truncate">{active?.seller_name}</DialogTitle>
          </DialogHeader>
          {active && (
            <div className="flex-1 space-y-2 overflow-y-auto px-5 py-4 text-sm">
              <Row label="Phone" value={active.seller_phone} />
              <Row label="Email" value={active.seller_email || ""} />
              <Row label="City" value={active.city || ""} />
              <Row label="Zone" value={active.zone || ""} />
              <Row label="Locality" value={active.locality || ""} />
              <Row label="Address" value={active.full_address || ""} />
              <Row label="Property Type" value={active.property_type || ""} />
              <Row label="Asking Price" value={active.asking_price ? `₹ ${active.asking_price.toLocaleString("en-IN")}` : ""} />
              <Row label="Built-up Area" value={active.built_up_area ? `${active.built_up_area} sqft` : ""} />
              <Row label="Configuration" value={active.configuration || ""} />
              <Row label="Furnishing" value={active.furnishing || ""} />
              <Row label="Possession" value={active.possession || ""} />
              <Row label="Amenities" value={(active.amenities ?? []).join(", ")} />
              <Row label="Coordinates" value={active.coordinates ? `${active.coordinates.lat.toFixed(5)}, ${active.coordinates.lng.toFixed(5)}` : ""} />
              {active.google_map_link && (
                <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
                  <span className="text-xs text-slate-500">Map Link</span>
                  <a href={active.google_map_link} target="_blank" rel="noreferrer" className="truncate text-right text-blue-600 hover:underline">Open</a>
                </div>
              )}
              <Row label="Status" value={active.status} />
              <Row label="Submitted" value={new Date(active.created_at).toLocaleString()} />
              {(active.photos ?? []).length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-500">Photos</div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(active.photos ?? []).map((src, idx) => (
                      <a key={`${src}-${idx}`} href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded border border-slate-200">
                        <img src={src} alt={`Property upload ${idx + 1}`} className="h-20 w-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs font-medium text-slate-500">Description</div>
                <pre className="mt-1 whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs">{active.description || "—"}</pre>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Internal notes</div>
                <textarea
                  defaultValue={active.notes || ""}
                  onBlur={(e) => updateM.mutate({ id: active.id, patch: { notes: e.target.value } })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-slate-200 p-2 text-sm" />
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
            {active && waNumber(active.seller_phone) && (
              <>
                <a href={`tel:+${waNumber(active.seller_phone)}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#c9a961] px-3 py-1.5 text-xs font-medium text-[#c9a961] hover:bg-amber-50">
                  <Phone size={12} /> Call
                </a>
                <a href={`https://wa.me/${waNumber(active.seller_phone)}?text=${encodeURIComponent(waText(active))}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-emerald-600 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50">
                  <MessageCircle size={12} /> WhatsApp
                </a>
              </>
            )}
            <button
              type="button"
              onClick={() => setActive(null)}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>

          </div>
        </DialogContent>
      </Dialog>


      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this seller enquiry?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={() => deleteId && deleteM.mutate(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-100 pb-1.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-slate-700">{value || "—"}</span>
    </div>
  );
}
