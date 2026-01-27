"use client";

import React, { useState, useEffect, useMemo } from "react";
import { BsBookmarkHeart } from "react-icons/bs";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import Drawer from "../CommonComponents/Drawer";

const NavWishList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user } = useUser();

  const {
    wishlistProducts,
    isProductsLoading,
    isProductsError,
    refetchProducts,
    productIdList,
    stableProductIdList,
  } = useWishlist();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const wishCount = useMemo(() => {
    const count = productIdList?.length || 0;
    return count > 98 ? "99+" : `${count}`;
  }, [productIdList]);

  // Refetch products only when drawer opens
  useEffect(() => {
    if (isClient && user && isOpen && stableProductIdList?.length > 0) {
      refetchProducts();
    }
  }, [isClient, user, isOpen, refetchProducts, stableProductIdList]);

  return (
    <div className="relative flex items-center">
      {/* Wishlist Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-700 md:text-2xl text-xl font-light relative hover:scale-90 transition-transform"
        title="Wishlist"
      >
        <BsBookmarkHeart />
        <span className="md:h-5 md:w-5 h-4 w-4 bg-brandPrimary rounded-full absolute -top-2 -right-2 md:text-[9px] text-[8px] text-white flex items-center justify-center font-semibold shadow">
          {wishCount}
        </span>
      </button>

      {/* Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        direction="right"
        width="w-[90%] md:w-[40%]"
      >
        {isOpen && (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 pb-2 border-b-2">
              My Wishlist
            </h3>

            <div className="max-h-[86vh] overflow-y-auto">
              {/* Loading skeleton */}
              {isProductsLoading && (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-200 animate-pulse rounded-md"
                    />
                  ))}
                </div>
              )}

              {/* Error State */}
              {isProductsError && (
                <div className="text-red-500 text-sm text-center mt-16">
                  Failed to load wishlist.{" "}
                  <button
                    onClick={() => refetchProducts()}
                    className="underline text-brandPrimary hover:text-red-600"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!isProductsLoading &&
                !isProductsError &&
                wishlistProducts?.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-gray-500 mt-16 ">
                    <p className="mb-2">No products in your wishlist.</p>
                    <Link
                      href="/shop"
                      className="btn-bordered"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}

              {/* Wishlist Items */}
              {!isProductsLoading &&
                !isProductsError &&
                wishlistProducts?.length > 0 && (
                  <WishListContent
                    products={wishlistProducts}
                    contentType="drawer"
                  />
                )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default NavWishList;
