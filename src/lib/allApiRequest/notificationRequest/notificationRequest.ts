import { NotificationQueryParams, NotificationType } from "@/Interfaces/notificationInterfaces";
import { request } from "../apiRequests";

// 📩 Notification পাঠানোর জন্য
export const sendNotification = async (
  data: Omit<NotificationType, "_id" | "createdAt" | "updatedAt" | "isRead">
) => {
  return request("POST", "/notification/send-notification", { ...data });
};


export const getAllNotifications = async ({page = 1, limit = 10,
}: NotificationQueryParams) => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return request(
    "GET", `/notification/admin?${query.toString()}`
  );
};


export const markNotificationAsRead = async (id: string) => {
  return request("PATCH", `/notification/mark-as-read/${id}`);
};

// ❌ notification delete
export const deleteNotification = async (id: string) => {
  return request("DELETE", `/notification/delete/${id}`);
};
