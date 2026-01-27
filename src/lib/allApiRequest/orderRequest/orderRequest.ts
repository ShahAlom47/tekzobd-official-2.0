

import { CheckoutDataType, GetAllOrdersParams, TrackingData } from "@/Interfaces/checkoutDataInterface";
import { request } from "../apiRequests";
import { ObjectId } from "mongodb";



export const addOrder = async (data: CheckoutDataType) => {
  return request("POST", "/orders/add", { ...data });
};
export const getAllOrders = async (params: GetAllOrdersParams) => {
  const {
    currentPage,
    limit,
    search,
    sort,
    orderStatus,
    paymentMethod,
    paymentStatus,
    deliveryMethod,
    city,
    fromDate,
    toDate,
    isDashboardRequest,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.set("currentPage", String(currentPage));
  queryParams.set("pageSize", String(limit));

  if (search) queryParams.set("search", search);
  if (sort) queryParams.set("sort", sort); // example: "checkoutAt-desc"
  if (orderStatus) queryParams.set("orderStatus", orderStatus);
  if (paymentMethod) queryParams.set("paymentMethod", paymentMethod);
  if (paymentStatus) queryParams.set("paymentStatus", paymentStatus);
  if (deliveryMethod) queryParams.set("deliveryMethod", deliveryMethod);
  if (city) queryParams.set("city", city);
  if (fromDate) queryParams.set("fromDate", fromDate);
  if (toDate) queryParams.set("toDate", toDate);

  const url = `/orders/allOrders?${queryParams.toString()}`;

  const customHeaders: Record<string, string> | undefined = isDashboardRequest
    ? { "x-from-dashboard": "true" }
    : undefined;

  return request("GET", url, undefined, undefined, customHeaders);
};
export const getSingleOrder = async (id: string | ObjectId) => {
  return request("GET", `/orders/details/${id}`);
};

export const deleteOrder = async (id: string | ObjectId) => {
  return request("DELETE", `/orders/delete/${id}`);
};

export const updateOrderStatus = async (id: string | ObjectId,newStatus:string,cancelledByUser?:boolean) => {
  return request("PATCH", `/orders/updateStatus/${id}`, { status: newStatus ,cancelledByUser});
};

// user request 
export const getUserOrders = async (userEmail: string) => {
  return request("GET", `/orders/userOrders/${userEmail}`);
};
export const orderTrackingDetails = async (orderId: string, data: TrackingData) => {
  return request("PUT", `/orders/orderTracking/${orderId}`, { ...data });
};



