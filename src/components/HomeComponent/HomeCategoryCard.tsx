"use client";

import { CategoryType } from "@/Interfaces/categoryInterfaces";
import { useRouter } from "next/navigation";
import { iconOptions } from "@/utils/iconOptions";
import { FaBox } from "react-icons/fa"; // Default icon

type Props = {
  category: CategoryType;
  key?: string;
};

const CategoryCard = ({ category, key }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/shop?category=${category.slug}`);
  };

  // iconOptions থেকে মেলানো, না পেলে FaBox fallback
  const matchedIcon = iconOptions.find((opt) => opt.value === category.icon);
  const IconComponent = matchedIcon?.icon || FaBox;

  return (
    <div
      key={key}
      onClick={handleClick}
      className="  cursor-pointer border border-brandPrimary hover:scale-95 drop-shadow-2xl shadow-blue-800 rounded-xl transition-all duration-300 p-4 text-center"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      {/* Icon render */}
      <div className="flex justify-center mb-3 text-4xl text-brandPrimary">
        <IconComponent />
      </div>

      <h3 className="text-sm md:text-lg font-semibold text-gray-800">
        {category.name}
      </h3>
    </div>
  );
};

export default CategoryCard;
