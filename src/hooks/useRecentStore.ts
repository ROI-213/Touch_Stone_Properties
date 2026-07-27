import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface RecentState {
  ids: string[];
  add: (id: string) => void;
  clear: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      add: (id) =>
        set((state) => {
          const filtered = state.ids.filter((i) => i !== id);
          return { ids: [id, ...filtered].slice(0, 20) };
        }),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "touchstone-recent",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
    }
  )
);
