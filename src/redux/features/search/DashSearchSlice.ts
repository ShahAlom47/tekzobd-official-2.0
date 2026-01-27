// src/features/search/dashSearchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashSearchState {
  dashSearchValue: string;
}

const initialState: DashSearchState = {
  dashSearchValue: '',
};

const dashSearchSlice = createSlice({
  name: 'dashSearch',
  initialState,
  reducers: {
    setDashSearchValue: (state, action: PayloadAction<string>) => {
      state.dashSearchValue = action.payload;
    },
    clearDashSearchValue: (state) => {
      state.dashSearchValue = '';
    },
  },
});

export const { setDashSearchValue, clearDashSearchValue } = dashSearchSlice.actions;
export default dashSearchSlice.reducer;
