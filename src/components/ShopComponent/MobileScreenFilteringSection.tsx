"use client";
import React, { useState } from "react";
import ShopFilterSidebar from "./ShopFilterSidebar";
import { IoCaretDownSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const MobileScreenFilteringSection = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="w-full mb-8 border-b-4 border-brandPrimary relative overflow-visible">
      {/*  Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="absolute -bottom-5 h-5 w-10 right-1/2 translate-x-1/2 rounded-b-md bg-brandPrimary flex items-center justify-center shadow-md"
      >
        <IoCaretDownSharp
          className={`text-white text-xl transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated Filter Section */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="filter-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden px-2 pt-6 pb-2"
          >
            <ShopFilterSidebar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileScreenFilteringSection;
