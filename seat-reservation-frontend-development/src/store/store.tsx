import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/features/UserSlice";
import authReducer from "../store/features/AuthSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
