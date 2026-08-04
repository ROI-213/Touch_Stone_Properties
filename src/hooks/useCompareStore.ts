import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

interface CompareState {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) =>
        set((state) => {
          if (state.ids.includes(id)) return state;
          if (state.ids.length >= 4) {
            toast.error("You can compare up to 4 properties at a time.");
            return state;
          }
          toast.success("Added to Compare List");
          return { ids: [...state.ids, id] };
        }),
      remove: (id) =>
        set((state) => ({
          ids: state.ids.filter((i) => i !== id),
        })),
      toggle: (id) => {
        const state = get();
        if (state.ids.includes(id)) {
          state.remove(id);
          toast.success("Removed from Compare List");
        } else {
          state.add(id);
        }
      },
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
    }),
    {
      name: "touchstone-compare",
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
