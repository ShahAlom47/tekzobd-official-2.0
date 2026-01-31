import React from "react";
import { PiSealCheckFill } from "react-icons/pi";

const WhyChooseUs: React.FC = () => {
  const points = [
    "100% Authentic Products",
    "Affordable & Transparent Pricing",
    "Fast Delivery Nationwide",
    "Secure Payments",
    "24/7 Customer Support",
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <h3 className="text-3xl font-bold mb-10 text-gray-800 text-center">
          Why Choose Us?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              {/* Icon inside hexagon */}
              <div
                className="w-12 h-12 flex items-center justify-center bg-green-100 text-green-600 
                [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]"
              >
                <PiSealCheckFill className="text-xl" />
              </div>
              <p className="text-gray-700 font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
