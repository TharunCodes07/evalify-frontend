"use client";

import { useSession } from "next-auth/react";
import { User } from "@/types/types";

export function useCurrentUser() {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  return user;
}
