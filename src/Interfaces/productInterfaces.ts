import { ObjectId } from "mongodb";

export type ProductFormInput = Omit<
  ProductType,
  "_id" | "createdAt" | "updatedAt"
>;

export interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  publicId?: string;
}

// export interface ReviewsType {

//       userId: string;
//       rating: number;
//       comment?: string;
//       createdAt: string;
//     }


export interface ProductType {
  _id: string | ObjectId;
  title: string;
  slug: string;
  description: string;
  brand:string;
  price: number;
  colors: string[];
  discount: number;
  stock: number;
  soldCount?:number; // akono use kora a hoyni  use korte  hobe 
  offer?: {
  isActive: boolean;
  startDate?: string;
  endDate?: string;
};

  ratings: {
    avg: number;
    count: number;
    // ReviewsType Available in ReviewCollection
  };

  media: MediaItem[];
  categoryId: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;

  seo?: {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
};

  // Source Info (নিজের হোক বা ড্রপশিপার)
  sourceInfo?: {
    sourceType: "self" | "dropship"; // তুমি নিজে বিক্রি করছো নাকি অন্য কারো প্রোডাক্ট
    supplierName?: string; // যেমন: Daraz, AliExpress, TechBazaar
    productSourceLink?: string; // আসল প্রোডাক্টের লিংক
    supplierProductId?: string; // ড্রপশিপার ওয়েবসাইটের ইউনিক আইডি (eg: i12345678)
    deliveryTime?: string; // যেমন: ৫-৭ দিন
    shippingCost?: number; // বাড়তি চার্জ লাগলে
    returnPolicy?: string; // ফেরত নীতিমালা
    commissionRate?: number; // লাভের শতাংশ (ড্রপশিপার কেটে রাখে)
    externalStock?: boolean; // স্টক তোমার কাছে না, ওদের কাছে আছে
  };
}

export type SortOptions = "asc" | "desc" | "newest" | "popular";

export interface GetAllProductParams {
  currentPage: number;
  limit: number;
  searchTrim?: string;
  sort?: SortOptions;
  minPrice?: string | number;
  maxPrice?: string | number;
  category?: string;
  brand?: string;
  rating?: string;
   offerOnly?: boolean;         // ✅ new: only active offer products
  isDashboardRequest?: boolean;
  stock?:"in-stock"| "out-of-stock";
  // any more you want
}
