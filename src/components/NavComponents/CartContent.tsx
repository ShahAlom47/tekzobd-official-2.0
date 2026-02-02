"use client";
import React from "react";
import { ProductType } from "@/Interfaces/productInterfaces";
import { CartItem } from "@/Interfaces/cartInterface";
import PageHeading from "../CommonComponents/PageHeading";
import CartProductCard from "./CartProductCard";

interface CartContentProps {
  products: ProductType[] | null;
  contentType?: "drawer" | "page";
  cartItems: CartItem[];
}

const CartContent = ({
  products,
  contentType = "page",
  cartItems,
}: CartContentProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No products in your cart.</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${contentType === "page" ? "p-6" : "p-2"}`}>
      {contentType === "page" && (
        <PageHeading
          title="Your Cart"
          subTitle="View and manage products you've added"
        />
      )}

      <div
        className={`grid gap-4 ${
          contentType === "drawer"
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        }`}
      >
        {products.map((product) => {
          const cartItem = cartItems.find(
            (item) => item.productId === product._id
          );

          return (
            <CartProductCard
              key={product._id.toString()}
              product={product}
              quantity={cartItem?.quantity || 1}
              color={cartItem?.color || undefined}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CartContent;
