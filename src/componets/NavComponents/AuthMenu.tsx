"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";
import defaultUserImage from "@/assets/image/defaultUser.png";
import { AiOutlineLogin } from "react-icons/ai";

const AuthMenu: React.FC = () => {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return (
      <span className="animate-spin">
        <FaSpinner />
      </span>
    );
  }

  // ✅ যদি user না থাকে, login icon দেখাবে
  if (!sessionData?.user) {
    return (
      <Link
        href="/login"
        className=" md:hidden avatar hover:scale-95  flex items-center justify-center"
      >
        <AiOutlineLogin  className="text-2xl text-brandPrimary" />
      </Link>
    );
  }

  // ✅ যদি user থাকে, dropdown দেখাবে
  const { name, image, role } = sessionData.user as {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn-circle avatar hover:scale-95 border-brandPrimary border"
      >
        <div className="md:w-8 w-8 rounded-full border p-0.5 border-blackDee">
          <Image
            src={image || defaultUserImage}
            alt="User Avatar"
            width={15}
            height={15}
            className="rounded-full"
          />
        </div>
      </div>

      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-2 font-semibold shadow menu menu-sm dropdown-content shadow-brandPrimary bg-white rounded-box text-brandNeutral w-52"
      >
        <li className="font-semibold text-sm text-brandNeutral px-2 py-1 uppercase border-b-2">
          {name || "User"}
        </li>

        {role !== "admin" && (
          <>
            <li>
              <Link
                href="/user/my-orders"
                className="cursor-pointer hover:text-brandPrimary"
              >
                My Orders
              </Link>
            </li>
            <li>
              <Link
                href="/user/my-wishlist"
                className="cursor-pointer hover:text-brandPrimary"
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
              className="text-red-600 font-semibold cursor-pointer hover:text-brandPrimary"
            >
              Dashboard
            </Link>
          </li>
        )}

        <li>
          <Link
            href="/user/settings"
            className="cursor-pointer hover:text-brandPrimary"
          >
            Settings
          </Link>
        </li>

        <li>
          <button
            onClick={() => signOut()}
            className="text-left w-full cursor-pointer hover:text-brandPrimary"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AuthMenu;
