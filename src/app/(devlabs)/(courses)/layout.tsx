"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredGroups={["faculty", "manager", "student"]}>
      {children}
    </AuthGuard>
  );
}
