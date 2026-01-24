import { ObjectId } from "mongodb";

export interface CategoryType {
  _id?: string | ObjectId;               // Unique ID বা slug (e.g., "electronics")
  name: string;              // Category নাম (e.g., "Electronics")
  slug: string;              // URL-friendly slug (e.g., "electronics")
  icon?: string;             // static ReactIcon
  parentCategory?: string | null;  // যদি sub-category হয়, তাহলে parent এর ID
  createdAt: string;         // ISO তারিখ
  updatedAt: string;         // ISO তারিখ
}

export type GetAllCategoryParams = {
  currentPage?: number;  
  limit?: number;
  searchTrim?: string;
};