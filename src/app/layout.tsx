import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import MainWrapper from "@/wrappers/MainWrapper";
import Providers from "@/Providers/RootProvider/Providers";
import Navbar from "@/components/NavComponents/Navbar";
import Footer from "@/components/CommonComponents/Footer";



export const metadata: Metadata = {
  title: "TekzoBD",
  description: "Your Trusted Tech Partner",
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
              {/* <ConditionalWrapper hideOn={["dashboard"]}> */}
                <Navbar />
              {/* </ConditionalWrapper> */}
              <MainWrapper>
                {children}
                {/* <ScrollTopButton /> */}
                {/* <SmartChatWidget /> */}
              </MainWrapper>
              {/* <ConditionalWrapper hideOn={["dashboard", "login"]}> */}
                <Footer />
              {/* </ConditionalWrapper> */}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}