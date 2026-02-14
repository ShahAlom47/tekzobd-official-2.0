"use client";

import { resetPassword } from "@/lib/allApiRequest/authRequest/authRequest";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ResetPassContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const userEmail = searchParams.get("userEmail");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!password || !confirmPassword) {
      setMessage({ type: "error", text: "❌ All fields are required. (সব ফিল্ড পূরণ করুন)" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "❌ Passwords do not match. (পাসওয়ার্ড মিলছে না)" });
      return;
    }

    if (!token || !userEmail) {
      setMessage({ type: "error", text: "❌ Invalid link. (অবৈধ লিঙ্ক)" });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await resetPassword(
       password,
        token,
        userEmail,
      
      );

      if (res?.success) {
        setMessage({ type: "success", text: "✅ Password reset successfully. (পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে)" });
        toast.success("Password reset successfully");
        router.push("/login");
      } else {
        setMessage({ type: "error", text: res?.message || "❌ Something went wrong. (সমস্যা হয়েছে)" });
        toast.error(res?.message || "Something went wrong");
      }
    } catch  {
      setMessage({ type: "error", text: "❌ Server error. Please try again later. (সার্ভার সমস্যা হয়েছে, পরে চেষ্টা করুন)" });
      toast.error("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center p-6 bg-white rounded-2xl shadow-md text-center">
      <h1 className="text-2xl font-semibold mb-2">Reset Password</h1>
      <p className="text-gray-600 mb-4">
        Enter your new password below to reset your account password.
      </p>

      {message && (
        <p
          className={`mb-3 p-2 rounded-md text-sm w-full ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full my-input rounded-full"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full my-input rounded-full"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-bordered w-full"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassContent;
