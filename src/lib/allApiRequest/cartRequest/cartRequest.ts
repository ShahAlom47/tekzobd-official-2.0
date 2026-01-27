// lib/allApiRequest/cart/cartRequest.ts

import { CartItem } from "@/Interfaces/cartInterface";
import { request } from "../apiRequests";



export const getUserCart = async (userEmail: string) => {
  return request("GET", `/cart/user-cart?userEmail=${userEmail}`);
};

export const syncCartToDB = async (localItems: CartItem[], userEmail: string ,forClean?: boolean) => {
  return request("POST", `/cart/sync`, { localItems, userEmail, forClean });
};

export const addToCartDB = async (data: { productId: string; quantity: number; color?: string | null; userEmail: string }) => {
  return request("POST", `/cart/add`, data);
};



export const removeFromCartDB = async (productId: string, userEmail: string) => {
  return request("DELETE", `/cart/remove`, { productId, userEmail });
};

export const updateCartItemQty = async (productId: string, quantity: number, userEmail: string) => {
  return request("PATCH", `/cart/update`, { productId, quantity, userEmail });
};


export const getCartProducts = async (productIds:string[], userEmail?: string) => {
  return request("POST", `/cart/cart-products`, { productIds, userEmail });
};

