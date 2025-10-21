"use client";

import { useQuery } from "@tanstack/react-query";
import { useSessionContext } from "@/lib/session-context";
import userQueries from "@/repo/user-queries/user-queries";

export function useUserExistence() {
  const { session } = useSessionContext();

  return useQuery({
    queryKey: ["userExists", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) {
        return { exists: false };
      }
      return userQueries.checkUserExists(session.user.email);
    },
    enabled: !!session?.user?.email && !!session?.needsRegistration,
    retry: 3,
    retryDelay: 500,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    networkMode: "online",
  });
}
