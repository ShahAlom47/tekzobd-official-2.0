"use client";

import React from "react";
import { CategoryType } from "@/Interfaces/categoryInterfaces";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { useCategories } from "@/hooks/useCategory";

interface CategorySelectProps<T extends FieldValues = FieldValues> {
  control?: Control<T>;
  name?: Path<T>;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  allCategory?: boolean;
}

export function CategorySelect<T extends FieldValues = FieldValues>({
  control,
  name,
  placeholder = "Select category",
  className = "",
  value,
  onChange,
  allCategory,
}: CategorySelectProps<T>) {
  const { categories, loading } = useCategories();

  const renderOptions = () => (
    <>
      <option value="" className="text-gray-400 text-xs">
        {loading ? "Loading categories..." : placeholder}
      </option>
      {allCategory && (
        <option key="allCategory" value="all-category" className="text-xs ">
          All Categories
        </option>
      )}
      {categories.map((cat: CategoryType) => (
        <option key={cat._id?.toString() || cat.name} value={cat._id?.toString() || ""}>
          {cat.name}
        </option>
      ))}
    </>
  );

  if (loading) {
    return (
      <select disabled className={`my-input ${className} text-sm text-black`}>
        <option>Loading categories...</option>
      </select>
    );
  }

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className={`my-input w-fit text-xs  ${className}`}
            value={field.value || ""}
          >
            {renderOptions()}
          </select>
        )}
      />
    );
  }

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      className={`my-input  ${className}`}
    >
      {renderOptions()}
    </select>
  );
}
