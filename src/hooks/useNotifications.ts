import { onMessage } from "firebase/messaging";
import { useState, useEffect, useCallback } from "react";
import { NotificationType } from "@/Interfaces/notificationInterfaces";
import {
  deleteNotification,
  getAllNotifications,
  markNotificationAsRead,
  sendNotification,
} from "@/lib/allApiRequest/notificationRequest/notificationRequest";
import { getMessagingInstance } from "@/lib/firebaseNotification/firebase";
import { requestFirebaseNotificationPermission } from "@/lib/firebaseNotification/requestPermission";
import { useUser } from "./useUser";
import toast from "react-hot-toast";

type SendNotificationInput = Omit<
  NotificationType,
  "_id" | "createdAt" | "updatedAt" | "isRead"
>;

type UseNotificationReturn = {
  getCurrentToken: () => Promise<string | null>;
  notifications: NotificationType[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (reset?: boolean) => Promise<void>;
  sendNewNotification: (data: SendNotificationInput) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotif: (id: string) => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
};

export function useNotifications(): UseNotificationReturn {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchNotifications = useCallback(
    async (reset: boolean = false) => {
      if (user?.role !== "admin") return;

      try {
        setLoading(true);
        setError(null);

        const currentPage = reset ? 1 : page;
        const res = await getAllNotifications({ page: currentPage, limit });

        const data = res?.data as NotificationType[];
        const unread = res?.unreadCount || 0;

        if (reset) {
          setNotifications(data);
          setPage(2);
        } else {
          setNotifications((prev) => [...prev, ...data]);
          setPage((prev) => prev + 1);
        }

        setUnreadCount(unread);
        setHasMore(data.length >= limit);
      } catch {
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    },
    [user, page]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      return fetchNotifications(false);
    }
    return Promise.resolve();
  }, [fetchNotifications, hasMore, loading]);

  const sendNewNotification = useCallback(
    async (notifData: SendNotificationInput) => {
      try {
        setLoading(true);
        setError(null);
        await sendNotification(notifData);
        await fetchNotifications(true);
      } catch {
        setError("Failed to send notification");
      } finally {
        setLoading(false);
      }
    },
    [fetchNotifications]
  );

  const markAsRead = useCallback(async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch {
      setError("Failed to mark as read");
    }
  }, []);

  const deleteNotif = useCallback(
    async (id: string) => {
      try {
        const target = notifications.find((n) => n._id === id);
        const res = await deleteNotification(id);
        if (!res?.success) return;
        toast.success("Successfully Completed");
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        if (target && !target.isRead) {
          setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
      } catch {
        setError("Failed to delete notification");
      }
    },
    [notifications]
  );

  const getCurrentToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = await requestFirebaseNotificationPermission();
      return token;
    } catch (error) {
      console.error("Failed to get current token:", error);
      return null;
    }
  }, []);

  // Safe fetchNotifications call on mount or when user changes
  useEffect(() => {
    if (!user?.role) return;

    const fetchData = async () => {
      await fetchNotifications(true);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Firebase push notification listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupMessaging = async () => {
      const messaging = await getMessagingInstance();
      if (messaging) {
        unsubscribe = onMessage(messaging, () => {
          fetchNotifications(true);
        });
      }
    };

    setupMessaging();

    return () => {
      if (unsubscribe) unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    getCurrentToken,
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    sendNewNotification,
    markAsRead,
    deleteNotif,
    hasMore,
    loadMore,
  };
}
