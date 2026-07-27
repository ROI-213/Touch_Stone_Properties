import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== confirm) return toast.error("Passwords don't match");
    if (pw.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. You're now signed in.");
    navigate({ to: "/customer-dashboard" });
  };

  return (
    <div className="min-h-screen bg-ivory px-4 py-20">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-elevated">
        <h1 className="font-display text-2xl font-bold text-charcoal">Set a new password</h1>
        <p className="mt-1 text-[13px] text-charcoal/60">
          Enter a new password for your Touchstone account.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              placeholder="New password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-10 py-2.5 text-[14px] focus:border-[#C8A34D] focus:outline-none focus:ring-2 focus:ring-[#C8A34D]/15"
            />
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-10 py-2.5 text-[14px] focus:border-[#C8A34D] focus:outline-none focus:ring-2 focus:ring-[#C8A34D]/15"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-[#C8A34D] to-[#E4C06F] py-2.5 text-[14px] font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
