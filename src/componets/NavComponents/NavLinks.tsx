"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCircle } from "react-icons/fa";

type NavItem = {
  name: string;
  href: string;
};

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const NavLinks = () => {
  const pathname = usePathname();

  const getActiveStyle = (href: string) => {
    if (href === "/") {
      return pathname === "/" ? "text-brandPrimary font-semibold" : "text-blackMid hover:text-brandPrimary";
    }
    return pathname.startsWith(href)
      ? "text-brandPrimary "
      : "text-blackMid hover:text-brandPrimary";
  };

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={` transition-all duration-500  font-semibold flex-center gap-1  ${getActiveStyle(item.href)}`}
        >
        <FaCircle size={5} className="text-brandPrimary"></FaCircle>  {item.name}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
