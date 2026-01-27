// hooks/useUser.ts
"use client";

import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const user = session?.user ;

  return {
    user,
    isAuthenticated,
    isLoading: status === "loading",
  };
};
