import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2, FolderTree, MapPin, Star, Crown, Flame,
  HardHat, Image as ImageIcon, Filter, Info, Trophy, MessageSquare,
  Handshake, Users, Heart, GitCompare, Mail, Phone, Calendar, Download,
  Share2, Menu, Layout, Search, UserCog, Settings, HelpCircle, History,
  ClipboardList, UserPlus, KeyRound,
} from "lucide-react";
import { useEnquiryCount } from "@/hooks/useEnquiryCount";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";

export type AdminNavItem = { label: string; to: string; icon: any; disabled?: boolean; moduleKey?: string };

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Hero Slides", to: "/admin/banners", icon: ImageIcon, moduleKey: "hero_slides" },
  { label: "Properties", to: "/admin/properties", icon: Building2, moduleKey: "properties" },
  { label: "Builders / Agents / Owners", to: "/admin/builders", icon: HardHat, moduleKey: "builders" },
  { label: "Areas / Locations", to: "/admin/locations", icon: MapPin, moduleKey: "locations" },
  { label: "Amenities", to: "/admin/amenities", icon: FolderTree, moduleKey: "amenities" },
  
  { label: "Form Options", to: "/admin/forms", icon: Filter, moduleKey: "form_options" },
  { label: "Featured", to: "/admin/featured", icon: Star, moduleKey: "featured" },
  { label: "Top Featured", to: "/admin/top-featured", icon: Crown, moduleKey: "top_featured" },
  
  
  { label: "About Us Page", to: "/admin/about-page", icon: Info, moduleKey: "about_us" },
  { label: "Success Stories", to: "/admin/stories", icon: Trophy, moduleKey: "success_stories" },
  { label: "Testimonials", to: "/admin/testimonials", icon: MessageSquare, moduleKey: "testimonials" },
  { label: "Partners", to: "/admin/partners", icon: Handshake, moduleKey: "partners" },
  { label: "Enquiries", to: "/admin/enquiries", icon: Mail, moduleKey: "enquiries" },
  { label: "Sell Property Enquiries", to: "/admin/sell-enquiries", icon: HardHat, moduleKey: "enquiries" },
  
  { label: "Footer", to: "/admin/footer", icon: Layout, moduleKey: "footer" },
  
  { label: "Activity Logs", to: "/admin/logs", icon: History, moduleKey: "activity_logs" },
  { label: "Admin Users", to: "/admin/users", icon: UserCog, moduleKey: "admin_users" },
  { label: "Staff", to: "/admin/staff", icon: UserPlus, moduleKey: "staff_management" },
  { label: "Tasks", to: "/admin/tasks", icon: ClipboardList, moduleKey: "staff_tasks" },
  { label: "Settings", to: "/admin/settings", icon: Settings, moduleKey: "settings" },
  { label: "Change Password", to: "/admin/change-password", icon: KeyRound },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const enquiryCount = useEnquiryCount();
  const { isAdmin, can, isStaff } = useStaffPermissions();
  const visibleNav = ADMIN_NAV.filter((item) => {
    if (isAdmin) return true;
    if (!isStaff) return false;
    if (item.to === "/admin/tasks") return true;
    if (item.to === "/admin/change-password") return true;
    if (!item.moduleKey) return false;
    return can(item.moduleKey, "view");
  });
  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto p-3">
      {visibleNav.map((item) => {
        const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
        const Icon = item.icon;
        const showEnquiryBadge = item.to === "/admin/enquiries" && enquiryCount > 0;
        const className = `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
          active
            ? "bg-[#c9a961] text-white shadow-sm"
            : item.disabled
            ? "text-slate-400 hover:bg-slate-100/60"
            : "text-slate-700 hover:bg-slate-100"
        }`;
        const content = (
          <>
            <Icon size={16} className="shrink-0" />
            <span className="truncate">{item.label}</span>
            {showEnquiryBadge && (
              <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {enquiryCount}
              </span>
            )}
            {item.disabled && !showEnquiryBadge && (
              <span className="ml-auto rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-slate-500">
                soon
              </span>
            )}
          </>
        );
        if (item.disabled) {
          return (
            <span key={item.to} className={className} title="Coming in next phase">
              {content}
            </span>
          );
        }
        return (
          <Link key={item.to} to={item.to} className={className} onClick={onNavigate}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
