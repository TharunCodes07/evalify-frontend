"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { User } from "@/types/types";

interface SessionContextType {
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
  update: (data?: unknown) => Promise<Session | null>;
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();

  const user = session?.user as User | undefined;
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isLoading = status === "loading";

  const value: SessionContextType = {
    session,
    status,
    update,
    user,
    isAuthenticated,
    isLoading,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(
      "useSessionContext must be used within SessionContextProvider",
    );
  }
  return context;
}
