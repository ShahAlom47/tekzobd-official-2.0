"use client"
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaSpinner } from "react-icons/fa";

const AuthButton = () => {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return (
      <span className="animate-spin text-xl text-gray-600">
        <FaSpinner />
      </span>
    );
  }

  // ✅ If user is logged in → Show "Log Out"
  if (sessionData?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="text-blackDeep hover:text-brandPrimary hover:underline text-xs px-1 py-1 max-h-5"
      >
        Log Out
      </button>
    );
  }

  // ❌ Not logged in → Show Login/Register
  return (
    <div className="flex items-center justify-center gap-1 text-xs">
      <Link href="/register" className="text-blackDeep hover:text-brandPrimary hover:underline text-xs px-1 py-1 max-h-5">
        Sign Up
      </Link>
      /
      <Link href="/login" className=" text-blackDeep hover:text-brandPrimary hover:underline text-xs px-1 py-1 max-h-5 ">
        Login
      </Link>
    </div>
  );
};

export default AuthButton;
