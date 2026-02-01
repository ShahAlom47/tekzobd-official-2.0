"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const StockFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentValue = searchParams.get("stock") || ""; // can be "in-stock" or "out-of-stock"
  const [selected, setSelected] = useState(currentValue);

  useEffect(() => {
    setSelected(currentValue);
  }, [currentValue]);

  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selected === val) {
      // Toggle off if already selected
      params.delete("stock");
      setSelected("");
    } else {
      params.set("stock", val);
      setSelected(val);
    }

    params.set("page", "1"); // Reset to first page on filter change
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-1 text-sm">
      <label className="block font-medium text-gray-700"> Availability</label>
      <div className="flex md:flex-row flex-col  gap-2">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selected === "in-stock"}
            onChange={() => handleChange("in-stock")}
          />
          In Stock
        </label>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selected === "out-of-stock"}
            onChange={() => handleChange("out-of-stock")}
          />
          Out of Stock
        </label>
      </div>
    </div>
  );
};

export default StockFilter;
