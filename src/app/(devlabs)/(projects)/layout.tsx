"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredGroups={["admin", "faculty", "student", "manager"]}>
      {children}
    </AuthGuard>
  );
}
