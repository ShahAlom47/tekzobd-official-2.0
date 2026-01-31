"use client";

import CategoryFilter from "./CategoryFilter";
import SortFilter from "./SortFiltering";



const ShopFilterSidebar = () => {
  return (
    <div className="md:p-4 p-1 rounded-lg shadow-md border text-sm space-y-5 bg-white text-blackMid ">
      <div className="grid grid-cols-2 md:grid-cols-1 gap2">
        {/* sort  */}
        <SortFilter />
        {/* Category */}
        <CategoryFilter></CategoryFilter>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-1  gap-2 ">
        {/* Price Range */}
        <PriceFilter></PriceFilter>
        <div className=" flex flex-col gap-2">
          {/* Brand Filter */}
          <BrandFilter></BrandFilter>
          {/* Stock Filter */}
          <StockFilter />
        </div>
      </div>
      <div className="md:block hidden">
        <RecentViewProducts></RecentViewProducts>
      </div>
    </div>
  );
};

export default ShopFilterSidebar;
