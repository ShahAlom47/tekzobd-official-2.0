// src/features/search/globalSearchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalSearchState {
  globalSearchValue: string;
}

const initialState: GlobalSearchState = {
  globalSearchValue: '',
};

const globalSearchSlice = createSlice({
  name: 'globalSearch',
  initialState,
  reducers: {
    setGlobalSearchValue: (state, action: PayloadAction<string>) => {
      state.globalSearchValue = action.payload;
    },
    clearGlobalSearchValue: (state) => {
      state.globalSearchValue = '';
    },
  },
});

export const { setGlobalSearchValue, clearGlobalSearchValue } = globalSearchSlice.actions;
export default globalSearchSlice.reducer;
