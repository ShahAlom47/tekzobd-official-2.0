// app/shop/layout.tsx

import type { Metadata } from "next";
import React, { ReactNode } from "react";

// ✅ SEO Metadata এখানে দিচ্ছি
export const metadata: Metadata = {
  title: " TekzoBD | Shop",
  description:
    "Browse a wide collection of electronics, gadgets, and accessories on TekzoBD Shop. Find the latest products at the best prices in Bangladesh.",
  keywords: [
    "shop electronics",
    "buy gadgets online",
    "TekzoBD shop",
    "Bangladesh electronics",
    "online marketplace",
  ],
  alternates: {
    canonical: "https://www.tekzobd.com/shop", // তোমার আসল domain বসাও
  },
  openGraph: {
    title: "Shop - TekzoBD",
    description:
      "Find and buy electronics, gadgets, and accessories at the best prices in Bangladesh.",
    url: "https://www.tekzobd.com/shop",
    siteName: "TekzoBD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop - TekzoBD",
    description:
      "Shop the latest electronics and gadgets at TekzoBD marketplace.",
  },
};

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <section className="max-w mx-auto p-4">
      {children}
    </section>
  );
}
