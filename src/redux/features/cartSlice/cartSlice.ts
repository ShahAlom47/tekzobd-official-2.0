import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: string;
  quantity: number;
  color?: string | null;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addOrUpdateCartItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item.productId === action.payload.productId);
      if (existing) {
        existing.quantity = action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
    },
    clearCartItems: (state) => {
      state.items = [];
    },
  },
});


export const { setCartItems, addOrUpdateCartItem, removeCartItem, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;
