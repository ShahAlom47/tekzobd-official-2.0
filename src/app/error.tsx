"use client";
import React from "react";
import { useRouter } from "next/navigation";
import errImg from "@/assets/image/errorTextBg.jpg";
import { ImHome } from "react-icons/im";
import { TfiReload } from "react-icons/tfi";

interface ErrorPageProps {
  homeBtn?: boolean;
  reloadBtn?: boolean;
}

const ErrorPage = ({ homeBtn, reloadBtn }: ErrorPageProps) => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white text-center px-4">
      {/* Oops! Text with Image Fill using inline style */}
      <div
        className="text-[100px] md:text-[140px] font-extrabold text-transparent text-center"
        style={{
          backgroundImage: `url(${errImg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Oops!
      </div>

      {/* 404 Text */}
      <h2 className="text-xl md:text-2xl font-bold mb-2">
        404 - PAGE NOT FOUND
      </h2>
      <p className="text-gray-500 max-w-md mb-6">
        The page you are looking for might have been removed,
        <br />
        had its name changed or is temporarily unavailable.
      </p>

      <div className="flex gap-4">
        {homeBtn !== false && (
          <button onClick={handleGoHome} className="btn-base rounded-full w-10 h-10 p-2">
            <ImHome />
          </button>
        )}
        {reloadBtn !== false && (
          <button onClick={() => router.refresh()} className="btn-bordered  rounded-full w-10 h-10 p-2">
            <TfiReload />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
