

import PageHeading from "@/components/PageHeading";
import { howToOrderMetadata } from "@/utils/seo/staticMetadata";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = howToOrderMetadata;

const HowToOrder = () => {
  return (
    <div className="min-h-screen bg-white text-blackMid  max-w lg:mt-6 mt-10 max-w p-2">
      <PageHeading title="How to Order" />

      <div className="container mx-auto px-4 py-8 space-y-6">

        <p>
          আমাদের ওয়েবসাইটে অর্ডার করা খুবই সহজ। নিচের ধাপগুলো অনুসরণ করুন:
        </p>

        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <strong>প্রোডাক্ট নির্বাচন:</strong> Home বা Shop page থেকে আপনি product card দেখতে পারবেন। 
            Product card এ click করলে আপনি প্রোডাক্টের বিস্তারিত দেখতে পাবেন।
          </li>

          <li>
            <strong>Add to Cart / Buy Now:</strong> প্রোডাক্ট কার্টে যোগ করার জন্য card বা details page-এ “Add to Cart” button থাকবে। 
            সরাসরি “Buy Now” button ব্যবহার করে checkout page-এ যেতে পারবেন।
          </li>

          <li>
            <strong>Cart Management:</strong> Cart icon-এ click করলে side drawer open হবে। সেখানে আপনি:
            <ul className="list-disc pl-6 space-y-1">
              <li>প্রোডাক্টের quantity বাড়াতে বা কমাতে পারবেন।</li>
              <li>প্রোডাক্ট delete করতে পারবেন।</li>
              <li>Stock অনুযায়ী button disabled থাকবে।</li>
            </ul>
          </li>

          <li>
            <strong>Order Summary:</strong> Cart-এ সব প্রোডাক্টের summary দেখা যাবে, discount এবং coupon ব্যবহার করতে পারবেন। 
            সব ঠিক থাকলে “Checkout” button চাপুন। 
          </li>

          <li>
            <strong>User Login:</strong> Checkout page-এ যেতে হলে userকে অবশ্যই login থাকতে হবে। 
            - Login থাকলে, তার profile data দিয়ে shipping form auto-fill হবে। 
            - না থাকলে, Manually shipping form fill-up করতে হবে ।
          </li>

          <li>
            <strong>Delivery Options:</strong> Checkout page-এ delivery select করতে হবে: 
            <ul className="list-disc pl-6 space-y-1">
              <li>ভিতরে (Inside Dhaka) – ৮০ টাকা charge যুক্ত হবে।</li>
              <li>বাইরে (Outside Dhaka) – ১২০ টাকা charge যুক্ত হবে।</li>
            </ul>
          </li>

          <li>
            <strong>Payment Method:</strong> Checkout page-এ select করতে হবে: 
            <ul className="list-disc pl-6 space-y-1">
              <li>COD – Extra ১০ টাকা charge যুক্ত হবে।</li>
              <li>Bkash – Number এবং QR code দেখাবে, সেই নাম্বারে বিকাশ থেকে send money করে পেমেন্ট করতে হবে |  পেমেন্ট হয়ে গেলে, Number এবং transaction ID দিতে হবে confirm order করার জন্য।</li>
            </ul>
          </li>

          <li>
            <strong>Order Confirmation:</strong> সব ঠিক থাকলে modal open হবে, যেখানে আপনার   অর্ডারের জন্য ব্যবহৃত  সকল তথ্য দেখাবে । 
            Confirm Order click করলে order place হবে।  
            পরে admin confirm করলে order processing শুরু হবে।
          </li>

          <li>
            <strong>Order Status Tracking:</strong>আপনার প্রোফাইল ছবিতে ক্লিক করলে ( User profile dropdown )→ My Orders থেকে তার সব order দেখতে পারবে।  
            <br />
            Status:
            <ul className="list-disc pl-6 space-y-1">
              <li>Pending – Admin এখনও approve করেনি। Cancel করা যাবে।</li>
              <li>Shipped – Order admin approve করে পাঠানো হয়েছে।</li>
              <li>Delivered – Order delivery হয়ে গেছে।</li>
            </ul>
          </li>
        </ol>

        <p className="mt-4">
          এই ধাপগুলো অনুসরণ করলে আপনার অর্ডার smooth এবং নিরাপদভাবে place হবে। 
          সবসময় নিশ্চিত করুন যে প্রোডাক্ট গ্রহণের সময় আপনি প্রস্তুত এবং নির্দেশনা মেনে চলবেন।
        </p>

      </div>
    </div>
  );
};

export default HowToOrder;
