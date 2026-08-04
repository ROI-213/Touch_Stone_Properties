import { useEffect, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";
import { useAuth } from "@/contexts/AuthContext";
import { findModuleForPath } from "@/lib/staff-modules";
import { ADMIN_NAV } from "@/components/admin/AdminSidebar";

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
    // User is logged in but not as admin/staff (e.g. a customer).
    // Redirect to the admin login page so they can sign in with admin credentials.
    void navigate({ to: "/admin/login", replace: true });
    return null;
  }

  // Module-level gate for staff — only show assigned modules
  if (!isAdmin) {
    const isBase = pathname === "/admin" || pathname === "/admin/";
    const isTasks = pathname.startsWith("/admin/tasks");
    const isChangePassword = pathname.startsWith("/admin/change-password");

    if (!isBase && !isTasks && !isChangePassword) {
      const mod = findModuleForPath(pathname);
      if (!mod || !can(mod.key, "view")) {
        // Staff doesn't have permission for this module.
        // Redirect to their first permitted sidebar item, or /admin/tasks as fallback.
        const firstPermitted = ADMIN_NAV.find((item) => {
          if (item.to === "/admin/tasks" || item.to === "/admin/change-password") return false;
          if (!item.moduleKey) return false;
          return can(item.moduleKey, "view");
        });
        void navigate({ to: firstPermitted?.to ?? "/admin/tasks", replace: true });
        return null;
      }
    }
  }

  return <>{children}</>;
}

