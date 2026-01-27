// src/redux/slices/categorySlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType } from "@/Interfaces/categoryInterfaces";

interface CategoryState {
  list: CategoryType[];
}

const initialState: CategoryState = {
  list: [],
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<CategoryType[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
