import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';

type UIState = {
  themeMode: 'light' | 'dark';
  selectedRegion: string | null;
};

const initialState: UIState = {
  themeMode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  selectedRegion: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
    setThemeMode(state, action: PayloadAction<'light' | 'dark'>) {
      state.themeMode = action.payload;
    },
    setSelectedRegion(state, action: PayloadAction<string | null>) {
      state.selectedRegion = action.payload;
    },
  },
});

export const { toggleTheme, setThemeMode, setSelectedRegion } = uiSlice.actions;

export const selectThemeMode = (state: RootState) => state.ui.themeMode;
export const selectSelectedRegion = (state: RootState) => state.ui.selectedRegion;

export default uiSlice.reducer;

