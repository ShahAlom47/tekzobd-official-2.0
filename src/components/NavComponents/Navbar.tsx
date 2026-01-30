"use client";

import React from "react";
// import NavCart from "./NavCart";
// import NavWishList from "./NavWishList";
import useScreenInfo from "@/hooks/useScreenInfo";
import Logo from "../CommonComponents/Logo";
import NavLinks from "./NavLinks";
import AuthMenu from "./AuthMenu";
import AuthButton from "./AuthButton";
import GlobalSearchBox from "../CommonComponents/GlobalSearchBox";
import SocialButtons from "../CommonComponents/SocialButton";
import MobileNavBar from "./MobileNavbar";
import { useUser } from "@/hooks/useUser";
// import Notification from "../CommonComponents/Notification";
const Navbar = () => {
  const { user } = useUser();
  const { scrollY, scrollDirection } = useScreenInfo();
  const showNavbar = scrollDirection === "up" || scrollY < 100;
  const showShadow = scrollY > 50;
  return (
    <nav
      className={`fixed top-0 left-0 w-full  z-50  duration-500 transition-all  backdrop-blur-lg bg-white   ${
        !showShadow ? "   shadow-lg shadow-backdrop" : " shadow-md shadow-blue-400 "
      } `}
    >
      <div
        className={`bg-gray-100  text-sm  duration-500 transition-all overflow-hidden
          ${showNavbar ? " px-4 py-1 " : "  px-4 p-0"} `}
        style={{
          maxHeight: showNavbar ? "200px  " : "0px",
        }}
      >
        <div className="max-w flex justify-between items-center gap-3 ">
          <div className=" flex-center  flex-1  gap-3 px-3 ">
            <h1 className=" text-gray-500 text-xs md:text-sm">Welcome to TekzoBD</h1>
            <h1 className="text-blackDeep hidden md:inline text-sm">
              Contact: 01773133145
            </h1>
            <SocialButtons className="text-xs"></SocialButtons>
          </div>
          <div className="md:block hidden">
            <AuthButton></AuthButton>
          </div>
        </div>
      </div>
      <div className=" lg:flex md:flex hidden items-center justify-between  max-w  p-0   ">
        <div className=" flex items-center gap-4  ">
          <Logo className="max-w-32"></Logo>
        </div>
        {/* link and  searchbar  start */}
        <div className="flex-1 flex -ml-4">
          <div
            className={` flex-1 text-sm  duration-500 transition-all overflow-hidden max-w md:flex hidden gap-4
          ${showNavbar ? " px-4 py-1 " : "  px-4 p-0"} `}
            style={{
              maxHeight: showNavbar ? "200px  " : "200px",
            }}
          >
            <NavLinks></NavLinks>
          </div>
          <GlobalSearchBox></GlobalSearchBox>
        </div>
        {/* link and  searchbar  end  */}

        <div className="flex items-center justify-center gap-4   px-2 ">
          {user?.role === "admin" ? (
            ''
            // <Notification></Notification> 
          ) : (
            // <NavWishList></NavWishList>
            ''
          )}

          {/* <NavCart></NavCart> */}

          <AuthMenu />
        </div>
      </div>

      {/* mobile nav  */}
      <div className={`lg:hidden md:hidden flex items-center justify-between `}>
        <MobileNavBar></MobileNavBar>
      </div>
    </nav>
  );
};

export default Navbar;
