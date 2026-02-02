"use client";

import React from "react";
import { ProductType } from "@/Interfaces/productInterfaces";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useProductPriceManage } from "@/hooks/usePriceMange";

interface Props {
  product: ProductType;
  quantity: number;
  color?: string | null;
}

const CartProductCard = ({ product, quantity, color }: Props) => {
  const { removeFromCart, updateQuantity } = useCart();
  const {
    originalPrice,
    discountPercent,
    hasDiscount,
    discountedPrice,
    isOutOfStock,
  } = useProductPriceManage({
    price: product.price,
    discount: product.discount,
    offer: product.offer,
    stock: product.stock,
  });

  // const isOfferActive = (() => {
  //   const offer = product.offer;
  //   if (!offer?.isActive || !offer.startDate || !offer.endDate) return false;

  //   const now = new Date().getTime();
  //   const start = new Date(offer.startDate).getTime();
  //   const end = new Date(offer.endDate).getTime();

  //   return now >= start && now <= end;
  // })();

  // const hasDiscount = isOfferActive && Number(product.discount) > 0;
  // const originalPrice = Number(product.price);
  // const discountPercent = Number(product.discount);
  // const discountedPrice = hasDiscount
  //   ? Math.round(originalPrice - (originalPrice * discountPercent) / 100)
  //   : originalPrice;

  // const stock = Number(product.stock);
  // const isOutOfStock = stock <= 0;

  return (
    <div
      className={`flex items-center gap-4 border rounded p-3 shadow-sm bg-white relative ${
        isOutOfStock ? "opacity-50" : ""
      }`}
    >
      {/* Image */}
      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
        <Image
          src={product.media[0]?.url || "/no-image.jpg"}
          alt={`${product.title} image`}
          width={80}
          height={80}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h4 className="text-base font-semibold text-gray-800 line-clamp-1">
          {product.title}
        </h4>

        {/* Price Section */}
        <div className="flex md:flex-row flex-col items-center  space-x-2">
          {hasDiscount && (
            <span className="text-gray-400 line-through text-sm ">
              TK {originalPrice}
            </span>
          )}
          <span className="text-brandPrimary font-semibold ">
            TK {discountedPrice}
          </span>
         
        </div>
        {
          color && (
            <div className="mt-1">
              <span className="text-sm text-gray-600">Color: {color} </span>
              <span className="inline-block w-3 h-3 rounded-full border"
                style={{ backgroundColor: color.toLowerCase() }}
              ></span>
            </div>
          )}
       

        {/* Quantity Control */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(product._id.toString(), quantity - 1)}
            disabled={quantity <= 1 || isOutOfStock}
            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            -
          </button>
          <span className="text-sm font-medium">{quantity}</span>
          <button
            onClick={() => updateQuantity(product._id.toString(), quantity + 1)}
            disabled={isOutOfStock || quantity >= Number(product.stock)}
            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-col justify-end items-end h-full">
        {/* Discount Label */}
        {hasDiscount && (
          <span className="bg-green-600 text-white px-2 rounded-sm text-sm font-medium">
            ({discountPercent}% OFF)
          </span>
        )}

        {/* Stock Warning */}
        {isOutOfStock && (
          <p className="text-red-500 text-sm mt-1 font-medium">Out of Stock</p>
        )}

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(product._id.toString())}
          className="text-red-500 hover:text-red-700 transition"
          title="Remove"
        >
          <MdClose size={22} />
        </button>
      </div>
    </div>
  );
};

export default CartProductCard;
