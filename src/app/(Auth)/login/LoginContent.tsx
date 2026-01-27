"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import PrimaryButton from "@/components/CommonComponents/PrimaryButton";
import SocialLogin from "@/components/CommonComponents/SocialLogin";
import PasswordInput from "@/components/CommonComponents/PasswordInput";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/"; // default: home
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ Loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoginError(null);
    setIsLoading(true); // ✅ Start loading

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.ok) {
        router.push(redirectPath);
      } else {
        const rawError = res?.error || "";

        if (rawError.includes("not verified")) {
          setLoginError(
            "⚠ আপনার ইমেইল যাচাই করা হয়নি। / Your email is not verified. একটি verification email পাঠানো হয়েছে। / A new verification email has been sent."
          );
        } else if (rawError.includes("No account")) {
          setLoginError(
            "❌ এই ইমেইল দিয়ে কোন একাউন্ট নেই। / No account found with this email."
          );
        } else if (rawError.includes("Incorrect password")) {
          setLoginError("❌ পাসওয়ার্ড ভুল হয়েছে। / Incorrect password.");
        } else {
          setLoginError(
            "⚠ লগইন ব্যর্থ হয়েছে। / Login failed. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("⚠ কিছু সমস্যা হয়েছে। / Something went wrong. Try again.");
    } finally {
      setIsLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[90vh]">
      <h1 className="text-xl font-semibold text-black">Login</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-sm w-full space-y-4 p-3 text-brandNeutral max-w-xl flex flex-col justify-center items-center"
      >
        {/* Email Field */}
        <div className=" w-full">
          <label className="ml-2">User Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            {...register("email", { required: "Email is required" })}
            className="my-input rounded-full w-full "
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

        {loginError && (
          <div className="my-2 p-3 w-full max-w-xl text-center text-red-600 bg-red-100 rounded-md">
            {loginError}
          </div>
        )}

        {/* ✅ Login Button with Loading */}
        <PrimaryButton type="submit" disabled={isLoading} loading={isLoading}>
          Login
        </PrimaryButton>
      </form>

      {/* Links */}
      <div className="flex flex-col items-center gap-2 flex-wrap mt-2 ">
        <SocialLogin />
        <p className="text-sm text-gray-700">
          Don’t have an account?
          <Link
            className="underline hover:scale-105 ml-1 text-blue-700"
            href="/register"
          >
            Register
          </Link>
          .
        </p>

        <Link className="underline text-blue-700" href="/forget-password">
          Lost your password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
