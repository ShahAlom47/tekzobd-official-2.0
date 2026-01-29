import { Suspense } from "react";
import Loading from "@/app/loading";
import Register from "@/components/Auth/Register";


const RegisterPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Register />
    </Suspense> 
  );
};

export default RegisterPage;
