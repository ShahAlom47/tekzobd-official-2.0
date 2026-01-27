// components/PasswordInput.tsx
"use client";

import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface PasswordInputProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
}
 
const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  register,
  error,
  placeholder = "Enter password",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative w-full">
      <label className="ml-2">{label}</label>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        {...register}
      className="my-input rounded-full "
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-2 top-[69%] transform -translate-y-1/2 text-gray-600"
      >
        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
