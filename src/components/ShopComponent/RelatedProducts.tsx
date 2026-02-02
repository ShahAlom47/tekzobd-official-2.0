"use client";

import Loading from "@/app/loading";
import { useQuery } from "@tanstack/react-query";
import { getRelatedProductsById } from "@/lib/allApiRequest/productRequest/productRequest";
import { ProductType } from "@/Interfaces/productInterfaces";
import RelatedProductCard from "./RelatedProductCard";

type Props = {
  productId: string;
};

const RelatedProducts = ({ productId }: Props) => {
  const { data: relatedProducts, isLoading } = useQuery({
    queryKey: ["relatedProducts", productId],
    queryFn: async () => {
      const res = await getRelatedProductsById(productId);
      return res?.data as ProductType[];
    },
  });

  if (isLoading) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <div className="flex justify-center items-center w-full">
          <Loading />
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <RelatedProductCard key={product._id.toString()} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
