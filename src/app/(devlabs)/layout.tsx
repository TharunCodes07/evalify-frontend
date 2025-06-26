"use client";

import { AppSidebar } from "@/components/nav/side-nav";
import { AppSidebarInset } from "@/components/nav/side-nav-inset";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthGuard from "@/components/auth/AuthGuard";
import { useEffect, useState } from "react";

export default function DevlabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [defaultOpen, setDefaultOpen] = useState(true);

  useEffect(() => {
    const sidebarState = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sidebar:state="))
      ?.split("=")[1];

    if (sidebarState) {
      setDefaultOpen(sidebarState === "true");
    }
  }, []);
  return (
    <AuthGuard requiredGroups={["admin", "faculty", "student", "manager"]}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar>
          <AppSidebarInset>{children}</AppSidebarInset>
        </AppSidebar>
      </SidebarProvider>
    </AuthGuard>
  );
}
