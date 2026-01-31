import React, { Suspense } from "react";

import ContactInfo from "@/components/AboutUsComponents/ContactInfo";
import CustomerTrust from "@/components/AboutUsComponents/CustomerTrust";
import Story from "@/components/AboutUsComponents/Story";
import VisionMission from "@/components/AboutUsComponents/VisionMission";
import WhatWeOffer from "@/components/AboutUsComponents/WhatWeOffer";
import WhyChooseUs from "@/components/AboutUsComponents/WhyChooseUs";
import Loading from "@/app/loading";
import Newsletter from "@/components/CommonComponents/NewsLetter";
import PageHeading from "@/components/CommonComponents/PageHeading";



const About = () => {
  return (
    <Suspense fallback={<Loading></Loading>}>
         <div className="p-4 py-8 max-w    space-y-8">
     {/* Heading */}
  
      <Suspense fallback={<div>Loading...</div>}>
        <PageHeading />
      </Suspense>
      <VisionMission />
      <Story />
      <WhatWeOffer />
      <WhyChooseUs />
      <CustomerTrust />
      <Newsletter></Newsletter>
      <ContactInfo />
    </div>
    </Suspense>
  );
};

export default About;
