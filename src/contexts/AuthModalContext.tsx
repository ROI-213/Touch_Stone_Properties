import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type Mode = "login" | "register" | "forgot";

interface Ctx {
  open: boolean;
  mode: Mode;
  loginOnly: boolean;
  openModal: (mode?: Mode, opts?: { loginOnly?: boolean }) => void;
  closeModal: () => void;
  setMode: (m: Mode) => void;
}

const AuthModalContext = createContext<Ctx | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [loginOnly, setLoginOnly] = useState(false);

  const openModal = useCallback((m?: Mode, opts?: { loginOnly?: boolean }) => {
    if (m) setMode(m);
    setLoginOnly(!!opts?.loginOnly);
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setOpen(false);
    setLoginOnly(false);
  }, []);

  const value = useMemo(
    () => ({ open, mode, loginOnly, openModal, closeModal, setMode }),
    [open, mode, loginOnly, openModal, closeModal],
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside AuthModalProvider");
  return ctx;
}
