"use client";

import React, { useEffect, useState } from "react";
import SafeImage from "@/components/CommonComponents/SafeImage";
import conImage from "@/assets/image/under.jpg";

const TARGET_DATE = new Date("2026-03-01T00:00:00"); // 🔥 launch date change koro

const UnderConstructionBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE.getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center">
      {/* Background Image */}
      <SafeImage
        src={conImage}
        alt="Under Construction"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          🚧 Website Under Construction
        </h1>
        <p className="text-sm md:text-lg mb-8 text-gray-200">
          We are working hard. Launching very soon!
        </p>

        {/* Countdown */}
        <div className="flex gap-4 justify-center">
          {Object.entries(timeLeft).map(([key, value]) => (
            <div
              key={key}
              className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg min-w-[70px]"
            >
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs uppercase tracking-wide text-gray-300">
                {key}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UnderConstructionBanner;
