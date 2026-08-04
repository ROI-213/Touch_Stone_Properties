import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu as MenuIcon, X, LogOut, Home } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import brandLogo from "@/assets/brand/logo.png";
import { useBrandSettings } from "@/hooks/useSiteSettings";
import { resolveLocalImage } from "@/data/siteImages";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const { brand } = useBrandSettings();
  const logoSrc = resolveLocalImage(brand?.logo_url, brandLogo);
  const brandName = brand?.name || "Touchstone Admin";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 flex h-14 sm:h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-3 sm:px-4 lg:px-6 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle Navigation"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>

          <Link to="/admin" className="flex items-center gap-2 min-w-0">
            <img src={logoSrc} alt={brandName} className="h-8 sm:h-9 w-auto shrink-0 object-contain" />
            <div className="leading-tight min-w-0">
              <div className="truncate text-xs sm:text-sm font-bold text-[#0a1f44]">{brandName}</div>
              <div className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-[#c9a961]">CMS Panel</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 sm:px-3"
          >
            <Home size={14} className="text-[#c9a961]" /> <span className="hidden sm:inline">View Site</span>
          </Link>
          
          <div className="hidden text-right leading-tight md:block">
            <div className="text-xs font-semibold text-slate-800">{profile?.full_name || "Admin User"}</div>
            <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{profile?.email || ""}</div>
          </div>

          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 sm:px-3"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <div className="flex min-w-0">
        {/* Desktop Sidebar */}
        <aside className="sticky top-14 sm:top-16 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
          <AdminSidebar />
        </aside>

        {/* Mobile Backdrop & Drawer */}
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 sm:h-16 items-center justify-between border-b border-slate-200 px-4">
            <div className="flex items-center gap-2">
              <img src={logoSrc} alt="" className="h-7 w-auto object-contain" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0a1f44]">Navigation Menu</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
          <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="min-w-0 flex-1 max-w-full p-3 sm:p-5 lg:p-7 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
