"use client";

import React, { useState } from "react";
import SummaryCard from "./SummaryCard";
import {
  FaUsers,
  FaShoppingCart,
  FaBoxOpen,
  FaDollarSign,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getAllOverview } from "@/lib/allApiRequest/dashOverviewRequest/dashOverviewRequest";
import { DashboardOverviewData } from "@/Interfaces/dashOverViewInterfaces";
import TimeRangeSelector, { FilterType } from "./TimeRangeSelector";

const OverviewContent = () => {
  const [filter, setFilter] = useState<FilterType>("week"); // default filter

  // Fetch data with react-query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["overview-data", filter],
    queryFn: async () => {
      const res = await getAllOverview({ filter });
      return res?.data as DashboardOverviewData;
    },
    staleTime: 5 * 1000, // 5 seconds → previous data kept briefly
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>Loading overview data...</p>;
  if (isError) return <p>Failed to load overview data.</p>;

  // Prepare all card data in one array for mapping
  const cards = [
    {
      title: "Users",
      values: [
        { label: "Total Users", value: data?.users?.totalUsers ?? 0 },
        { label: "New Users", value: data?.users?.newUsers ?? 0 },
      ],
      icon: <FaUsers className="text-blue-500" />,
    },
    {
      title: "Orders",
      values: [
        { label: "Total Orders", value: data?.orders?.totalOrders ?? 0 },
        { label: "Pending Orders", value: data?.orders?.pendingOrders ?? 0 },
        {
          label: "Completed Orders",
          value: data?.orders?.completedOrders ?? 0,
        },
        {
          label: "Cancelled Orders",
          value: data?.orders?.cancelledOrders ?? 0,
        },
      ],
      icon: <FaShoppingCart className="text-green-500" />,
    },
    {
      title: "Products",
      values: [
        { label: "Total Products", value: data?.products?.totalProducts ?? 0 },
        { label: "In Stock", value: data?.products?.inStockProducts ?? 0 },
        {
          label: "Out of Stock",
          value: data?.products?.outOfStockProducts ?? 0,
        },
      ],
      icon: <FaBoxOpen className="text-yellow-500" />,
    },
    {
      title: "Sales",
      values: [
        {
          label: "Total Sales",
          value: `$${data?.sales?.totalSalesAmount?.toFixed(2) ?? "0.00"}`,
        },
      ],
      icon: <FaDollarSign className="text-red-500" />,
    },
  ];

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md">
      {/* Filter Dropdown */}
      <TimeRangeSelector
        filter={filter}
        onFilterChange={setFilter}
        onRefresh={refetch}
      />

      {/* Cards */}
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {cards.map((card, idx) => {
          const isWideCard =
            card.title === "Orders" || card.title === "Products";
          return (
            <SummaryCard
              key={idx}
              title={card.title}
              values={card.values}
              className={isWideCard ? "col-span-2" : "col-span-1"}
            >
              {card.icon}
            </SummaryCard>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewContent;
