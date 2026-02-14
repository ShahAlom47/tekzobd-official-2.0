import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import MainWrapper from "@/wrappers/MainWrapper";
import Providers from "@/Providers/RootProvider/Providers";
import Navbar from "@/components/NavComponents/Navbar";
import Footer from "@/components/CommonComponents/Footer";
import ConditionalWrapper from "@/wrappers/ConditionalWrapper";



export const metadata: Metadata = {
  // Basic SEO
  title: "TekzoBD – Trusted Online Electronics Marketplace",
  description:
    "Shop trending electronics, gadgets, and accessories at TekzoBD. Fast delivery, secure payments, and reliable service across Bangladesh.",
  keywords: [
    "TekzoBD",
    "Electronics Bangladesh",
    "Gadgets Online",
    "LED Flashlight",
    "Rechargeable Torch",
    "Portable Gadgets",
    "Bangladesh Online Shopping",
  ],

  // ✅ Proper Icon Setup
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },

  // Open Graph for Social Media
  openGraph: {
    title: "TekzoBD – Trusted Online Electronics Marketplace",
    description:
      "High quality electronics & gadgets with fast delivery and secure payment options. Shop now at TekzoBD!",
    url: "https://www.tekzobd.com",
    siteName: "TekzoBD",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TekzoBD – Electronics & Gadgets",
      },
    ],
    locale: "en_BD",
    type: "website",
  },

  // Canonical URL
  alternates: {
    canonical: "https://www.tekzobd.com",
    languages: {
      "en-BD": "https://www.tekzobd.com/en",
      "bn-BD": "https://www.tekzobd.com/bn",
    },
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Author / Publisher
  authors: [{ name: "TekzoBD Team", url: "https://www.tekzobd.com" }],
  publisher: "TekzoBD",

  // Structured Data (JSON-LD for homepage)
  metadataBase: new URL("https://www.tekzobd.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white relative">
        <Providers>
          <Suspense fallback={<Loading />}>
              <ConditionalWrapper hideOn={["dashboard"]}>
                <Navbar />
              </ConditionalWrapper>
              <MainWrapper>
                {children}
                {/* <ScrollTopButton /> */}
                {/* <SmartChatWidget /> */}
              </MainWrapper>
              <ConditionalWrapper hideOn={["dashboard", "login"]}>
                <Footer />
              </ConditionalWrapper>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}