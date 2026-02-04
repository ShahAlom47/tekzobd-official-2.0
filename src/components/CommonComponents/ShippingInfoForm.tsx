"use client";

import React, { useEffect, useState } from "react";
import { useUserFullInfo } from "@/hooks/useUserFullInfo";
import toast from "react-hot-toast";
import { ShippingInfoFormType } from "@/Interfaces/checkoutDataInterface";

interface Props {
  shippingInfo: ShippingInfoFormType;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfoFormType>>;
  setShippingInfoErrors: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShippingInfoForm: React.FC<Props> = ({ shippingInfo, setShippingInfo,setShippingInfoErrors }) => {
  const { fullInfo } = useUserFullInfo();

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfoFormType, string>>>({});

  // Pre-fill shipping info from fullInfo
  useEffect(() => {
    if (fullInfo) {
      setShippingInfo((prev) => ({
        ...prev,
        name: fullInfo?.name || prev.name,
        phone: fullInfo.phone || prev.phone,
        address: fullInfo.address || prev.address,
        city: fullInfo.city || prev.city,
        zipCode: fullInfo.zipcode || prev.zipCode,
      }));
    }
  }, [fullInfo, setShippingInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

const handleBlur = (field: keyof ShippingInfoFormType) => {
  const value = shippingInfo[field] || "";
  let errorMsg = "";

  if (!value.trim()) {
    errorMsg = `${field[0].toUpperCase() + field.slice(1)} is required`;
  } else if (field === "phone" && !/^01[0-9]{9}$/.test(value)) {
    errorMsg = "Please enter a valid 11-digit Bangladeshi phone number";
  }

  if (errorMsg) {
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    setShippingInfoErrors(true);
    toast.error(errorMsg, { id: field });
  } else {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setShippingInfoErrors(false); // no error
  }
};

  const fieldLabels: Record<keyof ShippingInfoFormType, string> = {
    name: "Name",
    phone: "Phone",
    address: "Address",
    city: "City",
    zipCode: "Post Code", // 👈 শুধু UI তে Post Code
    deliveryMethod: "Delivery Method" // 👈 শুধু UI তে Delivery Method
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
      <div className="space-y-3">
        {(["name", "phone", "address", "city", "zipCode"] as (keyof ShippingInfoFormType)[]).map((field) => (
          <div key={field} className="flex flex-col">
            <input
              name={field}
              // placeholder={field[0].toUpperCase() + field.slice(1)}
               placeholder={fieldLabels[field]}
              value={shippingInfo[field] ?? ""}
              onChange={handleChange}
              onBlur={() => handleBlur(field)}
              className={`w-full my-input ${errors[field] ? "border-red-500" : ""}`}
            />
            {errors[field] && (
              <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingInfoForm;
