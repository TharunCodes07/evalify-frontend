import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useAuthSession() {
  const { data: session, status, update } = useSession();

  const clearRegistrationFlag = useCallback(async () => {
    try {
      await update({ needsRegistration: false });
      return true;
    } catch (error) {
      console.error("Failed to update session:", error);
      return false;
    }
  }, [update]);

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const needsRegistration = session?.needsRegistration === true;
  const isLoading = status === "loading";

  return {
    session,
    status,
    update,
    clearRegistrationFlag,
    isAuthenticated,
    needsRegistration,
    isLoading,
  };
}
