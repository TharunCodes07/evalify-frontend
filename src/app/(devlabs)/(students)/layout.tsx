"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard requiredGroups={["student"]}>{children}</AuthGuard>;
}
