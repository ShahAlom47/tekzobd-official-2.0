"use client";

import { useCategories } from "@/hooks/useCategory";
import { CategorySelect } from "./CategorySelect";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CategoryFilter = () => {
  const { categories } = useCategories();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isShopPage = pathname?.includes("/shop");

  // Selected category ID (null initially to avoid hydration mismatch)
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // When categories loaded or URL changes, sync category ID
  useEffect(() => {
    if (categories.length > 0) {
      const slug = searchParams.get("category") || "";
      const category = categories.find((cat) => cat.slug === slug);
      const currentId = category?._id?.toString() || "all-category";
      setSelectedId(currentId);
    }
  }, [categories, searchParams]);

  // Handle dropdown change
  const handleChange = (categoryId: string) => {
    setSelectedId(categoryId);

    const params = new URLSearchParams(searchParams.toString());

    if (categoryId === "all-category") {
      params.delete("category");
    } else {
      const selectedCategory = categories.find((cat) => cat._id === categoryId);
      const selectedSlug = selectedCategory?.slug;
      if (!selectedSlug) return;

      params.set("category", selectedSlug);
    }

    params.set("page", "1"); // Reset to first page when filter changes
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="p-1 rounded-md space-y- text-sm md:text-base">
      {isShopPage && (
        <h3 className="font-medium text-gray-700">Filter by Category</h3>
      )}
      <div className="mb-4">
        {/* Render CategorySelect only after selectedId is initialized */}
        {selectedId !== null && (
          <CategorySelect
            value={selectedId}
            onChange={handleChange}
            placeholder="Filter by category"
            allCategory={true}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
