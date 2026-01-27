"use client";
import PrimaryButton from "@/components/CommonComponents/PrimaryButton";

 



export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div
      className="relative text-brand-grayMid w-full min-h-screen flex items-center justify-center bg-cover bg-center "
      
    >
      

      <div className="relative z-10  lg:w-6/12 w-8/12 flex flex-col items-start">
        <h1 className="lg:text-4xl md:text-3xl text-xl font-bold">
          Oops! Page Not Found
        </h1>
        <h1 className="lg:text-9xl text-7xl font-bold text-primary">404</h1>
        <p className=" lg:w-8/12 w-11/12 mb-8">
          Thank you for visiting Portal. We apologize for any inconvenience
          caused. Happy exploring!
        </p>
       <PrimaryButton href="/">Back to Home</PrimaryButton>
      </div>
    </div>
  );
}
