import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { ShareModal, type SharePropertyData } from "@/components/ShareButton";

type Ctx = {
  open: (property: SharePropertyData) => void;
  close: () => void;
};

const ShareCtx = createContext<Ctx | null>(null);

export function ShareModalProvider({ children }: { children: ReactNode }) {
  const [property, setProperty] = useState<SharePropertyData | null>(null);

  const open = useCallback((p: SharePropertyData) => setProperty(p), []);
  const close = useCallback(() => setProperty(null), []);

  return (
    <ShareCtx.Provider value={{ open, close }}>
      {children}
      <ShareModal
        open={property !== null}
        onClose={close}
        property={property ?? { title: "", slug: "" }}
      />
    </ShareCtx.Provider>
  );
}

export function useShareModal(): Ctx {
  const ctx = useContext(ShareCtx);
  if (!ctx) {
    return {
      open: () => {
        if (typeof console !== "undefined") {
          console.warn("[ShareModal] No <ShareModalProvider> in tree; share click ignored.");
        }
      },
      close: () => {},
    };
  }
  return ctx;
}
