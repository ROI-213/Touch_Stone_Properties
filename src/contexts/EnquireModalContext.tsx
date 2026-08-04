import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { EnquireModal } from "@/components/EnquireModal";

type EnquireProperty = {
  id: string;
  title: string;
  location: string;
  price: string;
  assignedStaffId?: string | null;
};

type Ctx = {
  open: (property: EnquireProperty) => void;
  close: () => void;
};

const EnquireCtx = createContext<Ctx | null>(null);

export function EnquireModalProvider({ children }: { children: ReactNode }) {
  const [property, setProperty] = useState<EnquireProperty | null>(null);

  const open = useCallback((p: EnquireProperty) => setProperty(p), []);
  const close = useCallback(() => setProperty(null), []);

  return (
    <EnquireCtx.Provider value={{ open, close }}>
      {children}
      <EnquireModal
        open={property !== null}
        onClose={close}
        property={
          property ?? { id: "", title: "", location: "", price: "", assignedStaffId: null }
        }
      />
    </EnquireCtx.Provider>
  );
}

export function useEnquireModal(): Ctx {
  const ctx = useContext(EnquireCtx);
  // Fallback no-op so cards outside a provider still render; they simply won't open a modal.
  if (!ctx) {
    return {
      open: () => {
        if (typeof console !== "undefined") {
          console.warn("[EnquireModal] No <EnquireModalProvider> in tree; enquire click ignored.");
        }
      },
      close: () => {},
    };
  }
  return ctx;
}
