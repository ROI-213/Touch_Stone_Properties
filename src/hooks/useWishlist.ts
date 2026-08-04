import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

interface WishlistState {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [id, ...s.ids] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      toggle: (id) =>
        set((s) =>
          s.ids.includes(id)
            ? { ids: s.ids.filter((x) => x !== id) }
            : { ids: [id, ...s.ids] },
        ),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "tsp:wishlist",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
    },
  ),
);

/**
 * Backwards-compatible hook used by PropertyCard and other components.
 * Mirrors the previous Supabase-backed API but stored locally.
 */
export function useWishlist() {
  const ids = useWishlistStore((s) => s.ids);
  const add = useWishlistStore((s) => s.add);
  const remove = useWishlistStore((s) => s.remove);
  return {
    items: ids.map((property_id) => ({ id: property_id, property_id })),
    ids: new Set(ids),
    isLoading: false,
    add: async (id: string) => add(id),
    remove: async (id: string) => remove(id),
    has: (id: string) => ids.includes(id),
  };
}

export function useToggleWishlist() {
  const toggle = useWishlistStore((s) => s.toggle);
  const has = useWishlistStore((s) => s.has);
  return (propertyId: string) => {
    const wasIn = has(propertyId);
    toggle(propertyId);
    if (wasIn) {
      toast("💔 Removed from wishlist", { duration: 2200 });
    } else {
      toast.success("❤️ Added to wishlist", { duration: 2200 });
    }
  };
}
