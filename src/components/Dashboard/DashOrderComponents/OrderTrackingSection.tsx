"use client";

import React, { useState } from "react";
import { CheckoutDataType } from "@/Interfaces/checkoutDataInterface";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { orderTrackingDetails } from "@/lib/allApiRequest/orderRequest/orderRequest";
import TrackOrderButton from "./TrackOrderButton";

type TrackingFormType = {
  courierName: "steadfast" | "redx" | "pathao" | "express";
  courierOrderId: string;
  trackingUrl?: string;
};

const OrderTrackingSection = ({ order }: { order: CheckoutDataType }) => {
  const tracking = order.shippingInfo?.trackingInfo;

 

  const { register, handleSubmit, reset, setValue } = useForm<TrackingFormType>({
    defaultValues: {
      courierName: "steadfast",
      courierOrderId: "",
      trackingUrl: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async (data: TrackingFormType) => {
    try {
      setIsSubmitting(true);
      const res = await orderTrackingDetails(order._id as string, data);
     
      if (res.success) {
         toast.success(
        tracking ? "Tracking info updated successfully!" : "Tracking info added successfully!"
      );
        
        setIsEditing(false);
        reset();
        return
      }

   
     
toast.error(res.message || "Failed to save tracking info");
      setIsEditing(false);
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save tracking info");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-200 p-6 rounded shadow border border-brandPrimary">
      <h2 className="text-lg font-semibold mb-2">Order Tracking</h2>

      {/* যদি trackingInfo থাকে এবং edit mode না হয় */}
      {tracking && !isEditing ? (
        <div className="space-y-2">
          <p>
            <strong>Courier:</strong> {tracking.courierName}
          </p>
          <p>
            <strong>Order ID:</strong> {tracking.courierOrderId}
          </p>
             <TrackOrderButton order={order} />

          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={() => {
              // ফর্মে পুরানো value বসানো
              setValue("courierName", tracking.courierName);
              setValue("courierOrderId", tracking.courierOrderId);
              setValue("trackingUrl", tracking.trackingUrl || "");
              setIsEditing(true);
            }}
          >
            Edit Tracking Info
          </button>
        </div>
      ) : (
        // Add / Update form
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Courier Name</label>
            <select
              {...register("courierName", { required: true })}
              className="border rounded w-full px-3 py-2 my-input"
            >
              <option value="steadfast">Steadfast</option>
              <option value="redx">REDX</option>
              <option value="pathao">Pathao</option>
              <option value="express">Express</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Courier Order ID</label>
            <input
              type="text"
              {...register("courierOrderId", { required: true })}
              className="my-input"
              placeholder="Enter Courier Order ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Tracking URL (optional)
            </label>
            <input
              type="text"
              {...register("trackingUrl")}
              className="my-input"
              placeholder="https://courier.com/track/123"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brandPrimary text-white px-4 py-2 rounded hover:bg-brandPrimary-dark"
          >
            {isSubmitting
              ? "Saving..."
              : tracking
              ? "Update Tracking Info"
              : "Save Tracking Info"}
          </button>
        </form>
      )}
    </div>
  );
};

export default OrderTrackingSection;
