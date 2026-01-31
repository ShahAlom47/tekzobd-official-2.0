"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProductType } from "@/Interfaces/productInterfaces";
import SafeImage from "../CommonComponents/SafeImage";

interface Props {
  product: ProductType;
}

const RecentViewProductCard: React.FC<Props> = ({ product }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/shop/${product.slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white grid grid-cols-3 gap-2 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg border hover:border-brandPrimary transition duration-300 group p-1 md:p-2"
    >
      {/* Image Section */}
      <div className="relative col-span-1 w-full h-28 md:h-16 bg-gray-100 rounded-md overflow-hidden">
        <SafeImage
          src={product.media?.[0]?.url}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info Section */}
      <div className="p-1 flex flex-col justify-center gap-1 col-span-2">
        <h3 className="text-base font-medium text-gray-800 line-clamp-1">
          {product.title}
        </h3>
        <div className="text-gray-600 md:text-[10px]  ">
          ৳ {product.price - (product.price * product.discount) / 100}
          {product.discount > 0 && (
            <span className="ml-2 text-red-500 line-through md:text-[10px] font-normal">
              ৳ {product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentViewProductCard;
