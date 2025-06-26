"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function AdministrativeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard requiredGroups={["admin"]}>{children}</AuthGuard>;
}
