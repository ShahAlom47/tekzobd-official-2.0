"use client";


// import { useCategories } from "@/hooks/useCategory";
// import { useWishlist } from "@/hooks/useWishlist";
import { usePathname } from "next/navigation";
import React from "react";

const HIDE_MARGIN_ROUTES = ["/dashboard",];

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
    // useCategories();  // first time data load in the redux store 
    // useWishlist()
    // useAdminFirebaseToken()  //  for  Firebase  notification DB Token Manage


  

  const hasMargin = !HIDE_MARGIN_ROUTES.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <main className={`${hasMargin ? " top-4 md:pt-[5%] pt-[13%]" : "pt-0"} min-h-screen `}>
      {children}
    </main>
  );
}
