"use client";

import LoadingScreen from "@/components/ui/LoadingScreen";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserType, hasAccess } from "@/lib/utils/auth-utils";
import AccessDenied from "./access-denied";

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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Allow public access if specified
    if (allowPublicAccess) return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (session?.needsRegistration) {
      router.push("/register");
      return;
    }
  }, [session, status, router, allowPublicAccess]);
  if (status === "loading" && !allowPublicAccess) {
    return <LoadingScreen />;
  }

  // Allow public access if specified
  if (allowPublicAccess) {
    return <>{children}</>;
  }

  if (!session?.user) {
    return null;
  }

  if (session?.needsRegistration) {
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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Redirect to login if not authenticated
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Redirect to dashboard if user doesn't need registration
    if (session && !session.needsRegistration) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
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
