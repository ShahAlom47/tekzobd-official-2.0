"use client"
import { CheckoutDataType } from "@/Interfaces/checkoutDataInterface";
import React, { useState } from "react";

interface OrderSuccessContentProps {
  orderData: CheckoutDataType;
  onConfirm: () => Promise<void>; // async হতে পারে ধরে নিচ্ছি
}

const OrderSuccessContent: React.FC<OrderSuccessContentProps> = ({ orderData, onConfirm }) => {
  const {
    meta,
    pricing,
    paymentInfo,
    shippingInfo,
  } = orderData;

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return; // double click prevent
    setLoading(true);
    try {
      await onConfirm(); // parent থেকে আসা function call
    } catch (error) {
      console.error("Order confirmation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 p-2 text-black h-full text-sm">
      <div className="border p-2 rounded bg-gray-50 space-y-2 text-sm">
        <h3 className="font-semibold text-lg">Order Info</h3>
        <p><strong>Order Status:</strong> {meta?.orderStatus || "Pending"}</p>
        <p><strong>Confirmed At:</strong> {meta?.checkoutAt ? new Date(meta.checkoutAt).toLocaleString() : "N/A"}</p>
        <p><strong>User Email:</strong> {meta?.userEmail || "Guest"}</p>
      </div>

      <div className="border p-2 rounded bg-gray-50 space-y-2 text-sm">
        <h3 className="font-semibold text-lg">Payment Details</h3>
        <p><strong>Method:</strong> {paymentInfo?.method || "N/A"}</p>
        <p><strong>Paid:</strong> {paymentInfo?.paymentStatus === "paid" ? "Yes" : "No"}</p>
        {paymentInfo?.transactionId && (
          <>
            <p><strong>Bkash Number:</strong> {paymentInfo.paymentMethodDetails?.bkashNumber}</p>
            <p><strong>Transaction ID:</strong> {paymentInfo.transactionId}</p>
          </>
        )}
        <p><strong>Total Paid:</strong> TK {pricing?.grandTotal || 0}</p>
      </div>

      <div className="border p-2 rounded bg-gray-50 space-y-2">
        <h3 className="font-semibold text-lg">Shipping Address</h3>
        <p>{shippingInfo?.name}</p>
        <p>{shippingInfo?.phone}</p>
        <p>{shippingInfo?.address}</p>
        <p>{shippingInfo?.city} - {shippingInfo?.zipCode}</p>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessContent;
