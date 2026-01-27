import { RegisterUser } from "@/Interfaces/userInterfaces";
import { request } from "../apiRequests";

export interface VerifyEmailData {
  token: string;
  userEmail: string;
}

// Auth API requests
export const registerUser = async (data: RegisterUser) => {
  return request("POST", "/auth/register", { ...data });
};
export const verifyEmail = async (data: VerifyEmailData) => {
  return request("POST", "/auth/verify-email", { ...data });
}

export const forgetPassword = async (userEmail: string) => {
  return request("POST", "/auth/forget-password", { userEmail });
};
export const resetPassword = async (newPassword: string, token: string,userEmail:string) => {
  return request("PATCH", `/auth/reset-password/${userEmail}`, { newPassword, token });
};


