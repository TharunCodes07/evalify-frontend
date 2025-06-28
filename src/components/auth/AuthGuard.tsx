"use client";

import LoadingScreen from "@/components/ui/LoadingScreen";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserType, hasAccess } from "@/lib/utils/auth-utils";
import AccessDenied from "./access-denied";
import { useQuery } from "@tanstack/react-query";
import userQueries from "@/repo/user-queries/user-queries";

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
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Check if user exists when needsRegistration is true (prevents infinite loop)
  const { data: userExistsData, isLoading: checkingUserExists } = useQuery({
    queryKey: ["checkUserExists", session?.user?.email],
    queryFn: () => userQueries.checkUserExists(session?.user?.email || ""),
    enabled: !!session?.user?.email && !!session?.needsRegistration,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (status === "loading" || checkingUserExists) return;

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

  if (status === "loading" && !allowPublicAccess) {
    return <LoadingScreen />;
  }

  // Show loading while checking user existence to prevent flicker
  if (session?.needsRegistration && checkingUserExists) {
    return <LoadingScreen />;
  }

  // Allow public access if specified
  if (allowPublicAccess) {
    return <>{children}</>;
  }

  if (!session?.user) {
    return null;
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
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Check if user exists to prevent infinite loops
  const { data: userExistsData, isLoading: checkingUserExists } = useQuery({
    queryKey: ["checkUserExists", session?.user?.email],
    queryFn: () => userQueries.checkUserExists(session?.user?.email || ""),
    enabled: !!session?.user?.email,
    retry: 3,
    retryDelay: 1000,
  });

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
