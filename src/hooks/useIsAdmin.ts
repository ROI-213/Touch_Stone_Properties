import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/lib/admin-auth";

export function useIsAdmin() {
  const { user, loading, isReady } = useAuth();
  const q = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: isReady && !!user,
    queryFn: async () => {
      if (!user) return false;
      try {
        return await isAdminUser(user.id);
      } catch (error) {
        console.warn("[Auth] admin role check failed:", error);
        return false;
      }
    },
  });
  return {
    isAdmin: !!q.data,
    isLoading: loading || q.isLoading,
    user,
  };
}
