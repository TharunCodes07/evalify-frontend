"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredGroups={["faculty", "manager"]}>{children}</AuthGuard>
  );
}
