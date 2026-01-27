"use client";

import { useEffect, useState, type ReactNode } from "react";

type ClientOnlyProps = {
  children: ReactNode;
  fallback?: ReactNode; // Optional: লোডিং বা ফাঁকা UI দিতে চাইলে
};

export default function ClientOnly({ 
  children, 
  fallback = null 
}: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  return isMounted ? <>{children}</> : fallback;
}