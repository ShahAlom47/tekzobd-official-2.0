"use client";

import { useState } from "react";
import DashHeading from "@/components/DashHeading";
import DashNavbar from "@/components/DashNavbar";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen  ">
      <header className="w-full  border-b border-grayLight min-h-[10vh] bg-white ">
        <DashHeading navListOpen={isOpen} setNavListOpen={setIsOpen} />
      </header>

      <div className="flex  w-full min-h-[89vh] overflow-x-hidden ">
        <aside
          className={`${
            isOpen
              ? "w-fit  px-2  "
              : "md:w-14 md:px-1 w-0  px-0 hover:w-fit hover:px-2  "
          } duration-500 ease-in-out  flex flex-col justify-between gap-3  py-3 transition-all  text-blackLight  bg-brandPrimary bg-gradient-to-tr to-blue-500 from-brandPrimary `}
        >
          <div className=" overflow-y-scroll scroll-hide h-full max-h-[75vh] space-y-1 ">
            <DashNavbar isOpen={isOpen}></DashNavbar>
          </div>
          <div className="md:p-3 p-1 min-h-[10vh] flex flex-col    gap-3 items-center justify-center bg-blackDee rounded-sm">
            <Link
              href={"/"}
              className=" p-1 transition-all duration-300  text-blackMid border text-white border-white rounded-full hover:bg-white hover:text-black text-sm w-full text-center flex items-center gap-2 justify-center "
            >
              <FaHome></FaHome>
              <span
                className={`${isOpen ? " md:inline-block hidden " : "hidden"}`}
              >
                Home
              </span>
            </Link>
            <button className="p-1 transition-all duration-300 text-blackMid text-white border border-white rounded-full hover:bg-white hover:text-black text-sm  w-full text-center flex items-center gap-2 justify-center">
              <AiOutlineLogout />{" "}
              <span
                className={`${isOpen ? " md:inline-block hidden" : "hidden"}`}
              >
                Logout
              </span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col justify-between  ">
          <div className="flex-1 max-h-[85vh] overflow-y-scroll overflow-x-hidden  bg-gray-100 text-black  p-3">
            {children}
          </div>
          <div className="text-center text-xs py-1 text-gray-500 border-t border-grayLight">
            © {new Date().getFullYear()} TekzoBD. All rights reserved.
          </div>
        </main>
      </div>
    </div>
  );
}
