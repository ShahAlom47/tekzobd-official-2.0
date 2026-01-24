import { ObjectId } from "mongodb";

export interface CheckoutProductItem {
  productId: string|ObjectId;
  productName: string;
  quantity: number;
  productColor?: string | null;
  priceAtPurchase: number;
  discountedPrice: number;
}

export interface CouponData {
  code: string;
  discountPercent: number;
  discountAmount: number;
}

export interface PricingSummary {
  subtotal: number;
  totalDiscount: number;
  totalAfterDiscount: number;
  couponDiscountAmount: number;
  grandTotal: number;
  totalQuantity: number;
}
export interface TrackingData {
  courierName: "steadfast" | "redx" | "pathao" | "express";
  courierOrderId: string;
  trackingUrl?: string;
}

export interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  zipCode?: string;
  phone: string;
   deliveryMethod:
    | "home-delivery"      // ঢাকার বাইরে
    | "inside-dhaka"       // ঢাকার ভিতরে
    | "outside-dhaka"      // ঢাকার বাইরে (optional, তুমি চাইলে COD বা extra চেজ এর জন্য আলাদা রাখতে পারো)
    | "standard"
    | "express"
    | "pickup";
    trackingInfo? :TrackingData
}

export interface PaymentInfo {
  method: "card" | "cash-on-delivery" | "bkash" | "nagad";
  paymentStatus: "unpaid" | "paid";
  transactionId?: string;
  paymentMethodDetails?: {
    bkashNumber?: string;
    cardType?: string; 
  };
}

export interface CheckoutMeta {
  checkoutAt: string; // ISO timestamp
  userName: string; // optional, can be empty for guest checkout
  userEmail: string;
  userId:string|ObjectId; // optional, can be null for guest checkout
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  cancelledByUser?: boolean
  updatedAt?:string
}

// main Type  for checkout data
export interface CheckoutDataType {
  _id?: string | ObjectId; // optional for new orders
  userId?: string | ObjectId; // optional for guest checkout
  cartProducts: CheckoutProductItem[];
  coupon: CouponData | null;
  pricing: PricingSummary;
  shippingInfo?: ShippingInfo; // optional for now
  paymentInfo?: PaymentInfo;   // optional for now
  meta: CheckoutMeta;
}

export interface CheckoutRequestBody {
  cartItems: CheckoutProductItem[];
  coupon?: CouponData; // optional
  shippingInfo?: ShippingInfo; // optional
  paymentInfo?: PaymentInfo; // optional
}


// api request params 
export interface GetAllOrdersParams {
  currentPage: number;
  limit: number;
  search?: string; // Search by name/email/orderId
  sort?: string;   // e.g., "grandTotal-desc" or "checkoutAt-asc"
  orderStatus?: string; // e.g., "pending"
  paymentMethod?: string; // e.g., "bkash"
  paymentStatus?: string; // "paid" or "unpaid"
  deliveryMethod?: string; // "home-delivery" etc.
  city?: string;
  fromDate?: string; // ISO format
  toDate?: string;   // ISO format
  isDashboardRequest?: boolean;
}


// Shiping Form Data 

export interface ShippingInfoFormType {
  name: string;
  address: string;
  city: string;
  zipCode?: string;
  phone: string;
  deliveryMethod:
    | "home-delivery"      // ঢাকার বাইরে
    | "inside-dhaka"       // ঢাকার ভিতরে
    | "outside-dhaka"      // ঢাকার বাইরে (optional, তুমি চাইলে COD বা extra চেজ এর জন্য আলাদা রাখতে পারো)
    | "standard"
    | "express"
    | "pickup";
}
