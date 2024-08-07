// redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

// Create the Redux store
const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

// Define the root state type
export type RootState = ReturnType<typeof store.getState>;

// Define the App dispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
