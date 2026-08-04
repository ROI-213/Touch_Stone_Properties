import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DownloadsState {
  ids: string[];
  add: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useDownloadsStore = create<DownloadsState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) =>
        set((state) => {
          if (state.ids.includes(id)) return state;
          return { ids: [id, ...state.ids] };
        }),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
    }),
    {
      name: "touchstone-downloads",
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
