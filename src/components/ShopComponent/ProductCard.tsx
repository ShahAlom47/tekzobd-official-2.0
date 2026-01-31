"use client";

import { ProductType } from "@/Interfaces/productInterfaces";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaTrashAlt } from "react-icons/fa";
import { useWishlist } from "@/hooks/useWishlist";
import { useUser } from "@/hooks/useUser";
import { useCart } from "@/hooks/useCart";
import { useProductPriceManage } from "@/hooks/usePriceMange";
import SafeImage from "../CommonComponents/SafeImage";
import RatingDisplay from "../ui/RatingDisplay";
import LoginMsgModal from "../ui/LoginMsgModal";

type ProductCardProps = {
  item: ProductType;
  layout: "list" | "grid-3" | "grid-4";
  isWishList?: boolean;
};

const ProductCard = ({
  item,
  layout,
  isWishList = false,
}: ProductCardProps) => {
  const router = useRouter();
  const { isWishlisted, toggleWishlist, removeFromWishlist } = useWishlist();
  const [showLoginModal, setLoginModal] = useState<boolean>(false);
  const { user } = useUser();
  const {addToCart}=useCart()
    const {
      originalPrice,
      hasDiscount,
      discountedPrice,
      isOutOfStock,
    } = useProductPriceManage({
      price: item.price,
      discount: item.discount,
      offer: item.offer,
      stock: item.stock,
    });
    
    // console.log("ProductCard render", item);

  const handleCardClick = () => {
    router.push(`/shop/${item.slug}`);
  };

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user) {
      setLoginModal(true);
      return;
    }
    toggleWishlist(item._id.toString());
  };

  const handleRemoveFromWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    await removeFromWishlist(item._id.toString());
  };

const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();
  await addToCart(item?._id.toString());
};



  return (
    <div
      onClick={handleCardClick}
      className={`
        border border-brandNeutral rounded-sm shadow hover:shadow-md transition duration-300 cursor-pointer bg-white group hover:border-brandPrimary relative overflow-hidden
        ${layout === "list" ? "flex flex-row items-center gap-4" : ""}
        ${isWishList ? "p-2 text-sm" : "md:p-4 p-1"}
      `}
    >
      {/* ✅ Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          {item.discount}% OFF
        </div>
      )}

      {/* ✅ Stock Out Badge */}
      {isOutOfStock && (
        <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 rounded z-10">
          Stock Out
        </div>
      )}

      {/* ✅ Wishlist or Remove Button */}
      {!isWishList && (
        <button
          onClick={handleWishlistClick}
          className="absolute top-8 right-2 z-20 group-hover:-translate-x-0 translate-x-[200%] transition-all duration-500 btn-bordered p-1 text-sm text-brandPrimary rounded-sm"
          title="Add to wishlist"
        >
          {isWishlisted(item._id.toString()) ? "❤️" : <FaHeart />}
        </button>
      )}

      {/* ✅ Product Image */}
      <div
        className={`
          relative bg-gray-100 overflow-hidden
          ${
            layout === "list"
              ? isWishList
                ? "w-20 h-20"
                : "w-24 md:w-48 lg:w-1/3 aspect-square"
              : "p-3 w-full aspect-square"
          }
        `}
      >
        <SafeImage
          src={item?.media[0]?.url}
          alt={item?.title}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>

      {/* ✅ Product Info */}
      <div
        className={`${
          layout === "list"
            ? "flex-1 md:pl-4 space-y-2 text-left w-full"
            : "p-4 space-y-2 flex flex-col justify-center items-center"
        }`}
      >
        <h2
          className={`font-semibold text-gray-800 line-clamp-1 ${
            isWishList ? "text-sm" : "md:text-lg text-sm"
          }`}
        >
          {item?.title}
        </h2>

        {/* ✅ Price */}
        <div className="flex items-center space-x-2">
          {hasDiscount && (
            <span className="text-gray-400 line-through md:text-sm text-xs">
              TK {originalPrice}
            </span>
          )}
          <span
            className={`text-brandPrimary font-semibold ${
              isWishList ? "text-sm" : "md:text-base text-sm"
            }`}
          >
            TK {discountedPrice}
          </span>
        </div>

        {/* ✅ Rating */}
        {!isWishList && (
          <RatingDisplay avgRating={item?.ratings?.avg || 0} starSize={12} />
        )}

        {/* ✅ Button Group */}
        <div
          className={`flex gap-1  justify-center items-center   ${
            isWishList ? "md:flex-row flex-co items-center" : "flex-col w-full"
          }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn-bordered  md:px-2 px-2  text-xs md:text-base  transition w-fit ${
              isOutOfStock ? "cursor-not-allowed opacity-50" : ""
            } ${isWishList ? "h-6" : "sm:h-5 md:h-6 md:pb-2"}`}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
       

          {/* ✅ Remove from Wishlist Button */}
          {isWishList && (
            <button
              onClick={handleRemoveFromWishlist}
              className="btn-bordered border-red-500 px-4 py-1 hover:bg-red-600  transition text-xs md:text-base h-6 flex items-center gap-1"
            >
              <FaTrashAlt />
              <span className="hidden sm:inline">Remove</span>
            </button>
          )}
        </div>
      </div>
      <LoginMsgModal open={showLoginModal} setOpen={setLoginModal} />
    </div>
  );
};

export default ProductCard;
