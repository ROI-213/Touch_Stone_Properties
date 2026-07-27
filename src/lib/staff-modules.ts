// Single source of truth mapping admin routes <-> module permission keys.
// Keep keys in sync with staff_permissions.module_name values stored in DB.

export type StaffActionKey = "view" | "add" | "edit" | "delete" | "publish" | "export";

export type ModuleDef = {
  key: string;          // stored in staff_permissions.module_name
  label: string;
  group: string;
  route: string;        // primary admin route guarded by this module
  routePrefixes?: string[]; // extra prefixes also guarded
  actions: StaffActionKey[]; // which toggles to render for this module
};

const baseActions: StaffActionKey[] = ["view", "add", "edit", "delete"];
const contentActions: StaffActionKey[] = ["view", "add", "edit", "delete", "publish"];
const leadActions: StaffActionKey[] = ["view", "edit", "delete", "export"];

export const STAFF_MODULES: ModuleDef[] = [
  // Property Management
  { key: "hero_slides", label: "Hero Slides", group: "Property Management", route: "/admin/banners", actions: baseActions },
  { key: "properties", label: "Properties", group: "Property Management", route: "/admin/properties", actions: contentActions },
  { key: "builders", label: "Builders", group: "Property Management", route: "/admin/builders", actions: baseActions },
  { key: "locations", label: "Areas / Locations", group: "Property Management", route: "/admin/locations", actions: baseActions },
  { key: "amenities", label: "Amenities", group: "Property Management", route: "/admin/amenities", actions: baseActions },
  { key: "search_filters", label: "Search Filters", group: "Property Management", route: "/admin/search-filters", actions: ["view", "edit"] },
  { key: "form_options", label: "Form Options", group: "Property Management", route: "/admin/forms", actions: baseActions },
  { key: "featured", label: "Featured Properties", group: "Property Management", route: "/admin/featured", actions: ["view", "edit"] },
  { key: "top_featured", label: "Top Featured Properties", group: "Property Management", route: "/admin/top-featured", actions: ["view", "edit"] },
  { key: "hot_properties", label: "Hot Properties", group: "Property Management", route: "/admin/hot", actions: ["view", "edit"] },

  // Website Content
  { key: "site_content", label: "Site Content", group: "Website Content", route: "/admin/content", actions: contentActions },
  { key: "about_us", label: "About Us / Why Choose Us", group: "Website Content", route: "/admin/about", actions: contentActions },
  { key: "success_stories", label: "Success Stories", group: "Website Content", route: "/admin/stories", actions: contentActions },
  { key: "testimonials", label: "Testimonials", group: "Website Content", route: "/admin/testimonials", actions: contentActions },
  { key: "partners", label: "Partners", group: "Website Content", route: "/admin/partners", actions: baseActions },
  { key: "navigation", label: "Navigation", group: "Website Content", route: "/admin/navigation", actions: baseActions },
  { key: "footer", label: "Footer", group: "Website Content", route: "/admin/footer", actions: ["view", "edit"] },
  { key: "seo", label: "SEO Settings", group: "Website Content", route: "/admin/seo", actions: ["view", "edit"] },

  // Leads & Enquiries
  { key: "enquiries", label: "Enquiries", group: "Leads & Enquiries", route: "/admin/enquiries", actions: leadActions },
  { key: "contact_forms", label: "Contact Forms", group: "Leads & Enquiries", route: "/admin/contact-forms", actions: leadActions },
  { key: "site_visits", label: "Site Visits", group: "Leads & Enquiries", route: "/admin/site-visits", actions: leadActions },
  { key: "downloads", label: "Brochure Downloads", group: "Leads & Enquiries", route: "/admin/downloads", actions: ["view", "export"] },
  { key: "share_links", label: "Share Links", group: "Leads & Enquiries", route: "/admin/share-links", actions: ["view", "export"] },

  // Admin & Settings
  { key: "activity_logs", label: "Activity Logs", group: "Admin & Settings", route: "/admin/logs", actions: ["view", "export"] },
  { key: "admin_users", label: "Admin Users", group: "Admin & Settings", route: "/admin/users", actions: ["view"] },
  { key: "settings", label: "Settings", group: "Admin & Settings", route: "/admin/settings", actions: ["view", "edit"] },
  { key: "staff_management", label: "Staff Management", group: "Admin & Settings", route: "/admin/staff", actions: baseActions },
  { key: "staff_tasks", label: "Tasks / Assigned Work", group: "Admin & Settings", route: "/admin/tasks", actions: ["view", "add", "edit"] },
];

export const STAFF_MODULE_GROUPS = ["Property Management", "Website Content", "Leads & Enquiries", "Admin & Settings"] as const;

export function findModuleForPath(pathname: string): ModuleDef | undefined {
  // Longest-prefix match
  return [...STAFF_MODULES]
    .sort((a, b) => b.route.length - a.route.length)
    .find((m) => pathname === m.route || pathname.startsWith(m.route + "/") || (m.routePrefixes ?? []).some((p) => pathname.startsWith(p)));
}

export function generateStrongPassword(length = 14): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const nums = "23456789";
  const syms = "!@#$%^&*()-_=+?";
  const all = upper + lower + nums + syms;
  const required = [upper, lower, nums, syms].map((s) => s[Math.floor(Math.random() * s.length)]);
  const rest = Array.from({ length: length - required.length }, () => all[Math.floor(Math.random() * all.length)]);
  return [...required, ...rest].sort(() => Math.random() - 0.5).join("");
}
