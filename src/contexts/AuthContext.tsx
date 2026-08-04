import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isReady: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();

  const fetchProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();
      if (error) {
        console.warn("[Auth] profile read failed:", error.message);
        setProfile(null);
        return;
      }
      setProfile((data as Profile) ?? null);
    } catch (error) {
      console.warn("[Auth] profile read failed:", error);
      setProfile(null);
    }
  };

  const resetAuthState = () => {
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    let cancelled = false;
    let subscription: { unsubscribe: () => void } | undefined;

    try {
      // onAuthStateChange fires INITIAL_SESSION on mount with the restored
      // session from localStorage — no need to call getSession() separately.
      // Calling both causes a race where getSession() can resolve with null
      // before the localStorage token is read, triggering a spurious sign-out.
      const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
        if (cancelled) return;
        setSession(sess);
        setUser(sess?.user ?? null);
        setLoading(false);
        if (sess?.user) {
          setTimeout(() => {
            if (!cancelled) void fetchProfile(sess.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        if (event === "SIGNED_OUT") {
          qc.clear();
        }
      });
      subscription = sub.subscription;
    } catch (error) {
      console.warn("[Auth] auth listener failed:", error);
      resetAuthState();
      setLoading(false);
    }

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, [qc]);


  const signOut = async () => {
    try {
      await qc.cancelQueries();
      qc.clear();
      await supabase.auth.signOut();
    } catch (error) {
      console.warn("[Auth] sign out failed:", error);
    } finally {
      resetAuthState();
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, isReady: !loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
