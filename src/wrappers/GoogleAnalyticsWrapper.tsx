"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export default function GoogleAnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: fullPath,
      });

      if (process.env.NODE_ENV === "development") {
        // console.log("GA pageview sent:", fullPath, GA_MEASUREMENT_ID);
      }
    }
  }, [pathname, searchParams]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />
      {children}
    </>
  );
}
