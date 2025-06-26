"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function ArchivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredGroups={["faculty", "student"]}>{children}</AuthGuard>
  );
}
