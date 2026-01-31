"use client";

import { useState } from "react";
import { ProductType } from "@/Interfaces/productInterfaces";
import { FaList } from "react-icons/fa";
import { RiLayoutGridFill } from "react-icons/ri";
import { BsGrid3X3GapFill } from "react-icons/bs";
import ProductCard from "./ProductCard";

interface Props {
  products: ProductType[];
}

const ShopProductGrid: React.FC<Props> = ({ products }) => {
  const [layout, setLayout] = useState<"list" | "grid-3" | "grid-4">("grid-4");

  const renderProduct = (product: ProductType) => (
    <div key={String(product._id)}>
      <ProductCard item={product} layout={layout} />
    </div>
  );

  return (
    <div className="space-y-4 md:mt-10    ">
      {/* Layout Switch Buttons */}
      <div className="flex items-center gap-2   justify-end  ">
        <button
          onClick={() => setLayout("list")}
          className={`border px-3 py-1 rounded hover:bg-gray-100 ${
            layout === "list" ? "bg-gray-200 font-semibold" : ""
          }`}
        >
          <FaList  className="w-4 h-4 inline-block mr-1" />
        
        </button>
        <button
          onClick={() => setLayout("grid-3")}
          className={`border px-3 py-1 rounded hover:bg-gray-100 ${
            layout === "grid-3" ? "bg-gray-200 font-semibold" : ""
          }`}
        >
          <RiLayoutGridFill  className="w-4 h-4 inline-block mr-1" />
        </button>
        <button
          onClick={() => setLayout("grid-4")}
          className={`border px-3 py-1 rounded hover:bg-gray-100 hidden md:block ${
            layout === "grid-4" ? "bg-gray-200 font-semibold" : ""
          }`}
        >
          <BsGrid3X3GapFill className="w-4 h-4 inline-block mr-1" />
        </button>
      </div>

      {/* Product List/Grid Display */}
      <div
        className={`text-black ${
          layout === "list"
            ? "space-y-4"
            : layout === "grid-3"
            ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6"
            : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        }`}
      >
        {products?.map((product) => renderProduct(product))}
      </div>
    </div>
  );
};

export default ShopProductGrid;
