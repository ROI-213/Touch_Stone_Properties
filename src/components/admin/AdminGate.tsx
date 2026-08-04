import { useEffect, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldAlert } from "lucide-react";
import { findModuleForPath } from "@/lib/staff-modules";

export function AdminGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isAdmin, isLoading } = useIsAdmin();
  const { isStaff, can, isLoading: permsLoading } = useStaffPermissions();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/admin/login", replace: true });
  }, [loading, navigate, user]);

  if (loading || isLoading || permsLoading) {
    return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="text-sm text-slate-500">Loading admin…</div></div>;
  }
  if (!user) return null;

  const hasAnyAdminAccess = isAdmin || isStaff;
  if (!hasAnyAdminAccess) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600"><ShieldAlert size={20} /></div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-[#0a1f44]">Access Denied</h1>
          <p className="mt-2 text-sm text-slate-600">Your account doesn't have admin privileges. Contact a super admin to be granted access.</p>
          <div className="mt-5 text-xs text-slate-400">Signed in as <span className="font-medium text-slate-600">{user.email}</span></div>
          <Link to="/" className="mt-4 inline-block text-xs text-[#c9a961] hover:underline">← Back to site</Link>
        </div>
      </div>
    );
  }

  // Module-level gate for staff
  if (!isAdmin) {
    // Allow base /admin and the dedicated tasks page for any staff
    const isBase = pathname === "/admin" || pathname === "/admin/";
    const isTasks = pathname.startsWith("/admin/tasks");
    if (!isBase && !isTasks) {
      const mod = findModuleForPath(pathname);
      if (!mod || !can(mod.key, "view")) {
        return (
          <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
            <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600"><ShieldAlert size={20} /></div>
              <h1 className="mt-4 font-display text-2xl font-semibold text-[#0a1f44]">Access Denied</h1>
              <p className="mt-2 text-sm text-slate-600">You don't have permission to view this module.</p>
              <Link to="/admin/tasks" className="mt-4 inline-block text-xs text-[#c9a961] hover:underline">→ Go to My Tasks</Link>
            </div>
          </div>
        );
      }
    }
  }

  return <>{children}</>;
}
