"use client";

import DevlabsHero from "@/components/hero/devlabs-hero";
import AuthGuard from "@/components/auth/AuthGuard";

export default function HomePage() {
  return (
    <AuthGuard allowPublicAccess={true}>
      <DevlabsHero />
    </AuthGuard>
  );
}
