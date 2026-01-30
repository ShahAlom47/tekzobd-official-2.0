"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";
import { AiOutlineLogin } from "react-icons/ai";
import defaultUserImage from "@/assets/image/defaultUser.png";

const AuthMenu: React.FC = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔹 Outside click close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <span className="animate-spin text-brandPrimary">
        <FaSpinner />
      </span>
    );
  }

  // 🔹 Logged out
  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-blue-600/10 transition"
      >
        <AiOutlineLogin className="text-2xl text-blue-600" />
      </Link>
    );
  }

  const { name, image, role } = session.user as {
    name?: string;
    image?: string;
    role?: string;
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-brandPrimary hover:scale-95 transition"
      >
        <Image
          src={image || defaultUserImage}
          alt="User"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-56 z-50">
          <div className="bg-white rounded-xl shadow-lg border border-blue-500/30 overflow-hidden">
            {/* User Info */}
            <div className="px-4 py-3 border-b text-sm font-semibold text-brandNeutral uppercase bg-gray-200">
              {name || "User"}
            </div>

            <ul className="py-2 text-sm">
              {role !== "admin" && (
                <>
                  <li>
                    <Link
                      href="/user/my-orders"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-blue-400/50 transition"
                    >
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/my-wishlist"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-blue-400/50 transition"
                    >
                      My Wishlist
                    </Link>
                  </li>
                </>
              )}

              {role === "admin" && (
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-red-600 hover:bg-red-50 font-semibold transition"
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href="/user/settings"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-blue-400/50 transition"
                >
                  Settings
                </Link>
              </li>

              <li className="border-t mt-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-400/50 transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthMenu;
