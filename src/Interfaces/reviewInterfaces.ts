import { ObjectId } from "mongodb";


export type ReviewFormInput = Omit<
  ReviewsType,
  "_id" | "createdAt" | "updatedAt" | "isPublished"
> & {
  reviewId?: string |ObjectId; // নতুন ফিল্ড, মূল data তে নেই, কিন্তু edit form-এ দরকার
};

export interface ReviewsType {
  _id?: string| ObjectId; // MongoDB ID (optional)
  productId: string;
  userEmail: string;
  userName?:string|null;
  comment: string;
  parentId?: string | null;
  isPublished?: boolean;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}
