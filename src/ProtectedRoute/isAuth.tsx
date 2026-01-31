"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

type UserRole = "admin" | "user" | "guest";

export default function isAuth<P>(
  Component: React.ComponentType<P>,
  roles: UserRole[] = []
) {
  const IsAuth: React.FC<React.PropsWithChildren<P>> = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return; // wait for session

      if (status === "unauthenticated") {
        router.replace("/login");
      } else if (
        status === "authenticated" &&
        session &&
        roles.length > 0 &&
        !roles.includes(session.user.role as UserRole)
      ) {
        router.replace("/unauthorized");
      }
    }, [status, session, router]);

    if (status === "loading") {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      );
    }

    // Show nothing while redirecting (after redirect trigger)
    if (
      status === "unauthenticated" ||
      (status === "authenticated" &&
        session &&
        roles.length > 0 &&
        !roles.includes(session.user.role as UserRole))
    ) {
      return null;
    }

    return <Component {...props} />;
  };

  return IsAuth;
}
