"use client";

import React from "react";
import {
  FiTruck,
  FiShield,
  FiDollarSign,
  FiHeadphones,
  FiMail,
} from "react-icons/fi";
import img from "../../assets/image/what_we_Offer.png";
import SafeImage from "../CommonComponents/SafeImage";

const WhatWeOffer: React.FC = () => {
  const offers = [
    {
      title: "Affordable pricing",
      icon: <FiDollarSign />,
      outerColor: "bg-orange-200",
      innerColor: "bg-orange-100 text-orange-600",
    },
    {
      title: "Secure payment",
      icon: <FiShield />,
      outerColor: "bg-pink-200",
      innerColor: "bg-pink-100 text-pink-600",
    },
    {
      title: "Fast delivery",
      icon: <FiTruck />,
      outerColor: "bg-cyan-200",
      innerColor: "bg-cyan-100 text-cyan-600",
    },
    {
      title: "24/7 Support",
      icon: <FiHeadphones />,
      outerColor: "bg-gray-300",
      innerColor: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-4 text-gray-800">What We Offer</h3>
        <p className="text-gray-500 mb-12">
          You can create a complete shopping experience that best suits your needs.
        </p>

       <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center">
        {/* image WRaper  */}
        <div className=" w-full  flex justify-center items-center">
          <SafeImage
          src={img}
          alt="What We Offer"
          width={500}
          height={300}
          >

          </SafeImage>
        </div>
         {/* Layout wrapper */}
        <div className="relative flex flex-col items-center lg:flex-row lg:justify-center gap-1 py-8">
          {/* Left side offers (lg only) */}
          <div className="hidden lg:flex flex-col gap-16 items-end ">
            <OfferItem {...offers[0]} align="right" />
            <OfferItem {...offers[2]} align="right" />
          </div>

          {/* Center hexagon */}
          <div
            className="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 bg-blue-500 shadow 
            lg:flex hidden items-center justify-center border
            [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]"
          >
            <FiMail className="text-2xl md:text-3xl lg:text-4xl text-white" />
          </div>

          {/* Right side offers (lg only) */}
          <div className="hidden lg:flex flex-col gap-16 items-start ">
            <OfferItem {...offers[1]} align="left" />
            <OfferItem {...offers[3]} align="left" />
          </div>

          {/* Mobile + md layout */}
          <div className=" inset-  flex gap-4 flex-col lg:hidden items-center justify-between py-4  w-full max-w-md">
            <div className="flex gap-10   justify-between w-full px-6 ">
              <OfferItem {...offers[0]} />
              <OfferItem {...offers[1]} />
            </div>
             {/* Center hexagon */}
          <div
            className="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 bg-blue-500 shadow 
            lg:hidden flex items-center justify-center border
            [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]"
          >
            <FiMail className="text-2xl md:text-3xl lg:text-4xl text-white" />
          </div>
            <div className="flex justify-between w-full px-6">
              <OfferItem {...offers[2]} />
              <OfferItem {...offers[3]} />
            </div>
          </div>
        </div>
       </div>
      </div>
    </section>
  );
};

const OfferItem = ({
  title,
  icon,
  outerColor,
  innerColor,
  align,
}: {
  title: string;
  icon: React.ReactElement;
  outerColor: string;
  innerColor: string;
  align?: "left" | "right";
}) => (
  <div
    className={`flex flex-col md:flex-col lg:flex-row items-center lg:items-center text-center gap-3
      ${align === "right" ? "lg:flex-row-reverse lg:text-right" : ""}
      ${align === "left" ? "lg:flex-row lg:text-left" : ""}`}
  >
    {/* Outer Hexagon */}
    <div
      className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 ${outerColor} flex items-center justify-center 
        [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]`}
    >
      {/* Inner Hexagon */}
      <div
        className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 ${innerColor} flex items-center justify-center shadow 
          [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]`}
      >
        {icon}
      </div>
    </div>

    {/* Text responsive */}
    <p className="text-xs md:text-sm lg:text-base font-medium text-gray-700 md:mt-2 lg:mt-0">
      {title}
    </p>
  </div>
);

export default WhatWeOffer;
