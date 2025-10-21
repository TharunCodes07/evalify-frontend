"use client";

import LoadingScreen from "@/components/ui/LoadingScreen";
import { useSessionContext } from "@/lib/session-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserType, hasAccess } from "@/lib/utils/auth-utils";
import AccessDenied from "./access-denied";
import { useUserExistence } from "@/hooks/useUserExistence";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserType[];
  requiredGroups?: string[];
  fallbackComponent?: React.ReactNode;
  allowPublicAccess?: boolean;
}

export default function AuthGuard({
  children,
  requiredRoles = [],
  requiredGroups = [],
  fallbackComponent = <AccessDenied />,
  allowPublicAccess = false,
}: AuthGuardProps) {
  const { session, status, update } = useSessionContext();
  const router = useRouter();
  const { data: userExistsData, isLoading: checkingUserExists } =
    useUserExistence();

  useEffect(() => {
    if ((status === "loading" || checkingUserExists) && !allowPublicAccess)
      return;

    // Allow public access if specified
    if (allowPublicAccess) return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    // If user is marked for registration but actually exists, update session
    if (session?.needsRegistration && userExistsData?.exists) {
      update({ needsRegistration: false });
      return;
    }

    if (session?.needsRegistration && !userExistsData?.exists) {
      router.push("/register");
      return;
    }
  }, [
    session,
    status,
    router,
    allowPublicAccess,
    userExistsData,
    checkingUserExists,
    update,
  ]);

  // Only show loading for initial auth check, not for user existence check
  if (status === "loading" && !allowPublicAccess) {
    return <LoadingScreen />;
  }

  // Allow public access if specified
  if (allowPublicAccess) {
    return <>{children}</>;
  }

  // Don't render anything if not authenticated
  if (!session?.user) {
    return null;
  }

  // Show loading only during initial user existence check to prevent flicker
  // But timeout after 500ms to show content regardless
  if (session?.needsRegistration && checkingUserExists) {
    // Use a simpler inline loader instead of full screen
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-400">Verifying...</p>
        </div>
      </div>
    );
  }

  if (session?.needsRegistration && !userExistsData?.exists) {
    return null;
  }

  // Check if user has required access
  const userRoles = session.user.roles;
  const userGroups = session.user.groups;

  if (!hasAccess(userRoles, userGroups, requiredRoles, requiredGroups)) {
    return <>{fallbackComponent}</>;
  }

  return <>{children}</>;
}

// Registration Guard for the registration page
export function RegistrationGuard({
  children,
  fallbackComponent = <AccessDenied />,
}: {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}) {
  const { session, status, update } = useSessionContext();
  const router = useRouter();
  const { data: userExistsData, isLoading: checkingUserExists } =
    useUserExistence();

  useEffect(() => {
    if (status === "loading" || checkingUserExists) return;

    // Redirect to login if not authenticated
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // If user exists but is marked for registration, update session and redirect to dashboard
    if (userExistsData?.exists && session?.needsRegistration) {
      update({ needsRegistration: false });
      router.push("/dashboard");
      return;
    }

    // Redirect to dashboard if user doesn't need registration
    if (session && !session.needsRegistration) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router, userExistsData, checkingUserExists, update]);

  if (status === "loading" || checkingUserExists) {
    return <LoadingScreen />;
  }

  if (!session?.user) {
    return null;
  }

  if (session && !session.needsRegistration) {
    return null;
  }

  // Show access denied if no session or no needsRegistration flag
  if (!session || !session.needsRegistration) {
    return <>{fallbackComponent}</>;
  }

  return <>{children}</>;
}
