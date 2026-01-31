
import PageHeading from "@/components/PageHeading";
import { deliveryMetadata } from "@/utils/seo/staticMetadata";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = deliveryMetadata;

const DeliveryPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-blackMid lg:mt-6 mt-10 max-w p-2">
      <PageHeading title="Delivery Policy" />

      <div className="container mx-auto px-4 py-8 space-y-6">
        <p>
          আমরা শুধুমাত্র নিম্নোক্ত পেমেন্ট মেথডে অর্ডার ডেলিভারী করি:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Cash on Delivery (COD)</strong> – পণ্য গ্রহণের সময় নগদ প্রদান করতে পারবেন।</li>
          <li><strong>Bkash</strong> – অগ্রিম পেমেন্ট হিসেবে Bkash ব্যবহার করতে পারেন।</li>
        </ul>

        <p>
          <strong>ডেলিভারী সময়সীমা এবং চার্জ:</strong><br />
          - ঢাকার ভিতরে: সাধারণত ১-৩ কর্মদিবস – <strong>ডেলিভারি চার্জ: ৮০ টাকা</strong><br />
          - ঢাকার বাইরে: সাধারণত ২-৫ কর্মদিবস – <strong>ডেলিভারি চার্জ: ১২০ টাকা</strong><br />
          বড় উৎসব, ঝড়/বন্যা/হিটওয়েভ বা অন্যান্য প্রাকৃতিক দুর্যোগের সময় ডেলিভারী সময় পরিবর্তিত হতে পারে।<br />
          শুক্রবার অফিস বন্ধ থাকায় বৃহস্পতিবারের অর্ডারগুলো শনিবার থেকে হিসাব করা হয়।
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>প্রোডাক্ট ভাঙা/চুরা বা কোনো ক্ষতি থাকলে সেটি **return হবে না**।</li>
          <li>আমাদের ভুলের কারণে যদি প্রোডাক্টে সমস্যা থাকে, তাহলে সেটি **return হবে এবং নতুন প্রোডাক্ট পাঠানো হবে**।</li>
          <li>Return/Exchange করার জন্য অবশ্যই **unboxing ভিডিও প্রমাণ** দিতে হবে।</li>
        </ul>

        <p>
          অনুগ্রহ করে নিশ্চিত করুন যে পণ্য গ্রহণের সময় আপনি প্রস্তুত এবং উল্লিখিত নিয়মগুলো মেনে চলবেন।  
          এটি আমাদের এবং আপনার উভয়ের জন্য নিরাপদ এবং smooth delivery নিশ্চিত করে।  
          ডেলিভারি চার্জটি checkout page-এ subtotal-এ যোগ হবে এবং payment অনুযায়ী update হবে।
        </p>
      </div>
    </div>
  );
};

export default DeliveryPolicy;
