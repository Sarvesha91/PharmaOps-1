import { configureStore } from '@reduxjs/toolkit';

import uiReducer from '../features/ui/uiSlice';
import documentsReducer from '../features/documents/documentsSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    documents: documentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

