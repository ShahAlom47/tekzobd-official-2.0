"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: "left" | "right" | "top" | "bottom";
  width?: string;
  height?: string;
  className?: string;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  direction = "right",
  width = "w-[70%]",
  height = "h-[70%]",
  className = "",
  children,
}) => {
  const pathname = usePathname();
  const pathnameRef = useRef(usePathname());

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // Route change detect kore drawer close korar jonno 


useEffect(() => {
  const currentPath = pathname;
  if (isOpen && currentPath !== pathnameRef.current) {
    onClose();
  }
  pathnameRef.current = currentPath;
}, [pathname, isOpen, onClose]);

  const getPositionClasses = () => {
    switch (direction) {
      case "left":
        return `top-0 left-0  h-screen ${width} ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`;
      case "right":
        return `top-0 right-0  h-screen ${width} ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`;
      case "top":
        return `top-0 left-0 w-full ${height} ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`;
      case "bottom":
        return `bottom-0 left-0 w-full ${height} ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`;
      default:
        return "";
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 min-h-screen"
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`
          fixed bg-white  z-50 shadow-lg
          border border-[var(--border)]
          transform transition-transform duration-700 h-full
          ${getPositionClasses()} ${className}
        `}
      >
        <div className="flex justify-end px-3">
          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-red-500 text-gray-600 absolute  top-2 right-3"
          >
            ✕
          </button>
        </div>
        <div className="">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
