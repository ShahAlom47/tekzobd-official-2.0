"use client";

import { CategoryType } from "@/Interfaces/categoryInterfaces";
import HomeCategoryCard from "./HomeCategoryCard";

type Props = {
  categories: CategoryType[];
};

const CategoryGrid = ({ categories }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
      {categories.map((category) => (
        <div
          key={category._id ? category._id.toString() : category?.name}
        >
          <HomeCategoryCard category={category} />
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
