import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CheckoutDataType } from "@/Interfaces/checkoutDataInterface";

interface CheckoutState {
  checkoutData: CheckoutDataType | null;
}

const initialState: CheckoutState = {
  checkoutData: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutData: (state, action: PayloadAction<CheckoutDataType>) => {
      state.checkoutData = action.payload;
    },
    clearCheckoutData: (state) => {
      state.checkoutData = null;
    },
  },
});

export const { setCheckoutData, clearCheckoutData } = checkoutSlice.actions;
export default checkoutSlice.reducer;
