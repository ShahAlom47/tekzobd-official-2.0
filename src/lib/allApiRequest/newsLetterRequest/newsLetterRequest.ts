import { GetNewsLetterParams, NewsletterSubscriberType } from "@/Interfaces/newsLetterInterface";
import { request } from "../apiRequests";
import { ObjectId } from "mongodb";

// ✅ 1. Subscribe to Newsletter
export const subscribeNewsLetter = async (data: NewsletterSubscriberType) => {
  return request("POST", `/newsletter/subscribe`, { ...data });
};

// ✅ 2. Get all newsletter subscribers with pagination and search
export const getAllNewsLetterSubscribers = async ({
  currentPage,
  limit,
  searchTrim,
}: GetNewsLetterParams) => {
  const url =
    `/newsletter/subscribers?currentPage=${currentPage}&limit=${limit}` +
    (searchTrim ? `&search=${encodeURIComponent(searchTrim)}` : "");
  return request("GET", url);
};

// ✅ 3. Delete a subscriber
export const deleteNewsLetterSubscriber = async (id: string | ObjectId) => {
  return request("DELETE", `/newsletter/deleteSubscriber/${id}`);
};

// ✅ 4. Update subscriber active/inactive status
export const updateSubscriberStatus = async (
  id: string | ObjectId,
  newStatus: boolean
) => {
  return request("PATCH", `/newsletter/updateStatus/${id}`, {newStatus });
};
