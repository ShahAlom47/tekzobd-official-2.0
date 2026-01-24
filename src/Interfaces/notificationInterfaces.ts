import { ObjectId } from 'mongodb';

export interface NotificationType {
  _id: string | ObjectId;
  type:
    | "order_placed"
    | "order_cancelled"
    | "payment_failed"
    | "refund_requested"
    | "stock_low"
    | "new_review"
    | "contact_message"
    | "other";
  title: string;
  message: string;
  link?: string | null;
  relatedId?: string | null;
  isRead: boolean;
  adminEmail?: string | null;
  createdAt: string;  // ISO string
  updatedAt?: string; // ISO string (optional)
}


export interface NotificationQueryParams {
  page?: number;
  limit?: number;
}
