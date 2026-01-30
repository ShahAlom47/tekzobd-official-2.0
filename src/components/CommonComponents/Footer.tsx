"use client";
import React from "react";
import Logo from "./Logo";
import SocialButtons from "./SocialButton";
import Link from "next/link";
import { FaCircle } from "react-icons/fa";
import NavLinks from "../NavComponents/NavLinks";
import TekzoBDInstallButton from "./TekzoBDInstallButton";

const Footer = () => {
  return (
    <footer className="bg-grayLight text-gray-300 py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo or Site Name */}
        <div className="text-2xl font-bold text-white">
          <Logo className="max-w-32"></Logo>
        </div>

        {/* Navigation Links */}
        <div className="  flex flex-row flex-wrap gap-4 justify-center text-sm">
          <NavLinks></NavLinks>
          <Link className="transition-all duration-500  font-semibold flex-center gap-2  text-blackMid hover:text-brandPrimary " href="/delivery-policy"> <FaCircle size={5} className="text-brandPrimary"></FaCircle> Delivery Policy</Link>
          <Link className="transition-all duration-500  font-semibold flex-center gap-2  text-blackMid hover:text-brandPrimary " href="/how-to-order"> <FaCircle size={5} className="text-brandPrimary"></FaCircle> How to Order</Link>
          <Link className="transition-all duration-500  font-semibold flex-center gap-2  text-blackMid hover:text-brandPrimary " href="/trackOrderById"> <FaCircle size={5} className="text-brandPrimary"></FaCircle> Track Order By ID</Link>
        </div>
    
        {/* Social Icons (external) */}
     
          <SocialButtons></SocialButtons>
          
   
      </div>

      {/* Bottom Line */}
    <div className=" flex  flex-col-reverse gap-3  md:flex-row justify-center items-center mt-6 border-t border-gray-700  pt-4">
        <div className="text-center text-xs   text-gray-500">
        © {new Date().getFullYear()} TekzoBD. All rights reserved. | Version
        1.0.0
      </div>
      <TekzoBDInstallButton></TekzoBDInstallButton>
    </div>
    </footer>
  );
};

export default Footer;
