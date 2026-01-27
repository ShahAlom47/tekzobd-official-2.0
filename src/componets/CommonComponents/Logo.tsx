"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import logo from "@/assets/logo/3d-logo.png"

interface PropsType {
  className?: string;
}

const Logo = ({ className }: PropsType) => {
    const router = useRouter()
   
  return (
    <div  onClick={()=> router.push("/")} className='flex gap-2  mx-3  justify-center items-center  cursor-pointer max-h-20 max-w-xl overflow-y-hidden'>
      <Image
        src={logo}
        alt="Logo"
        width={200}
        height={150}
        unoptimized
        className={` ${className}`}
      />
    </div>
  );
};

export default Logo;
