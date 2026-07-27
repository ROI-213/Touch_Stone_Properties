import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Save, Trash2 } from "lucide-react";
import {
  listFormOptions, createFormOption, updateFormOption, deleteFormOption,
  type FormOption,
} from "@/lib/form-options";

export const Route = createFileRoute("/admin/forms")({
  component: FormsAdmin,
});

function FormsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-form-options"], queryFn: listFormOptions });
  const items = data ?? [];

  const groups = useMemo(() => {
    const m = new Map<string, FormOption[]>();
    for (const o of items) {
      const k = `${o.form_key} · ${o.field_key}`;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(o);
    }
    return Array.from(m.entries());
  }, [items]);

  const create = useMutation({
    mutationFn: (input: Omit<FormOption, "id" | "created_at" | "updated_at">) => createFormOption(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-form-options"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const upd = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<FormOption> }) => updateFormOption(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-form-options"] });
      qc.invalidateQueries({ queryKey: ["form_options"] });
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFormOption(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-form-options"] });
      qc.invalidateQueries({ queryKey: ["form_options"] });
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function addOption(formKey: string, fieldKey: string, currentMax: number) {
    const label = window.prompt(`New option label for ${formKey}.${fieldKey}`)?.trim();
    if (!label) return;
    create.mutate({
      form_key: formKey,
      field_key: fieldKey,
      label,
      value: label,
      display_order: currentMax + 10,
      is_active: true,
    });
  }

  function addGroup() {
    const formKey = window.prompt("Form key (e.g. search, enquiry)")?.trim();
    if (!formKey) return;
    const fieldKey = window.prompt("Field key (e.g. city, budget_min)")?.trim();
    if (!fieldKey) return;
    create.mutate({ form_key: formKey, field_key: fieldKey, label: "Option 1", value: "Option 1", display_order: 10, is_active: true });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0a1f44]">Form Options</h1>
          <p className="mt-1 text-sm text-slate-500">Manage dropdown choices used by the search panel and enquiry forms.</p>
        </div>
        <button onClick={addGroup} className="inline-flex items-center gap-1.5 rounded-md bg-[#0a1f44] px-3 py-1.5 text-sm text-white">
          <Plus size={14} /> New field
        </button>
      </div>

      {isLoading && <div className="text-sm text-slate-500">Loading…</div>}
      {!isLoading && groups.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
          No options yet.
        </div>
      )}

      <div className="space-y-4">
        {groups.map(([key, rows]) => {
          const [formKey, fieldKey] = key.split(" · ");
          const maxOrder = rows.reduce((m, r) => Math.max(m, r.display_order), 0);
          return (
            <div key={key} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-mono text-xs text-slate-500">{key}</div>
                <button onClick={() => addOption(formKey, fieldKey, maxOrder)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">
                  <Plus size={12} /> Option
                </button>
              </div>
              <div className="space-y-2">
                {rows.map((r) => (
                  <Row key={r.id} row={r} onSave={(patch) => upd.mutate({ id: r.id, patch })} onDelete={() => { if (confirm("Delete option?")) del.mutate(r.id); }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ row, onSave, onDelete }: { row: FormOption; onSave: (patch: Partial<FormOption>) => void; onDelete: () => void }) {
  const [v, setV] = useState(row);
  const dirty = v.label !== row.label || v.value !== row.value || v.display_order !== row.display_order || v.is_active !== row.is_active;
  return (
    <div className="grid grid-cols-[1fr_1fr_80px_auto_auto] items-center gap-2">
      <input value={v.label} onChange={(e) => setV({ ...v, label: e.target.value })} className={inputCls} placeholder="Label" />
      <input value={v.value} onChange={(e) => setV({ ...v, value: e.target.value })} className={inputCls} placeholder="Value" />
      <input type="number" value={v.display_order} onChange={(e) => setV({ ...v, display_order: Number(e.target.value) })} className={inputCls} />
      <label className="inline-flex items-center gap-1 text-xs text-slate-600">
        <input type="checkbox" checked={v.is_active} onChange={(e) => setV({ ...v, is_active: e.target.checked })} /> Active
      </label>
      <div className="flex items-center gap-1">
        <button disabled={!dirty} onClick={() => onSave({ label: v.label, value: v.value, display_order: v.display_order, is_active: v.is_active })}
          className="inline-flex items-center gap-1 rounded-md bg-[#0a1f44] px-2 py-1 text-xs text-white disabled:opacity-40"><Save size={12} /></button>
        <button onClick={onDelete} className="rounded-md p-1 text-rose-500 hover:bg-rose-50"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-[#c9a961]";
