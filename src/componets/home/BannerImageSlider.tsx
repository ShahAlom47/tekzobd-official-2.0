"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SafeImage from "../CommonComponents/SafeImage";
import { BannerType } from "@/Interfaces/bannerInterfaces";
import bg1 from "@/assets/banner/bg-1.jpg";
import bg2 from "@/assets/banner/bg-2.jpg";
import bg3 from "@/assets/banner/bg-3.jpg";

const BannerData: BannerType[] = [
  {
    title: "Banner 1",
    subtitle: "Welcome to our store",
    link: "/shop",
    image: "/banners/banner1.jpg", // string OK
    bg: bg1,    // string OK
    isActive: true,
    order: 1,
  },
  {
    title: "Banner 2",
    subtitle: "",                  // optional, can be empty
    link: "/shop",                 // added, required
    image: "/banners/banner2.jpg", // added, required
    bg: bg2,    // string OK      
    isActive: true,
    order: 2,
  },
  {
    title: "Banner 3",
    subtitle: "",
    link: "/shop",
    image: "/banners/banner3.jpg",
    bg: bg3,
    isActive: true,
    order: 3,
  },
];



const BannerImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BannerData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [BannerData.length, 4000]);


  return (
    <div className="relative w-full max-w-[1900px] mx-auto overflow-hidden mt-10 sm:mt-8 md:mt-0 lg:mt-0">
      {/* Slides wrapper with aspect ratio (responsive) */}
      <div className="relative w-full min-h-[150px] sm:min-h-[250px] md:min-h-[400px] lg:min-h-[600px] h-auto">
        {BannerData.map((banner, idx) => (
          <div
            key={idx}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              idx === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <SafeImage
              src={banner.bg}
              alt={banner.title}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Button Overlay */}
      <Link
        href="/shop"
        className="btn-base rounded-full absolute md:bottom-5 bottom-3 left-1/2 -translate-x-1/2 z-20 transition-transform hover:scale-105 md:text-base text-xs"
      >
        See Products
      </Link>

      {/* Dot Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {BannerData.map((_, idx) => (
          <span
            key={idx}
            className={`md:w-3 md:h-3 h-1 w-1 rounded-full cursor-pointer ${
              idx === currentIndex
                ? "bg-blue-700"
                : "bg-gray-300/50 border border-blue-700"
            }`}
            onClick={() => setCurrentIndex(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default BannerImageSlider;
