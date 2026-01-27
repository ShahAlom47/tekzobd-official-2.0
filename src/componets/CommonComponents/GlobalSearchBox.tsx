"use client";

import {
  setGlobalSearchValue,
  clearGlobalSearchValue,
} from "@/redux/features/search/GlobalSearchSlice";
import { useAppDispatch } from "@/redux/hooks/reduxHook";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState, KeyboardEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const GlobalSearchBox: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [searchText, setSearchText] = useState<string>("");

  // ✅ Handle search & redirect
  const handleSearch = () => {
    const trimmed = searchText.trim();
    if (!trimmed) return;

    dispatch(setGlobalSearchValue(trimmed));
    router.push(`/shop?searchTrim=${encodeURIComponent(trimmed)}`);
  };

  // ✅ Clear search & go back to shop without query
  const handleClearSearch = () => {
    setSearchText("");
    dispatch(clearGlobalSearchValue());
    router.push("/shop");
  };

  // ✅ Live update input
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // ✅ Handle Enter key press inside input
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative w-auto max-w-screen-md mx-auto rounded-full border-2 border-brandPrimary">
      <input
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown} // ✅ Now handles Enter press
        placeholder="Search products..."
        className="w-full px-4 py-[2] bg-transparent focus:outline-none rounded-full text-black focus:ring-2 focus:ring-brandPrimary transition duration-300"
      />

      {/* Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brandPrimary"
      >
        <FaSearch />
      </button>

      {/* Clear (X) Button */}
      {searchText && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
        >
          <IoClose size={16} />
        </button>
      )}
    </div>
  );
};

export default GlobalSearchBox;

