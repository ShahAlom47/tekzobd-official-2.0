"use client";
import React from "react";
import { HiOutlineRefresh } from "react-icons/hi";

export type FilterType = "today" | "week" | "month" | "year" | "all";

interface TimeRangeSelectorProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onRefresh: () => void;
}

const filterOptions: { label: string; value: FilterType }[] = [
  { label: "Today", value: "today" },
  { label: "This Week ", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "All Time", value: "all" },
];

export default function TimeRangeSelector({
  filter,
  onFilterChange,
  onRefresh,
}: TimeRangeSelectorProps) {

  const handleRefresh =()=>{
    onFilterChange("week")
    onRefresh()
  }
  return (
    <div className="flex items-center gap-4 mb-6">
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value as FilterType)}
        className="my-input max-w-fit"
      >
        {filterOptions.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
      <button onClick={handleRefresh} className="btn-bordered rounded-sm">
        <HiOutlineRefresh />
      </button>
    </div>
  );
}
