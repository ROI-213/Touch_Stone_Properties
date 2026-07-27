import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, User as UserIcon, Phone, MapPin, Save } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/customer-dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", city: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        city: profile.city ?? "",
      });
    }
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        city: form.city,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    await refreshProfile();
  };

  return (
    <div>
      <div className="mb-6">
        <div className="text-[12px] font-bold uppercase tracking-[3px] text-[#C8A34D]">Profile</div>
        <h1 className="mt-1 font-display text-3xl font-bold text-charcoal">Account Details</h1>
      </div>

      <form onSubmit={save} className="rounded-2xl bg-white p-6 shadow-card md:p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProfileField icon={<UserIcon size={15} />} label="Full Name">
            <input
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] focus:border-[#C8A34D] focus:outline-none focus:ring-2 focus:ring-[#C8A34D]/15"
            />
          </ProfileField>
          <ProfileField icon={<Mail size={15} />} label="Email">
            <input
              value={user?.email ?? ""}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[14px] text-slate-500"
            />
          </ProfileField>
          <ProfileField icon={<Phone size={15} />} label="Phone">
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] focus:border-[#C8A34D] focus:outline-none focus:ring-2 focus:ring-[#C8A34D]/15"
            />
          </ProfileField>
          <ProfileField icon={<MapPin size={15} />} label="City">
            <input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] focus:border-[#C8A34D] focus:outline-none focus:ring-2 focus:ring-[#C8A34D]/15"
            />
          </ProfileField>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A34D] to-[#E4C06F] px-6 py-2.5 text-[13px] font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            <Save size={14} /> {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ProfileField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-charcoal/70">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}
