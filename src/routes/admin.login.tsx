import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Login — Touchstone Properties" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { isAdmin, isLoading } = useIsAdmin();
  const { isStaff, isLoading: staffLoading } = useStaffPermissions();
  const { openModal, closeModal } = useAuthModal();
  const [permissionDenied, setPermissionDenied] = useState(false);

  const rolesLoading = isLoading || staffLoading;
  const hasAccess = isAdmin || isStaff;

  useEffect(() => {
    if (!loading && !user) {
      openModal("login", { loginOnly: true });
    }
  }, [loading, user, openModal]);

  useEffect(() => {
    return () => closeModal();
  }, [closeModal]);

  useEffect(() => {
    if (!loading && user && !rolesLoading && !hasAccess) {
      setPermissionDenied(true);
      void signOut();
    }
  }, [hasAccess, rolesLoading, loading, signOut, user]);

  useEffect(() => {
    if (!loading && user && !rolesLoading && hasAccess) {
      void navigate({ to: isAdmin ? "/admin/properties" : "/admin/tasks", replace: true });
    }
  }, [hasAccess, isAdmin, rolesLoading, loading, navigate, user]);

  if (loading || (user && rolesLoading)) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="text-sm text-slate-500">Loading admin…</div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#0a1f44]/5 text-[#0a1f44]">
          {permissionDenied ? <Building2 size={20} /> : <Lock size={20} />}
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-[#0a1f44]">
          Admin Sign In Required
        </h1>
        {permissionDenied ? (
          <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            You do not have permission to access the admin panel.
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            Please sign in with an administrator account to access the CMS.
          </p>
        )}
        <button
          onClick={() => openModal("login", { loginOnly: true })}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[#c9a961] px-6 text-sm font-medium text-white hover:bg-[#b89651]"
        >
          Sign In
        </button>
        <div className="mt-4 text-xs text-slate-400">
          <Link to="/" className="hover:text-slate-600">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}