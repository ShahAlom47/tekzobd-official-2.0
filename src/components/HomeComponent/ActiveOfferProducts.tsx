"use client";

import { ProductType } from "@/Interfaces/productInterfaces";
import React from "react";
import Link from "next/link";
import HomeSecHeading from "../CommonComponents/HomeSecHeading";
import OfferProductCard from "./OfferProductCard";

type Props = {
  products: ProductType[];
};

const ActiveOfferProducts = ({ products }: Props) => {
  const currentDate = new Date();

  // Active offer ফিল্টার
  const offerProducts = products.filter((product) => {
    if (
      product.isPublished &&
      product.offer?.isActive === true &&
      product.offer.startDate &&
      product.offer.endDate
    ) {
      const start = new Date(product.offer.startDate);
      const end = new Date(product.offer.endDate);
      return currentDate >= start && currentDate <= end;
    }
    return false;
  });

  // যদি কোন অফার না থাকে
  if (offerProducts.length === 0) {
    return (
      <section className="py-12 text-center text-gray-500">
        <p>No active offers available right now.</p>
      </section>
    );
  }

  // ✅ শুধু 12 টা পর্যন্ত দেখাবে
  const visibleProducts = offerProducts.slice(0, 12);

  return (
    <section className="py-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeSecHeading>Special Offers</HomeSecHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-5">
          {visibleProducts.map((product) => (
            <OfferProductCard
              key={product?._id.toString()}
              product={product}
            />
          ))}
        </div>

        {/* ✅ যদি ডাটার সংখ্যা 12 টার বেশি হয় তখনই বাটন আসবে */}
        {offerProducts.length > 9 && (
          <div className="text-center mt-6">
            <Link
              href="/shop?sort=offer&page=1"
              className="btn-bordered"
            >
              View All Offers
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActiveOfferProducts;
