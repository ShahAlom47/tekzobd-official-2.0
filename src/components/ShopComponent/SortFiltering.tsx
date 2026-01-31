"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { label: "Sort", value: "" },
  { label: "Price: Low to High", value: "asc" },
  { label: "Price: High to Low", value: "desc" },
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "popular" },
  { label: "Offer First", value: "offer" },
];

const SortFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isShopPage = pathname?.includes("/shop");

  const [selectedSort, setSelectedSort] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const initialSort = searchParams?.get("sort") || "";
      setSelectedSort(initialSort);
      setError(""); // clear error if success
    } catch (err) {
      console.error(err);
      setError("⚠ Could not read sort parameter");
      setSelectedSort(""); // fallback to empty
    }
  }, [searchParams]);

  const handleChange = (value: string) => {
    try {
      if (!searchParams) throw new Error("Invalid search params");

      const params = new URLSearchParams(searchParams.toString());

      if (value === "") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }

      params.set("page", "1"); // reset page
      setSelectedSort(value);
      setError(""); // clear error
      router.push(`/shop?${params.toString()}`);
    } catch (err) {
      console.error(err);
      setError("⚠ Something went wrong while updating sort");
    }
  };

  return (
    <div className="p-1 space-y-1 text-sm md:text-base">
      {isShopPage && (
        <label className="font-medium text-gray-700 ">Sort By</label>
      )}

      <select
        value={selectedSort}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full my-input"
      >
        {sortOptions.map(({ label, value }) => (
          <option key={value || "default"} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* Show error if any */}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SortFilter;
