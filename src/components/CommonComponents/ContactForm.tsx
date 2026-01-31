"use client";

import React from "react";

const ContactForm: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg shadow-blue-600 p-6">
      <h3 className="text-2xl font-semibold mb-4">Send us a message</h3>

      <p className="text-red-600 text-xs mb-4">
        ⚠️ Message service is temporarily unavailable. Please reach us via
        email or phone.
      </p>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          disabled
          className="w-full my-input"
        />
        <input
          type="email"
          placeholder="Your Email"
          disabled
           className="w-full my-input"
       />
        <textarea
          placeholder="Your Message"
          rows={4}
          disabled
            className="w-full my-input"
             ></textarea>
        <button
          type="button"
          disabled
          className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed"
        >
          Currently Unavailable
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
