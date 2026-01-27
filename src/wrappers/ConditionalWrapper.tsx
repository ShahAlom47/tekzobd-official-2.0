"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface ConditionalWrapperProps {
  hideOn: string[]; // Example: ["login", "dashboard"]
  children: React.ReactNode;
}

const ConditionalWrapper = ({ hideOn, children }:ConditionalWrapperProps) => {
  const pathname = usePathname();

  const shouldHide = hideOn.some((item) => pathname.includes(item));

  if (shouldHide) return null;

  return <>{children}</>;
};

export default ConditionalWrapper;
