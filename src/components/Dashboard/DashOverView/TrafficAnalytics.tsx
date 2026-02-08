"use client";
import { getAllTrafficInfo } from "@/lib/allApiRequest/dashOverviewRequest/dashOverviewRequest";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import TimeRangeSelector, { FilterType } from "./TimeRangeSelector";
import SummaryCard from "./SummaryCard";
import { CustomTable } from "../ui/CustomTable";
import {
  ExtraMetrics,
  SummaryMetrics,
  TrafficApiResponse,
  TrafficRow,
} from "@/Interfaces/googleAnalyticsInterface";

export default function TrafficAnalytics() {
  const [filter, setFilter] = useState<FilterType>("week");
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery<TrafficApiResponse>({
    queryKey: ["traffic-data", filter],
    queryFn: async () => {
      const res = await getAllTrafficInfo({ filter });
      return res?.data as TrafficApiResponse;
    },
    staleTime: 5 * 1000,
    refetchOnWindowFocus: false,
  });
  // Prepare table data
  const tableRows: TrafficRow[] = useMemo(() => {
    if (!data?.rows) return [];
    return data.rows.map((row): TrafficRow => {
      const [pagePath, pageTitle, eventName, linkText, rawDate] =
        row.dimensionValues.map((d) => d.value);
      const [eventCount, totalUsers, pageViews] = row.metricValues.map(
        (m) => m.value
      );
      const dateFormatted = `${rawDate.slice(6, 8)}/${rawDate.slice(
        4,
        6
      )}/${rawDate.slice(0, 4)}`;
      return {
        pagePath,
        pageTitle,
        eventName,
        linkText,
        date: dateFormatted,
        eventCount,
        totalUsers,
        pageViews,
      };
    });
  }, [data]);

  // Summary metrics
  const summary: SummaryMetrics = useMemo(() => {
    let totalUsers = 0,
      pageViews = 0,
      events = 0;
    tableRows.forEach((row) => {
      totalUsers += parseInt(row.totalUsers);
      pageViews += parseInt(row.pageViews);
      events += parseInt(row.eventCount);
    });
    return { totalUsers, pageViews, events };
  }, [tableRows]);

  // Extract specific metrics
  const extraMetrics: ExtraMetrics = useMemo(() => {
    if (!data?.rows)
      return {
        homeViews: 0,
        shopViews: 0,
        productViews: 0,
        addToCart: 0,
        checkout: 0,
      };

    let homeViews = 0;
    let shopViews = 0;
    let productViews = 0;
    let addToCart = 0;
    let checkout = 0;

    data.rows.forEach((row) => {
      const [pagePath, , eventName] = row.dimensionValues.map((d) => d.value);
      const totalUsers = parseInt(row.metricValues[1].value);

      if (pagePath === "/") homeViews += totalUsers;
      if (pagePath === "/shop") shopViews += totalUsers;
      if (pagePath.startsWith("/shop/") || pagePath.startsWith("/product/")) {
        productViews += totalUsers;
      }
      if (eventName === "add_to_cart") addToCart += totalUsers;
      if (eventName === "checkout") checkout += totalUsers;
    });

    return { homeViews, shopViews, productViews, addToCart, checkout };
  }, [data]);

  const rowsToShow = showAll ? tableRows : tableRows.slice(0, 20);

  // ✅ Columns for CustomTable
  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Page Path", accessor: "pagePath" },
    { header: "Page Title", accessor: "pageTitle" },
    { header: "Event", accessor: "eventName" },
    { header: "Link Text", accessor: "linkText" },
    { header: "Event Count", accessor: "eventCount" },
    { header: "Users", accessor: "totalUsers" },
    { header: "Page Views", accessor: "pageViews" },
  ];

  return (
    <div className="p-6 bg-white rounded shadow max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Traffic Analytics</h2>

      <TimeRangeSelector
        filter={filter}
        onFilterChange={setFilter}
        onRefresh={refetch}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          title="Total Users"
          values={[{ value: summary.totalUsers }]}
        />
        <SummaryCard
          title="Page Views"
          values={[{ value: summary.pageViews }]}
        />
        <SummaryCard title="Event Count" values={[{ value: summary.events }]} />
        <SummaryCard
          title="Home Page Views"
          values={[{ value: extraMetrics.homeViews }]}
        />
        <SummaryCard
          title="Shop Page Views"
          values={[{ value: extraMetrics.shopViews }]}
        />
        <SummaryCard
          title="Product Views"
          values={[{ value: extraMetrics.productViews }]}
        />
        <SummaryCard
          title="Add to Cart"
          values={[{ value: extraMetrics.addToCart }]}
        />
        <SummaryCard
          title="Checkout Clicks"
          values={[{ value: extraMetrics.checkout }]}
        />
      </div>

      {/* ✅ Replace old table with CustomTable */}
      <div className="mt-6">
        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500 py-4">Failed to load data.</p>
        ) : (
          <CustomTable columns={columns} data={rowsToShow} />
        )}
      </div>

      {/* Show More Button */}
      {!showAll && tableRows.length > 20 && (
        <div className="text-center mt-4">
          <button onClick={() => setShowAll(true)} className="btn-bordered">
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
