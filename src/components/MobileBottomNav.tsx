import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Building2, Heart, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlistStore } from "@/hooks/useWishlist";

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const wishlistCount = useWishlistStore((s) => s.ids.length);

  // Hide on admin routes or when embedded
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const tabs = [
    {
      label: "Home",
      to: "/",
      isActive: pathname === "/",
      icon: Home,
    },
    {
      label: "Properties",
      to: "/buy-properties/$type",
      params: { type: "all" },
      isActive: pathname.startsWith("/buy-properties") || pathname.startsWith("/rent-properties"),
      icon: Building2,
    },
    {
      label: "Wishlist",
      to: "/wishlist",
      badge: wishlistCount > 0 ? (wishlistCount > 99 ? "99+" : wishlistCount) : null,
      isActive: pathname.startsWith("/wishlist"),
      icon: Heart,
    },
    {
      label: "Enquire",
      to: "/contact-us",
      isActive: pathname === "/contact-us" || pathname === "/contact",
      icon: MessageCircle,
    },
    {
      label: "Profile",
      to: "/customer-dashboard/profile",
      isActive: pathname.startsWith("/customer-dashboard"),
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-[70] block md:hidden border-t border-black/10 bg-white/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[max(0px,env(safe-area-inset-bottom))]"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const content = (
            <div className="relative flex flex-col items-center justify-center gap-0.5 w-full py-1">
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-colors duration-150 ${
                    tab.isActive ? "text-gold" : "text-charcoal/70"
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-crimson px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight transition-colors duration-150 ${
                  tab.isActive ? "font-bold text-gold" : "text-charcoal/70"
                }`}
              >
                {tab.label}
              </span>

              {tab.isActive && (
                <motion.span
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-1 h-1 w-6 rounded-full bg-gold shadow-[0_2px_8px_rgba(200,163,77,0.5)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </div>
          );

          return (
            <Link
              key={tab.label}
              to={tab.to as any}
              params={tab.params as any}
              preload={false}
              className="relative flex flex-1 h-full min-h-[48px] min-w-[48px] items-center justify-center select-none active:scale-95 transition-transform touch-manipulation cursor-pointer"
              aria-label={tab.label}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
