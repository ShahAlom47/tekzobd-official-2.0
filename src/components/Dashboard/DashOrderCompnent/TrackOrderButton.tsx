"use client";

import React, { useState } from "react";
import { CheckoutDataType } from "@/Interfaces/checkoutDataInterface";

interface TrackOrderButtonProps {
  order: CheckoutDataType;
}

const TrackOrderButton = ({ order }: TrackOrderButtonProps) => {
  const tracking = order.shippingInfo?.trackingInfo;
  const [showDetails, setShowDetails] = useState(false);

  if (!tracking) {
    // যদি tracking info না থাকে
    return <p className="text-gray-500">Tracking info not available yet.</p>;
  }

  return (
    <div className="my-4">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="btn-bordered"
      >
        {showDetails ? "Hide Tracking Info" : "Track Your Order"}
      </button>

      {showDetails && (
        <div className="mt-2 p-4 border rounded bg-gray-100 space-y-2">
          <p>
            <strong>Courier:</strong> {tracking.courierName}
          </p>
          <p>
            <strong>Order ID:</strong> {tracking.courierOrderId}
          </p>
          {tracking.trackingUrl && (
            <p>
              <a
                href={tracking.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Tracking
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrderButton;
