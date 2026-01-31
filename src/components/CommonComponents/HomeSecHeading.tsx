"use client";
import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

interface HomeSecHeadingProps {
  children: React.ReactNode;
  subTitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
  animation?: boolean;
}

const HomeSecHeading: React.FC<HomeSecHeadingProps> = ({
  children,
  subTitle,
  className = "",
  align = "center",
  animation,
}) => {
  const isCentered = align === "left";

  if (animation !== true) {
    return (
      <div
        className={clsx(
          "mb-5  animated-bottom-border   w-full  py-3 ",
          isCentered ? "text-center" : "text-left",
          className
        )}
      >
        <h2
          className={clsx(
            " md:text-2xl text-lg font-bold text-brandNeutral ",
            isCentered ? "mx-auto" : ""
          )}
        >
          {children}
        </h2>

        {subTitle && (
          <p
            className={clsx(
              "mt-2 text-sm md:text-base text-gray-500 max-w-xl",
              isCentered ? "mx-auto" : ""
            )}
          >
            {subTitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className=""
      initial={{ opacity: 0, x: -90 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9 }}
    >
      <div
        className={clsx(
          "mb-5  animated-bottom-border   w-full  py-3 ",
          isCentered ? "text-center" : "text-left",
          className
        )}
      >
        <h2
          className={clsx(
            "text-sm md:text-2xl font-bold text-brandNeutral ",
            isCentered ? "mx-auto" : ""
          )}
        >
          {children}
        </h2>

        {subTitle && (
          <p
            className={clsx(
              "mt-2 text-sm md:text-base text-gray-500 max-w-xl",
              isCentered ? "mx-auto" : ""
            )}
          >
            {subTitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default HomeSecHeading;
