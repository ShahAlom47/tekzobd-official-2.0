// utils/cartLocalHelper.ts

import { CartItem } from "@/Interfaces/cartInterface";

const CART_KEY = "local_cart";

export const getLocalCart = (): CartItem[] => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveLocalCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearLocalCart = () => {
  localStorage.removeItem(CART_KEY);
};
