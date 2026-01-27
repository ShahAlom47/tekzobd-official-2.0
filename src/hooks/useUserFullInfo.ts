"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { getUserInfo } from "@/lib/allApiRequest/userRequest/userRequest";
import { Users } from "@/Interfaces/userInterfaces";

export function useUserFullInfo() {
  const { user } = useUser();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userFullInfo", user?.email],
    queryFn: async () => {
      const res = await getUserInfo(user?.email as string);
      return res?.data as Users;
    },
    enabled: !!user?.email, // শুধু তখনই call হবে যখন user আছে
  });

  return {
    fullInfo: data,
    isLoading,
    error,
    refetch,
  };
}
