"use client";
import React from "react";
import { useRouter } from "next/navigation";
import bg from "@/assets/image/unauthorizedBG.jpg";

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
      }}
      className="flex flex-col items-center justify-center bg-gray-900 bg-opacity-75"
    >
      <div className="bg-black bg-opacity-40 p-10 rounded-lg shadow-lg text-center max-w-md drop-shadow-lg shadow-slate-800">
        <h1 className="text-5xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-200 mb-8">
          Sorry, you do not have permission to view this page.
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 primary-hover text-white rounded-md transition"
          >
            Go to Home
          </button>

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 primary-hover text-white rounded-md transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

