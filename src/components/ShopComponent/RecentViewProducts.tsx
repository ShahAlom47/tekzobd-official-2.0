"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/Interfaces/productInterfaces";
import { getRecentViewedIds } from "@/utils/recentViewHelper";
import { getRecentProductsByIds } from "@/lib/allApiRequest/productRequest/productRequest";
import RecentViewProductCard from "./RecentViewProductCard";

const RecentViewProducts = () => {
  const [recentProducts, setRecentProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      const ids = getRecentViewedIds();

      if (ids.length > 0) {
        const res = await getRecentProductsByIds(ids);
        setRecentProducts((res?.data ?? []) as ProductType[]);
      }
    };

    fetchRecentProducts();
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <div className="my-8 py-4">
      <h2 className="md:text-lg  font-semibold mb-4 text-gray-700"> Recently Viewed </h2>
      <div className="grid grid-cols-1  gap-4  max-h-fit overflow-y-scroll">
        {recentProducts.map((item) => (
        <RecentViewProductCard key={item?._id?.toString()} product={item}></RecentViewProductCard>
        ))}
      </div>
    </div>
  );
};

export default RecentViewProducts;
