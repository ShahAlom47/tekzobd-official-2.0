"use client";

import { forgetPassword } from "@/lib/allApiRequest/authRequest/authRequest";
import React, { useState } from "react";
import toast from "react-hot-toast";
export const dynamic = "force-dynamic";

const ForgetPassword = () => {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const userEmail = formData.get("email") as string;

    if (!userEmail) {
      setMessage({ type: "error", text: "❌ Email is required. (ইমেইল আবশ্যক)" });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await forgetPassword(userEmail);

      if (res?.success) {
        setSuccess(true);
        setEmail(userEmail);
        setMessage({
          type: "success",
          text: "✅ Password reset link sent to your email. (পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে)"
        });
        toast.success("Password reset link sent.");
        form.reset();
      } else {
        setMessage({
          type: "error",
          text: res?.message || "❌ Something went wrong. Please try again. (সমস্যা হয়েছে, আবার চেষ্টা করুন)"
        });
        toast.error(res?.message || "Something went wrong");
      }
    } catch {
      setMessage({
        type: "error",
        text: "❌ Server error. Please try again later. (সার্ভার সমস্যা হয়েছে, পরে আবার চেষ্টা করুন)"
      });
      toast.error("Server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    // Clear previous message before resend
    setMessage(null);

    try {
      setIsSubmitting(true);
      const res = await forgetPassword(email);

      if (res?.success) {
        setMessage({
          type: "success",
          text: "✅ New reset link sent successfully. (নতুন রিসেট লিংক পাঠানো হয়েছে)"
        });
        toast.success("New reset link sent.");
      } else {
        setMessage({
          type: "error",
          text: res?.message || "❌ Could not resend reset link. (রিসেট লিংক পাঠানো যায়নি)"
        });
        toast.error(res?.message || "Could not resend reset link");
      }
    } catch {
      setMessage({
        type: "error",
        text: "❌ Server error. Please try again later. (সার্ভার সমস্যা হয়েছে, পরে আবার চেষ্টা করুন)"
      });
      toast.error("Server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center p-6 bg-white rounded-2xl shadow-md text-center">
      {!success ? (
        <>
          <h1 className="text-2xl font-semibold mb-2">Forgot Password</h1>
          <p className="text-gray-600 mb-4">
            Enter your email address and we will send you a reset link.
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

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full my-input rounded-full p-3 border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-bordered w-full"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </>
      ) : (
        <>
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

          <h2 className="text-xl font-bold text-green-600 mb-4">
            ✅ Password reset link has been sent. (পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে)
          </h2>
          <p className="text-gray-700 mb-6">
            Please check your inbox (<span className="font-medium">{email}</span>) to reset your password.  
            If you don’t see the email, check your Spam/Junk folder.
          </p>

          <button
            onClick={handleResend}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isSubmitting ? "Resending..." : "Resend Link"}
          </button>
        </>
      )}
    </div>
  );
};

export default ForgetPassword;
