"use client";

import React from "react";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

const statusList: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

// User-friendly names
const statusNames: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Accepted", // confirmed হলে "Accepted" দেখাবে
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500 text-white",
  confirmed: "bg-green-500 text-white",
  shipped: "bg-purple-500 text-white",
  delivered: "bg-green-600 text-white",
  cancelled: "bg-red-500 text-white",
};

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
  const activeIndex = statusList.indexOf(status);

  return (
    <div className="flex items-center gap-2 mt-4 overflow-x-auto px-2 py-1">
      {statusList.map((s, idx) => {
        const isActive = idx === activeIndex;
        const isCompleted = idx < activeIndex;

        return (
          <div key={s} className="flex items-center flex-shrink-0">
            <div
              className={`
                w-6 h-6 md:w-5 md:h-5 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold
                ${isActive ? statusColors[s] + " shadow-lg animate-pulse" : ""}
                ${isCompleted && !isActive ? "bg-gray-300 text-gray-800" : ""}
                ${!isCompleted && !isActive ? "bg-gray-200 text-gray-500" : ""}
              `}
            >
              {isActive || isCompleted ? "✓" : idx + 1}
            </div>
            <span
              className={`ml-1 text-xs md:text-sm font-medium ${
                isActive ? "text-black" : "text-gray-500"
              } whitespace-nowrap`}
            >
              {statusNames[s]}
            </span>

            {idx !== statusList.length - 1 && (
              <div
                className={`h-1 md:h-0.5 flex-1 mx-1 rounded ${
                  idx < activeIndex ? "bg-green-400" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;
