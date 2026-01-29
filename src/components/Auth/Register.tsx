"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/utils/handleApiError";
import { RegisterUser } from "@/Interfaces/userInterfaces";
import PrimaryButton from "@/components/PrimaryButton";
import { registerUser } from "@/lib/allApiRequest/authRequest/authRequest";
import PasswordInput from "@/components/PasswordInput";
import SocialLogin from "@/components/SocialLogin";

const Register: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterUser>();

  const password = watch("password");

  const onSubmit = async (data: RegisterUser) => {
    setIsLoading(true);
    try {
      // 1️⃣ user register হবে
      const res = await registerUser({ ...data });

      if (res?.success) {
        toast.success(res.message || "Registration successful");

        // 2️⃣ auto login বাদ, verify page এ redirect
        router.push("/verify-email");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (error) {
      handleApiError(error);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen max-w-xl mx-auto ">
      <h1 className="text-xl font-semibold text-black">Sign Up</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-sm w-full space-y-4 p-3 text-brandNeutral  max-w-xl flex flex-col justify-center items-center "
      >
        {/* Name Field */}
        <div className="w-full">
          <label className="ml-2">User Name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            {...register("name", { required: "Name is required" })}
            className="my-input rounded-full "
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="w-full">
          <label className="ml-2">User Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            className="my-input rounded-full "
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <PasswordInput
          label="Password"
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.password?.message}
        />

        <PasswordInput
          label="Confirm Password"
          register={register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />

        <PrimaryButton type="submit" loading={isLoading} disabled={isLoading}>
          Register
        </PrimaryButton>
      </form>
      <div className=" w-full  max-w-xl flex flex-col justify-center items-center mt-3 ">
        <SocialLogin />

        {/* Links */}
        <p className="flex gap-2  items-center text-xs text-gray-400 mt-2">
          Already have an account?
          <Link
            className="btn-link btn underline hover:scale-105"
            href="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
