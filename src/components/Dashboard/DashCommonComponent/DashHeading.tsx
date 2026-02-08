"use client";


import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { MdCancel } from "react-icons/md";
import Logo from "@/components/CommonComponents/Logo";
import DashSearchBox from "./DashSearchBox";

interface PropsType {
  navListOpen?: boolean;
  setNavListOpen?: (open: boolean) => void;
}

const DashHeading = ({ navListOpen, setNavListOpen }: PropsType) => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  return (
    <div>
      <div className=" flex gap-4 justify-between items-center  text-white px-4 pl-1 h-full">
        <div className=" flex justify-center items-center md:gap-2 ">
          <Logo></Logo>
        </div>
        <div className="flex-1   flex gap-3 items-center justify-between ">
          <button
            className="text-2xl text-brandNeutral hover:text-brandPrimary transition-all duration-300 p-1"
            onClick={() => setNavListOpen && setNavListOpen(!navListOpen)}
          >
            {navListOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
          </button>
          <div className="w-full  md:block hidden">
            <DashSearchBox></DashSearchBox>
          </div>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className=" text-blackLight md:hidden flex "
          >
            {searchOpen ? (
              <MdCancel size={24}></MdCancel>
            ) : (
              <FaSearch></FaSearch>
            )}
          </button>
        </div>
        {/* <div className="flex items-center gap-4 text-xl text-blackDeep">
         <DashMessageBox></DashMessageBox>
          
         <Notification></Notification>
       
        </div> */}
      </div>
       <div className={`md:hidden ${searchOpen?"px-4 py-1":"px-0 py-0"} bg-white overflow-hidden  duration-500 transition-all`}
        style={{
          maxHeight: searchOpen ? "250px  " : "0px",
        }}>


          <DashSearchBox></DashSearchBox>
        </div>
    </div>
  );
};

export default DashHeading;
