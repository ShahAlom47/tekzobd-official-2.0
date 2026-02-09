"use client";

import React, { useState } from "react";
import { ObjectId } from "mongodb";
import { useConfirm } from "@/hooks/useConfirm";
import toast from "react-hot-toast";
import { updateOrderStatus } from "@/lib/allApiRequest/orderRequest/orderRequest";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface Props {
  id: string | ObjectId;
  status: OrderStatus;
  onStatusChange?: (newStatus: OrderStatus) => void;
}

const statusOptions: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

interface Props {
  id: string | ObjectId;
  status: OrderStatus;
  cancelledByUser?: boolean;   // নতুন প্রপ
  onStatusChange?: (newStatus: OrderStatus) => void;
}

const OrderStatusSelect: React.FC<Props> = ({ id, status, cancelledByUser = false, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(status);
  const { ConfirmModal, confirm } = useConfirm();

  // যদি ইউজারই cancel করে থাকে, তাহলে admin কে status update থেকে আটকাবে
  if (cancelledByUser) {
    return (
      <div className="inline-block text-red-600 font-semibold text-xs">
        Order cancelled by user
      </div>
    );
  }

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;

    if (newStatus === selectedStatus) return;

    const confirmed = await confirm({
      title: "Update Order Status",
      message: `Are you sure you want to change the status to "${newStatus}"?`,
      confirmText: "Yes",
      cancelText: "No",
    });

    if (!confirmed) return;

    try {
      const response = await updateOrderStatus(id, newStatus);
      if (response?.success) {
        setSelectedStatus(newStatus);
        toast.success("Order status updated successfully");
        onStatusChange?.(newStatus);
      } else {
        toast.error(response?.message || "Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating order status");
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600";
      case "confirmed":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-600";
      case "delivered":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="inline-block">
      <select
        value={selectedStatus}
        onChange={handleChange}
        className={`px-3 py-1 rounded border capitalize text-sm cursor-pointer text-white ${getStatusColor(selectedStatus)}`}
      >
        {statusOptions.map((option) => (
          <option key={option} value={option} className="capitalize text-black">
            {option}
          </option>
        ))}
      </select>

      {ConfirmModal}
    </div>
  );
};

export default OrderStatusSelect;

