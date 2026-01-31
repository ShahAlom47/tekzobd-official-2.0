"use client";

import React, { useState } from "react";

interface CourierOption {
  name: string;
  value: string;
  baseUrl: string;
  idType?: string; // Optional info for UI
}

const couriers: CourierOption[] = [
  {
    name: "Steadfast",
    value: "steadfast",
    baseUrl: "https://steadfast.com.bd/t/",
    idType: "Tracking ID",
  },
  {
    name: "RedX",
    value: "redx",
    baseUrl: "https://redx.com.bd/track-global-parcel/?trackingId=",
  },
  {
    name: "Pathao",
    value: "pathao",
    baseUrl: "https://pathao.com/tracking/?trackingId=",
  },
  {
    name: "Paperfly",
    value: "paperfly",
    baseUrl: "https://go.paperfly.com.bd/track/order/",
  },
];

const TrackOrderByID: React.FC = () => {
  const [selectedCourier, setSelectedCourier] = useState("steadfast");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const handleTrack = () => {
    if (!orderId.trim()) {
      setError("Please enter your Order ID");
      return;
    }

    const courier = couriers.find((c) => c.value === selectedCourier);
    if (!courier) {
      setError("Please select a valid courier.");
      return;
    }

    // Basic ID check (can be improved)
    const idValid = /^[A-Za-z0-9-_]+$/.test(orderId);
    if (!idValid) {
      setError("Invalid Order ID format.");
      return;
    }

    setError("");

    // ✅ Redirect user to courier tracking page
    const redirectUrl = `${courier.baseUrl}${orderId}`;
    window.open(redirectUrl, "_blank"); // opens in new tab
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          📦 Track Your Order
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Select your courier & enter your Order ID to track your shipment.
        </p>

        {/* Courier Select */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Courier Service
        </label>
        <select
          value={selectedCourier}
          onChange={(e) => setSelectedCourier(e.target.value)}
          className="w-full my-input mb-4"
        >
          {couriers.map((c) => (
            <option key={c.value} value={c.value}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Order ID Input */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Order / Tracking ID
        </label>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter your tracking ID"
          className="w-full my-input mb-4"
        />

        <button
          onClick={handleTrack}

          className="w-full btn-base mt-4"
        >
          Track Now
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <p className="text-black text-xs mt-6 text-center leading-relaxed bg-yellow-100 p-4 rounded">
          🔔 <b>Note:</b> এই Track Order ফিচারটি শুধুমাত্র তাদের জন্য, যারা
          WhatsApp, Messenger, বা ফোনে অর্ডার করেছেন।  
          আপনি যদি ওয়েবসাইটে লগইন করে অর্ডার করে থাকেন, তাহলে <b>`My Orders`</b>{" "}
          থেকে সরাসরি ট্র্যাক করতে পারবেন।
        </p>
      </div>
    </div>
  );
};

export default TrackOrderByID;
