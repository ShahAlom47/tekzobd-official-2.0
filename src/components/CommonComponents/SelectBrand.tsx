"use client";

import React, { useState, useEffect, useRef } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

export const defaultBrands = [
  "N/A","Hoco", "Awei","Tech", "Electronics", "Apple", "Samsung", "Sony", "LG", "Dell", "HP", "Lenovo", "Asus",
  "Acer", "Microsoft", "Google", "OnePlus", "Xiaomi", "Huawei", "Nokia", "Motorola",
  "Panasonic", "Philips", "Canon", "Nikon", "Bose", "JBL", "Sennheiser", "Amazon",
  "Fitbit", "Garmin", "Razer", "Alienware", "Corsair", "Seagate", "Western Digital",
  "Sandisk", "Kingston", "Logitech", "Toshiba",
];

interface SelectBrandProps<T extends FieldValues = FieldValues> {
  control?: Control<T>;
  name?: Path<T>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  brands?: string[];
  allBrandsOption?: boolean;
}

export function SelectBrand<T extends FieldValues = FieldValues>({
  control,
  name,
  value = "",
  onChange,
  placeholder = "Select or type brand",
  className = "",
  brands = defaultBrands,
  allBrandsOption = true,
}: SelectBrandProps<T>) {
  const [inputValue, setInputValue] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Compute filtered brands directly
  const filteredBrands = React.useMemo(() => {
    const val = inputValue.toLowerCase();
    const filtered = brands.filter((brand) =>
      brand.toLowerCase().includes(val)
    );
    return allBrandsOption
      ? ["All Brands", ...filtered.filter((b) => b !== "All Brands")]
      : filtered;
  }, [inputValue, brands, allBrandsOption]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (brand: string, callback?: (val: string) => void) => {
    const finalVal = brand === "All Brands" ? "" : brand;
    setInputValue(finalVal);
    callback?.(finalVal);
    setIsOpen(false);
  };

  const renderInput = (
    currentVal: string,
    setVal: (val: string) => void,
    changeCallback?: (val: string) => void
  ) => (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        className="my-input w-full"
        value={currentVal}
        onChange={(e) => {
          const val = e.target.value;
          setVal(val);
          changeCallback?.(val);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        autoComplete="off"
      />
      {isOpen && filteredBrands.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
          {filteredBrands.map((brand) => (
            <li
              key={brand}
              className="cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white transition"
              onClick={() => handleSelect(brand, changeCallback)}
            >
              {brand}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Controlled via form
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          renderInput(field.value || "", (val) => field.onChange(val), field.onChange)
        }
      />
    );
  }

  // Manual controlled
  return renderInput(inputValue, setInputValue, onChange);
}
