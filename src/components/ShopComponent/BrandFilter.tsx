"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SelectBrand } from "../CommonComponents/SelectBrand";

const BrandFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialBrand = searchParams.get("brand") || "";

  const [selectedBrand, setSelectedBrand] = useState(initialBrand);

  useEffect(() => {
    setSelectedBrand(initialBrand);
  }, [initialBrand]);

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);

    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "All Brands") {
      params.delete("brand");
    } else {
      params.set("brand", value);
    }

    params.set("page", "1"); // Reset pagination
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700">Filter by Brand</label>
      <SelectBrand value={selectedBrand} onChange={handleBrandChange} />
    </div>
  );
};

export default BrandFilter;
