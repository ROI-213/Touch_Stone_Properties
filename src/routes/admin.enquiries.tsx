import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2, Download, Phone, MessageCircle, Search } from "lucide-react";

function waNumber(raw?: string | null): string {
  let d = (raw || "").replace(/\D/g, "").replace(/^0+/, "");
  if (!d) return "";
  if (d.startsWith("91") && d.length === 12) return d;
  if (d.length === 10) return `91${d}`;
  return d;
}
function waText(e: { name?: string; propertyTitle?: string | null; requirementType?: string | null; source?: string | null }): string {
  const name = e.name || "there";
  if (e.propertyTitle) {
    const kind = e.requirementType || "enquiry";
    return `Hi ${name}, this is Touch Stone Properties. We received your ${kind} for ${e.propertyTitle}. Our team would like to assist you further.`;
  }
  return `Hi ${name}, this is Touch Stone Properties. We received your property enquiry from our website. Our team would like to assist you further.`;
}
import toast from "react-hot-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  type Enquiry, type EnquiryStatus, ENQUIRY_STATUSES,
  deleteEnquiry, exportEnquiriesCsv, getEnquiries, updateEnquiry,
} from "@/lib/enquiries";

export const Route = createFileRoute("/admin/enquiries")({
  component: EnquiriesPage,
});

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  "Follow-up": "bg-amber-100 text-amber-700",
  Converted: "bg-emerald-100 text-emerald-700",
  Closed: "bg-slate-200 text-slate-600",
};

function EnquiriesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-enquiries"], queryFn: getEnquiries });
  const list: Enquiry[] = data ?? [];

  const [reqFilter, setReqFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Enquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
    qc.invalidateQueries({ queryKey: ["enquiry-new-count"] });
  };

  const updateM = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Enquiry> }) => updateEnquiry(id, patch),
    onSuccess: (_d, vars) => {
      invalidate();
      if (active?.id === vars.id) setActive({ ...active, ...vars.patch });
    },
    onError: (e: any) => toast.error(e.message || "Update failed"),
  });
  const deleteM = useMutation({
    mutationFn: (id: string) => deleteEnquiry(id),
    onSuccess: (_d, id) => {
      invalidate();
      if (active?.id === id) setActive(null);
      setDeleteId(null);
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message || "Delete failed"),
  });

  const filtered = useMemo(() => list.filter((e) => {
    if (reqFilter !== "All" && e.requirementType !== reqFilter) return false;
    if (statusFilter !== "All" && e.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (![e.name, e.phone, e.email, e.location].some((v) => (v || "").toLowerCase().includes(s))) return false;
    }
    return true;
  }), [list, reqFilter, statusFilter, search]);

  const stats = useMemo(() => ({
    total: list.length,
    New: list.filter((e) => e.status === "New").length,
    "In Progress": list.filter((e) => e.status === "Contacted" || e.status === "Follow-up").length,
    Converted: list.filter((e) => e.status === "Converted").length,
    Closed: list.filter((e) => e.status === "Closed").length,
  }), [list]);

  const exportCsv = () => {
    const blob = new Blob([exportEnquiriesCsv(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Enquiries</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? "Loading…" : `${list.length} total enquiries from the website`}
          </p>
        </div>
        <button onClick={exportCsv}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#0a1f44] px-4 py-2 text-sm text-white hover:bg-[#0a1f44]/90">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div>
            <div className="font-numeric text-2xl font-bold text-[#0a1f44]">{v}</div>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="mt-5 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email, message…"
            className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-[#c9a961]"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full sm:w-auto rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option>All</option>
          {ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-3">Date</th><th className="p-3">Name</th><th className="p-3">Phone</th>
              <th className="p-3">Type</th><th className="p-3">Property</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-slate-400">No enquiries.</td></tr>}
            {filtered.map((e) => (
              <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="p-3 text-xs text-slate-500">{new Date(e.createdAt).toLocaleString()}</td>
                <td className="p-3 font-medium text-[#0a1f44]">{e.name}</td>
                <td className="p-3">{e.phone}</td>
                <td className="p-3">{e.requirementType}</td>
                <td className="p-3 text-xs text-slate-500">{e.propertyTitle || e.source || "—"}</td>
                <td className="p-3">
                  <select value={e.status} onChange={(ev) => updateM.mutate({ id: e.id, patch: { status: ev.target.value as EnquiryStatus } })}
                    className={`rounded border-0 px-2 py-1 text-xs font-medium ${STATUS_STYLES[e.status]}`}>
                    {ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setActive(e)} title="View"
                      className="grid h-8 w-8 place-items-center rounded text-slate-600 hover:bg-slate-100">
                      <Eye size={14} />
                    </button>
                    {waNumber(e.phone) && (
                      <>
                        <a href={`tel:+${waNumber(e.phone)}`} title="Call customer"
                          className="grid h-8 w-8 place-items-center rounded text-[#c9a961] hover:bg-amber-50">
                          <Phone size={14} />
                        </a>
                        <a href={`https://wa.me/${waNumber(e.phone)}?text=${encodeURIComponent(waText(e))}`}
                          target="_blank" rel="noopener noreferrer" title="WhatsApp customer"
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
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">No enquiries found.</div>
        )}
        {filtered.map((e) => (
          <div key={e.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-[#0a1f44] text-sm">{e.name}</div>
                <div className="text-xs text-slate-500">{new Date(e.createdAt).toLocaleDateString()} · {e.phone}</div>
              </div>
              <select value={e.status} onChange={(ev) => updateM.mutate({ id: e.id, patch: { status: ev.target.value as EnquiryStatus } })}
                className={`rounded border-0 px-2 py-1 text-xs font-medium ${STATUS_STYLES[e.status]}`}>
                {ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Type: <strong>{e.requirementType}</strong></span>
              <span className="truncate max-w-[150px]">{e.propertyTitle || e.source || "—"}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
              <button onClick={() => setActive(e)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                <Eye size={14} /> View Details
              </button>
              {waNumber(e.phone) && (
                <>
                  <a href={`tel:+${waNumber(e.phone)}`} className="grid h-9 w-9 place-items-center rounded-lg border border-amber-200 bg-amber-50 text-[#c9a961]">
                    <Phone size={15} />
                  </a>
                  <a href={`https://wa.me/${waNumber(e.phone)}?text=${encodeURIComponent(waText(e))}`} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
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
            <DialogTitle className="truncate">{active?.name}</DialogTitle>
          </DialogHeader>
          {active && (
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm">
              <Row label="Phone" value={active.phone} />
              <Row label="Email" value={active.email} />
              <Row label="Location" value={active.location} />
              <Row label="Budget" value={active.budget} />
              <Row label="Requirement" value={active.requirementType} />
              <Row label="Property" value={active.propertyTitle || "—"} />
              <Row label="Source" value={active.source} />
              <Row label="Page" value={active.pageUrl || "—"} />
              <Row label="Date" value={new Date(active.createdAt).toLocaleString()} />
              {(active.images ?? []).length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-500">Photos</div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(active.images ?? []).map((src, idx) => (
                      <a key={`${src}-${idx}`} href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded border border-slate-200">
                        <img src={src} alt={`Property upload ${idx + 1}`} className="h-20 w-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs font-medium text-slate-500">Message</div>
                <div className="mt-1 rounded bg-slate-50 p-3">{active.message || "—"}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Internal notes</div>
                <textarea defaultValue={active.notes || ""}
                  onBlur={(e) => updateM.mutate({ id: active.id, patch: { notes: e.target.value } })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-slate-200 p-2 text-sm" />
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
            {active && waNumber(active.phone) && (
              <>
                <a href={`tel:+${waNumber(active.phone)}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#c9a961] px-3 py-1.5 text-xs font-medium text-[#c9a961] hover:bg-amber-50">
                  <Phone size={12} /> Call
                </a>
                <a href={`https://wa.me/${waNumber(active.phone)}?text=${encodeURIComponent(waText(active))}`}
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
            <AlertDialogTitle>Delete this enquiry?</AlertDialogTitle>
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
