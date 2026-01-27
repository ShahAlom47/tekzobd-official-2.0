"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import QueryProvider from "../QueryProvider";
import ReduxProvider from "../ReduxProvider";
// import PushNotificationInit from "@/components/wrappers/PushNotificationInit";

export default function RootProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ReduxProvider>
        <QueryProvider>
          <Toaster position="top-right" />
          {/* <PushNotificationInit></PushNotificationInit> */}
          
          {children}
        </QueryProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
