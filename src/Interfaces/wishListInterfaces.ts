import { ObjectId } from 'mongodb';
// interfaces/wishlistInterfaces.ts

export interface WishlistProduct {
  productId: string ;
  addedAt: string // ISO string for consistency across systems
}

export interface AddRequestWistDataType extends WishlistProduct {
userEmail:string
}

export interface WishlistType {
  _id?:  string | ObjectId;
  userEmail: string;
  products: WishlistProduct[];
  updatedAt?: string;
  createdAt?:string;
}
