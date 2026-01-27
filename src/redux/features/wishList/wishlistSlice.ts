
import { WishlistType } from "@/Interfaces/wishListInterfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  data: WishlistType | null;
}

const initialState: WishlistState = {
  data: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistRedux: (state, action: PayloadAction<WishlistType>) => {
      state.data = action.payload;
    },
    clearWishlistRedux: (state) => {
      state.data = null;
    },
  },
});

export const { setWishlistRedux, clearWishlistRedux } = wishlistSlice.actions;
export default wishlistSlice.reducer;
