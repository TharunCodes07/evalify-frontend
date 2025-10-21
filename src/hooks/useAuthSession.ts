import { useSessionContext } from "@/lib/session-context";
import { useCallback } from "react";

export function useAuthSession() {
  const { session, status, update, isAuthenticated, isLoading } =
    useSessionContext();

  const clearRegistrationFlag = useCallback(async () => {
    try {
      await update({ needsRegistration: false });
      return true;
    } catch (error) {
      console.error("Failed to update session:", error);
      return false;
    }
  }, [update]);

  const needsRegistration = session?.needsRegistration === true;

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
