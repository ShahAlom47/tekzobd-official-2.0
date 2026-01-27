"use client";

import React, { useEffect, useState } from "react";
import { PiShoppingCartThin } from "react-icons/pi";
import Drawer from "./Drawer";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { getCartProducts } from "@/lib/allApiRequest/cartRequest/cartRequest";
import { ProductType } from "@/Interfaces/productInterfaces";
import Loading from "@/app/loading";
import { queryClient } from "@/Providers/QueryProvider";
import CartContent from "./CartContent";
import CartSummary from "./CartSummary";
import { BsCartDash } from "react-icons/bs";
import { useRouter } from "next/navigation";

const NavCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount, cartItems } = useCart();
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);
  const itemIds = cartItems?.map((item) => item?.productId) || [];
  const router = useRouter();



  useEffect(() => {
    setIsClient(true);
  }, []);


  const userEmail = user?.email ?? "";

  const cartCount = (): string =>
    !itemCount || itemCount <= 0
      ? "0"
      : itemCount > 99
      ? "+99"
      : itemCount.toString();

  const queryEnabled = isClient && isOpen && itemIds.length > 0;

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cartProducts", itemIds.join(",")],
    queryFn: async () => {
      const res = await getCartProducts(itemIds, userEmail);
      return (res.data || []) as ProductType[];
    },
    enabled: queryEnabled,
    staleTime: 1000 * 60 * 2,
    placeholderData: () =>
      queryClient.getQueryData<ProductType[]>([
        "cartProducts",
        itemIds.join(","),
      ]),
  });

  if (!isClient) return null;



  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        title="Your Cart"
        className="text-black md:text-2xl text-2xl font-light relative hover:scale-90 transition-transform"
      >
        <PiShoppingCartThin />
        <span className="md:h-5 md:w-5 h-4 w-4 p-1 bg-brandPrimary rounded-full absolute -top-2 -right-2 md:text-[9px] text-[8px] text-white flex items-center justify-center font-semibold shadow">
          {cartCount()}
        </span>
      </button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        direction="right"
        width="w-[90%] md:w-[40%] product"
      >
        <div className="p-2 min-h-screen flex flex-col">
          <h3 className="text-lg font-semibold mb-2 pb-2 border-b-2">
            Your Cart
          </h3>

          <div className="flex flex-col justify-between gap-2 p-2 product h-[90vh] ">
            <div className="overflow-y-scroll flex-1 h-full product ">
              {isLoading && !products && <Loading />}

              {isError && (
                <div className="text-red-500 text-sm text-center ">
                  Failed to load cart products.{" "}
                  <button
                    onClick={() => refetch()}
                    className="underline text-brandPrimary hover:text-red-600"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty Cart Message */}
              {!isLoading &&
                !isError &&
                (!products || products.length === 0) && (
                  <div className="flex flex-col items-center justify-center mt-10 text-gray-900 px-4 ">
                    <BsCartDash size={40} />
                    <p className="text-lg font-semibold mb-2">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-gray-900 mb-4">
                      Looks like you haven’t added anything yet.
                    </p>
                    <button
                      onClick={() => {
                        router.push("/shop");
                        setIsOpen(false);
                      }}
                      className="btn-bordered"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              {!isLoading && !isError && products && products.length > 0 && (
                <CartContent
                  products={products}
                  cartItems={cartItems}
                  contentType={"drawer"}
                />
              )}
            </div>

            <div>
              {!isLoading && !isError && products && products.length > 0 && (
                <CartSummary
                  cartItems={cartItems}
                  products={products || []}
                  couponDiscountPercent={0}
                />
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default NavCart;
