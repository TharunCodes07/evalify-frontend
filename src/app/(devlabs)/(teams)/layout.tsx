"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredGroups={["admin", "student", "manager"]}>
      {children}
    </AuthGuard>
  );
}
