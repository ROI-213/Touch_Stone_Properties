import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { listStaff, listTasks, createTask, updateTask, deleteTask, getMyStaffRecord, type StaffTask } from "@/lib/staff";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";
import { STAFF_MODULES } from "@/lib/staff-modules";

export const Route = createFileRoute("/admin/tasks")({ component: TasksPage });

const STATUS_OPTIONS: StaffTask["status"][] = ["pending", "in_progress", "completed", "rejected"];
const STATUS_COLORS: Record<StaffTask["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

function TasksPage() {
  const qc = useQueryClient();
  const { isAdmin } = useStaffPermissions();
  const { data: me } = useQuery({ queryKey: ["my-staff-record"], queryFn: getMyStaffRecord, enabled: !isAdmin });
  const { data: staff = [] } = useQuery({ queryKey: ["admin-staff"], queryFn: listStaff, enabled: isAdmin });
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["staff-tasks", isAdmin ? "all" : me?.id],
    queryFn: () => listTasks(isAdmin ? undefined : { assignedTo: me?.id ?? "__none__" }),
    enabled: isAdmin || !!me?.id,
  });
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"><ChevronLeft size={14} /> Dashboard</Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">{isAdmin ? "Assigned Work" : "My Tasks"}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            {isAdmin ? "Assign tasks to staff and review their progress." : "Your assigned work. Update status and add notes as you go."}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#c9a961] px-3 py-2 text-sm font-medium text-white hover:bg-[#b89651]">
            <Plus size={14} /> Assign Task
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-3">
        {isLoading && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">Loading…</div>}
        {!isLoading && tasks.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400">No tasks yet.</div>}
        {tasks.map((t) => {
          const owner = staff.find((s) => s.id === t.assigned_to);
          return (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-[#0a1f44]">{t.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_COLORS[t.status]}`}>{t.status.replace("_", " ")}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase text-slate-600">{t.priority}</span>
                    {t.related_module && <span className="rounded-full bg-[#c9a961]/15 px-2 py-0.5 text-[10px] font-medium text-[#0a1f44]">{t.related_module}</span>}
                  </div>
                  {t.description && <p className="mt-1 text-sm text-slate-600">{t.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
                    {owner && <span>Assigned to: <b className="text-slate-700">{owner.name}</b></span>}
                    {t.due_date && <span>Due: {t.due_date}</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select value={t.status} onChange={async (e) => {
                    try { await updateTask(t.id, { status: e.target.value as StaffTask["status"] }); qc.invalidateQueries({ queryKey: ["staff-tasks"] }); }
                    catch (err: any) { toast.error(err.message); }
                  }} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                  {isAdmin && (
                    <button onClick={async () => { if (!confirm("Delete this task?")) return; await deleteTask(t.id); qc.invalidateQueries({ queryKey: ["staff-tasks"] }); }}
                      className="inline-flex items-center gap-1 rounded-md text-xs text-red-600 hover:underline"><Trash2 size={12} /> Delete</button>
                  )}
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <textarea defaultValue={t.staff_notes ?? ""} placeholder="Staff notes…" rows={2}
                  onBlur={async (e) => { if (e.target.value !== (t.staff_notes ?? "")) { await updateTask(t.id, { staff_notes: e.target.value }); qc.invalidateQueries({ queryKey: ["staff-tasks"] }); } }}
                  className="rounded-md border border-slate-200 bg-white p-2 text-xs" />
                {isAdmin && (
                  <textarea defaultValue={t.admin_remarks ?? ""} placeholder="Admin remarks…" rows={2}
                    onBlur={async (e) => { if (e.target.value !== (t.admin_remarks ?? "")) { await updateTask(t.id, { admin_remarks: e.target.value }); qc.invalidateQueries({ queryKey: ["staff-tasks"] }); } }}
                    className="rounded-md border border-slate-200 bg-white p-2 text-xs" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {open && isAdmin && (
        <TaskModal onClose={() => setOpen(false)} onSaved={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["staff-tasks"] }); }} staff={staff} />
      )}
    </div>
  );
}

function TaskModal({ onClose, onSaved, staff }: { onClose: () => void; onSaved: () => void; staff: { id: string; name: string }[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relatedModule, setRelatedModule] = useState("");
  const [assignedTo, setAssignedTo] = useState(staff[0]?.id ?? "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim()) { toast.error("Title required"); return; }
    if (!assignedTo) { toast.error("Pick a staff member"); return; }
    setSaving(true);
    try {
      await createTask({
        title, description: description || null, related_module: relatedModule || null,
        assigned_to: assignedTo, priority, due_date: dueDate || null,
        status: "pending", admin_remarks: null, staff_notes: null, attachment_url: null,
      });
      toast.success("Task assigned");
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-[#0a1f44]">Assign Task</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"><X size={16} /></button>
        </div>
        <div className="space-y-3 px-6 py-5 text-sm">
          <label className="block"><div className="mb-1 text-xs font-medium text-slate-600">Title *</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
          <label className="block"><div className="mb-1 text-xs font-medium text-slate-600">Description</div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block"><div className="mb-1 text-xs font-medium text-slate-600">Assigned to *</div>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select></label>
            <label className="block"><div className="mb-1 text-xs font-medium text-slate-600">Related module</div>
              <select value={relatedModule} onChange={(e) => setRelatedModule(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="">—</option>
                {STAFF_MODULES.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select></label>
            <label className="block"><div className="mb-1 text-xs font-medium text-slate-600">Priority</div>
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select></label>
            <label className="block"><div className="mb-1 text-xs font-medium text-slate-600">Due date</div>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={save} disabled={saving} className="rounded-lg bg-[#c9a961] px-4 py-2 text-sm font-medium text-white hover:bg-[#b89651] disabled:opacity-60">
            {saving ? "Saving…" : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
