import axios from "axios";
import type { AxiosError } from "axios";

export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  insId?:string;
  unreadCount?:number;
  data?: T;
  totalData?: number;
  currentPage?: number;
  totalPages?: number;
}

const api = axios.create({
  baseURL: `http://localhost:3000/api`,
  // baseURL: `https://tekzobd.vercel.app/api`,
  // baseURL: `https://www.tekzobd.com/api`,
  withCredentials: true,
});

export const request = async <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  data?: Record<string, unknown> | FormData,
  isForm?: "formData",
  customHeaders?: Record<string, string>
): Promise<IApiResponse<T>> => {
  try {
    const headers = {
      "Content-Type":
        isForm === "formData" ? "multipart/form-data" : "application/json",
      ...customHeaders,
    };

    // Auto add timestamps
    if (data && !(data instanceof FormData)) {
      const now = new Date().toISOString();
      if (method === "POST") {
        data = { ...data, createdAt: now, updatedAt: now };
      } else if (method === "PUT" || method === "PATCH") {
        data = { ...data, updatedAt: now };
      }
    }

    const response = await api({
      method,
      url,
      data,
      headers,
    });
    return response.data as IApiResponse<T>;
  
  } catch (error: unknown) {
    let message = "Unknown error occurred";
    if (axios.isAxiosError(error)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as AxiosError<any>;
      if (axiosError.response?.data?.message) {
        message = axiosError.response.data.message;
      } else if (axiosError.message) {
        message = axiosError.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
   

    return {
      success: false,
      message,
    };
  }
};
