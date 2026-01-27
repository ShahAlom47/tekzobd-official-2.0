import { Suspense } from "react";
import Register from "../../../components/Auth/Register";
import Loading from "@/app/loading";
import {  registerMetadata } from "@/utils/seo/staticMetadata";

export const metadata = registerMetadata;

const RegisterPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Register />
    </Suspense> 
  );
};

export default RegisterPage;
