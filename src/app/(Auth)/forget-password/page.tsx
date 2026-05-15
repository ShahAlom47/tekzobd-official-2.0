"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

const ADMIN_WHATSAPP = "01773133145"; // +88 remove kore use kora better

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");
  const [note, setNote] = useState("");

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email required");
      return;
    }

    if (!problem) {
      toast.error("Please select your problem");
      return;
    }

    const message = `
🔐 Password Help Request

📧 Email: ${email}
⚠️ Problem: ${problem}
📝 Note: ${note || "No additional note"}

Please help me reset my password.
    `;

    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");

    toast.success("Redirecting to WhatsApp...");
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center p-6 bg-white rounded-2xl shadow-md">

      <h1 className="text-2xl font-semibold mb-2">
        Forgot Password Help
      </h1>

      <p className="text-gray-600 mb-6 text-center">
        Send your problem directly to admin via WhatsApp
      </p>

      <form onSubmit={handleSendWhatsApp} className="space-y-4 w-full">

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full my-input rounded-full p-3 border"
        />

        {/* Problem Dropdown */}
        <select
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="w-full my-input rounded-full p-3 border"
        >
          <option value="">Select Problem</option>
          <option value="Forgot Password">Forgot Password</option>
          <option value="Cannot Login">Cannot Login</option>
          <option value="Account Locked">Account Locked</option>
          <option value="Other Issue">Other Issue</option>
        </select>

        {/* Optional Note */}
        <textarea
          placeholder="Optional note (describe your problem)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full my-input rounded-xl p-3 border min-h-[100px]"
        />

        {/* Button */}
        <button
          type="submit"
          className="btn-bordered w-full"
        >
          Send to WhatsApp
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Admin will respond via WhatsApp and reset your password manually.
      </p>
    </div>
  );
};

export default ForgetPassword;