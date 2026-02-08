
import { clearDashSearchValue, setDashSearchValue } from "@/redux/features/search/DashSearchSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHook";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const DashSearchBox = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchValue = useAppSelector((state) => state.dashSearch.dashSearchValue);
  const [searchTerm, setSearchTerm] = useState(searchValue);



  useEffect(() => {
    dispatch(clearDashSearchValue());
    setSearchTerm(""); 
  }, [pathname, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setDashSearchValue(searchTerm));
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    dispatch(clearDashSearchValue());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-2 border-brandPrimary rounded-full p-1 text-black relative"
    >
      <input
        className="px-2 w-full bg-transparent outline-none"
        type="text"
        name="search"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-10 text-grayDeep hover:text-red-400"
        >
          <IoMdClose size={18} />
        </button>
      )}

      <button
        type="submit"
        className="text-grayDeep hover:text-gray-700 px-1"
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default DashSearchBox;
