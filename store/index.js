import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import userReducer from "./slices/userSlice";
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    notifications: notificationsReducer,
  },
});
