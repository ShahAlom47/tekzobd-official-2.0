// components/CouponChecker.tsx
"use client";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface CouponCheckerProps {
  onCouponValidated: (data: { code: string; discountPercent: number }) => void;
}

const dummyCoupons = [
  { code: "DISCOUNT10", discountPercent: 0 },
  { code: "SAVE20", discountPercent: 0 },
];

const CouponChecker: React.FC<CouponCheckerProps> = ({ onCouponValidated }) => {
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCheck = () => {
    const coupon = dummyCoupons.find(
      (c) => c.code === code.trim().toUpperCase()
    );
    if (coupon) {
      setError("");
      setSuccess(true);
      //   onCouponValidated(coupon);
      onCouponValidated(coupon);
    } else {
      setSuccess(false);
      setError("Invalid coupon code!");
    }
  };

  return (
    <div className="mb-2 text-black">
      <label className="flex gap-1  justify-start ">
        <input
          className=""
          type="checkbox"
          checked={showInput}
          onChange={() => setShowInput((prev) => !prev)}
        />
        <span className="font-normal">You have a coupon?</span>
      </label>

      {showInput && (
        <div className="mt-3 space-y-2 ">
          <div className="flex gap-2 items-center ">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="my-input h-full py-1"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={handleCheck} className="btn-base h-fit">
              Apply
            </button>
          </div>

          {success && (
            <p className="text-yellow-600 flex items-center gap-1">
              <FaCheckCircle /> Coupon feature is under construction.
            </p>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default CouponChecker;
