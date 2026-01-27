"use client";
import { useConfirm } from "@/hooks/useConfirm";
import { NotificationType } from "@/Interfaces/notificationInterfaces";
import { useRouter } from "next/navigation";

type Props = {
  notification: NotificationType;
  markAsRead: (id: string) => void;
  deleteNotif: (id: string) => void;
};

const NotificationCard = ({
  notification,
  markAsRead,
  deleteNotif,
}: Props) => {
  const { confirm, ConfirmModal } = useConfirm();
  const router = useRouter();

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });
    if (!ok) return;
    deleteNotif(notification._id.toString());
  };

  const handleCardClick = () => {
    if (!notification.isRead) {
      markAsRead(notification._id.toString());
    }
    if (notification.link && notification.link.trim() !== "") {
      router.push(notification.link);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`p-3 rounded-md shadow-sm border cursor-pointer
          ${notification.isRead ? "bg-white" : "bg-gray-100"}
          hover:bg-gray-200 transition-colors duration-200
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCardClick();
          }
        }}
      >
        <h4 className="font-semibold text-sm">{notification.title}</h4>
        <p className="text-xs text-gray-600">{notification.message}</p>
        <div className="flex justify-end gap-2 mt-2 text-xs">
          <button
            className="text-red-500 hover:underline"
            onClick={(e) => {
              e.stopPropagation(); // 🔑 card click আটকাচ্ছে
              handleDelete();
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal আলাদা রেন্ডার করা হলো */}
      {ConfirmModal}
    </>
  );
};

export default NotificationCard;
