"use client";

import { useSession } from "next-auth/react";
import { User } from "@/types/types";

export function useCurrentUser() {
  const { data: session } = useSession();
  // Assuming the user object in the session matches the User type
  // and has an `id` property. You might need to adjust this based on your session's structure.
  const user = session?.user as User | undefined;

  return user;
}
