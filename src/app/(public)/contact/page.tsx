import React, { Suspense } from "react";
import contactImg from "@/assets/image/ContactUs_3.jpg";
import Loading from "@/app/loading";
import { Metadata } from "next";
import { contactMetadata } from "@/utils/seo/staticMetadata";
import SafeImage from "@/components/CommonComponents/SafeImage";
import PageHeading from "@/components/CommonComponents/PageHeading";
import ContactInfo from "@/components/AboutUsComponents/ContactInfo";
import ContactForm from "@/components/CommonComponents/ContactForm";
import Newsletter from "@/components/CommonComponents/NewsLetter";

export const metadata: Metadata = contactMetadata

const ContactUs = () => {
  return (
    <div className="p-4 py-8 max-w  space-y-8">
      {/* Heading */}
      <Suspense fallback={<div>Loading...</div>}>
        <PageHeading />
      </Suspense>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* Left Side */}
        <div className="space-y-6">
          {/* Image */}
          <div className="rounded-xl overflow-hidden shadow-md ">
            <SafeImage
              src={contactImg}
              alt="Contact illustration"
              width={600}
              height={300}
              className="w-full h-auto object-cover"
            ></SafeImage>
          </div>
        </div>

        {/* Right Side - Contact Form */}
       <ContactForm></ContactForm>

        {/* Other Contact Info */}
        <ContactInfo></ContactInfo>

        {/* Map */}
       <Suspense fallback={<Loading />}>
         <div className="w-full h-64 rounded-xl overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902166322506!2d90.39104987508402!3d23.750885388740327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b89423f529cf%3A0xb5d87f889d98e4a2!2sDhaka!5e0!3m2!1sen!2sbd!4v1690000000000!5m2!1sen!2sbd"
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </div>
       </Suspense>

      </div>
      <Newsletter></Newsletter>
    </div>
  );
};

export default ContactUs;
